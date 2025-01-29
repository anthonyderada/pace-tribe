import { Badge } from "@/components/ui/badge";
import { FollowButton } from "../FollowButton";
import { ChatRoom } from "../../messages/ChatRoom";

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
    <div className="flex flex-col items-center md:items-start gap-2">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-zinc-100">
          {profile.username}
        </h1>
        {!isOwnProfile && profile.id && (
          <div className="flex items-center gap-2">
            <FollowButton userId={profile.id} initialIsFollowing={false} />
            <ChatRoom
              recipientId={profile.id}
              recipientName={profile.username || "User"}
              recipientAvatar={profile.avatar_url}
            />
          </div>
        )}
      </div>
      {captainRoles && captainRoles.length > 0 && (
        <div className="flex flex-col items-center md:items-start gap-2">
          {captainRoles.map((role, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-500 border-amber-500/20"
              >
                Captain
              </Badge>
              <span className="text-zinc-400">of {role.clubs?.name}</span>
            </div>
          ))}
        </div>
      )}
      <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2">
        {profile.location || "Not set"}
      </p>
      <div className="space-y-4">
        <p className="text-zinc-400">{profile.bio || "No bio added yet"}</p>
      </div>
    </div>
  );
};