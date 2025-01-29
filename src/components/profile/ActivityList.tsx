import { TribesSection } from "./TribesSection";
import { EventsSection } from "./EventsSection";

type Club = {
  id: string;
  name: string;
  location: string | null;
  thumbnail_url: string | null;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  club: {
    name: string;
  };
};

type ActivityListProps = {
  joinedClubs: Club[];
  registeredEvents: Event[];
};

export const ActivityList = ({ joinedClubs, registeredEvents }: ActivityListProps) => {
  return (
    <>
      <TribesSection joinedClubs={joinedClubs} />
      <EventsSection registeredEvents={registeredEvents} />
    </>
  );
};