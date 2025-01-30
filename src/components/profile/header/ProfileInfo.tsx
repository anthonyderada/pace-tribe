import { FollowButton } from "../FollowButton";
import { ChatRoom } from "../../messages/ChatRoom";
import { Link } from "react-router-dom";
import { SocialButtons } from "./SocialButtons";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProfileInfoProps {
  profile: {
    id: string;
    username: string | null;
    bio: string | null;
    location: string | null;
    instagram_username: string | null;
    strava_athlete_id: string | null;
  };
  isOwnProfile: boolean;
}

export const ProfileInfo = ({ profile, isOwnProfile }: ProfileInfoProps) => {
  const { data: captainRoles } = useQuery({
    queryKey: ['captainRoles', profile.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('club_members')
        .select(`
          role,
          clubs (
            id,
            name
          )
        `)
        .eq('user_id', profile.id)
        .eq('role', 'captain');
      
      if (error) throw error;
      return data;
    },
    enabled: !!profile.id,
  });

  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col items-center md:items-start">
        <h1 className="text-2xl font-bold text-white mb-2">
          {profile.username || "Anonymous Runner"}
        </h1>
        
        {profile.location && (
          <p className="text-zinc-400 mb-4">{profile.location}</p>
        )}

        {profile.bio && (
          <p className="text-zinc-300 mb-4 text-center md:text-left max-w-2xl">
            {profile.bio}
          </p>
        )}

        {captainRoles?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-zinc-400 mb-2">Captain of:</h3>
            <div className="flex flex-wrap gap-2">
              {captainRoles.map((role) => (
                <Link
                  key={role.clubs.id}
                  to={`/clubs/${role.clubs.id}`}
                  className="text-emerald-400 hover:text-emerald-300 text-sm"
                >
                  {role.clubs.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-2">
          {!isOwnProfile && (
            <>
              <FollowButton userId={profile.id} />
              <ChatRoom recipientId={profile.id} />
            </>
          )}
        </div>

        <SocialButtons 
          instagramUsername={profile.instagram_username}
          stravaAthleteId={profile.strava_athlete_id}
        />
      </div>
    </div>
  );
};