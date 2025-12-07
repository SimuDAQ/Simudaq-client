import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container px-4 md:px-6 relative">
        <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-3xl mx-auto glow-effect">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">완전 무료</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            지금 바로 시작하세요
          </h2>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            실제 돈을 투자하기 전, Simudaq에서 연습해보세요.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/login">
                무료로 가입하기
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mt-6">
            신용카드 불필요 · 즉시 시작 · 언제든 탈퇴 가능
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
