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
import { sortAndGroupMembers } from "./utils/memberSorting";

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

      if (membersError) throw membersError;
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
                  <div className="flex items-center gap-3">
                    <MemberProfileLink userId={member.user_id}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.profiles.avatar_url || undefined} />
                        <AvatarFallback>
                          {member.profiles.username?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </MemberProfileLink>
                    <div className="flex-grow">
                      <MemberProfileLink userId={member.user_id}>
                        <h3 className="text-sm font-medium text-zinc-100">
                          {member.profiles.username || 'Anonymous'}
                        </h3>
                      </MemberProfileLink>
                      <div className="flex flex-col gap-1">
                        {member.profiles.location && (
                          <span className="text-xs text-zinc-400">
                            {member.profiles.location}
                          </span>
                        )}
                      </div>
                    </div>
                    {user && user.id !== member.user_id && (
                      <FollowButton
                        userId={member.user_id}
                        initialIsFollowing={followingMap[member.user_id] || false}
                      />
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