import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { useToast } from "@/hooks/use-toast";

type Profile = {
  id: string;
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
  const location = useLocation();
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accolades, setAccolades] = useState<Accolades | null>(null);
  const { toast } = useToast();

  const isOwnProfile = !id || id === user?.id;
  const profileId = isOwnProfile ? user?.id : id;

  useEffect(() => {
    // If not logged in and trying to access own profile, redirect to login
    if (!user && !id) {
      navigate("/login");
      return;
    }

    // If no profileId is available, show error
    if (!profileId) {
      setError("Profile not found");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch profile data first
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .maybeSingle();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error("Failed to load profile data");
        }

        if (!profileData) {
          setError("Profile not found");
          setLoading(false);
          return;
        }

        setProfile(profileData);

        // Only fetch additional data if we have a valid profile
        const [accoladesResponse, clubsResponse, eventsResponse] = await Promise.all([
          supabase
            .from("accolades")
            .select("*")
            .eq("user_id", profileId)
            .maybeSingle(),
          supabase
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
            .eq("user_id", profileId),
          supabase
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
            .eq("user_id", profileId),
        ]);

        if (accoladesResponse.data) {
          setAccolades(accoladesResponse.data);
        }

        if (clubsResponse.data) {
          const clubs = clubsResponse.data.map(item => ({
            id: item.clubs.id,
            name: item.clubs.name,
            location: item.clubs.location,
            description: item.clubs.description,
            thumbnail_url: item.clubs.thumbnail_url
          }));
          setJoinedClubs(clubs);
        }

        if (eventsResponse.data) {
          const events = eventsResponse.data.map(item => ({
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
        }
      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        setError(error.message);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile data. Please try again.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user, navigate, profileId, id, toast]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-zinc-400">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-zinc-400">
          {error || "Profile not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileContainer
        profile={profile}
        user={user}
        isOwnProfile={isOwnProfile}
        fromClubId={fromClubId}
        onProfileUpdate={(updates) => setProfile(prev => ({ ...prev!, ...updates }))}
      />

      <ProfileContent
        userId={profileId}
        profile={profile}
        accolades={accolades}
        joinedClubs={joinedClubs}
        registeredEvents={registeredEvents}
        isEditable={isOwnProfile}
        onPreferencesUpdate={(preferences) => setProfile(prev => ({ ...prev!, ...preferences }))}
        onAccoladesUpdate={setAccolades}
      />
    </div>
  );
};

export default Profile;