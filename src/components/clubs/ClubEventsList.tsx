import { EventCard } from "./events/EventCard";
import { NoEvents } from "./events/NoEvents";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Event } from "./events/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClubEventsListProps {
  events: Event[];
  clubId: string;
  userId?: string;
}

export const ClubEventsList = ({ events, clubId, userId }: ClubEventsListProps) => {
  const queryClient = useQueryClient();
  const now = new Date();

  // Split events into upcoming and past
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastEvents = events
    .filter(event => new Date(event.date) < now)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Most recent first

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

  const renderEventGrid = (eventList: Event[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {eventList.length > 0 ? (
        eventList.map((event) => (
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
  );

  return (
    <div className="pt-4">
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            Upcoming Events
            {upcomingEvents.length > 0 && (
              <span className="bg-zinc-800 text-white px-2 py-0.5 rounded-full text-xs">
                {upcomingEvents.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            Past Events
            {pastEvents.length > 0 && (
              <span className="bg-zinc-800 text-white px-2 py-0.5 rounded-full text-xs">
                {pastEvents.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-0">
          {renderEventGrid(upcomingEvents)}
        </TabsContent>
        
        <TabsContent value="past" className="mt-0">
          {renderEventGrid(pastEvents)}
        </TabsContent>
      </Tabs>
    </div>
  );
};