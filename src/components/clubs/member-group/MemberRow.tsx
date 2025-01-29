import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FollowButton } from "@/components/profile/FollowButton";
import { useNavigate } from "react-router-dom";

interface MemberRowProps {
  member: {
    id: string;
    user_id: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
    };
  };
  isFollowing: boolean;
}

export const MemberRow = ({ member, isFollowing }: MemberRowProps) => {
  const navigate = useNavigate();

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${member.user_id}`);
  };

  return (
    <div className="flex items-center gap-2 p-2 hover:bg-zinc-800/30 rounded-lg transition-colors">
      <Avatar 
        className="w-12 h-12 border-2 border-zinc-900 cursor-pointer"
        onClick={handleProfileClick}
      >
        <AvatarImage src={member.profiles.avatar_url || undefined} />
        <AvatarFallback>
          {member.profiles.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
      <span 
        className="text-sm text-white font-normal tracking-wide flex-grow cursor-pointer hover:text-zinc-300"
        onClick={handleProfileClick}
      >
        {member.profiles.username || 'Anonymous'}
      </span>
      <FollowButton
        userId={member.user_id}
        initialIsFollowing={isFollowing}
      />
    </div>
  );
};