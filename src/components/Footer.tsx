import { TrendingUp } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display font-bold text-xl">Simudaq</span>
            </a>
            <p className="text-sm text-muted-foreground">
              리스크 없이 배우는 주식 투자의 첫걸음
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">서비스</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">모의 투자</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">실시간 시세</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">포트폴리오 분석</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">투자 랭킹</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">학습</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">투자 기초</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">기술적 분석</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">기업 분석</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">투자 전략</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">지원</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground transition-colors">고객센터</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">자주 묻는 질문</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 Simudaq. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            본 서비스는 모의 투자 서비스이며, 실제 투자 권유가 아닙니다.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
