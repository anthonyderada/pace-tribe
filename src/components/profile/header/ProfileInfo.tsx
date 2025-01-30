import { FollowButton } from "../FollowButton";
import { ChatRoom } from "../../messages/ChatRoom";
import { Link } from "react-router-dom";
import { Activity, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  captainRoles?: {
    role: string;
    clubs: {
      id: string;
      name: string;
    };
  }[];
}

export const ProfileInfo = ({ profile, isOwnProfile, captainRoles }: ProfileInfoProps) => {
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
              <FollowButton 
                userId={profile.id} 
                initialIsFollowing={false}
              />
              <ChatRoom 
                recipientId={profile.id} 
                recipientName={profile.username || "Anonymous Runner"}
                recipientAvatar={null}
              />
            </>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          {profile.instagram_username && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
            >
              <a
                href={`https://instagram.com/${profile.instagram_username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
            </Button>
          )}
          {profile.strava_athlete_id && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              asChild
            >
              <a
                href={`https://www.strava.com/athletes/${profile.strava_athlete_id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Activity className="h-4 w-4" />
                Strava
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};