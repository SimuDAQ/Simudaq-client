import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WS_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const WS_ENDPOINT = "/ws";

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

type MessageCallback = (data: RealtimeStockData) => void;
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
    onMessage: MessageCallback,
    onReply?: ReplyCallback,
    onError?: ErrorCallback
  ): Promise<void> {
    try {
      await this.connect();

      if (!this.client || !this.connected) {
        throw new Error('WebSocket not connected');
      }

      // 이미 구독 중이면 무시
      if (this.subscriptions.has(stockCode)) {
        console.log(`[WebSocket] Already subscribed to ${stockCode}`);
        return;
      }

      // 구독 요청 전송
      this.client.publish({
        destination: '/app/stock/subscribe',
        body: JSON.stringify({ stockCode }),
      });

      console.log(`[WebSocket] Subscription request sent for ${stockCode}`);

      // 응답 대기 후 데이터 토픽 구독
      setTimeout(() => {
        if (!this.client) return;

        const dataTopicSubscription = this.client.subscribe(
          `/topic/stock/${stockCode}`,
          (message: IMessage) => {
            try {
              const data: RealtimeStockData = JSON.parse(message.body);
              console.log(`[WebSocket] Data received for ${stockCode}:`, data);
              onMessage(data);
            } catch (error) {
              console.error('[WebSocket] Failed to parse message:', error);
              if (onError) {
                onError(error as Error);
              }
            }
          }
        );

        this.subscriptions.set(stockCode, dataTopicSubscription);
        console.log(`[WebSocket] Subscribed to data topic: /topic/stock/${stockCode}`);

        if (onReply) {
          onReply({
            status: 'success',
            message: 'subscribed',
            stockCode,
            dataEndpoint: `/topic/stock/${stockCode}`,
          });
        }
      }, 500);
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

      const subscription = this.subscriptions.get(stockCode);
      if (!subscription) {
        console.log(`[WebSocket] Not subscribed to ${stockCode}`);
        return;
      }

      // 구독 해제 요청 전송
      this.client.publish({
        destination: '/app/stock/unsubscribe',
        body: JSON.stringify({ stockCode }),
      });

      // 데이터 토픽 구독 해제
      subscription.unsubscribe();
      this.subscriptions.delete(stockCode);

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
    return this.subscriptions.has(stockCode);
  }
}

// 싱글톤 인스턴스 생성
export const websocketService = new WebSocketService();
