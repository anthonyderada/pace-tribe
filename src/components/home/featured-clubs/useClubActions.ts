import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Club } from "./types";

export const useClubActions = (club: Club, userId?: string) => {
  const queryClient = useQueryClient();
  const isMember = club.club_members?.some(member => member.user_id === userId);

  const joinClubMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('club_members')
        .insert([{ club_id: club.id, user_id: userId }]);
      
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
    mutationFn: async () => {
      const { error } = await supabase
        .from('club_members')
        .delete()
        .eq('club_id', club.id)
        .eq('user_id', userId);
      
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

  const handleJoinLeaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!userId) {
      toast.error('Please log in to join clubs');
      return;
    }

    if (isMember) {
      leaveClubMutation.mutate();
    } else {
      joinClubMutation.mutate();
    }
  };

  const isLoading = joinClubMutation.isPending || leaveClubMutation.isPending;

  return {
    handleJoinLeaveClick,
    isLoading,
    isMember
  };
};