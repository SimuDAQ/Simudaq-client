import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { stockService } from "@/services/stockService";
import { StockSearchItem } from "@/types/stock";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const StockSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stocks, setStocks] = useState<StockSearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchStocks = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await stockService.searchStocks(searchQuery.trim());
        setStocks(response.content);
      } catch (err) {
        setError(err instanceof Error ? err.message : "종목 검색에 실패했습니다");
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchStocks();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const formatPrice = (price: number) => {
    return price.toLocaleString("ko-KR");
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
            {loading ? (
              <span>검색 중...</span>
            ) : (
              <span>
                총 <span className="text-primary font-semibold">{stocks.length}</span>개 종목
              </span>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-center py-8">
              <div className="text-red-500 mb-2">{error}</div>
            </div>
          )}

          {/* Stock List */}
          {!loading && !error && stocks.length > 0 && (
            <div className="grid gap-3">
              {stocks.map((stock) => (
                <Link
                  key={stock.id}
                  to={`/stock/${stock.shortCode}`}
                  className="group block"
                >
                  <div className="glass-card p-4 md:p-5 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5">
                    <div className="flex items-center justify-between gap-4">
                      {/* Stock Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                            {stock.nameKr}
                          </h3>
                          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                            {stock.shortCode}
                          </span>
                        </div>
                      </div>

                      {/* Price Info */}
                      <div className="text-right flex items-center gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-0.5">
                            기준가
                          </div>
                          <div className="text-xl font-bold">
                            ₩{formatPrice(stock.basePrice)}
                          </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && stocks.length === 0 && (
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
