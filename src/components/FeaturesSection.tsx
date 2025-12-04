import { 
  TrendingUp, 
  Shield, 
  BarChart3, 
  Zap, 
  Users, 
  BookOpen 
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "실시간 시세",
    description: "실제 한국 주식 시장과 동일한 실시간 시세로 현실감 있는 투자 경험을 제공합니다.",
  },
  {
    icon: Shield,
    title: "무위험 투자",
    description: "가상 자금으로 투자하기 때문에 실제 손실 없이 다양한 전략을 시험해볼 수 있습니다.",
  },
  {
    icon: BarChart3,
    title: "상세 분석",
    description: "포트폴리오 수익률, 거래 내역, 투자 패턴 등 다양한 분석 리포트를 제공합니다.",
  },
  {
    icon: Zap,
    title: "빠른 체결",
    description: "실제 주식 거래와 동일한 호가 시스템으로 빠르고 정확한 주문 체결을 경험하세요.",
  },
  {
    icon: Users,
    title: "투자 랭킹",
    description: "다른 사용자들과 수익률을 비교하고, 상위 투자자들의 전략을 참고해보세요.",
  },
  {
    icon: BookOpen,
    title: "투자 교육",
    description: "초보자를 위한 주식 투자 기초부터 고급 기술적 분석까지 학습할 수 있습니다.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
            왜 <span className="gradient-text">Simudaq</span>인가요?
          </h2>
          <p className="text-muted-foreground text-lg">
            처음 주식 투자를 시작하는 분들을 위해 완벽한 학습 환경을 제공합니다.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group glass-card rounded-2xl p-6 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
