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
  const baseDescription = description || "No description available";
  const scheduleText = recurrenceSchedule ? (
    <span className="inline-flex items-center rounded-full bg-zinc-700/50 px-2 py-0.5 text-xs font-medium text-zinc-300 ml-2">
      {recurrenceSchedule}
    </span>
  ) : null;

  return (
    <>
      <p className="text-gray-400 line-clamp-3 mb-4">
        {baseDescription}
        {scheduleText}
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