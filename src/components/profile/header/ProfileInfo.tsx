import { Badge } from "@/components/ui/badge";
import { FollowButton } from "../FollowButton";
import { ChatRoom } from "../../messages/ChatRoom";
import { Link } from "react-router-dom";
import { Instagram, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProfileInfoProps {
  profile: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    location: string | null;
    bio: string | null;
    instagram_username: string | null;
    strava_athlete_id: string | null;
  };
  captainRoles?: Array<{
    clubs: {
      id: string;
      name: string;
    };
  }>;
  isOwnProfile: boolean;
}

export const ProfileInfo = ({ profile, captainRoles, isOwnProfile }: ProfileInfoProps) => {
  return (
    <div className="flex flex-col items-center md:items-start gap-2 w-full">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-zinc-100">
          {profile.username}
        </h1>
      </div>
      {captainRoles && captainRoles.length > 0 && (
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1"
          >
            Captain
          </Badge>
          {captainRoles.map((role, index) => (
            <Link 
              key={role.clubs.id}
              to={`/clubs/${role.clubs.id}`}
              className="hover:opacity-80 transition-opacity"
            >
              <Badge
                variant="outline"
                className="bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20 cursor-pointer px-3 py-1"
              >
                {role.clubs.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}
      <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2">
        {profile.location || "Not set"}
      </p>
      <div className="flex flex-col items-center md:items-start w-full gap-4">
        <p className="text-zinc-400 text-center md:text-left">
          {profile.bio || "No bio added yet"}
        </p>
        
        <div className="flex items-center gap-2">
          {profile.instagram_username && (
            <a
              href={`https://instagram.com/${profile.instagram_username}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="icon"
                className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 border-0"
              >
                <Instagram className="h-5 w-5 text-white" />
              </Button>
            </a>
          )}
          {profile.strava_athlete_id && (
            <a
              href={`https://www.strava.com/athletes/${profile.strava_athlete_id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="icon"
                className="bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 border-0"
              >
                <Activity className="h-5 w-5 text-white" />
              </Button>
            </a>
          )}
        </div>

        {!isOwnProfile && profile.id && (
          <div className="flex items-center justify-center gap-2 w-full md:w-auto md:justify-start">
            <FollowButton userId={profile.id} initialIsFollowing={false} />
            <ChatRoom
              recipientId={profile.id}
              recipientName={profile.username || "User"}
              recipientAvatar={profile.avatar_url}
            />
          </div>
        )}
      </div>
    </div>
  );
};