import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MemberProfileLink } from "@/components/clubs/member-group/MemberProfileLink";
import { FollowButton } from "@/components/profile/FollowButton";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

type Member = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  location: string | null;
  shared_events_count?: number;
};

const Members = () => {
  const { user } = useAuth();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});

  const { data: members, isLoading } = useQuery({
    queryKey: ['members'],
    queryFn: async () => {
      // First get all members
      const { data: membersData, error: membersError } = await supabase
        .from('profiles')
        .select('id, username, avatar_url, location');

      if (membersError) throw membersError;

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
          membersData.map(async (member) => {
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

      return membersData.map(member => ({ ...member, shared_events_count: 0 }));
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-zinc-800 bg-transparent rounded-2xl">
          <CardContent className="p-6">
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border border-zinc-800 bg-transparent rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Users className="h-5 w-5" />
            Community Members ({members?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members?.map((member) => (
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
                        <h3 className="font-semibold text-zinc-100">
                          {member.username || 'Anonymous'}
                        </h3>
                      </MemberProfileLink>
                      <div className="flex flex-col gap-0.5">
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
                    <FollowButton
                      userId={member.id}
                      initialIsFollowing={followingMap[member.id] || false}
                    />
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

export default Members;