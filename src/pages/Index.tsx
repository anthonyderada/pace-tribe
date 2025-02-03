import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import StickyFilterSection from "@/components/home/StickyFilterSection";

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />
      <div className="min-h-[80px]"> {/* Reduced spacer height */}
        <StickyFilterSection />
      </div>
      <FeaturedClubs />
    </div>
  );
};

export default Index;