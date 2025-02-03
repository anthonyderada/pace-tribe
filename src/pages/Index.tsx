import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import StickyFilterBar from "@/components/home/StickyFilterBar";

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />
      <StickyFilterBar />
      <FeaturedClubs />
    </div>
  );
};

export default Index;