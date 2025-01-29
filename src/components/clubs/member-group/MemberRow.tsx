import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberProfileLink } from "./MemberProfileLink";
import { FollowButton } from "@/components/profile/FollowButton";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import { Crown } from "lucide-react";

interface MemberRowProps {
  member: {
    id: string;
    user_id: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
      location: string | null;
    };
    role?: string;
  };
  isFollowing: boolean;
}

export const MemberRow = ({ member, isFollowing }: MemberRowProps) => {
  const { user } = useAuth();
  const { id: clubId } = useParams();
  const isCaptain = member.role === 'captain';

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
      <MemberProfileLink userId={member.user_id} clubId={clubId}>
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="relative">
            <Avatar className="h-8 w-8">
              <AvatarImage src={member.profiles.avatar_url || undefined} />
              <AvatarFallback>
                {member.profiles.username?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
            {isCaptain && (
              <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5" title="Club Captain">
                <Crown className="h-3 w-3 text-zinc-900" />
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-100 flex items-center gap-2">
              {member.profiles.username || 'Anonymous'}
              {isCaptain && (
                <span className="text-xs text-amber-500 font-medium">Captain</span>
              )}
            </p>
            {member.profiles.location && (
              <p className="text-xs text-zinc-400">{member.profiles.location}</p>
            )}
          </div>
        </div>
      </MemberProfileLink>
      {user && user.id !== member.user_id && (
        <FollowButton
          userId={member.user_id}
          initialIsFollowing={isFollowing}
        />
      )}
    </div>
  );
};