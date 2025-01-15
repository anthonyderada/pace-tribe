import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, Route } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";

type RunningPreferencesProps = {
  userId: string;
  profile: {
    preferred_distance: string | null;
    comfortable_pace: string | null;
    seeking_training_partners: boolean | null;
    seeking_casual_meetups: boolean | null;
    seeking_race_pacers: boolean | null;
    preferred_shoe_brand: string[] | null;
  } | null;
  onPreferencesUpdate: (preferences: {
    preferred_distance: string;
    comfortable_pace: string;
    seeking_training_partners: boolean;
    seeking_casual_meetups: boolean;
    seeking_race_pacers: boolean;
    preferred_shoe_brand: string[];
  }) => void;
};

export const RunningPreferences = ({ userId, profile, onPreferencesUpdate }: RunningPreferencesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [preferredDistance, setPreferredDistance] = useState(profile?.preferred_distance || "");
  const [paceRange, setPaceRange] = useState([6, 7]);
  const [seekingTrainingPartners, setSeekingTrainingPartners] = useState(profile?.seeking_training_partners || false);
  const [seekingCasualMeetups, setSeekingCasualMeetups] = useState(profile?.seeking_casual_meetups || false);
  const [seekingRacePacers, setSeekingRacePacers] = useState(profile?.seeking_race_pacers || false);
  const [preferredShoeBrands, setPreferredShoeBrands] = useState<string[]>(profile?.preferred_shoe_brand || []);

  const formatPace = (pace: number) => {
    return `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, '0')} min/mile`;
  };

  const formatPaceRange = (range: number[]) => {
    return `${formatPace(range[0])} - ${formatPace(range[1])}`;
  };

  const shoeBrands = [
    "Nike", "Hoka", "ON", "Asics", "Saucony", "Brooks", "Adidas",
    "Mizuno", "Altra", "New Balance", "Salomon", "La Sportiva",
    "Merrel", "Topo Athletic"
  ];

  const toggleShoeBrand = (brand: string) => {
    setPreferredShoeBrands(current => {
      if (current.includes(brand)) {
        return current.filter(b => b !== brand);
      } else {
        return [...current, brand];
      }
    });
  };

  const handleUpdatePreferences = async () => {
    try {
      const formattedPaceRange = formatPaceRange(paceRange);
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          preferred_distance: preferredDistance,
          comfortable_pace: formattedPaceRange,
          seeking_training_partners: seekingTrainingPartners,
          seeking_casual_meetups: seekingCasualMeetups,
          seeking_race_pacers: seekingRacePacers,
          preferred_shoe_brand: preferredShoeBrands
        })
        .eq("id", userId);

      if (error) throw error;

      onPreferencesUpdate({ 
        preferred_distance: preferredDistance,
        comfortable_pace: formattedPaceRange,
        seeking_training_partners: seekingTrainingPartners,
        seeking_casual_meetups: seekingCasualMeetups,
        seeking_race_pacers: seekingRacePacers,
        preferred_shoe_brand: preferredShoeBrands
      });
      setIsEditing(false);
      toast({
        title: "Preferences updated",
        description: "Your running preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-0 bg-zinc-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <Route className="h-5 w-5" />
          Running Preferences
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Preferred Race Distance
              </label>
              <Select
                value={preferredDistance}
                onValueChange={setPreferredDistance}
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
                Preferred Shoe Brands
              </label>
              <div className="grid grid-cols-2 gap-2">
                {shoeBrands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-2">
                    <Checkbox
                      id={`shoe-brand-${brand}`}
                      checked={preferredShoeBrands.includes(brand)}
                      onCheckedChange={() => toggleShoeBrand(brand)}
                      className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                    />
                    <label
                      htmlFor={`shoe-brand-${brand}`}
                      className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">
                Comfortable Pace Range
              </label>
              <div className="space-y-2">
                <Slider
                  value={paceRange}
                  onValueChange={setPaceRange}
                  min={4.5}
                  max={10}
                  step={0.25}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[role=slider]]:ring-white [&_[role=slider]]:ring-offset-black [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-white [&_[role=slider]]:focus:ring-offset-2 [&_[role=slider]]:focus:ring-offset-black [&_[role=slider]]:hover:border-white/80 [&_[role=slider]]:active:border-white/70 [&_[role=track]]:bg-zinc-700 [&_[role=range]]:bg-white"
                />
                <div className="text-white text-sm">
                  {formatPaceRange(paceRange)}
                </div>
              </div>
            </div>
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
                      setSeekingTrainingPartners(checked as boolean)
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
                      setSeekingCasualMeetups(checked as boolean)
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
                      setSeekingRacePacers(checked as boolean)
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
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleUpdatePreferences}
                className="border border-white bg-white text-black"
                variant="outline"
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setPreferredDistance(profile?.preferred_distance || "");
                  setSeekingTrainingPartners(profile?.seeking_training_partners || false);
                  setSeekingCasualMeetups(profile?.seeking_casual_meetups || false);
                  setSeekingRacePacers(profile?.seeking_race_pacers || false);
                  setPreferredShoeBrands(profile?.preferred_shoe_brand || []);
                }}
                className="border border-white text-white bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <Button
              onClick={() => setIsEditing(true)}
              className="absolute top-0 right-0 bg-transparent text-zinc-400"
              size="icon"
              variant="ghost"
            >
              <Pencil className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">Preferred race distance</h3>
                <p className="text-zinc-400">
                  {profile?.preferred_distance || "Not set"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">Preferred shoe brands</h3>
                <div className="flex flex-wrap gap-2">
                  {profile?.preferred_shoe_brand && profile.preferred_shoe_brand.length > 0 ? (
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
                  {profile?.comfortable_pace || "Not set"}
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">Connection Preferences</h3>
                <div className="space-y-1">
                  {[
                    profile?.seeking_training_partners && "Looking for Training Partners",
                    profile?.seeking_casual_meetups && "Interested in Casual Meetups",
                    profile?.seeking_race_pacers && "Looking for Race Day Pacers"
                  ].filter(Boolean).map((preference, index) => (
                    <p key={index} className="text-zinc-400">{preference}</p>
                  ))}
                  {!profile?.seeking_training_partners && 
                   !profile?.seeking_casual_meetups && 
                   !profile?.seeking_race_pacers && (
                    <p className="text-zinc-400">No preferences set</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};