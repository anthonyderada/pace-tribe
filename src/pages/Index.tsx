import HeroSection from "@/components/home/HeroSection";
import FeaturedClubs from "@/components/home/FeaturedClubs";
import FeaturedLocation from "@/components/home/FeaturedLocation";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import { PostList } from "@/components/feed/PostList";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <HeroSection />
      {user ? (
        <div className="max-w-3xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>
          <PostList />
        </div>
      ) : (
        <>
          <FeaturedLocation />
          <FeaturedClubs />
          <FeaturesSection />
          <CallToAction />
        </>
      )}
    </div>
  );
};

export default Index;