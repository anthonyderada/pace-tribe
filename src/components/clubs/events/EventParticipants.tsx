import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

export const EventParticipants = ({ 
  participantCount, 
  participants = [] 
}: EventParticipantsProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {participants.slice(0, 3).map((participant) => (
          <Avatar key={participant.user_id} className="h-6 w-6 border-2 border-zinc-800">
            <AvatarImage 
              src={participant.profiles?.avatar_url || ''} 
              alt={participant.profiles?.username || 'Participant'} 
            />
            <AvatarFallback className="bg-zinc-700 text-xs">
              {participant.profiles?.username?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        ))}
        {participantCount > 3 && (
          <div className="h-6 w-6 rounded-full bg-zinc-700 border-2 border-zinc-800 flex items-center justify-center">
            <span className="text-xs text-zinc-300">+{participantCount - 3}</span>
          </div>
        )}
      </div>
      <span className="text-gray-400 text-sm whitespace-nowrap">
        {participantCount} participants
      </span>
    </div>
  );
};