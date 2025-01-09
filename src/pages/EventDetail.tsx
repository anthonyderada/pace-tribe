import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  club_id: string;
  clubs: {
    name: string;
  };
  event_participants: {
    id: string;
    user_id: string;
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

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        // Get event details
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select(`
            *,
            clubs (
              name
            ),
            event_participants (
              id,
              user_id
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

        // Check if user is a participant
        if (user) {
          const { data } = await supabase
            .from("event_participants")
            .select("id")
            .eq("event_id", id)
            .eq("user_id", user.id)
            .maybeSingle();

          setIsParticipant(!!data);
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

    // Set up real-time subscription for participants
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
          // Update event details
          const { data } = await supabase
            .from("events")
            .select(`
              *,
              clubs (
                name
              ),
              event_participants (
                id,
                user_id
              )
            `)
            .eq("id", id)
            .maybeSingle();

          if (data) {
            setEvent(data);
            if (user) {
              setIsParticipant(
                data.event_participants.some((p) => p.user_id === user.id)
              );
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

    try {
      if (isParticipant) {
        // Leave event
        const { error } = await supabase
          .from("event_participants")
          .delete()
          .eq("event_id", id)
          .eq("user_id", user.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "You have left the event",
        });
      } else {
        // Join event
        const { error } = await supabase.from("event_participants").insert({
          event_id: id,
          user_id: user.id,
        });

        if (error) throw error;

        toast({
          title: "Success",
          description: "You have joined the event",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update participation",
      });
    }
  };

  if (isLoading || !event) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Card className="border-0 bg-zinc-900/90">
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
      <Card className="border-0 bg-zinc-900/90">
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
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white`}
              onClick={handleParticipation}
            >
              {isParticipant ? "Leave Event" : "Join Event"}
            </Button>
          ) : (
            <Button
              className="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate("/login")}
            >
              Login to Register
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">
            Organized by
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Card
            className="border-0 bg-zinc-900/90 cursor-pointer hover:bg-zinc-800/90 transition-colors"
            onClick={() => navigate(`/clubs/${event.club_id}`)}
          >
            <CardHeader>
              <CardTitle className="text-lg text-zinc-100">
                {event.clubs.name}
              </CardTitle>
              <CardDescription className="text-zinc-400">
                Running Club
              </CardDescription>
            </CardHeader>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetail;