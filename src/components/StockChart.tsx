import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { generatePriceHistory } from "@/data/stocks";
import { cn } from "@/lib/utils";

interface StockChartProps {
  basePrice: number;
  change: number;
}

const periods = [
  { label: "1주", days: 7 },
  { label: "1개월", days: 30 },
  { label: "3개월", days: 90 },
  { label: "6개월", days: 180 },
  { label: "1년", days: 365 },
];

const StockChart = ({ basePrice, change }: StockChartProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState(2); // 3개월 default
  
  const data = useMemo(() => {
    return generatePriceHistory(basePrice, periods[selectedPeriod].days);
  }, [basePrice, selectedPeriod]);

  const isPositive = change >= 0;
  const strokeColor = isPositive ? "hsl(var(--stock-up))" : "hsl(var(--stock-down))";
  const gradientId = isPositive ? "colorPositive" : "colorNegative";

  const formatPrice = (value: number) => {
    return `₩${value.toLocaleString("ko-KR")}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-sm text-muted-foreground mb-1">{label}</p>
          <p className="text-lg font-bold">{formatPrice(payload[0].value)}</p>
          <p className="text-xs text-muted-foreground">
            거래량: {(payload[0].payload.volume / 1000000).toFixed(1)}M
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">주가 차트</h3>
        <div className="flex gap-1">
          {periods.map((period, index) => (
            <button
              key={period.label}
              onClick={() => setSelectedPeriod(index)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md transition-all",
                selectedPeriod === index
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--stock-up))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--stock-up))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--stock-down))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--stock-down))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={["dataMin - 1000", "dataMax + 1000"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={strokeColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#${gradientId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockChart;
