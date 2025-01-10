import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['featuredClubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*, club_members(count)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Running Tribe
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect with local running clubs, join group runs, and become part of a community that shares your passion for running.
            </p>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Search clubs by location..."
                  className="pl-10 w-full bg-zinc-800/50 border-zinc-700"
                />
                <Button 
                  className="absolute right-0 top-0 h-full bg-emerald-500 hover:bg-emerald-600"
                  onClick={() => navigate("/clubs")}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Clubs Section */}
      <div className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Clubs</h2>
            <Button 
              variant="link" 
              className="text-emerald-500"
              onClick={() => navigate("/clubs")}
            >
              View All Clubs
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {isLoading ? (
              // Loading state
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-zinc-900/50 rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-video bg-zinc-800"></div>
                  <div className="p-6">
                    <div className="h-6 bg-zinc-800 rounded mb-2"></div>
                    <div className="h-4 bg-zinc-800 rounded w-1/3 mb-4"></div>
                    <div className="h-20 bg-zinc-800 rounded mb-4"></div>
                    <div className="h-10 bg-zinc-800 rounded"></div>
                  </div>
                </div>
              ))
            ) : clubs?.map((club) => (
              <div key={club.id} className="bg-zinc-900/50 rounded-lg overflow-hidden">
                <div className="aspect-video bg-zinc-800"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-white">{club.name}</h3>
                    <span className="text-gray-400">{club.club_members?.length || 0} members</span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">{club.location || 'Location not specified'}</p>
                  <p className="text-gray-400 mb-4">{club.description || 'No description available'}</p>
                  <Button 
                    className="w-full bg-emerald-500 hover:bg-emerald-600"
                    onClick={() => navigate(`/clubs/${club.id}`)}
                  >
                    View Club
                  </Button>
                </div>
              </div>
            ))}
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

      {/* Call to Action Section */}
      <div className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Running Together?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join Pace Tribe today and connect with runners in your area. Whether you're just starting or training for a marathon, there's a club for you.
          </p>
          <Button 
            onClick={() => navigate("/register")}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 text-lg"
          >
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;