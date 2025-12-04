import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Building2, BarChart3, Coins, Percent, Calculator, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stocks } from "@/data/stocks";
import StockChart from "@/components/StockChart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StockDetail = () => {
  const { code } = useParams<{ code: string }>();
  const stock = stocks.find((s) => s.code === code);

  if (!stock) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">종목을 찾을 수 없습니다</h1>
          <Link to="/search">
            <Button>종목 검색으로 돌아가기</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  const isPositive = stock.change >= 0;

  const infoCards = [
    { icon: BarChart3, label: "시가총액", value: stock.marketCap },
    { icon: Coins, label: "거래량", value: `${(stock.volume / 1000000).toFixed(1)}M` },
    { icon: TrendingUp, label: "52주 최고", value: `₩${formatPrice(stock.high52w)}` },
    { icon: TrendingDown, label: "52주 최저", value: `₩${formatPrice(stock.low52w)}` },
    { icon: Calculator, label: "PER", value: `${stock.per}배` },
    { icon: Percent, label: "PBR", value: `${stock.pbr}배` },
    { icon: PiggyBank, label: "EPS", value: `₩${formatPrice(stock.eps)}` },
    { icon: Coins, label: "배당수익률", value: `${stock.dividend}%` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>종목 목록</span>
          </Link>

          {/* Stock Header */}
          <div className="glass-card p-6 md:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold">{stock.name}</h1>
                  <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-md">
                    {stock.code}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{stock.sector}</span>
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="text-3xl md:text-4xl font-bold mb-1">
                  ₩{formatPrice(stock.price)}
                </div>
                <div
                  className={`flex items-center gap-2 text-lg font-semibold ${
                    isPositive ? "text-stock-up" : "text-stock-down"
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <TrendingDown className="w-5 h-5" />
                  )}
                  <span>
                    {isPositive ? "+" : ""}
                    {formatPrice(stock.change)} ({isPositive ? "+" : ""}
                    {stock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Trade Buttons */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-stock-up hover:bg-stock-up/90 text-white">
                매수
              </Button>
              <Button className="flex-1 bg-stock-down hover:bg-stock-down/90 text-white">
                매도
              </Button>
            </div>
          </div>

          {/* Chart */}
          <div className="mb-6">
            <StockChart basePrice={stock.price} change={stock.change} />
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {infoCards.map((card) => (
              <div key={card.label} className="glass-card p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <card.icon className="w-4 h-4" />
                  <span className="text-sm">{card.label}</span>
                </div>
                <div className="text-lg font-semibold">{card.value}</div>
              </div>
            ))}
          </div>

          {/* Company Description */}
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              기업 정보
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {stock.description}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockDetail;
