import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useProfileData = (profileId: string | undefined) => {
  const { toast } = useToast();

  const { data: profile, isLoading: isProfileLoading, error: profileError } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error("Profile ID is required");
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", profileId)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Profile not found");
      
      return data;
    },
    enabled: !!profileId, // Only run query when profileId exists
  });

  const { data: accolades, isLoading: isAccoladesLoading } = useQuery({
    queryKey: ['accolades', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error("Profile ID is required");
      
      const { data, error } = await supabase
        .from("accolades")
        .select("*")
        .eq("user_id", profileId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!profileId, // Only run query when profileId exists
  });

  const { data: joinedClubs, isLoading: isClubsLoading } = useQuery({
    queryKey: ['joined_clubs', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error("Profile ID is required");
      
      const { data, error } = await supabase
        .from("club_members")
        .select(`
          clubs (
            id,
            name,
            location,
            description,
            thumbnail_url
          )
        `)
        .eq("user_id", profileId);

      if (error) throw error;
      return data.map(item => item.clubs).filter(Boolean);
    },
    enabled: !!profileId, // Only run query when profileId exists
  });

  const { data: registeredEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ['registered_events', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error("Profile ID is required");
      
      const { data, error } = await supabase
        .from("event_participants")
        .select(`
          events (
            id,
            title,
            date,
            location,
            distance,
            pace,
            clubs (
              name
            )
          )
        `)
        .eq("user_id", profileId);

      if (error) throw error;
      return data
        .map(item => ({
          ...item.events,
          club: { name: item.events.clubs.name }
        }))
        .filter(Boolean);
    },
    enabled: !!profileId, // Only run query when profileId exists
  });

  const isLoading = isProfileLoading || isAccoladesLoading || isClubsLoading || isEventsLoading;

  return {
    profile,
    accolades,
    joinedClubs,
    registeredEvents,
    isLoading,
    error: profileError
  };
};