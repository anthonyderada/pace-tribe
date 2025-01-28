import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedClubs />
      <FeaturesSection />
      <CallToAction />
    </div>
  );
};

export default Index;