import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
              <Avatar 
                className="h-8 w-8 ring-2 ring-zinc-900 hover:translate-y-[-2px] transition-transform"
              >
                <AvatarImage src={member.profiles.avatar_url || undefined} />
                <AvatarFallback>
                  {member.profiles.username?.[0]?.toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              {member.role === 'captain' && (
                <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5" title="Club Captain">
                  <Crown className="h-2.5 w-2.5 text-zinc-900" />
                </div>
              )}
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