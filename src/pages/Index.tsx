import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturedLocation from "@/components/home/FeaturedLocation";
import ClubTypeFilters from "@/components/home/ClubTypeFilters";

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedLocation />
      <ClubTypeFilters />
      <FeaturedClubs />
    </div>
  );
};

export default Index;