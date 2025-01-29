import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { EventSearchBar } from "./events/EventSearchBar";
import { EventList } from "./events/EventList";

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          club:clubs(
            id,
            name,
            thumbnail_url
          ),
          participants:event_participants(user_id)
        `)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ eventId, isRegistered }: { eventId: string; isRegistered: boolean }) => {
      if (isRegistered) {
        const { error } = await supabase
          .from('event_participants')
          .delete()
          .eq('event_id', eventId)
          .eq('user_id', user?.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('event_participants')
          .insert([{ event_id: eventId, user_id: user?.id }]);
        
        if (error) throw error;
      }
    },
    onSuccess: (_, { isRegistered }) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast.success(
        isRegistered 
          ? 'Successfully unregistered from the event'
          : 'Successfully registered for the event!'
      );
    },
    onError: (error) => {
      console.error('Error with event registration:', error);
      toast.error('Failed to update event registration. Please try again.');
    }
  });

  const handleRegister = (eventId: string, isRegistered: boolean) => {
    if (!user) {
      toast.error('Please log in to register for events');
      return;
    }
    registerMutation.mutate({ eventId, isRegistered });
  };

  if (error) {
    console.error('Error loading events:', error);
  }

  const filteredEvents = events?.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">Running Events</h1>
        <div className="flex gap-4 items-center">
          <EventSearchBar onSearch={setSearchQuery} />
        </div>
      </div>

      <EventList
        events={filteredEvents}
        isLoading={isLoading}
        userId={user?.id}
        onRegister={handleRegister}
        isRegistering={registerMutation.isPending}
      />
    </div>
  );
};

export default Events;