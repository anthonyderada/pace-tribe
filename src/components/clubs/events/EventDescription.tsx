import { EventBadges } from "./EventBadges";
import { EventParticipants } from "./EventParticipants";

interface EventDescriptionProps {
  description: string | null;
  participantCount: number;
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
  participants = []
}: EventDescriptionProps) => {
  return (
    <>
      <p className="text-gray-400 line-clamp-3 mb-4">
        {description || "No description available"}
      </p>
      <div className="flex justify-between items-center">
        <EventBadges />
        <EventParticipants 
          participantCount={participantCount} 
          participants={participants} 
        />
      </div>
    </>
  );
};