import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UserCheck, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing: boolean;
}

export const FollowButton = ({ userId, initialIsFollowing }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Check initial follow status
  useEffect(() => {
    const checkFollowStatus = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('follows')
        .select('*')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      if (!error && data) {
        setIsFollowing(true);
      }
    };

    checkFollowStatus();
  }, [user, userId]);

  const handleFollowToggle = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      if (isFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);

        if (error) throw error;
        setIsFollowing(false);
        toast({
          description: "Unfollowed successfully",
        });
      } else {
        const { error } = await supabase
          .from('follows')
          .insert([
            { follower_id: user.id, following_id: userId }
          ]);

        if (error) throw error;
        setIsFollowing(true);
        toast({
          description: "Following successfully",
        });
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast({
        variant: "destructive",
        description: "Failed to update follow status",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (user?.id === userId) return null;

  return (
    <Button
      variant={isFollowing ? "secondary" : "default"}
      size="sm"
      onClick={handleFollowToggle}
      disabled={isLoading || !user}
      className="ml-auto text-xs font-medium border border-zinc-700"
    >
      {isFollowing ? (
        <>
          <UserCheck className="h-4 w-4 mr-1" />
          Following
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4 mr-1" />
          Follow
        </>
      )}
    </Button>
  );
};