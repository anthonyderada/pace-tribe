import { useNavigate } from "react-router-dom";
import { Repeat } from "lucide-react";

interface EventTitleProps {
  id: string;
  title: string;
  isRecurring?: boolean;
  className?: string;
}

export const EventTitle = ({ id, title, isRecurring, className = "" }: EventTitleProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-2">
      <h4 
        className={`text-white font-semibold line-clamp-2 cursor-pointer hover:text-zinc-200 ${className}`}
        onClick={(e) => {
          e.stopPropagation();
          navigate(`/events/${id}`);
        }}
      >
        {title}
      </h4>
      {isRecurring && (
        <Repeat className="h-4 w-4 text-zinc-400" />
      )}
    </div>
  );
};