import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

type Event = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  club: {
    name: string;
  };
};

interface EventsSectionProps {
  registeredEvents: Event[];
}

export const EventsSection = ({ registeredEvents }: EventsSectionProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 bg-zinc-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <Calendar className="h-5 w-5" />
          My Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        {registeredEvents.length > 0 ? (
          <div className="space-y-4">
            {registeredEvents.map((event) => (
              <Card 
                key={event.id}
                className="border-0 bg-zinc-800/90 cursor-pointer hover:bg-zinc-700/90 transition-colors"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <CardHeader>
                  <CardTitle className="text-lg text-zinc-100">{event.title}</CardTitle>
                  <div className="space-y-2">
                    <p className="text-sm text-zinc-400 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(event.date), "MMMM d, yyyy - h:mm a")}
                    </p>
                    {event.location && (
                      <p className="text-sm text-zinc-400 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </p>
                    )}
                    <p className="text-sm text-zinc-400">
                      Organized by {event.club.name}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">No events registered yet</p>
        )}
      </CardContent>
    </Card>
  );
};