import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const ClubMembers = () => {
  const { id } = useParams();

  const { data: club, isLoading } = useQuery({
    queryKey: ['club-members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select(`
          name,
          club_members (
            id,
            user_id,
            profiles (
              id,
              username,
              avatar_url,
              bio
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Club not found");
      return data;
    },
  });

  if (isLoading || !club) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
          <CardContent className="p-6">
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {club.name} Members ({club.club_members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {club.club_members.map((member) => (
              <Card
                key={member.id}
                className="bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
                onClick={() => window.location.href = `/profile/${member.profiles.id}`}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={member.profiles.avatar_url || undefined} />
                      <AvatarFallback>
                        {member.profiles.username?.[0]?.toUpperCase() || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-zinc-100">
                        {member.profiles.username || 'Anonymous'}
                      </h3>
                      {member.profiles.bio && (
                        <p className="text-sm text-zinc-400 line-clamp-1">
                          {member.profiles.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubMembers;