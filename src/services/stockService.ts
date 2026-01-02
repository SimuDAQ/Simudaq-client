import { StockSearchResponse, ApiResponse } from "@/types/stock";

const API_BASE_URL = import.meta.env.LOCAL_API_BASE_URL || "http://localhost:8080";

export const stockService = {
  async searchStocks(name: string): Promise<StockSearchResponse> {
    const url = `${API_BASE_URL}/v1/stocks?name=${encodeURIComponent(name)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search stocks: ${response.statusText}`);
    }

    const result: ApiResponse<StockSearchResponse> = await response.json();

    if (result.error) {
      throw new Error(result.error.message || "Failed to search stocks");
    }

    return result.data;
  },
};
