import { format } from "date-fns";
import { Calendar } from "lucide-react";

interface NextEventOverlayProps {
  event: {
    title: string;
    date: string;
  };
}

export const NextEventOverlay = ({ event }: NextEventOverlayProps) => {
  const eventDate = new Date(event.date);

  return (
    <div className="absolute bottom-0 right-0 w-72 bg-black/90 p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-white text-black rounded-lg p-2 text-center min-w-14">
          <div className="text-xs font-semibold">{format(eventDate, 'MMM')}</div>
          <div className="text-lg font-bold leading-none">{format(eventDate, 'd')}</div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-white mb-1">
            <Calendar className="h-4 w-4" />
            {format(eventDate, 'EEEE h:mm a')}
          </div>
          <h4 className="text-white font-semibold line-clamp-2">{event.title}</h4>
        </div>
      </div>
    </div>
  );
};