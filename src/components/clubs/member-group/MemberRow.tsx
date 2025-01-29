import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberProfileLink } from "./MemberProfileLink";
import { FollowButton } from "@/components/profile/FollowButton";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";

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

  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-800/50 transition-colors">
      <MemberProfileLink userId={member.user_id} clubId={clubId}>
        <div className="flex items-center gap-3 cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={member.profiles.avatar_url || undefined} />
            <AvatarFallback>
              {member.profiles.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-zinc-100">
              {member.profiles.username || 'Anonymous'}
              {member.role === 'captain' && (
                <span className="ml-2 text-xs text-emerald-400">Captain</span>
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