import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Connect with Your Local Running Community
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Join running clubs, find training partners, and participate in local events. Your running journey starts here.
            </p>
            <div className="space-x-4">
              <Button
                onClick={() => navigate("/register")}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/clubs")}
                className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10 px-8 py-3 text-lg"
              >
                Find Clubs
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Join Running Clubs</h3>
              <p className="text-gray-400">
                Find and join local running clubs that match your pace and goals.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Participate in Events</h3>
              <p className="text-gray-400">
                Discover and register for running events in your area.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-4">Connect with Runners</h3>
              <p className="text-gray-400">
                Meet other runners and build your running community.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;