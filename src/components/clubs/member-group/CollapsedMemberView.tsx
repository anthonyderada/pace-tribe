import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Member = {
  id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
};

interface CollapsedMemberViewProps {
  visibleMembers: Member[];
  remainingCount: number;
  totalCount: number;
}

export const CollapsedMemberView = ({ 
  visibleMembers, 
  remainingCount, 
  totalCount 
}: CollapsedMemberViewProps) => {
  return (
    <div className="flex items-center">
      <div className="flex items-center -space-x-2">
        {visibleMembers.map((member) => (
          <Avatar key={member.id} className="w-6 h-6 border-2 border-zinc-900">
            <AvatarImage src={member.profiles.avatar_url || undefined} />
            <AvatarFallback>
              {member.profiles.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        ))}
        {remainingCount > 0 && (
          <div className="w-6 h-6 rounded-full bg-zinc-800 border-2 border-zinc-900 flex items-center justify-center text-xs text-zinc-300">
            +{remainingCount}
          </div>
        )}
      </div>
      <span className="ml-3 text-sm text-zinc-400">
        {totalCount} {totalCount === 1 ? 'member' : 'members'}
      </span>
    </div>
  );
};