import { TrendingUp, TrendingDown, Wallet, PieChart, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const portfolioStocks = [
  { name: "삼성전자", shares: 50, avgPrice: 71200, currentPrice: 72400, change: 1.69 },
  { name: "SK하이닉스", shares: 20, avgPrice: 182000, currentPrice: 178500, change: -1.92 },
  { name: "카카오", shares: 100, avgPrice: 46500, currentPrice: 48350, change: 3.98 },
  { name: "NAVER", shares: 15, avgPrice: 198000, currentPrice: 205500, change: 3.79 },
];

const PortfolioPreview = () => {
  const totalValue = 15847200;
  const totalReturn = 847200;
  const returnPercent = 5.65;

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 h-96 bg-gradient-to-r from-primary/5 to-transparent blur-3xl" />
      
      <div className="container px-4 md:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
              나만의 <span className="gradient-text">포트폴리오</span>를
              <br />구축하세요
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              가상 자금으로 시작하세요. 
              실제 주식 시장과 동일한 환경에서 포트폴리오를 구성하고,
              투자 전략을 테스트해보세요.
            </p>
            <div className="flex gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/login">
                  지금 시작하기
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Portfolio card */}
          <div className="glass-card rounded-2xl p-6 glow-effect">
            {/* Portfolio header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Wallet className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">내 포트폴리오</p>
                  <p className="font-semibold">모의 투자 계좌</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                <TrendingUp className="h-4 w-4" />
                +{returnPercent}%
              </div>
            </div>

            {/* Total value */}
            <div className="mb-6 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground mb-1">총 평가금액</p>
              <div className="flex items-end gap-3">
                <span className="text-3xl font-bold font-display">
                  ₩{totalValue.toLocaleString()}
                </span>
                <span className="text-success text-sm mb-1">
                  +₩{totalReturn.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Stock list */}
            <div className="space-y-4">
              {portfolioStocks.map((stock, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                      {stock.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{stock.name}</p>
                      <p className="text-xs text-muted-foreground">{stock.shares}주</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">
                      ₩{stock.currentPrice.toLocaleString()}
                    </p>
                    <p
                      className={`text-xs flex items-center justify-end gap-1 ${
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
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioPreview;
