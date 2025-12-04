import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, TrendingUp, TrendingDown, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { stocks } from "@/data/stocks";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StockSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStocks = useMemo(() => {
    if (!searchQuery.trim()) return stocks;
    const query = searchQuery.toLowerCase();
    return stocks.filter(
      (stock) =>
        stock.name.toLowerCase().includes(query) ||
        stock.code.includes(query) ||
        stock.sector.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
  };

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + "M";
    }
    return (volume / 1000).toFixed(0) + "K";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              종목 <span className="text-gradient">검색</span>
            </h1>
            <p className="text-muted-foreground mb-6">
              종목명, 종목코드, 섹터로 검색하세요
            </p>
            
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="삼성전자, 005930, 전기전자..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 text-lg bg-card border-border/50 focus:border-primary"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4 text-sm text-muted-foreground">
            총 <span className="text-primary font-semibold">{filteredStocks.length}</span>개 종목
          </div>

          {/* Stock List */}
          <div className="grid gap-3">
            {filteredStocks.map((stock) => (
              <Link
                key={stock.code}
                to={`/stock/${stock.code}`}
                className="group block"
              >
                <div className="glass-card p-4 md:p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                  <div className="flex items-center justify-between gap-4">
                    {/* Stock Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                          {stock.name}
                        </h3>
                        <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                          {stock.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{stock.sector}</span>
                        <span>•</span>
                        <span>시총 {stock.marketCap}</span>
                        <span>•</span>
                        <span>거래량 {formatVolume(stock.volume)}</span>
                      </div>
                    </div>

                    {/* Price Info */}
                    <div className="text-right flex items-center gap-4">
                      <div>
                        <div className="text-xl font-bold mb-0.5">
                          ₩{formatPrice(stock.price)}
                        </div>
                        <div
                          className={`flex items-center justify-end gap-1 text-sm font-medium ${
                            stock.change >= 0 ? "text-stock-up" : "text-stock-down"
                          }`}
                        >
                          {stock.change >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>
                            {stock.change >= 0 ? "+" : ""}
                            {formatPrice(stock.change)} ({stock.changePercent >= 0 ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%)
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {filteredStocks.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">검색 결과가 없습니다</h3>
              <p className="text-muted-foreground">
                다른 검색어로 다시 시도해보세요
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StockSearch;
