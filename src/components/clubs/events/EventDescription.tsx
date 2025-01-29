import { EventBadges } from "./EventBadges";
import { EventParticipants } from "./EventParticipants";
import { Badge } from "@/components/ui/badge";

interface EventDescriptionProps {
  description: string | null;
  participantCount: number;
  recurrenceSchedule?: string | null;
  participants?: { 
    user_id: string; 
    profiles?: { 
      avatar_url: string | null; 
      username: string | null 
    } 
  }[];
}

export const EventDescription = ({ 
  description, 
  participantCount,
  recurrenceSchedule,
  participants = []
}: EventDescriptionProps) => {
  return (
    <>
      <p className="text-gray-400 line-clamp-3 mb-4">
        {description || "No description available"}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <EventBadges />
          {recurrenceSchedule && (
            <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 whitespace-nowrap">
              {recurrenceSchedule}
            </Badge>
          )}
        </div>
        <EventParticipants 
          participantCount={participantCount} 
          participants={participants} 
        />
      </div>
    </>
  );
};