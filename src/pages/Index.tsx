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
        .select(`
          *,
          club_members!club_members_club_id_fkey (
            count
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const categories = [
    { 
      name: 'Trails', 
      icon: '/lovable-uploads/172a4cca-8937-40ba-b6bb-f35085b36bb7.png',
    },
    { 
      name: 'Road', 
      icon: '/lovable-uploads/aaae8bd4-c7f5-4ca1-9fac-fde0a09ac193.png',
      selected: true 
    },
    { 
      name: 'Track', 
      icon: '/lovable-uploads/0e9e5ef6-c03a-469d-a897-99700fa12bd0.png',
    },
    { 
      name: 'Coaching', 
      icon: '/lovable-uploads/ef1bf8f5-8d03-4e1b-97de-c32adbc3661f.png',
    },
    { 
      name: 'Social', 
      icon: '/lovable-uploads/b93e8026-1345-4911-96e9-1b58b8478f90.png',
    },
    { 
      name: 'Recovery', 
      icon: '/lovable-uploads/c5a3292f-e28b-4f6d-82c8-6f8784c83570.png',
    },
    {
      name: 'Nutrition',
      icon: '/lovable-uploads/12df4cdf-f053-47f8-9e42-9a02b17d451d.png',
    },
    {
      name: 'Shoe Store',
      icon: '/lovable-uploads/a1d393c8-d808-4613-982f-a4a705184f57.png',
    },
    {
      name: 'Cleaning',
      icon: '/lovable-uploads/e2f4d6b0-e690-4dee-afd7-226ae3eb50b5.png',
    }
  ];

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
            <div className="max-w-md mx-auto mb-12">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  type="text"
                  placeholder="Search clubs by location..."
                  className="pl-10 w-full bg-zinc-800/50 border-zinc-700"
                />
                <Button 
                  className="absolute right-0 top-0 h-full bg-white hover:bg-white text-black"
                  onClick={() => navigate("/clubs")}
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Categories Row */}
            <div className="flex justify-center gap-8 mb-16 overflow-x-auto px-4">
              {categories.map((category) => (
                <div 
                  key={category.name}
                  className={`flex flex-col items-center cursor-pointer ${
                    category.selected ? 'opacity-100' : 'opacity-50'
                  } hover:opacity-100 transition-opacity flex-shrink-0`}
                >
                  <div className="w-12 h-12 mb-2">
                    <img 
                      src={category.icon} 
                      alt={category.name}
                      className="w-full h-full object-contain invert"
                    />
                  </div>
                  <span className="text-white text-sm whitespace-nowrap">
                    {category.name}
                  </span>
                  {category.selected && (
                    <div className="h-0.5 w-full bg-white mt-2"></div>
                  )}
                </div>
              ))}
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
                <div key={i} className="bg-zinc-800/50 rounded-2xl overflow-hidden animate-pulse p-6">
                  <div className="h-6 bg-zinc-700 rounded mb-2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/3 mb-4"></div>
                  <div className="h-20 bg-zinc-700 rounded mb-4"></div>
                </div>
              ))
            ) : clubs?.map((club) => (
              <div 
                key={club.id} 
                className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer"
                onClick={() => navigate(`/clubs/${club.id}`)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-white">{club.name}</h3>
                  <span className="text-gray-400 text-sm">
                    {club.club_members[0]?.count || 0} members
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-4">{club.location || 'Location not specified'}</p>
                <p className="text-gray-400">{club.description || 'No description available'}</p>
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
            className="bg-white text-black px-8 py-3 text-lg"
          >
            Join Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
