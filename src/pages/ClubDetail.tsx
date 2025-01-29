import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Route, Timer, Building2, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MemberAvatarGroup } from "@/components/clubs/MemberAvatarGroup";
import { NextEventOverlay } from "@/components/clubs/NextEventOverlay";
import { Badge } from "@/components/ui/badge";

const ClubDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: club, isLoading: isClubLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select(`
          *,
          club_members (
            id,
            user_id,
            profiles (
              username,
              avatar_url
            )
          ),
          events (
            *,
            event_participants (
              id,
              user_id
            )
          ),
          club_label_assignments (
            id,
            label_id,
            club_labels (
              id,
              name
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

  const joinClubMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("club_members")
        .insert({
          club_id: id,
          user_id: user?.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
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
        .eq("club_id", id)
        .eq("user_id", user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
      toast.success('You have left the club');
    },
    onError: (error) => {
      console.error('Error leaving club:', error);
      toast.error('Failed to leave the club. Please try again.');
    }
  });

  const joinEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("event_participants")
        .insert({
          event_id: eventId,
          user_id: user?.id,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
      toast.success('Successfully registered for the event');
    },
    onError: (error) => {
      console.error('Error joining event:', error);
      toast.error('Failed to register for the event. Please try again.');
    }
  });

  const leaveEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
      toast.success('Successfully unregistered from the event');
    },
    onError: (error) => {
      console.error('Error leaving event:', error);
      toast.error('Failed to unregister from the event. Please try again.');
    }
  });

  useEffect(() => {
    const channel = supabase
      .channel('club-members-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'club_members',
          filter: `club_id=eq.${id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['club', id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  if (isClubLoading || !club) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
          <CardContent className="p-6">
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextEvent = club.events
    ?.filter(event => new Date(event.date) > new Date())
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const isMember = club?.club_members?.some(member => member.user_id === user?.id);
  const isClubMutating = joinClubMutation.isPending || leaveClubMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl overflow-hidden">
        <div className="relative">
          {club.thumbnail_url && (
            <div className="w-full h-64 relative">
              <img
                src={club.thumbnail_url}
                alt={club.name}
                className="w-full h-full object-cover"
              />
              {nextEvent && <NextEventOverlay event={nextEvent} />}
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">{club.name}</h1>
              {club.location && (
                <div className="flex items-center gap-2 text-zinc-400 mb-4">
                  <MapPin className="h-4 w-4" />
                  {club.location}
                </div>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                {club.club_label_assignments?.map((assignment) => (
                  <Badge
                    key={assignment.id}
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-100"
                  >
                    {assignment.club_labels.name}
                  </Badge>
                ))}
              </div>
              <p className="text-zinc-400 mb-6">
                {club.description || "No description available."}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {user ? (
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
              ) : (
                <Button
                  className="w-full min-w-32 border border-white bg-white text-black hover:bg-gray-100"
                  onClick={() => navigate("/login")}
                >
                  Login to Join
                </Button>
              )}
              <MemberAvatarGroup 
                members={club.club_members} 
                clubId={club.id}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {club.events && club.events.length > 0 ? (
              club.events.map((event) => {
                const isParticipant = event.event_participants?.some(participant => participant.user_id === user?.id);
                const isLoading = joinEventMutation.isPending || leaveEventMutation.isPending;

                return (
                  <Card
                    key={event.id}
                    className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-white">
                        {event.title}
                      </h3>
                      {user && (
                        <Button
                          className={`w-24 ${
                            isParticipant
                              ? "border border-white text-white bg-transparent hover:bg-white/10"
                              : "border border-white bg-white text-black hover:bg-gray-100"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isParticipant) {
                              leaveEventMutation.mutate(event.id);
                            } else {
                              joinEventMutation.mutate(event.id);
                            }
                          }}
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : isParticipant ? (
                            'Leave'
                          ) : (
                            'Join'
                          )}
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.date), "MMM d, yyyy - h:mm a")}
                    </div>
                    {event.location && (
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4 mb-3">
                      {event.distance && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Route className="h-4 w-4" />
                          {(Number(event.distance) * 0.621371).toFixed(1)} miles
                        </div>
                      )}
                      {event.pace && (
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                          <Timer className="h-4 w-4" />
                          {event.pace}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-400 line-clamp-3">
                      {event.description || "No description available"}
                    </p>
                    <p className="text-gray-400 text-sm mt-4">
                      {event.event_participants?.length || 0} participants
                    </p>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center text-zinc-400">
                No upcoming events
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;
