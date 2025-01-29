import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberProfileLink } from "./MemberProfileLink";

interface CollapsibleTriggerButtonProps {
  visibleMembers: {
    profiles: {
      username: string | null;
      avatar_url: string | null;
    };
    user_id: string;
  }[];
  remainingCount: number;
  totalCount: number;
  isOpen: boolean;
  clubId: string;
}

export const CollapsibleTriggerButton = ({
  visibleMembers,
  remainingCount,
  isOpen,
}: CollapsibleTriggerButtonProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-2">
        {visibleMembers.map((member, index) => (
          <MemberProfileLink 
            key={index} 
            userId={member.user_id}
            className="relative z-[1] hover:z-10"
          >
            <Avatar 
              className="h-8 w-8 ring-2 ring-zinc-900 hover:translate-y-[-2px] transition-transform"
            >
              <AvatarImage src={member.profiles.avatar_url || undefined} />
              <AvatarFallback>
                {member.profiles.username?.[0]?.toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </MemberProfileLink>
        ))}
      </div>
      {remainingCount > 0 && (
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
            <span className="text-xs text-muted-foreground mr-1">
              {isOpen ? 'Show less' : `Show ${remainingCount} more`}
            </span>
            {isOpen ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </Button>
        </CollapsibleTrigger>
      )}
    </div>
  );
};