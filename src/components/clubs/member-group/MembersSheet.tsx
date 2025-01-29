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

interface MembersSheetProps {
  clubId: string;
  totalCount: number;
}

type Member = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  location: string | null;
  shared_events_count?: number;
};

export const MembersSheet = ({ clubId, totalCount }: MembersSheetProps) => {
  const { user } = useAuth();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const { data: members, isLoading } = useQuery({
    queryKey: ['club-members', clubId],
    queryFn: async () => {
      // First get all club members
      const { data: membersData, error: membersError } = await supabase
        .from('club_members')
        .select(`
          user_id,
          profiles (
            id,
            username,
            avatar_url,
            location
          )
        `)
        .eq('club_id', clubId);

      if (membersError) throw membersError;

      // Transform the data to match our Member type
      const transformedMembers = membersData.map(member => ({
        id: member.profiles.id,
        username: member.profiles.username,
        avatar_url: member.profiles.avatar_url,
        location: member.profiles.location,
        shared_events_count: 0
      }));

      // If user is logged in, get shared events count for each member
      if (user) {
        const { data: userEvents, error: eventsError } = await supabase
          .from('event_participants')
          .select('event_id')
          .eq('user_id', user.id);

        if (eventsError) throw eventsError;

        const userEventIds = userEvents.map(e => e.event_id);

        // For each member, count shared events
        const membersWithSharedEvents = await Promise.all(
          transformedMembers.map(async (member) => {
            if (member.id === user.id) {
              return { ...member, shared_events_count: 0 };
            }

            const { data: memberEvents, error: memberEventsError } = await supabase
              .from('event_participants')
              .select('event_id')
              .eq('user_id', member.id)
              .in('event_id', userEventIds);

            if (memberEventsError) throw memberEventsError;

            return {
              ...member,
              shared_events_count: memberEvents.length
            };
          })
        );

        return membersWithSharedEvents;
      }

      return transformedMembers;
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
        newFollowingMap[member.id] = followingSet.has(member.id);
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
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
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
                className="bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors border-0"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <MemberProfileLink userId={member.id}>
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar_url || undefined} />
                        <AvatarFallback>
                          {member.username?.[0]?.toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                    </MemberProfileLink>
                    <div className="flex-grow">
                      <MemberProfileLink userId={member.id}>
                        <h3 className="text-sm font-medium text-zinc-100">
                          {member.username || 'Anonymous'}
                        </h3>
                      </MemberProfileLink>
                      <div className="flex flex-col gap-1">
                        {member.location && (
                          <span className="text-xs text-zinc-400">
                            {member.location}
                          </span>
                        )}
                        {user && member.shared_events_count! > 0 && (
                          <span className="text-xs text-zinc-400">
                            {member.shared_events_count} shared event{member.shared_events_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                    {user && user.id !== member.id && (
                      <FollowButton
                        userId={member.id}
                        initialIsFollowing={followingMap[member.id] || false}
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