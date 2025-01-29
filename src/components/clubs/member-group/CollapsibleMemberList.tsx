import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberRow } from "./MemberRow";

type Member = {
  id: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
    location: string | null;
  };
  role?: string;
};

interface CollapsibleMemberListProps {
  members: Member[];
  followingMap: Record<string, boolean>;
  clubId: string;
  totalCount: number;
}

export const CollapsibleMemberList = ({ 
  members, 
  followingMap,
  clubId,
  totalCount,
}: CollapsibleMemberListProps) => {
  // Sort members to show captains first
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === 'captain' && b.role !== 'captain') return -1;
    if (a.role !== 'captain' && b.role === 'captain') return 1;
    return 0;
  });

  return (
    <div className="p-2 bg-zinc-800/20 rounded-lg">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {sortedMembers.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isFollowing={followingMap[member.user_id] || false}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};