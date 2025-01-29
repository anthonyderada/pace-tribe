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
  // First, separate captains and regular members
  const captains = members.filter(member => member.role === 'captain');
  const regularMembers = members.filter(member => member.role !== 'captain');
  
  // Randomize regular members
  const shuffledRegularMembers = [...regularMembers].sort(() => Math.random() - 0.5);
  
  // Sort captains by username
  const sortedCaptains = [...captains].sort((a, b) => {
    const usernameA = a.profiles.username?.toLowerCase() || '';
    const usernameB = b.profiles.username?.toLowerCase() || '';
    return usernameA.localeCompare(usernameB);
  });
  
  // Combine the arrays: captains first, then randomized regular members
  const sortedMembers = [...sortedCaptains, ...shuffledRegularMembers];

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