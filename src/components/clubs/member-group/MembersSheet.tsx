import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberProfileLink } from "./MemberProfileLink";
import { FollowButton } from "@/components/profile/FollowButton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CaptainBadge } from "./CaptainBadge";

interface MembersSheetProps {
  clubId: string;
  totalCount: number;
}

type Member = {
  id: string;
  user_id: string;
  role?: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
    location: string | null;
  };
};

export const MembersSheet = ({ clubId, totalCount }: MembersSheetProps) => {
  const { user } = useAuth();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const { data: members, isLoading } = useQuery({
    queryKey: ['club-members', clubId],
    queryFn: async () => {
      console.log('Fetching members with roles...');
      const { data: membersData, error: membersError } = await supabase
        .from('club_members')
        .select(`
          id,
          user_id,
          role,
          profiles (
            username,
            avatar_url,
            location
          )
        `)
        .eq('club_id', clubId);

      if (membersError) {
        console.error('Error fetching members:', membersError);
        throw membersError;
      }
      console.log('Fetched members:', membersData);
      return membersData as Member[];
    },
  });

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) {
        console.error('Error fetching follow status:', error);
        return;
      }

      const followingSet = new Set(data.map(f => f.following_id));
      const newFollowingMap: Record<string, boolean> = {};
      members?.forEach(member => {
        newFollowingMap[member.user_id] = followingSet.has(member.user_id);
      });
      setFollowingMap(newFollowingMap);
    };

    if (members) {
      fetchFollowStatus();
    }
  }, [members, user]);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-0 h-auto hover:bg-transparent">
          <span className="text-xs text-muted-foreground hover:text-primary transition-colors">
            View all {totalCount} members
          </span>
        </Button>
      </SheetTrigger>
      <SheetContent 
        className="w-full sm:max-w-xl bg-zinc-900/95 border-zinc-800"
        side="right"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-zinc-100">
            <Users className="h-5 w-5" />
            Club Members ({members?.length || 0})
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-zinc-800/50 border-0">
                  <CardContent className="p-4">
                    <div className="h-12 w-full bg-zinc-700/50 rounded" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            members?.map((member) => (
              <Card
                key={member.id}
                className="bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors duration-200 border-0"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-grow min-w-0">
                      <MemberProfileLink userId={member.user_id}>
                        <div className="relative">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={member.profiles.avatar_url || undefined} />
                            <AvatarFallback>
                              {member.profiles.username?.[0]?.toUpperCase() || '?'}
                            </AvatarFallback>
                          </Avatar>
                          {member.role === 'captain' && <CaptainBadge />}
                        </div>
                      </MemberProfileLink>
                      <div className="flex-grow min-w-0">
                        <MemberProfileLink userId={member.user_id}>
                          <h3 className="text-sm font-medium text-zinc-100 truncate">
                            {member.profiles.username || 'Anonymous'}
                          </h3>
                        </MemberProfileLink>
                        {member.profiles.location && (
                          <span className="text-xs text-zinc-400 block truncate">
                            {member.profiles.location}
                          </span>
                        )}
                      </div>
                    </div>
                    {user && user.id !== member.user_id && (
                      <div className="flex-shrink-0">
                        <FollowButton
                          userId={member.user_id}
                          initialIsFollowing={followingMap[member.user_id] || false}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};