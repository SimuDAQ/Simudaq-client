import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const WS_ENDPOINT = "/stock";

export interface WebSocketSubscriptionResponse {
  status: string;
  message: string;
  stockCode: string;
  dataEndpoint?: string;
}

export interface RealtimeStockData {
  dateTime: string;
  base: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  accumulatedAmount: number;
}

export interface PriceLevel {
  price: string;
  volume: string;
}

export interface ExpectedTrade {
  price: string;
  volume: string;
  totalVolume: string;
  priceChange: string;
  priceSign: string;
  priceChangeRate: string;
}

export interface StockAskBidData {
  stockCode: string;
  businessTime: string;
  timeCode: string;
  askPrices: PriceLevel[];
  bidPrices: PriceLevel[];
  totalAskVolume: string;
  totalAskVolumeChange: string;
  totalBidVolume: string;
  totalBidVolumeChange: string;
  afterHoursTotalAskVolume: string;
  afterHoursTotalBidVolume: string;
  afterHoursTotalAskVolumeChange: string;
  afterHoursTotalBidVolumeChange: string;
  expectedTrade: ExpectedTrade;
  accumulatedVolume: string;
  tradeTypeCode: string;
}

export interface StockExecutionData {
  stockCode: string;
  executionTime: string;
  currentPrice: string;
  priceChangeSign: string;
  priceChange: string;
  priceChangeRate: string;
  weightedAveragePrice: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  askPrice1: string;
  bidPrice1: string;
  executionVolume: string;
  accumulatedVolume: string;
  accumulatedTradeAmount: string;
  sellExecutionCount: string;
  buyExecutionCount: string;
  netBuyExecutionCount: string;
  executionStrength: string;
  totalSellVolume: string;
  totalBuyVolume: string;
  executionType: string;
  buyRate: string;
  volumeChangeRate: string;
  openPriceTime: string;
  openPriceChangeSign: string;
  openPriceChange: string;
  highPriceTime: string;
  highPriceChangeSign: string;
  highPriceChange: string;
  lowPriceTime: string;
  lowPriceChangeSign: string;
  lowPriceChange: string;
  businessDate: string;
  marketOperationCode: string;
  tradingHaltYn: string;
  askVolume1: string;
  bidVolume1: string;
  totalAskVolume: string;
  totalBidVolume: string;
  volumeTurnoverRate: string;
  previousDaySameTimeVolume: string;
  previousDaySameTimeVolumeRate: string;
  timeClassCode: string;
  marketClosureTypeCode: string;
  viStandardPrice: string;
}

type AskBidCallback = (data: StockAskBidData) => void;
type ExecutionCallback = (data: StockExecutionData) => void;
type ReplyCallback = (response: WebSocketSubscriptionResponse) => void;
type ErrorCallback = (error: Error) => void;

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private replySubscription: StompSubscription | null = null;
  private connected = false;
  private connectPromise: Promise<void> | null = null;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${WS_BASE_URL}${WS_ENDPOINT}`) as WebSocket,
      debug: (str) => {
        console.log('[STOMP Debug]:', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[WebSocket] Connected');
        this.connected = true;
        this.setupReplySubscription();
      },
      onDisconnect: () => {
        console.log('[WebSocket] Disconnected');
        this.connected = false;
        this.subscriptions.clear();
        this.replySubscription = null;
      },
      onStompError: (frame) => {
        console.error('[STOMP Error]:', frame.headers['message'], frame.body);
      },
    });
  }

  private setupReplySubscription() {
    if (!this.client) return;

    // 구독/구독 해제 응답을 받기 위한 개인 큐 구독
    this.replySubscription = this.client.subscribe('/user/queue/reply', (message: IMessage) => {
      try {
        const response: WebSocketSubscriptionResponse = JSON.parse(message.body);
        console.log('[WebSocket] Reply received:', response);
      } catch (error) {
        console.error('[WebSocket] Failed to parse reply:', error);
      }
    });
  }

  async connect(): Promise<void> {
    if (this.connected) {
      return Promise.resolve();
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {
      if (!this.client) {
        reject(new Error('Client not initialized'));
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Connection timeout'));
        this.connectPromise = null;
      }, 10000);

      this.client.onConnect = () => {
        clearTimeout(timeoutId);
        console.log('[WebSocket] Connected');
        this.connected = true;
        this.setupReplySubscription();
        this.connectPromise = null;
        resolve();
      };

      this.client.activate();
    });

    return this.connectPromise;
  }

  disconnect() {
    if (this.client) {
      // 모든 구독 해제
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      if (this.replySubscription) {
        this.replySubscription.unsubscribe();
        this.replySubscription = null;
      }

      this.client.deactivate();
      this.connected = false;
      this.connectPromise = null;
    }
  }

  async subscribe(
    stockCode: string,
    onAskBid: AskBidCallback,
    onExecution: ExecutionCallback,
    onReply?: ReplyCallback,
    onError?: ErrorCallback
  ): Promise<void> {
    try {
      await this.connect();

      if (!this.client || !this.connected) {
        throw new Error('WebSocket not connected');
      }

      // 이미 구독 중이면 무시
      if (this.subscriptions.has(`askbid-${stockCode}`) || this.subscriptions.has(`execution-${stockCode}`)) {
        console.log(`[WebSocket] Already subscribed to ${stockCode}`);
        return;
      }

      // 1. /topic/stock/askbid/{shortCode} 구독
      const askBidSubscription = this.client.subscribe(
        `/topic/stock/askbid/${stockCode}`,
        (message: IMessage) => {
          try {
            const data: StockAskBidData = JSON.parse(message.body);
            console.log(`[WebSocket] AskBid data received for ${stockCode}:`, data);
            onAskBid(data);
          } catch (error) {
            console.error('[WebSocket] Failed to parse askbid message:', error);
            if (onError) {
              onError(error as Error);
            }
          }
        }
      );
      this.subscriptions.set(`askbid-${stockCode}`, askBidSubscription);
      console.log(`[WebSocket] Subscribed to /topic/stock/askbid/${stockCode}`);

      // 2. /topic/stock/execution/{shortCode} 구독
      const executionSubscription = this.client.subscribe(
        `/topic/stock/execution/${stockCode}`,
        (message: IMessage) => {
          try {
            const data: StockExecutionData = JSON.parse(message.body);
            console.log(`[WebSocket] Execution data received for ${stockCode}:`, data);
            onExecution(data);
          } catch (error) {
            console.error('[WebSocket] Failed to parse execution message:', error);
            if (onError) {
              onError(error as Error);
            }
          }
        }
      );
      this.subscriptions.set(`execution-${stockCode}`, executionSubscription);
      console.log(`[WebSocket] Subscribed to /topic/stock/execution/${stockCode}`);

      // 3. 구독 요청 전송 to /app/stock/subscribe
      this.client.publish({
        destination: '/app/stock/subscribe',
        body: JSON.stringify({ stockCode }),
      });

      console.log(`[WebSocket] Subscription request sent for ${stockCode}`);

      if (onReply) {
        onReply({
          status: 'success',
          message: 'subscribed',
          stockCode,
        });
      }
    } catch (error) {
      console.error('[WebSocket] Subscribe error:', error);
      if (onError) {
        onError(error as Error);
      }
      throw error;
    }
  }

  async unsubscribe(stockCode: string): Promise<void> {
    try {
      if (!this.client || !this.connected) {
        console.warn('[WebSocket] Not connected, skipping unsubscribe');
        return;
      }

      const askBidSubscription = this.subscriptions.get(`askbid-${stockCode}`);
      const executionSubscription = this.subscriptions.get(`execution-${stockCode}`);

      if (!askBidSubscription && !executionSubscription) {
        console.log(`[WebSocket] Not subscribed to ${stockCode}`);
        return;
      }

      // 구독 해제 요청 전송
      this.client.publish({
        destination: '/app/stock/unsubscribe',
        body: JSON.stringify({ stockCode }),
      });

      // askbid 토픽 구독 해제
      if (askBidSubscription) {
        askBidSubscription.unsubscribe();
        this.subscriptions.delete(`askbid-${stockCode}`);
        console.log(`[WebSocket] Unsubscribed from /topic/stock/askbid/${stockCode}`);
      }

      // execution 토픽 구독 해제
      if (executionSubscription) {
        executionSubscription.unsubscribe();
        this.subscriptions.delete(`execution-${stockCode}`);
        console.log(`[WebSocket] Unsubscribed from /topic/stock/execution/${stockCode}`);
      }

      console.log(`[WebSocket] Unsubscribed from ${stockCode}`);
    } catch (error) {
      console.error('[WebSocket] Unsubscribe error:', error);
      throw error;
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  isSubscribed(stockCode: string): boolean {
    return this.subscriptions.has(`askbid-${stockCode}`) || this.subscriptions.has(`execution-${stockCode}`);
  }
}

// 싱글톤 인스턴스 생성
export const websocketService = new WebSocketService();
