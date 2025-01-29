import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CollapsibleTriggerButtonProps {
  visibleMembers: {
    profiles: {
      username: string | null;
      avatar_url: string | null;
    };
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
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3">
        {visibleMembers.map((member, index) => (
          <Avatar key={index} className="h-6 w-6 ring-2 ring-zinc-900">
            <AvatarImage src={member.profiles.avatar_url || undefined} />
            <AvatarFallback>
              {member.profiles.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      {remainingCount > 0 && (
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="h-auto p-0">
            <span className="text-xs text-muted-foreground mr-1">
              {isOpen ? 'Show less' : `+${remainingCount} more`}
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