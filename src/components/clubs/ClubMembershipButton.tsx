import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ClubMembershipButtonProps {
  clubId: string;
  isMember: boolean;
  userId?: string;
}

export const ClubMembershipButton = ({ clubId, isMember, userId }: ClubMembershipButtonProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const joinClubMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("club_members")
        .insert({
          club_id: clubId,
          user_id: userId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
      toast.success('You have joined the club');
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
        .eq("club_id", clubId)
        .eq("user_id", userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
      toast.success('You have left the club');
    },
    onError: (error) => {
      console.error('Error leaving club:', error);
      toast.error('Failed to leave the club. Please try again.');
    }
  });

  const isClubMutating = joinClubMutation.isPending || leaveClubMutation.isPending;

  if (!userId) {
    return (
      <Button
        className="w-full min-w-32 border border-white bg-white text-black hover:bg-gray-100"
        onClick={() => navigate("/login")}
      >
        Login to Join
      </Button>
    );
  }

  return (
    <Button
      className={`w-full min-w-32 ${
        isMember
          ? "border border-white text-white bg-transparent hover:bg-white/10"
          : "border border-white bg-white text-black hover:bg-gray-100"
      }`}
      onClick={() => {
        if (isMember) {
          leaveClubMutation.mutate();
        } else {
          joinClubMutation.mutate();
        }
      }}
      disabled={isClubMutating}
    >
      {isClubMutating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isMember ? (
        "Leave Club"
      ) : (
        "Join Club"
      )}
    </Button>
  );
};