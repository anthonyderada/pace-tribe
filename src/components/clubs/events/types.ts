export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  club_id?: string;
  is_recurring?: boolean;
  recurrence_schedule?: string | null;
  clubs?: {
    name: string;
    thumbnail_url: string | null;
  };
  event_participants: {
    id?: string;
    user_id: string;
    profiles?: {
      username: string | null;
      avatar_url: string | null;
    };
  }[];
}

export interface EventMetadataProps {
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  is_recurring?: boolean;
  recurrence_schedule?: string | null;
}

export interface EventCardProps {
  event: Event;
  userId?: string;
  onJoin: (eventId: string) => void;
  onLeave: (eventId: string) => void;
  isLoading: boolean;
}