export interface StockSearchItem {
  id: number;
  shortCode: string;
  standardCode: string;
  nameKr: string;
  basePrice: number;
  previousDayVolume: number;
  meta: {
    groupCode: string;
  };
}

export interface StockSearchResponse {
  content: StockSearchItem[];
  metadata: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: {
    timestamp: string;
    path: string;
    exceptionName: string;
    bindingErrors: string;
    message: string;
    status: number;
    reason: string;
  };
}
