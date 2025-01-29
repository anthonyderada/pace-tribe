import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { MemberAvatar } from "./MemberAvatar";

interface CollapsibleTriggerButtonProps {
  visibleMembers: {
    profiles: {
      username: string | null;
      avatar_url: string | null;
    };
    user_id: string;
    role?: string;
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
      <CollapsibleTrigger asChild>
        <div className="flex -space-x-2 cursor-pointer">
          {visibleMembers.map((member, index) => (
            <div 
              key={index}
              className="relative z-[1] hover:z-10"
            >
              <MemberAvatar 
                member={member}
                size="sm"
                className="ring-2 ring-zinc-900 hover:translate-y-[-2px] transition-transform"
              />
            </div>
          ))}
        </div>
      </CollapsibleTrigger>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
          <span className="text-xs text-muted-foreground mr-1">
            {isOpen ? 'Show less' : 'Show more'}
          </span>
          {isOpen ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </Button>
      </CollapsibleTrigger>
    </div>
  );
};