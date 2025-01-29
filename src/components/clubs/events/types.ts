export interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  event_participants: {
    user_id: string;
    profiles?: {
      avatar_url: string | null;
      username: string | null;
    };
  }[];
}

export interface EventMetadataProps {
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
}