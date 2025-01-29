import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Users } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = Math.max(0, members.length - maxVisible);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
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
            </div>
            <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-2 p-2 bg-zinc-800/20 rounded-lg">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 p-2 hover:bg-zinc-800/30 rounded-lg transition-colors">
              <Avatar className="w-8 h-8 border-2 border-zinc-900">
                <AvatarImage src={member.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {member.profiles.username?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-zinc-300">
                {member.profiles.username || 'Anonymous'}
              </span>
            </div>
          ))}
          <Button
            variant="ghost"
            className="w-full mt-2 text-zinc-400 hover:text-zinc-200"
            onClick={() => navigate(`/clubs/${clubId}/members`)}
          >
            View all members
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};