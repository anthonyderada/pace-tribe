import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Event } from "@/components/clubs/events/types";
import { useNavigate } from "react-router-dom";

interface EventParticipantsListProps {
  event: Event;
}

export const EventParticipantsList = ({ event }: EventParticipantsListProps) => {
  const navigate = useNavigate();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100">
          Participants ({event.event_participants.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {event.event_participants.length === 0 ? (
            <p className="text-zinc-400">No participants yet. Be the first to join!</p>
          ) : (
            event.event_participants.map((participant) => (
              <div
                key={participant.id}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-800/50 transition-colors"
                onClick={() => navigate(`/profile/${participant.user_id}`)}
                style={{ cursor: "pointer" }}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={participant.profiles?.avatar_url || undefined}
                    alt={participant.profiles?.username || "User"}
                  />
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {participant.profiles?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-zinc-100">
                  {participant.profiles?.username || "Anonymous Runner"}
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </>
  );
};