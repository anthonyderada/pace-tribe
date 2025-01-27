import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PersonalBests } from "@/components/profile/PersonalBests";
import { RunningPreferences } from "@/components/profile/RunningPreferences";
import { ClubList } from "@/components/profile/ClubList";
import { EventList } from "@/components/profile/EventList";
import { useQuery } from "@tanstack/react-query";

type Profile = {
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  preferred_distance: string | null;
  comfortable_pace: string | null;
  seeking_training_partners: boolean | null;
  seeking_casual_meetups: boolean | null;
  seeking_race_pacers: boolean | null;
  seeking_coach: boolean | null;
  preferred_shoe_brand: string[] | null;
};

type Accolades = {
  pb_5k: string | null;
  pb_10k: string | null;
  pb_half_marathon: string | null;
  pb_marathon: string | null;
};

type Club = {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  thumbnail_url: string | null;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  club: {
    name: string;
  };
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userId } = useParams();
  const [loading, setLoading] = useState(true);
  const isOwnProfile = !userId || (user && userId === user.id);

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', userId || user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId || user?.id)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!userId || !!user?.id
  });

  const { data: accolades, isLoading: isAccoladesLoading } = useQuery({
    queryKey: ['accolades', userId || user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("accolades")
        .select("pb_5k, pb_10k, pb_half_marathon, pb_marathon")
        .eq("user_id", userId || user?.id)
        .single();

      if (error) throw error;
      return data as Accolades;
    },
    enabled: !!userId || !!user?.id
  });

  const { data: joinedClubs, isLoading: isClubsLoading } = useQuery({
    queryKey: ['joined-clubs', userId || user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select(`
          club_id,
          clubs (
            id,
            name,
            location,
            description,
            thumbnail_url
          )
        `)
        .eq("user_id", userId || user?.id);

      if (error) throw error;

      return data.map(item => ({
        id: item.clubs.id,
        name: item.clubs.name,
        location: item.clubs.location,
        description: item.clubs.description,
        thumbnail_url: item.clubs.thumbnail_url
      }));
    },
    enabled: !!userId || !!user?.id
  });

  const { data: registeredEvents, isLoading: isEventsLoading } = useQuery({
    queryKey: ['registered-events', userId || user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_participants")
        .select(`
          event_id,
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
        .eq("user_id", userId || user?.id);

      if (error) throw error;

      return data.map(item => ({
        id: item.events.id,
        title: item.events.title,
        date: item.events.date,
        location: item.events.location,
        distance: item.events.distance,
        pace: item.events.pace,
        club: {
          name: item.events.clubs.name
        }
      }));
    },
    enabled: !!userId || !!user?.id
  });

  useEffect(() => {
    if (!userId && !user) {
      navigate("/login");
      return;
    }
    setLoading(false);
  }, [user, userId, navigate]);

  if (loading || isProfileLoading || isAccoladesLoading || isClubsLoading || isEventsLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!profile) {
    return <div className="container mx-auto px-4 py-8">Profile not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-0 bg-zinc-900/90">
        <ProfileHeader
          profile={profile}
          user={isOwnProfile ? user : null}
          onProfileUpdate={isOwnProfile ? (updates) => {} : undefined}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RunningPreferences
          userId={userId || user?.id || ""}
          profile={profile}
          onPreferencesUpdate={isOwnProfile ? (preferences) => {} : undefined}
          readOnly={!isOwnProfile}
        />
        
        <PersonalBests
          userId={userId || user?.id || ""}
          accolades={accolades}
          onAccoladesUpdate={isOwnProfile ? () => {} : undefined}
          readOnly={!isOwnProfile}
        />

        <ClubList joinedClubs={joinedClubs || []} />
        <EventList registeredEvents={registeredEvents || []} />
      </div>
    </div>
  );
};

export default Profile;