import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberRow } from "./MemberRow";
import { MemberListHeader } from "./MemberListHeader";
import { sortAndGroupMembers } from "./utils/memberSorting";

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
  totalCount,
}: CollapsibleMemberListProps) => {
  const sortedMembers = sortAndGroupMembers(members);

  return (
    <div className="p-2 bg-zinc-800/20 rounded-lg">
      <MemberListHeader totalCount={totalCount} />
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