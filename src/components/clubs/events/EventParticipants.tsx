import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users } from "lucide-react";

interface EventParticipantsProps {
  participantCount: number;
  participants?: { 
    user_id: string; 
    profiles?: { 
      avatar_url: string | null; 
      username: string | null 
    } 
  }[];
}

export const EventParticipants = ({ participantCount, participants = [] }: EventParticipantsProps) => {
  const displayedParticipants = participants.slice(0, 3);
  const remainingCount = participantCount - displayedParticipants.length;

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {displayedParticipants.map((participant, index) => (
          <Avatar key={participant.user_id} className="h-6 w-6 border-2 border-zinc-900">
            <AvatarImage 
              src={participant.profiles?.avatar_url || ''} 
              alt={participant.profiles?.username || 'User'} 
            />
            <AvatarFallback>
              <Users className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="text-sm text-zinc-400">
        {participantCount} going
      </span>
    </div>
  );
};