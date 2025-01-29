import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { EventTitle } from "./EventTitle";
import { EventMetadata } from "./EventMetadata";
import { EventRSVPButton } from "./EventRSVPButton";
import { EventDescription } from "./EventDescription";
import { EventCardProps } from "./types";
import { Badge } from "@/components/ui/badge";
import { Repeat } from "lucide-react";

export const EventCard = ({ event, userId, onJoin, onLeave, isLoading }: EventCardProps) => {
  const navigate = useNavigate();
  const isParticipant = event.event_participants?.some(
    participant => participant.user_id === userId
  );

  const handleRSVPClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isParticipant) {
      onLeave(event.id);
    } else {
      onJoin(event.id);
    }
  };

  return (
    <Card
      key={event.id}
      className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2">
          <EventTitle id={event.id} title={event.title} />
          {event.is_recurring && event.recurrence_schedule && (
            <Badge variant="secondary" className="bg-zinc-700 text-zinc-300 hover:bg-zinc-600 whitespace-nowrap">
              <Repeat className="h-3 w-3 mr-1" />
              {event.recurrence_schedule}
            </Badge>
          )}
        </div>
        {userId && (
          <EventRSVPButton
            isParticipant={isParticipant}
            isLoading={isLoading}
            onClick={handleRSVPClick}
          />
        )}
      </div>
      
      <EventMetadata
        date={event.date}
        location={event.location}
        distance={event.distance}
        pace={event.pace}
        is_recurring={event.is_recurring}
        recurrence_schedule={event.recurrence_schedule}
      />
      
      <EventDescription
        description={event.description}
        participantCount={event.event_participants?.length || 0}
        participants={event.event_participants}
      />
    </Card>
  );
};