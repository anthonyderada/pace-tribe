import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Route, Timer, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  event_participants: { user_id: string }[];
}

interface ClubEventsListProps {
  events: Event[];
  clubId: string;
  userId?: string;
}

export const ClubEventsList = ({ events, clubId, userId }: ClubEventsListProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const joinEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const { error } = await supabase
        .from("event_participants")
        .insert({
          event_id: eventId,
          user_id: userId,
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
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
        .eq("user_id", userId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['club', clubId] });
      toast.success('Successfully unregistered from the event');
    },
    onError: (error) => {
      console.error('Error leaving event:', error);
      toast.error('Failed to unregister from the event. Please try again.');
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {events && events.length > 0 ? (
        events.map((event) => {
          const isParticipant = event.event_participants?.some(
            participant => participant.user_id === userId
          );
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
                {userId && (
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
  );
};