import { TrendingUp, TrendingDown } from "lucide-react";

interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: number;
}

const stocks: Stock[] = [
  { symbol: "삼성전자", name: "005930", price: "72,400", change: 2.34 },
  { symbol: "SK하이닉스", name: "000660", price: "178,500", change: -1.12 },
  { symbol: "LG에너지솔루션", name: "373220", price: "421,000", change: 0.85 },
  { symbol: "삼성바이오로직스", name: "207940", price: "812,000", change: 1.56 },
  { symbol: "현대차", name: "005380", price: "234,500", change: -0.42 },
  { symbol: "기아", name: "000270", price: "98,700", change: 3.21 },
  { symbol: "셀트리온", name: "068270", price: "185,200", change: -2.15 },
  { symbol: "카카오", name: "035720", price: "48,350", change: 1.89 },
];

const StockTicker = () => {
  return (
    <div className="w-full overflow-hidden bg-secondary/50 border-y border-border py-3">
      <div className="flex animate-[scroll_30s_linear_infinite] gap-8">
        {[...stocks, ...stocks].map((stock, index) => (
          <div
            key={index}
            className="flex items-center gap-3 whitespace-nowrap px-4"
          >
            <span className="font-medium text-foreground">{stock.symbol}</span>
            <span className="text-muted-foreground text-sm">{stock.name}</span>
            <span className="font-semibold text-foreground">₩{stock.price}</span>
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                stock.change >= 0 ? "text-success" : "text-destructive"
              }`}
            >
              {stock.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {stock.change >= 0 ? "+" : ""}
              {stock.change}%
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default StockTicker;
