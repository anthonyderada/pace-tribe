import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { EventHeader } from "@/components/events/detail/EventHeader";
import { EventDetailsSection } from "@/components/events/detail/EventDetailsSection";
import { EventParticipantsList } from "@/components/events/detail/EventParticipantsList";
import { EventActions } from "@/components/events/detail/EventActions";
import { useEffect } from "react";

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select(`
          *,
          clubs (
            name,
            location,
            description,
            thumbnail_url
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

      if (error) throw error;
      if (!data) throw new Error("Event not found");
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('event-participants-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants',
          filter: `event_id=eq.${id}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['event', id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, queryClient]);

  const registerMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("event_participants")
        .insert({
          event_id: id,
          user_id: user?.id,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success("Successfully registered for the event!");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to register for the event");
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
      queryClient.invalidateQueries({ queryKey: ['event', id] });
      toast.success("Successfully cancelled your registration");
    },
    onError: (error) => {
      console.error("Error:", error);
      toast.error("Failed to cancel registration");
    },
  });

  const handleParticipation = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const isParticipant = event?.event_participants?.some(
      (participant) => participant.user_id === user.id
    );

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
          <CardContent className="p-6">
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isParticipant = event.event_participants?.some(
    (participant) => participant.user_id === user?.id
  );
  const isMutating = registerMutation.isPending || cancelMutation.isPending;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardContent className="p-6">
          <EventHeader event={event} />
          <EventDetailsSection event={event} />
          <EventActions
            isParticipant={isParticipant}
            isMutating={isMutating}
            user={user}
            handleParticipation={handleParticipation}
          />
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <EventParticipantsList event={event} />
      </Card>
    </div>
  );
};

export default EventDetail;