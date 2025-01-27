import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['featuredClubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select(`
          *,
          club_members (
            id,
            user_id
          ),
          club_label_assignments (
            id,
            label_id,
            club_labels (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  const joinClubMutation = useMutation({
    mutationFn: async (clubId: string) => {
      const { error } = await supabase
        .from('club_members')
        .insert([{ club_id: clubId, user_id: user?.id }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredClubs'] });
      toast.success('Successfully joined the club!');
    },
    onError: (error) => {
      console.error('Error joining club:', error);
      toast.error('Failed to join the club. Please try again.');
    }
  });

  const leaveClubMutation = useMutation({
    mutationFn: async (clubId: string) => {
      const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', clubId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['featuredClubs'] });
      toast.success('Successfully left the club');
    },
    onError: (error) => {
      console.error('Error leaving club:', error);
      toast.error('Failed to leave the club. Please try again.');
    }
  });

  const handleJoinLeaveClick = (clubId: string, isMember: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to join clubs');
      return;
    }

    if (isMember) {
      leaveClubMutation.mutate(clubId);
    } else {
      joinClubMutation.mutate(clubId);
    }
  };

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
      name: 'Performance', 
      icon: '/lovable-uploads/ef1bf8f5-8d03-4e1b-97de-c32adbc3661f.png',
    },
    { 
      name: 'Social', 
      icon: '/lovable-uploads/b93e8026-1345-4911-96e9-1b58b8478f90.png',
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <div className="relative bg-background-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Find Your Running Tribe
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Connect with local running clubs, join group runs, and become part of a community that shares your passion for running.
            </p>
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
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="bg-zinc-800/50 rounded-2xl border-0">
                  <CardContent className="p-0">
                    <Skeleton className="h-48 rounded-t-2xl bg-zinc-800" />
                    <div className="p-6">
                      <Skeleton className="h-6 w-2/3 mb-2 bg-zinc-800" />
                      <Skeleton className="h-4 w-1/3 bg-zinc-800" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : clubs?.map((club) => {
              const isMember = club.club_members?.some(member => member.user_id === user?.id);
              const isLoading = joinClubMutation.isPending || leaveClubMutation.isPending;

              return (
                <Card 
                  key={club.id} 
                  className="bg-zinc-800/50 rounded-2xl overflow-hidden hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
                  onClick={() => navigate(`/clubs/${club.id}`)}
                >
                  <CardContent className="p-0">
                    {club.thumbnail_url ? (
                      <img 
                        src={club.thumbnail_url} 
                        alt={club.name}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-zinc-700 flex items-center justify-center">
                        <span className="text-zinc-400">No image</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{club.name}</h3>
                          <p className="text-gray-400 text-sm mt-1">{club.location || 'Location not specified'}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {club.club_label_assignments?.map((assignment) => (
                              <Badge
                                key={assignment.id}
                                variant="secondary"
                                className="bg-zinc-800 text-zinc-100"
                              >
                                {assignment.club_labels.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          className={`w-24 ${
                            isMember
                              ? "border border-white text-white bg-transparent hover:bg-white/10"
                              : "border border-white bg-white text-black hover:bg-gray-100"
                          }`}
                          onClick={(e) => handleJoinLeaveClick(club.id, isMember, e)}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isMember ? (
                            'Leave'
                          ) : (
                            'Join'
                          )}
                        </Button>
                      </div>
                      <p className="text-gray-400 line-clamp-3 mt-4">{club.description || 'No description available'}</p>
                      <p className="text-gray-400 text-sm mt-4">{club.club_members?.length || 0} members</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
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

      {/* Call to Action or Feedback Section */}
      <div className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-4 text-center">
          {user ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Welcome to Pace Tribe!
              </h2>
              <p className="text-xl text-gray-400 mb-8">
                We are always looking to improve this app for you. Feel free to leave feature ideas or feedback about the current app below.
              </p>
              <Button 
                onClick={() => window.open("https://forms.gle/YourFormLink", "_blank")}
                className="bg-white text-black px-8 py-3 text-lg"
              >
                Feedback Form
              </Button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;