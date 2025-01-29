import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface EventActionsProps {
  isParticipant: boolean;
  isMutating: boolean;
  user: any;
  handleParticipation: () => void;
}

export const EventActions = ({ 
  isParticipant, 
  isMutating, 
  user, 
  handleParticipation 
}: EventActionsProps) => {
  const navigate = useNavigate();

  if (!user) {
    return (
      <Button
        className="w-full mt-8 border border-white bg-white text-black hover:bg-gray-100"
        onClick={() => navigate("/login")}
      >
        Login to RSVP
      </Button>
    );
  }

  return (
    <Button
      className={`w-full mt-8 ${
        isParticipant
          ? "border border-white text-white bg-transparent hover:bg-white/10"
          : "border border-white bg-white text-black hover:bg-gray-100"
      }`}
      onClick={handleParticipation}
      disabled={isMutating}
    >
      {isMutating
        ? <Loader2 className="h-4 w-4 animate-spin" />
        : isParticipant
        ? "Going"
        : "RSVP"}
    </Button>
  );
};