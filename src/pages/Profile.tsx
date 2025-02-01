import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingState } from "@/components/profile/LoadingState";

const Profile = () => {
  const { profileId } = useParams();
  const { user } = useAuth();

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          username,
          avatar_url,
          bio,
          location,
          preferred_distance,
          comfortable_pace,
          seeking_training_partners,
          seeking_casual_meetups,
          seeking_race_pacers,
          seeking_coach,
          preferred_shoe_brand,
          instagram_username,
          strava_athlete_id
        `)
        .eq('id', profileId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!profileId,
  });

  if (isProfileLoading) {
    return <LoadingState />;
  }

  if (!profile) {
    return <div>Profile not found</div>;
  }

  const isOwnProfile = user?.id === profileId;

  return (
    <div className="min-h-screen py-12">
      <ProfileContainer
        profile={profile}
        user={user}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={async (updates) => {
          const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', profile.id);

          if (error) throw error;
        }}
      />
    </div>
  );
};

export default Profile;