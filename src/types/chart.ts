export interface ChartData {
  dateTime: string;
  base: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  accumulatedAmount: number;
}

export interface ChartResponse {
  stockCode: string; // 서버에서 반환되는 stockCode는 실제로 shortCode
  nextDateTime: string;
  candles: ChartData[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

// WebSocket 실시간 데이터 타입
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

export interface WebSocketSubscriptionResponse {
  status: string;
  message: string;
  stockCode: string;
  dataEndpoint?: string;
}
