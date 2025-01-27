import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Route, Timer, Footprints } from "lucide-react";

type RunningPreferencesProps = {
  userId: string;
  profile: {
    location: string | null;
    preferred_distance: string | null;
    comfortable_pace: string | null;
    preferred_shoe_brand: string[] | null;
    seeking_training_partners: boolean | null;
    seeking_casual_meetups: boolean | null;
    seeking_race_pacers: boolean | null;
    seeking_coach: boolean | null;
  };
  onPreferencesUpdate?: (preferences: Partial<RunningPreferencesProps["profile"]>) => void;
  readOnly?: boolean;
};

export const RunningPreferences = ({
  profile,
  readOnly = false
}: RunningPreferencesProps) => {
  return (
    <Card className="border-0 bg-zinc-900/90">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100">
          Running Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {profile.location && (
          <div className="flex items-center gap-2 text-zinc-400">
            <MapPin className="h-5 w-5" />
            <span>{profile.location}</span>
          </div>
        )}
        {profile.preferred_distance && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Route className="h-5 w-5" />
            <span>{profile.preferred_distance}</span>
          </div>
        )}
        {profile.comfortable_pace && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Timer className="h-5 w-5" />
            <span>{profile.comfortable_pace}</span>
          </div>
        )}
        {profile.preferred_shoe_brand && profile.preferred_shoe_brand.length > 0 && (
          <div className="flex items-center gap-2 text-zinc-400">
            <Footprints className="h-5 w-5" />
            <span>{profile.preferred_shoe_brand.join(", ")}</span>
          </div>
        )}

        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-zinc-100 mb-3">Looking for:</h4>
          {profile.seeking_training_partners && (
            <div className="text-zinc-400">Training Partners</div>
          )}
          {profile.seeking_casual_meetups && (
            <div className="text-zinc-400">Casual Meetups</div>
          )}
          {profile.seeking_race_pacers && (
            <div className="text-zinc-400">Race Pacers</div>
          )}
          {profile.seeking_coach && (
            <div className="text-zinc-400">Coach</div>
          )}
          {!profile.seeking_training_partners && 
            !profile.seeking_casual_meetups && 
            !profile.seeking_race_pacers && 
            !profile.seeking_coach && (
            <div className="text-zinc-400">Not looking for anything specific at the moment</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};