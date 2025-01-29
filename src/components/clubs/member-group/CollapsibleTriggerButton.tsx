import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { CollapsibleTrigger } from "@/components/ui/collapsible";
import { CollapsedMemberView } from "./CollapsedMemberView";

type Member = {
  id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
};

interface CollapsibleTriggerButtonProps {
  visibleMembers: Member[];
  remainingCount: number;
  totalCount: number;
  isOpen: boolean;
}

export const CollapsibleTriggerButton = ({ 
  visibleMembers, 
  remainingCount, 
  totalCount,
  isOpen 
}: CollapsibleTriggerButtonProps) => {
  return (
    <CollapsibleTrigger asChild>
      <Button
        variant="ghost"
        className="w-full p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
      >
        <div className="flex items-center justify-between w-full">
          <CollapsedMemberView 
            visibleMembers={visibleMembers}
            remainingCount={remainingCount}
            totalCount={totalCount}
          />
          <ChevronDown 
            className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${
              isOpen ? 'transform rotate-180' : ''
            }`} 
          />
        </div>
      </Button>
    </CollapsibleTrigger>
  );
};