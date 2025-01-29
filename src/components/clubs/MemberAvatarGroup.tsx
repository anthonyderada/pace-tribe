import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

type Member = {
  id: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
};

interface MemberAvatarGroupProps {
  members: Member[];
  clubId: string;
  maxVisible?: number;
}

export const MemberAvatarGroup = ({ members, clubId, maxVisible = 5 }: MemberAvatarGroupProps) => {
  const navigate = useNavigate();
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = Math.max(0, members.length - maxVisible);

  return (
    <Button
      variant="ghost"
      className="p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
      onClick={() => navigate(`/clubs/${clubId}/members`)}
    >
      <div className="flex items-center -space-x-2">
        {visibleMembers.map((member) => (
          <Avatar key={member.id} className="w-8 h-8 border-2 border-zinc-900">
            <AvatarImage src={member.profiles.avatar_url || undefined} />
            <AvatarFallback>
              {member.profiles.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-300">
            +{remainingCount}
          </div>
        )}
      </div>
      <span className="ml-3 text-sm text-zinc-400">
        {members.length} {members.length === 1 ? 'member' : 'members'}
      </span>
    </Button>
  );
};