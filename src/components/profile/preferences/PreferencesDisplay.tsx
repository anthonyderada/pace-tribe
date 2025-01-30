import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface PreferencesDisplayProps {
  profile: {
    preferred_distance: string | null;
    comfortable_pace: string | null;
    preferred_shoe_brand: string[] | null;
    seeking_training_partners: boolean | null;
    seeking_casual_meetups: boolean | null;
    seeking_race_pacers: boolean | null;
    seeking_coach: boolean | null;
  };
  onEdit: () => void;
  isEditable: boolean;
}

export const PreferencesDisplay = ({
  profile,
  onEdit,
  isEditable,
}: PreferencesDisplayProps) => {
  return (
    <div className="relative">
      {isEditable && (
        <Button
          onClick={onEdit}
          className="absolute top-0 right-0 bg-transparent text-zinc-400"
          size="icon"
          variant="ghost"
        >
          <Pencil className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      )}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Preferred race distance</h3>
          <p className="text-zinc-400">
            {profile.preferred_distance || "Not set"}
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Preferred shoe brands</h3>
          <div className="flex flex-wrap gap-2">
            {profile.preferred_shoe_brand && profile.preferred_shoe_brand.length > 0 ? (
              profile.preferred_shoe_brand.map((brand) => (
                <span
                  key={brand}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-100"
                >
                  {brand}
                </span>
              ))
            ) : (
              <p className="text-zinc-400">No preference</p>
            )}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Comfortable pace</h3>
          <p className="text-zinc-400">
            {profile.comfortable_pace || "Not set"}
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Connection Preferences</h3>
          <div className="space-y-1">
            {[
              profile.seeking_training_partners && "Looking for Training Partners",
              profile.seeking_casual_meetups && "Interested in Casual Meetups",
              profile.seeking_race_pacers && "Looking for Race Day Pacers",
              profile.seeking_coach && "Looking for a Coach"
            ].filter(Boolean).map((preference, index) => (
              <p key={index} className="text-zinc-400">{preference}</p>
            ))}
            {!profile.seeking_training_partners && 
             !profile.seeking_casual_meetups && 
             !profile.seeking_race_pacers &&
             !profile.seeking_coach && (
              <p className="text-zinc-400">No preferences set</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};