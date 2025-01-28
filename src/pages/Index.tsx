import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import FeaturedLocation from "@/components/home/FeaturedLocation";

const Index = () => {
  return (
    <div className="relative bg-transparent">
      <HeroSection />
      <FeaturedLocation />
      <FeaturedClubs />
      <FeaturesSection />
      <CallToAction />
    </div>
  );
};

export default Index;