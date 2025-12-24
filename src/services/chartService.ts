import { ChartResponse, ApiResponse } from "@/types/chart";

const API_BASE_URL = import.meta.env.LOCAL_API_BASE_URL || "http://localhost:8080";

export interface GetChartParams {
  stockCode: string;
  interval: string;
  from: string;
  count: string;
}

export const chartService = {
  async getChart(params: GetChartParams): Promise<ChartResponse> {
    const { interval, from, count } = params;

    // stockCode가 없거나 undefined인 경우 기본값 사용
    const stockCode = params.stockCode || '005930'; // 삼성전자를 기본값으로

    const url = `${API_BASE_URL}/v1/chart/kr/${stockCode}/${interval}?from=${from}&count=${count}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }

    const result: ApiResponse<ChartResponse> = await response.json();
    return result.data;
  },
};
