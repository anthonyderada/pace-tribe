import { FollowButton } from "@/components/profile/FollowButton";
import { MemberProfileLink } from "./MemberProfileLink";
import { MemberAvatar } from "./MemberAvatar";
import { Crown } from "lucide-react";

interface MemberRowProps {
  member: {
    id: string;
    user_id: string;
    role?: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
      location: string | null;
    };
  };
  isFollowing: boolean;
}

export const MemberRow = ({ member, isFollowing }: MemberRowProps) => {
  const isCaptain = member.role === 'captain';

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-zinc-800/30 rounded-lg transition-colors">
      <div className="relative">
        <MemberAvatar member={member} />
        {isCaptain && (
          <div className="absolute -bottom-1 -left-1 bg-amber-500 rounded-full p-0.5" title="Club Captain">
            <Crown className="h-3 w-3 text-zinc-900" />
          </div>
        )}
      </div>
      <MemberProfileLink 
        userId={member.user_id}
        className="flex-grow"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-white tracking-wide cursor-pointer hover:text-zinc-300">
              {member.profiles.username || 'Anonymous'}
            </span>
            {isCaptain && (
              <span className="text-xs text-amber-500">Captain</span>
            )}
          </div>
          {member.profiles.location && (
            <span className="text-xs text-zinc-400">
              {member.profiles.location}
            </span>
          )}
        </div>
      </MemberProfileLink>
      <FollowButton
        userId={member.user_id}
        initialIsFollowing={isFollowing}
      />
    </div>
  );
};