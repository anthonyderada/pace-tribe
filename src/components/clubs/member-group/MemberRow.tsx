import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/profile/FollowButton";
import { MemberProfileLink } from "./MemberProfileLink";

interface MemberRowProps {
  member: {
    id: string;
    user_id: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
      location: string | null;
    };
  };
  isFollowing: boolean;
}

export const MemberRow = ({ member, isFollowing }: MemberRowProps) => {
  return (
    <div className="flex items-center gap-2 p-2 hover:bg-zinc-800/30 rounded-lg transition-colors">
      <MemberProfileLink userId={member.user_id}>
        <Avatar className="w-12 h-12 border-2 border-zinc-900 cursor-pointer">
          <AvatarImage src={member.profiles.avatar_url || undefined} />
          <AvatarFallback>
            {member.profiles.username?.[0]?.toUpperCase() || '?'}
          </AvatarFallback>
        </Avatar>
      </MemberProfileLink>
      <MemberProfileLink 
        userId={member.user_id}
        className="flex-grow"
      >
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-white tracking-wide cursor-pointer hover:text-zinc-300">
            {member.profiles.username || 'Anonymous'}
          </span>
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