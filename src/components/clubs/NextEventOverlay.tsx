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
          <div className="flex items-center gap-2 text-sm md:text-base font-medium text-white/90 mb-0.5 whitespace-nowrap">
            {format(eventDate, 'EEEE h:mm a')}
            <Calendar className="h-4 w-4 md:h-5 md:w-5 flex-shrink-0" />
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