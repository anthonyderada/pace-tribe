import { Road, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface EventDescriptionProps {
  description: string | null;
  participantCount: number;
  participants?: { user_id: string; profiles?: { avatar_url: string | null; username: string | null } }[];
}

export const EventDescription = ({ 
  description, 
  participantCount,
  participants = []
}: EventDescriptionProps) => {
  return (
    <>
      <p className="text-gray-400 line-clamp-3 mb-4">
        {description || "No description available"}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700/70">
            <Road className="h-3 w-3 mr-1" />
            Road Running
          </Badge>
          <Badge variant="secondary" className="bg-zinc-700/50 text-zinc-300 hover:bg-zinc-700/70">
            <Users className="h-3 w-3 mr-1" />
            Social
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {participants.slice(0, 3).map((participant, index) => (
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
          <span className="text-gray-400 text-sm">
            {participantCount} participants
          </span>
        </div>
      </div>
    </>
  );
};