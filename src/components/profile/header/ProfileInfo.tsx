import { Badge } from "@/components/ui/badge";
import { FollowButton } from "../FollowButton";
import { ChatRoom } from "../../messages/ChatRoom";
import { Link } from "react-router-dom";

interface ProfileInfoProps {
  profile: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    location: string | null;
    bio: string | null;
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