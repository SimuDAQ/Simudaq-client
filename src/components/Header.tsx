import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/images/logo.png";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Simudaq Logo" className="h-12 w-auto" />
            <span className="font-display font-bold text-xl">Simudaq</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
              <Search className="w-4 h-4" />
              종목검색
            </Link>
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              기능
            </a>
            <a href="#portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              포트폴리오
            </a>
            <a href="#ranking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              랭킹
            </a>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm">
              로그인
            </Button>
            <Button variant="default" size="sm">
              무료 시작
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link to="/search" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Search className="w-4 h-4" />
                종목검색
              </Link>
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                기능
              </a>
              <a href="#portfolio" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                포트폴리오
              </a>
              <a href="#ranking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                랭킹
              </a>
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button variant="ghost" size="sm" className="flex-1">
                  로그인
                </Button>
                <Button variant="default" size="sm" className="flex-1">
                  무료 시작
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
