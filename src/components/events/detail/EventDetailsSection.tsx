import { Building2, MapPin, Route, Timer, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event } from "@/components/clubs/events/types";
import { useNavigate } from "react-router-dom";

interface EventDetailsSectionProps {
  event: Event;
}

export const EventDetailsSection = ({ event }: EventDetailsSectionProps) => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4 text-zinc-100">
        Event Details
      </h3>
      <p className="text-zinc-400 mb-4">
        {event.description || "No description available."}
      </p>
      <div className="space-y-4">
        {event.clubs && (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:text-zinc-300 transition-colors"
            onClick={() => navigate(`/clubs/${event.club_id}`)}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={event.clubs.thumbnail_url || undefined}
                alt={event.clubs.name}
              />
              <AvatarFallback>
                <Building2 className="h-4 w-4 text-zinc-400" />
              </AvatarFallback>
            </Avatar>
            <span className="text-zinc-400">
              Organized by {event.clubs.name}
            </span>
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-400">{event.location}</span>
          </div>
        )}
        {event.distance && (
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-400">
              {(event.distance * 0.621371).toFixed(1)} miles
            </span>
          </div>
        )}
        {event.pace && (
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-zinc-400" />
            <span className="text-zinc-400">{event.pace.replace(/min\/mil/g, '/mi')}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-zinc-400" />
          <span className="text-zinc-400">
            {event.event_participants.length} participants
          </span>
        </div>
      </div>
    </div>
  );
};