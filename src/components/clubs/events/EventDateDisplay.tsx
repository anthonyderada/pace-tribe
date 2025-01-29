import { format } from "date-fns";

interface EventDateDisplayProps {
  date: string;
  className?: string;
}

export const EventDateDisplay = ({ date, className = "" }: EventDateDisplayProps) => {
  const eventDate = new Date(date);
  
  return (
    <div className={`bg-white text-black rounded-lg p-2 text-center min-w-14 ${className}`}>
      <div className="text-xs font-semibold">{format(eventDate, 'MMM')}</div>
      <div className="text-lg font-bold leading-none">{format(eventDate, 'd')}</div>
    </div>
  );
};