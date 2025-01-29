import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturedLocation from "@/components/home/FeaturedLocation";

const Home = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturedLocation />
      <FeaturedClubs />
    </div>
  );
};

export default Home;