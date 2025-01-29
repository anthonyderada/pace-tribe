import { ScrollArea } from "@/components/ui/scroll-area";
import { MemberRow } from "./MemberRow";
import { MembersSheet } from "./MembersSheet";

type Member = {
  id: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
    location: string | null;
  };
};

interface CollapsibleMemberListProps {
  members: Member[];
  followingMap: Record<string, boolean>;
}

export const CollapsibleMemberList = ({ members, followingMap }: CollapsibleMemberListProps) => {
  return (
    <div className="p-2 bg-zinc-800/20 rounded-lg">
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-2">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isFollowing={followingMap[member.user_id] || false}
            />
          ))}
        </div>
      </ScrollArea>
      <MembersSheet />
    </div>
  );
};