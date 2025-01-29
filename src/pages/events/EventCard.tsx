import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, MapPin, Route, Timer, Users, Loader2 } from "lucide-react";
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
  club?: {
    id: string;
    name: string;
    thumbnail_url: string | null;
  };
  participants?: { user_id: string }[];
}

interface EventCardProps {
  event: Event;
  isRegistered: boolean;
  isLoading: boolean;
  onRegister: (eventId: string, isRegistered: boolean) => void;
  userId?: string;
}

export const EventCard = ({ 
  event, 
  isRegistered, 
  isLoading, 
  onRegister,
  userId 
}: EventCardProps) => {
  const navigate = useNavigate();

  const handleRegisterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegister(event.id, isRegistered);
  };

  return (
    <Card 
      className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-semibold text-white">{event.title}</h3>
          <div className="flex items-center gap-2 text-gray-400 text-sm mt-2">
            <Calendar className="h-4 w-4" />
            {format(new Date(event.date), "MMM d, yyyy - h:mm a")}
          </div>
        </div>
        {userId && (
          <Button
            className={`w-24 ${
              isRegistered
                ? "border border-white text-white bg-transparent hover:bg-white/10"
                : "border border-white bg-white text-black hover:bg-gray-100"
            }`}
            onClick={handleRegisterClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isRegistered ? (
              'Going'
            ) : (
              'RSVP'
            )}
          </Button>
        )}
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
            {event.pace.replace(/min\/mil/g, '/mi')}
          </div>
        )}
      </div>
      {event.club && (
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={event.club.thumbnail_url || ''} 
              alt={event.club.name} 
            />
            <AvatarFallback>
              <Users className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span className="text-gray-400 text-sm">
            Organized by {event.club.name}
          </span>
        </div>
      )}
      <p className="text-gray-400 line-clamp-3">
        {event.description || 'No description available'}
      </p>
    </Card>
  );
};