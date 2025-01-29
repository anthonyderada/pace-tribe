import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

type Accolades = {
  pb_5k: string | null;
  pb_10k: string | null;
  pb_half_marathon: string | null;
  pb_marathon: string | null;
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [accolades, setAccolades] = useState<Accolades | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const isOwnProfile = user?.id === profileId;

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!profileId) {
        toast({
          title: "Error",
          description: "Profile ID is required",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      try {
        setIsLoading(true);

        // Fetch profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", profileId)
          .maybeSingle();

        if (profileError) throw profileError;
        if (!profileData) {
          toast({
            title: "Error",
            description: "Profile not found",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        setProfile(profileData);

        // Fetch joined clubs
        const { data: clubsData, error: clubsError } = await supabase
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

        if (clubsError) throw clubsError;
        setJoinedClubs(clubsData.map(item => item.clubs).filter(Boolean));

        // Fetch registered events
        const { data: eventsData, error: eventsError } = await supabase
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

        if (eventsError) throw eventsError;
        setRegisteredEvents(
          eventsData
            .map(item => ({
              ...item.events,
              club: { name: item.events.clubs.name }
            }))
            .filter(Boolean)
        );

        // Fetch accolades
        const { data: accoladesData, error: accoladesError } = await supabase
          .from("accolades")
          .select("*")
          .eq("user_id", profileId)
          .maybeSingle();

        if (accoladesError) throw accoladesError;
        setAccolades(accoladesData);

      } catch (error: any) {
        console.error("Error fetching profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [profileId, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pb-12">
      <ProfileContainer
        profile={profile}
        user={user}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={(updates) => setProfile(prev => ({ ...prev!, ...updates }))}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
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
    </div>
  );
};

export default Profile;