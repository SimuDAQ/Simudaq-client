import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StockTicker from "@/components/StockTicker";
import FeaturesSection from "@/components/FeaturesSection";
import PortfolioPreview from "@/components/PortfolioPreview";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <HeroSection />
        <StockTicker />
        <FeaturesSection />
        <PortfolioPreview />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
