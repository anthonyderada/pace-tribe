import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Route } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PreferencesForm } from "./preferences/PreferencesForm";
import { PreferencesDisplay } from "./preferences/PreferencesDisplay";

type RunningPreferencesProps = {
  userId: string;
  profile: {
    preferred_distance: string | null;
    comfortable_pace: string | null;
    seeking_training_partners: boolean | null;
    seeking_casual_meetups: boolean | null;
    seeking_race_pacers: boolean | null;
    seeking_coach: boolean | null;
    preferred_shoe_brand: string[] | null;
  } | null;
  onPreferencesUpdate: (preferences: {
    preferred_distance: string;
    comfortable_pace: string;
    seeking_training_partners: boolean;
    seeking_casual_meetups: boolean;
    seeking_race_pacers: boolean;
    seeking_coach: boolean;
    preferred_shoe_brand: string[];
  }) => void;
  isEditable?: boolean;
};

export const RunningPreferences = ({
  userId,
  profile,
  onPreferencesUpdate,
  isEditable = true
}: RunningPreferencesProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [preferredDistance, setPreferredDistance] = useState(profile?.preferred_distance || "");
  const [paceRange, setPaceRange] = useState([6, 7]);
  const [seekingTrainingPartners, setSeekingTrainingPartners] = useState(profile?.seeking_training_partners || false);
  const [seekingCasualMeetups, setSeekingCasualMeetups] = useState(profile?.seeking_casual_meetups || false);
  const [seekingRacePacers, setSeekingRacePacers] = useState(profile?.seeking_race_pacers || false);
  const [seekingCoach, setSeekingCoach] = useState(profile?.seeking_coach || false);
  const [preferredShoeBrands, setPreferredShoeBrands] = useState<string[]>(profile?.preferred_shoe_brand || []);

  const formatPaceRange = (range: number[]) => {
    const formatPace = (pace: number) => {
      return `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, '0')} min/mile`;
    };
    return `${formatPace(range[0])} - ${formatPace(range[1])}`;
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
          seeking_coach: seekingCoach,
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
        seeking_coach: seekingCoach,
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

  const handleCancel = () => {
    setIsEditing(false);
    setPreferredDistance(profile?.preferred_distance || "");
    setSeekingTrainingPartners(profile?.seeking_training_partners || false);
    setSeekingCasualMeetups(profile?.seeking_casual_meetups || false);
    setSeekingRacePacers(profile?.seeking_race_pacers || false);
    setSeekingCoach(profile?.seeking_coach || false);
    setPreferredShoeBrands(profile?.preferred_shoe_brand || []);
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
          <PreferencesForm
            preferredDistance={preferredDistance}
            paceRange={paceRange}
            seekingTrainingPartners={seekingTrainingPartners}
            seekingCasualMeetups={seekingCasualMeetups}
            seekingRacePacers={seekingRacePacers}
            seekingCoach={seekingCoach}
            preferredShoeBrands={preferredShoeBrands}
            onPreferredDistanceChange={setPreferredDistance}
            onPaceRangeChange={setPaceRange}
            onTrainingPartnersChange={setSeekingTrainingPartners}
            onCasualMeetupsChange={setSeekingCasualMeetups}
            onRacePacersChange={setSeekingRacePacers}
            onCoachChange={setSeekingCoach}
            onShoeBrandsChange={setPreferredShoeBrands}
            onSave={handleUpdatePreferences}
            onCancel={handleCancel}
          />
        ) : (
          <PreferencesDisplay
            profile={profile || {
              preferred_distance: null,
              comfortable_pace: null,
              preferred_shoe_brand: null,
              seeking_training_partners: null,
              seeking_casual_meetups: null,
              seeking_race_pacers: null,
              seeking_coach: null,
            }}
            onEdit={() => setIsEditing(true)}
            isEditable={isEditable}
          />
        )}
      </CardContent>
    </Card>
  );
};