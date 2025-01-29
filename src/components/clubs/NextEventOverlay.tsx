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
    <div className="absolute bottom-0 right-0 left-1/2 bg-gradient-to-t from-black/80 to-transparent p-6">
      <div className="flex items-start gap-3 justify-end">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-white/90 mb-1 justify-end whitespace-nowrap">
            {format(eventDate, 'EEEE h:mm a')}
            <Calendar className="h-4 w-4 flex-shrink-0" />
          </div>
          <EventTitle 
            id={event.id}
            title={event.title}
            className="text-white text-right mb-0"
          />
        </div>
        <EventDateDisplay date={event.date} />
      </div>
    </div>
  );
};