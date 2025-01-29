import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface NextEventOverlayProps {
  event: {
    id: string;
    title: string;
    date: string;
  };
}

export const NextEventOverlay = ({ event }: NextEventOverlayProps) => {
  const navigate = useNavigate();
  const eventDate = new Date(event.date);

  return (
    <div className="absolute bottom-0 right-0 left-1/2">
      <div className="flex items-start gap-3 justify-end p-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-white mb-1 justify-end whitespace-nowrap">
            {format(eventDate, 'EEEE h:mm a')}
            <Calendar className="h-4 w-4 flex-shrink-0" />
          </div>
          <h4 className="text-white font-semibold line-clamp-2 text-right mb-2">{event.title}</h4>
          <Button
            variant="outline"
            size="sm"
            className="w-full border border-white bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/events/${event.id}`);
            }}
          >
            RSVP
          </Button>
        </div>
        <div className="flex-shrink-0 bg-white text-black rounded-lg p-2 text-center min-w-14">
          <div className="text-xs font-semibold">{format(eventDate, 'MMM')}</div>
          <div className="text-lg font-bold leading-none">{format(eventDate, 'd')}</div>
        </div>
      </div>
    </div>
  );
};