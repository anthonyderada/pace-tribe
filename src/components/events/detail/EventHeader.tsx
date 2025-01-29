import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { CardDescription, CardTitle } from "@/components/ui/card";
import { Event } from "@/components/clubs/events/types";

interface EventHeaderProps {
  event: Event;
}

export const EventHeader = ({ event }: EventHeaderProps) => {
  return (
    <>
      <CardTitle className="text-4xl font-bold text-zinc-100">
        {event.title}
      </CardTitle>
      <CardDescription className="flex items-center gap-2 text-zinc-400">
        <Calendar className="h-4 w-4" />
        {format(new Date(event.date), "MMMM d, yyyy - h:mm a")}
      </CardDescription>
    </>
  );
};