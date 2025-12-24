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
  stockCode: string;
  nextDateTime: string;
  candles: ChartData[];
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}
