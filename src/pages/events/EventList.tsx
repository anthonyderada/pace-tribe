import { EventCard } from "./EventCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  club?: {
    id: string;
    name: string;
    thumbnail_url: string | null;
  };
  participants?: { user_id: string }[];
}

interface EventListProps {
  events: Event[] | undefined;
  isLoading: boolean;
  userId?: string;
  onRegister: (eventId: string, isRegistered: boolean) => void;
  isRegistering: boolean;
}

export const EventList = ({ 
  events, 
  isLoading, 
  userId,
  onRegister,
  isRegistering
}: EventListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={`skeleton-${index}`} className="bg-zinc-800/50 rounded-2xl border-0">
            <div className="p-6">
              <Skeleton className="h-6 w-2/3 mb-2 bg-zinc-800" />
              <Skeleton className="h-4 w-1/3 bg-zinc-800" />
              <Skeleton className="h-20 mt-4 bg-zinc-800" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="col-span-full text-center text-zinc-400">
        No events found
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => {
        const isRegistered = event.participants?.some(
          participant => participant.user_id === userId
        );

        return (
          <EventCard
            key={event.id}
            event={event}
            isRegistered={isRegistered}
            isLoading={isRegistering}
            onRegister={onRegister}
            userId={userId}
          />
        );
      })}
    </div>
  );
};