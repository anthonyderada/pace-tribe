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
    <div className="absolute bottom-0 right-0 left-1/2 p-6">
      <div className="flex items-center gap-3 justify-end">
        <div className="flex-1 flex flex-col items-end">
          <div className="flex items-center gap-2 text-xs md:text-sm text-white/90 mb-1 whitespace-nowrap">
            {format(eventDate, 'EEEE h:mm a')}
            <Calendar className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
          </div>
          <EventTitle 
            id={event.id}
            title={event.title}
            className="text-white text-right mb-0 text-sm md:text-base"
          />
        </div>
        <EventDateDisplay date={event.date} />
      </div>
    </div>
  );
};