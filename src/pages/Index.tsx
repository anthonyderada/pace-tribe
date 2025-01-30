import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturedLocation from "@/components/home/FeaturedLocation";
import ClubTypeFilters from "@/components/home/ClubTypeFilters";
import CallToAction from "@/components/home/CallToAction";

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedLocation />
      <ClubTypeFilters />
      <FeaturedClubs />
      <CallToAction />
    </div>
  );
};

export default Index;