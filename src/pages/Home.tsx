import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import FeaturedLocation from "@/components/home/FeaturedLocation";

const Home = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedLocation />
      <FeaturedClubs />
      <FeaturesSection />
      <CallToAction />
    </div>
  );
};

export default Home;