import { FollowButton } from "@/components/profile/FollowButton";
import { MemberProfileLink } from "./MemberProfileLink";
import { MemberAvatar } from "./MemberAvatar";
import { Badge } from "@/components/ui/badge";

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
      <MemberAvatar member={member} />
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
              <Badge variant="secondary" className="bg-amber-500/20 text-amber-500 border-amber-500/30 text-[10px] px-2 py-0">
                Captain
              </Badge>
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