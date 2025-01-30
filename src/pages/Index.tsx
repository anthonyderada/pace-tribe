import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import FeaturedLocation from "@/components/home/FeaturedLocation";
import ClubTypeFilters from "@/components/home/ClubTypeFilters";

const Index = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedLocation />
      <ClubTypeFilters />
      <FeaturedClubs />
      <FeaturesSection />
      <CallToAction />
    </div>
  );
};

export default Index;