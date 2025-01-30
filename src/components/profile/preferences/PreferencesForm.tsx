import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Save } from "lucide-react";
import { ShoeBrandSelector } from "./ShoeBrandSelector";
import { ConnectionPreferences } from "./ConnectionPreferences";

type Time = {
  hours: string;
  minutes: string;
  seconds: string;
};

interface PreferencesFormProps {
  preferredDistance: string;
  paceRange: number[];
  seekingTrainingPartners: boolean;
  seekingCasualMeetups: boolean;
  seekingRacePacers: boolean;
  seekingCoach: boolean;
  preferredShoeBrands: string[];
  onPreferredDistanceChange: (value: string) => void;
  onPaceRangeChange: (value: number[]) => void;
  onTrainingPartnersChange: (checked: boolean) => void;
  onCasualMeetupsChange: (checked: boolean) => void;
  onRacePacersChange: (checked: boolean) => void;
  onCoachChange: (checked: boolean) => void;
  onShoeBrandsChange: (brands: string[]) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const PreferencesForm = ({
  preferredDistance,
  paceRange,
  seekingTrainingPartners,
  seekingCasualMeetups,
  seekingRacePacers,
  seekingCoach,
  preferredShoeBrands,
  onPreferredDistanceChange,
  onPaceRangeChange,
  onTrainingPartnersChange,
  onCasualMeetupsChange,
  onRacePacersChange,
  onCoachChange,
  onShoeBrandsChange,
  onSave,
  onCancel,
}: PreferencesFormProps) => {
  const formatPace = (pace: number) => {
    return `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, '0')} min/mile`;
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm text-zinc-400 mb-2 block">
          Preferred Race Distance
        </label>
        <Select
          value={preferredDistance}
          onValueChange={onPreferredDistanceChange}
        >
          <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
            <SelectValue placeholder="Select preferred distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5k">5k</SelectItem>
            <SelectItem value="10k">10k</SelectItem>
            <SelectItem value="Half Marathon">Half Marathon</SelectItem>
            <SelectItem value="Marathon">Marathon</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm text-zinc-400 mb-2 block">
          Comfortable Pace Range
        </label>
        <div className="space-y-2">
          <Slider
            value={paceRange}
            onValueChange={onPaceRangeChange}
            min={4.5}
            max={10}
            step={0.25}
            className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[role=slider]]:ring-white [&_[role=slider]]:ring-offset-black [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-white [&_[role=slider]]:focus:ring-offset-2 [&_[role=slider]]:focus:ring-offset-black [&_[role=slider]]:hover:border-white/80 [&_[role=slider]]:active:border-white/70 [&_[role=track]]:bg-zinc-700 [&_[role=range]]:bg-white"
          />
          <div className="text-white text-sm">
            {formatPace(paceRange[0])} - {formatPace(paceRange[1])}
          </div>
        </div>
      </div>

      <ShoeBrandSelector
        selectedBrands={preferredShoeBrands}
        onBrandsChange={onShoeBrandsChange}
      />

      <ConnectionPreferences
        seekingTrainingPartners={seekingTrainingPartners}
        seekingCasualMeetups={seekingCasualMeetups}
        seekingRacePacers={seekingRacePacers}
        seekingCoach={seekingCoach}
        onTrainingPartnersChange={onTrainingPartnersChange}
        onCasualMeetupsChange={onCasualMeetupsChange}
        onRacePacersChange={onRacePacersChange}
        onCoachChange={onCoachChange}
      />

      <div className="flex gap-2">
        <Button
          onClick={onSave}
          className="border border-white bg-white text-black"
          variant="outline"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          className="border border-white text-white bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};