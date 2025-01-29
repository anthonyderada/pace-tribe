import { Calendar, MapPin, Route, Timer, Repeat } from "lucide-react";
import { format } from "date-fns";
import { EventMetadataProps } from "./types";

export const EventMetadata = ({ 
  date, 
  location, 
  distance, 
  pace,
  is_recurring,
  recurrence_schedule 
}: EventMetadataProps) => {
  return (
    <>
      <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
        <Calendar className="h-4 w-4" />
        {format(new Date(date), "MMM d, yyyy - h:mm a")}
      </div>
      {is_recurring && recurrence_schedule && (
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <Repeat className="h-4 w-4" />
          {recurrence_schedule}
        </div>
      )}
      {location && (
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          {location}
        </div>
      )}
      <div className="flex flex-wrap gap-4 mb-3">
        {distance && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Route className="h-4 w-4" />
            {(Number(distance) * 0.621371).toFixed(1)} miles
          </div>
        )}
        {pace && (
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Timer className="h-4 w-4" />
            {pace.replace(/min\/mil/g, '/mi')}
          </div>
        )}
      </div>
    </>
  );
};