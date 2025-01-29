import { useNavigate } from "react-router-dom";

interface EventTitleProps {
  id: string;
  title: string;
  className?: string;
}

export const EventTitle = ({ id, title, className = "" }: EventTitleProps) => {
  const navigate = useNavigate();

  return (
    <h4 
      className={`text-white font-semibold line-clamp-2 cursor-pointer hover:text-zinc-200 ${className}`}
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/events/${id}`);
      }}
    >
      {title}
    </h4>
  );
};