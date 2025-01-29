import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface EventRSVPButtonProps {
  isParticipant: boolean;
  isLoading: boolean;
  onClick: (e: React.MouseEvent) => void;
}

export const EventRSVPButton = ({ isParticipant, isLoading, onClick }: EventRSVPButtonProps) => {
  return (
    <Button
      className={`w-24 ${
        isParticipant
          ? "border border-white text-white bg-transparent hover:bg-white/10"
          : "border border-white bg-white text-black hover:bg-gray-100"
      }`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isParticipant ? (
        'Going'
      ) : (
        'RSVP'
      )}
    </Button>
  );
};