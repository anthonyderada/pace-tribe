import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Route, Timer, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  event_participants: { user_id: string }[];
}

interface EventCardProps {
  event: Event;
  userId?: string;
  onJoin: (eventId: string) => void;
  onLeave: (eventId: string) => void;
  isLoading: boolean;
}

export const EventCard = ({ event, userId, onJoin, onLeave, isLoading }: EventCardProps) => {
  const navigate = useNavigate();
  const isParticipant = event.event_participants?.some(
    participant => participant.user_id === userId
  );

  return (
    <Card
      key={event.id}
      className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-white">
          {event.title}
        </h3>
        {userId && (
          <Button
            className={`w-24 ${
              isParticipant
                ? "border border-white text-white bg-transparent hover:bg-white/10"
                : "border border-white bg-white text-black hover:bg-gray-100"
            }`}
            onClick={(e) => {
              e.stopPropagation();
              if (isParticipant) {
                onLeave(event.id);
              } else {
                onJoin(event.id);
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isParticipant ? (
              'Going'
            ) : (
              'RSVP'
            )}
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
        <Calendar className="h-4 w-4" />
        {format(new Date(event.date), "MMM d, yyyy - h:mm a")}
      </div>
      {event.location && (
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          {event.location}
        </div>
      )}
      <div className="flex flex-wrap gap-4 mb-3">
        {event.distance && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Route className="h-4 w-4" />
            {(Number(event.distance) * 0.621371).toFixed(1)} miles
          </div>
        )}
        {event.pace && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Timer className="h-4 w-4" />
            {event.pace}
          </div>
        )}
      </div>
      <p className="text-gray-400 line-clamp-3">
        {event.description || "No description available"}
      </p>
      <p className="text-gray-400 text-sm mt-4">
        {event.event_participants?.length || 0} participants
      </p>
    </Card>
  );
};