import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import StickyFilterSection from "@/components/home/StickyFilterSection";

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />
      <div className="min-h-[100px]"> {/* Spacer to prevent content jump when sticky activates */}
        <StickyFilterSection />
      </div>
      <FeaturedClubs />
    </div>
  );
};

export default Index;