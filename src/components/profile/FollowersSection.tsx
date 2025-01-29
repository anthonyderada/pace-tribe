import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users } from "lucide-react";

interface FollowersSectionProps {
  userId: string;
}

export const FollowersSection = ({ userId }: FollowersSectionProps) => {
  const { data: followers } = useQuery({
    queryKey: ['followers', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower_id,
          profiles!follows_follower_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('following_id', userId);

      if (error) throw error;
      return data;
    },
  });

  const { data: following } = useQuery({
    queryKey: ['following', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following_id,
          profiles!follows_following_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('follower_id', userId);

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="border-0 bg-zinc-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <Users className="h-5 w-5" />
          Network
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold mb-2 text-zinc-100">
            Followers ({followers?.length || 0})
          </h3>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {followers?.map((follow) => (
                <Link
                  key={follow.follower_id}
                  to={`/profile/${follow.profiles.id}`}
                  className="flex items-center gap-2 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={follow.profiles.avatar_url || undefined} />
                    <AvatarFallback className="bg-emerald-600">
                      {follow.profiles.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-zinc-300">
                    {follow.profiles.username}
                  </span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-zinc-100">
            Following ({following?.length || 0})
          </h3>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {following?.map((follow) => (
                <Link
                  key={follow.following_id}
                  to={`/profile/${follow.profiles.id}`}
                  className="flex items-center gap-2 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={follow.profiles.avatar_url || undefined} />
                    <AvatarFallback className="bg-emerald-600">
                      {follow.profiles.username[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-zinc-300">
                    {follow.profiles.username}
                  </span>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
};