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

const FeaturedClubs = () => {
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

  return (
    <div className="py-8 bg-black/40">
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
                              className="bg-zinc-800 text-zinc-100 pointer-events-none"
                            >
                              {assignment.club_labels.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {user && (
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
                      )}
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
  );
};

export default FeaturedClubs;