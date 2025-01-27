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
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [accolades, setAccolades] = useState<Accolades | null>(null);

  const isOwnProfile = !id || id === user?.id;
  const profileId = isOwnProfile ? user?.id : id;

  useEffect(() => {
    if (!user && !id) {
      navigate("/login");
      return;
    }

    if (!profileId) return;

    async function getProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, bio, location, preferred_distance, comfortable_pace, seeking_training_partners, seeking_casual_meetups, seeking_race_pacers, seeking_coach, preferred_shoe_brand")
          .eq("id", profileId)
          .single();

        if (error) throw error;
        setProfile(data as Profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    async function getAccolades() {
      try {
        const { data, error } = await supabase
          .from("accolades")
          .select("pb_5k, pb_10k, pb_half_marathon, pb_marathon")
          .eq("user_id", profileId)
          .single();

        if (error) throw error;

        if (data) {
          setAccolades({
            pb_5k: data.pb_5k as string | null,
            pb_10k: data.pb_10k as string | null,
            pb_half_marathon: data.pb_half_marathon as string | null,
            pb_marathon: data.pb_marathon as string | null
          });
        }
      } catch (error) {
        console.error("Error fetching accolades:", error);
      }
    }

    async function getJoinedClubs() {
      try {
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
          .eq("user_id", profileId);

        if (error) throw error;

        const clubs = data.map(item => ({
          id: item.clubs.id,
          name: item.clubs.name,
          location: item.clubs.location,
          description: item.clubs.description,
          thumbnail_url: item.clubs.thumbnail_url
        }));

        setJoinedClubs(clubs);
      } catch (error) {
        console.error("Error fetching joined clubs:", error);
      }
    }

    async function getRegisteredEvents() {
      try {
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
          .eq("user_id", profileId);

        if (error) throw error;

        const events = data.map(item => ({
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

        setRegisteredEvents(events);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
    getAccolades();
    getJoinedClubs();
    getRegisteredEvents();

    const clubsChannel = supabase
      .channel('schema-db-changes-clubs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'club_members',
          filter: `user_id=eq.${profileId}`
        },
        () => {
          getJoinedClubs();
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel('schema-db-changes-events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants',
          filter: `user_id=eq.${profileId}`
        },
        () => {
          getRegisteredEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(clubsChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [user, navigate, profileId, id]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-zinc-400">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-0 bg-zinc-900/90">
        <ProfileHeader
          profile={profile}
          user={isOwnProfile ? user : null}
          onProfileUpdate={(updates) => isOwnProfile && setProfile(prev => ({ ...prev!, ...updates }))}
        />
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <RunningPreferences
          userId={profileId || ""}
          profile={profile}
          onPreferencesUpdate={(preferences) => isOwnProfile && setProfile(prev => ({ ...prev!, ...preferences }))}
          isEditable={isOwnProfile}
        />
        
        <PersonalBests
          userId={profileId || ""}
          accolades={accolades}
          onAccoladesUpdate={(newAccolades) => isOwnProfile && setAccolades(newAccolades)}
          isEditable={isOwnProfile}
        />

        <ClubList joinedClubs={joinedClubs} />
        <EventList registeredEvents={registeredEvents} />
      </div>
    </div>
  );
};

export default Profile;