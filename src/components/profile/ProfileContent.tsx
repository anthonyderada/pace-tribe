import { RunningPreferences } from "./RunningPreferences";
import { PersonalBests } from "./PersonalBests";
import { FollowersSection } from "./FollowersSection";
import { ClubList } from "./ClubList";
import { EventList } from "./EventList";

type Profile = {
  preferred_distance: string | null;
  comfortable_pace: string | null;
  seeking_training_partners: boolean | null;
  seeking_casual_meetups: boolean | null;
  seeking_race_pacers: boolean | null;
  seeking_coach: boolean | null;
  preferred_shoe_brand: string[] | null;
};

type Club = {
  id: string;
  name: string;
  location: string | null;
  description: string | null;
  thumbnail_url: string | null;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  distance: number | null;
  pace: string | null;
  club: {
    name: string;
  };
};

type Accolades = {
  pb_5k: string | null;
  pb_10k: string | null;
  pb_half_marathon: string | null;
  pb_marathon: string | null;
};

interface ProfileContentProps {
  userId: string;
  profile: Profile;
  accolades: Accolades | null;
  joinedClubs: Club[];
  registeredEvents: Event[];
  isEditable: boolean;
  onPreferencesUpdate: (preferences: Partial<Profile>) => void;
  onAccoladesUpdate: (accolades: Accolades) => void;
}

export const ProfileContent = ({
  userId,
  profile,
  accolades,
  joinedClubs,
  registeredEvents,
  isEditable,
  onPreferencesUpdate,
  onAccoladesUpdate,
}: ProfileContentProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <PersonalBests
        userId={userId}
        accolades={accolades}
        onAccoladesUpdate={onAccoladesUpdate}
        isEditable={isEditable}
      />
      
      <ClubList joinedClubs={joinedClubs} />
      
      <FollowersSection userId={userId} />
      
      <RunningPreferences
        userId={userId}
        profile={profile}
        onPreferencesUpdate={onPreferencesUpdate}
        isEditable={isEditable}
      />

      <EventList registeredEvents={registeredEvents} />
    </div>
  );
};