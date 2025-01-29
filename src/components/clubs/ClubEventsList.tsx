import { EventCard } from "./events/EventCard";
import { NoEvents } from "./events/NoEvents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event } from "./events/types";

interface ClubEventsListProps {
  events: Event[];
  clubId: string;
  userId?: string;
}

export const ClubEventsList = ({ events, clubId, userId }: ClubEventsListProps) => {
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
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events && events.length > 0 ? (
          events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              userId={userId}
              onJoin={(eventId) => joinEventMutation.mutate(eventId)}
              onLeave={(eventId) => leaveEventMutation.mutate(eventId)}
              isLoading={joinEventMutation.isPending || leaveEventMutation.isPending}
            />
          ))
        ) : (
          <NoEvents />
        )}
      </div>
    </div>
  );
};