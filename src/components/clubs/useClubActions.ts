import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Club } from "./types";

export const useClubActions = (club: Club, userId?: string) => {
  const [isMember, setIsMember] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (userId && club.club_members) {
      setIsMember(club.club_members.some((member) => member.user_id === userId));
    }
  }, [club.club_members, userId]);

  const joinClubMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("club_members")
        .insert({
          club_id: club.id,
          user_id: userId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club', club.id] });
      toast.success('Successfully joined the club');
    },
    onError: (error) => {
      console.error('Error joining club:', error);
      toast.error('Failed to join the club. Please try again.');
    }
  });

  const leaveClubMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("club_members")
        .delete()
        .eq("club_id", club.id)
        .eq("user_id", userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      queryClient.invalidateQueries({ queryKey: ['club', club.id] });
      toast.success('Successfully left the club');
    },
    onError: (error) => {
      console.error('Error leaving club:', error);
      toast.error('Failed to leave the club. Please try again.');
    }
  });

  const handleJoinLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      navigate("/login");
      return;
    }

    if (isMember) {
      leaveClubMutation.mutate();
    } else {
      joinClubMutation.mutate();
    }
  };

  return {
    handleJoinLeaveClick,
    isLoading: joinClubMutation.isPending || leaveClubMutation.isPending,
    isMember,
  };
};