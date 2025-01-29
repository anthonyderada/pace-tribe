import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EventBadgesProps {
  isFree?: boolean;
}

export const EventBadges = ({ isFree = true }: EventBadgesProps) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700/70 whitespace-nowrap">
        <MapPin className="h-3 w-3 mr-1" />
        Road Running
      </Badge>
      <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700/70 whitespace-nowrap">
        <Users className="h-3 w-3 mr-1" />
        Social
      </Badge>
      {isFree && (
        <Badge variant="secondary" className="bg-emerald-900/50 text-emerald-300 hover:bg-emerald-900/70 whitespace-nowrap">
          Free
        </Badge>
      )}
    </div>
  );
};