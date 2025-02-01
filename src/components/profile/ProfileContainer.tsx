import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ProfileHeader } from "./ProfileHeader";
import { User } from "@supabase/supabase-js";

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
  instagram_username: string | null;
  strava_athlete_id: string | null;
};

interface ProfileContainerProps {
  profile: Profile;
  user: User | null;
  isOwnProfile: boolean;
  fromClubId?: string;
  onProfileUpdate: (updates: Partial<Profile>) => void;
}

export const ProfileContainer = ({
  profile,
  user,
  isOwnProfile,
  fromClubId,
  onProfileUpdate,
}: ProfileContainerProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {fromClubId && (
        <Button
          variant="ghost"
          className="mb-4 text-zinc-400 hover:text-zinc-100"
          onClick={() => navigate(`/clubs/${fromClubId}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Club
        </Button>
      )}

      <div className="rounded-2xl overflow-hidden mb-8">
        <ProfileHeader
          profile={profile}
          user={isOwnProfile ? user : null}
          onProfileUpdate={(updates) => isOwnProfile && onProfileUpdate(updates)}
        />
      </div>
    </div>
  );
};