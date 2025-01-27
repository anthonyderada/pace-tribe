import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Route, Timer } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  club_id: string;
  distance: number | null;
  pace: string | null;
  clubs: {
    name: string;
    location: string | null;
    description: string | null;
    thumbnail_url: string | null;
    club_members: {
      id: string;
      user_id: string;
    }[];
  };
  event_participants: {
    id: string;
    user_id: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
    };
  }[];
};

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [isParticipant, setIsParticipant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { data: existingRegistration } = await supabase
        .from("event_participants")
        .select()
        .eq("event_id", id)
        .eq("user_id", user?.id)
        .maybeSingle();

      if (existingRegistration) {
        throw new Error("You are already registered for this event");
      }

      const { error } = await supabase
        .from("event_participants")
        .insert({
          event_id: id,
          user_id: user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You are now registered for the event",
      });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      setIsParticipant(true);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register for the event",
      });
      console.error("Error:", error);
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("event_participants")
        .delete()
        .eq("event_id", id)
        .eq("user_id", user?.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You have cancelled your registration for the event",
      });
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      setIsParticipant(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel registration",
      });
      console.error("Error:", error);
    },
  });

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select(`
            *,
            clubs (
              name,
              location,
              description,
              thumbnail_url,
              club_members (
                id,
                user_id
              )
            ),
            event_participants (
              id,
              user_id,
              profiles (
                username,
                avatar_url
              )
            )
          `)
          .eq("id", id)
          .maybeSingle();

        if (eventError) throw eventError;
        if (!eventData) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Event not found",
          });
          navigate("/events");
          return;
        }
        setEvent(eventData);

        if (user) {
          const isCurrentParticipant = eventData.event_participants.some(
            (participant) => participant.user_id === user.id
          );
          setIsParticipant(isCurrentParticipant);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load event details",
        });
        navigate("/events");
      }
    };

    getEventDetails();

    // Subscribe to real-time changes in event_participants
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "event_participants",
          filter: `event_id=eq.${id}`,
        },
        async () => {
          // Refetch event data when participants change
          const { data } = await supabase
            .from("events")
            .select(`
              *,
              clubs (
                name,
                location,
                description,
                thumbnail_url,
                club_members (
                  id,
                  user_id
                )
              ),
              event_participants (
                id,
                user_id,
                profiles (
                  username,
                  avatar_url
                )
              )
            `)
            .eq("id", id)
            .maybeSingle();

          if (data) {
            setEvent(data);
            if (user) {
              const isCurrentParticipant = data.event_participants.some(
                (participant) => participant.user_id === user.id
              );
              setIsParticipant(isCurrentParticipant);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, navigate, toast]);

  const handleParticipation = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isParticipant) {
      cancelMutation.mutate();
    } else {
      registerMutation.mutate();
    }
  };

  if (isLoading || !event) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-zinc-100">
            {event.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-2 text-zinc-400">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.date), "MMMM d, yyyy - h:mm a")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-zinc-100">
              Event Details
            </h3>
            <p className="text-zinc-400 mb-4">
              {event.description || "No description available."}
            </p>
            <div className="space-y-4">
              {event.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-zinc-400" />
                  <span className="text-zinc-400">{event.location}</span>
                </div>
              )}
              {event.distance && (
                <div className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-zinc-400" />
                  <span className="text-zinc-400">
                    {(event.distance * 0.621371).toFixed(1)} miles
                  </span>
                </div>
              )}
              {event.pace && (
                <div className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-zinc-400" />
                  <span className="text-zinc-400">{event.pace}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-400">
                  {event.event_participants.length} participants
                </span>
              </div>
            </div>
          </div>
          {user ? (
            <Button
              className={`w-full mt-8 ${
                isParticipant
                  ? "border border-white text-white bg-transparent hover:bg-white/10"
                  : "border border-white bg-white text-black hover:bg-gray-100"
              }`}
              onClick={handleParticipation}
              disabled={registerMutation.isPending || cancelMutation.isPending}
            >
              {registerMutation.isPending || cancelMutation.isPending
                ? "Loading..."
                : isParticipant
                ? "Cancel Registration"
                : "Register"}
            </Button>
          ) : (
            <Button
              className="w-full mt-8 border border-white bg-white text-black hover:bg-gray-100"
              onClick={() => navigate("/login")}
            >
              Login to Register
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Organized by
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Card
            className="border border-zinc-800 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800/80 transition-colors"
            onClick={() => navigate(`/clubs/${event.club_id}`)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage
                    src={event.clubs.thumbnail_url || undefined}
                    alt={event.clubs.name}
                  />
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {event.clubs.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-xl font-semibold text-white">
                      {event.clubs.name}
                    </CardTitle>
                    <span className="text-gray-400 text-sm">
                      {event.clubs.club_members?.length || 0} members
                    </span>
                  </div>
                  <CardDescription className="text-gray-400 text-sm">
                    {event.clubs.location || "Location not specified"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">
                {event.clubs.description || "No description available"}
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Participants ({event.event_participants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {event.event_participants.length === 0 ? (
              <p className="text-zinc-400">No participants yet. Be the first to join!</p>
            ) : (
              event.event_participants.map((participant) => (
                <div
                  key={participant.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
                  onClick={() => navigate(`/profile/${participant.user_id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={participant.profiles.avatar_url || undefined}
                      alt={participant.profiles.username || "User"}
                    />
                    <AvatarFallback className="bg-emerald-600 text-white">
                      {participant.profiles.username?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-zinc-100">
                    {participant.profiles.username || "Anonymous Runner"}
                  </span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetail;
