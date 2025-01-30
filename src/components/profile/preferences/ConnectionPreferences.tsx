import { Checkbox } from "@/components/ui/checkbox";

interface ConnectionPreferencesProps {
  seekingTrainingPartners: boolean;
  seekingCasualMeetups: boolean;
  seekingRacePacers: boolean;
  seekingCoach: boolean;
  onTrainingPartnersChange: (checked: boolean) => void;
  onCasualMeetupsChange: (checked: boolean) => void;
  onRacePacersChange: (checked: boolean) => void;
  onCoachChange: (checked: boolean) => void;
}

export const ConnectionPreferences = ({
  seekingTrainingPartners,
  seekingCasualMeetups,
  seekingRacePacers,
  seekingCoach,
  onTrainingPartnersChange,
  onCasualMeetupsChange,
  onRacePacersChange,
  onCoachChange,
}: ConnectionPreferencesProps) => {
  return (
    <div className="space-y-4">
      <label className="text-sm text-zinc-400 block">
        Connection Preferences
      </label>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="training-partners"
            checked={seekingTrainingPartners}
            onCheckedChange={(checked) => 
              onTrainingPartnersChange(checked as boolean)
            }
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label
            htmlFor="training-partners"
            className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Looking for Training Partners
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="casual-meetups"
            checked={seekingCasualMeetups}
            onCheckedChange={(checked) => 
              onCasualMeetupsChange(checked as boolean)
            }
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label
            htmlFor="casual-meetups"
            className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Interested in Casual Meetups
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="race-pacers"
            checked={seekingRacePacers}
            onCheckedChange={(checked) => 
              onRacePacersChange(checked as boolean)
            }
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label
            htmlFor="race-pacers"
            className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Looking for Race Day Pacers
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="seeking-coach"
            checked={seekingCoach}
            onCheckedChange={(checked) => 
              onCoachChange(checked as boolean)
            }
            className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
          />
          <label
            htmlFor="seeking-coach"
            className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Looking for a Coach
          </label>
        </div>
      </div>
    </div>
  );
};