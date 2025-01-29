import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SearchBar } from "@/components/clubs/search/SearchBar";
import { ClubCard } from "@/components/clubs/ClubCard";
import { useState } from "react";

const Clubs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: clubs, isLoading, error } = useQuery({
    queryKey: ['clubs'],
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
        .order('created_at', { ascending: false });
      
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
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
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
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
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

  const filteredClubs = clubs?.filter(club => 
    club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    club.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (error) {
    console.error('Error loading clubs:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">Running Clubs</h1>
        <SearchBar onSearch={setSearchQuery} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="bg-zinc-800/50 rounded-2xl border-0">
              <CardContent className="p-0">
                <Skeleton className="h-48 rounded-t-2xl bg-zinc-800" />
                <div className="p-6">
                  <Skeleton className="h-6 w-2/3 mb-2 bg-zinc-800" />
                  <Skeleton className="h-4 w-1/3 bg-zinc-800" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredClubs && filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <ClubCard
              key={club.id}
              club={club}
              userId={user?.id}
              onJoinLeave={handleJoinLeaveClick}
              isLoading={joinClubMutation.isPending || leaveClubMutation.isPending}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-zinc-400">
            No clubs found
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;