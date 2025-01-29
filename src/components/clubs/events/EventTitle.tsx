import { useNavigate } from "react-router-dom";
import { Repeat } from "lucide-react";

interface EventTitleProps {
  id: string;
  title: string;
  isRecurring?: boolean;
  isFree?: boolean;
  className?: string;
}

export const EventTitle = ({ id, title, isRecurring, isFree, className = "" }: EventTitleProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <h4 
        className={`text-white text-xl font-semibold line-clamp-2 cursor-pointer hover:text-zinc-200 ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/events/${id}`);
        }}
      >
        {title}
      </h4>
      <div className="flex items-center gap-2">
        {isRecurring && (
          <Repeat className="h-4 w-4 text-white" strokeWidth={1.5} />
        )}
        {isFree && (
          <span className="text-sm text-zinc-500/70">FREE</span>
        )}
      </div>
    </div>
  );
};