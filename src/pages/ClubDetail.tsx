import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, Route, Timer, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";

type Club = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  thumbnail_url: string | null;
  club_members: {
    id: string;
    user_id: string;
  }[];
  events: {
    id: string;
    title: string;
    description: string | null;
    date: string;
    location: string | null;
    distance: number | null;
    pace: string | null;
    event_participants: {
      id: string;
      user_id: string;
    }[];
  }[];
};

const ClubDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);

  const { data: club, isLoading: isClubLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select(`
          *,
          club_members (
            id,
            user_id
          ),
          events (
            *,
            event_participants (
              id,
              user_id
            )
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Club not found");
      return data as Club;
    },
  });

  // Add real-time subscription for club members
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
          // Refetch club data when club members change
          queryClient.invalidateQueries({ queryKey: ['club', id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  const joinEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('event_participants')
        .insert([{ event_id: eventId, user_id: user?.id }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
      toast.success('Successfully registered for the event!');
    },
    onError: (error) => {
      console.error('Error registering for event:', error);
      toast.error('Failed to register for the event. Please try again.');
    }
  });

  const leaveEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user?.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', id] });
      toast.success('Successfully unregistered from the event');
    },
    onError: (error) => {
      console.error('Error unregistering from event:', error);
      toast.error('Failed to unregister from the event. Please try again.');
    }
  });

  const handleMembership = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const isMember = club?.club_members?.some(member => member.user_id === user?.id);
      if (isMember) {
        const { error } = await supabase
          .from("club_members")
          .delete()
          .eq("club_id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        toast.success('You have left the club');
      } else {
        const { data: existingMembership, error: checkError } = await supabase
          .from("club_members")
          .select()
          .eq("club_id", id)
          .eq("user_id", user.id)
          .maybeSingle();

        if (checkError) throw checkError;

        if (existingMembership) {
          toast.error('You are already a member of this club');
          return;
        }

        const { error } = await supabase
          .from("club_members")
          .insert({
            club_id: id,
            user_id: user.id,
          });

        if (error) {
          if (error.code === "23505") {
            toast.error('You are already a member of this club');
            return;
          }
          throw error;
        }

        toast.success('You have joined the club');
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error('Failed to update membership');
    }
  };

  const handleEventParticipation = (eventId: string, isParticipant: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please log in to register for events');
      return;
    }

    if (isParticipant) {
      leaveEventMutation.mutate(eventId);
    } else {
      joinEventMutation.mutate(eventId);
    }
  };

  if (isClubLoading || !club) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
          <CardHeader>
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-zinc-800 rounded animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isMember = club.club_members?.some(member => member.user_id === user?.id);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            {club.thumbnail_url && (
              <img
                src={club.thumbnail_url}
                alt={club.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
            )}
            <div>
              <CardTitle className="text-4xl font-bold text-zinc-100">
                {club.name}
              </CardTitle>
              {club.location && (
                <CardDescription className="flex items-center gap-2 text-zinc-400">
                  <MapPin className="h-4 w-4" />
                  {club.location}
                </CardDescription>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-zinc-100">About</h3>
            <p className="text-zinc-400">
              {club.description || "No description available."}
            </p>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Users className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-400">
              {club.club_members.length} members
            </span>
          </div>
          {user ? (
            <Button
              className={`w-full ${
                isMember
                  ? "border border-white text-white bg-transparent hover:bg-white/10"
                  : "border border-white bg-white text-black hover:bg-gray-100"
              }`}
              onClick={handleMembership}
            >
              {isMember ? "Leave Club" : "Join Club"}
            </Button>
          ) : (
            <Button
              className="w-full border border-white bg-white text-black hover:bg-gray-100"
              onClick={() => navigate("/login")}
            >
              Login to Join
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Button
                        className={`w-24 ${
                          isParticipant
                            ? "border border-white text-white bg-transparent hover:bg-white/10"
                            : "border border-white bg-white text-black hover:bg-gray-100"
                        }`}
                        onClick={(e) => handleEventParticipation(event.id, isParticipant, e)}
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