import { EventBadges } from "./EventBadges";
import { EventParticipants } from "./EventParticipants";

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
  const fullDescription = recurrenceSchedule 
    ? `${description || "No description available"} - ${recurrenceSchedule}`
    : description || "No description available";

  return (
    <>
      <p className="text-gray-400 line-clamp-3 mb-4">
        {fullDescription}
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