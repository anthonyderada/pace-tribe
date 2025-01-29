import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { EventTitle } from "./events/EventTitle";
import { EventDateDisplay } from "./events/EventDateDisplay";

interface NextEventOverlayProps {
  event: {
    id: string;
    title: string;
    date: string;
  };
}

export const NextEventOverlay = ({ event }: NextEventOverlayProps) => {
  const eventDate = new Date(event.date);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-white/90 mb-1">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            {format(eventDate, 'EEEE h:mm a')}
          </div>
          <EventTitle 
            id={event.id}
            title={event.title}
            className="text-white mb-0"
          />
        </div>
        <EventDateDisplay date={event.date} />
      </div>
    </div>
  );
};