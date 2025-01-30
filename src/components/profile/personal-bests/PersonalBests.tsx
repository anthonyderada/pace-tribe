import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { parseIntervalToTime } from "./utils/timeUtils";
import { EditableTimeInputs } from "./components/EditableTimeInputs";
import { PRGrid } from "./components/PRGrid";
import { PercentileLegend } from "./components/PercentileLegend";

type Time = {
  hours: string;
  minutes: string;
  seconds: string;
};

type PersonalBestsProps = {
  userId: string;
  accolades: {
    pb_5k: string | null;
    pb_10k: string | null;
    pb_half_marathon: string | null;
    pb_marathon: string | null;
  } | null;
  onAccoladesUpdate: (accolades: {
    pb_5k: string | null;
    pb_10k: string | null;
    pb_half_marathon: string | null;
    pb_marathon: string | null;
  }) => void;
  isEditable?: boolean;
};

export const PersonalBests = ({
  userId,
  accolades,
  onAccoladesUpdate,
  isEditable = true
}: PersonalBestsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [pb5kTime, setPb5kTime] = useState<Time>(parseIntervalToTime(accolades?.pb_5k));
  const [pb10kTime, setPb10kTime] = useState<Time>(parseIntervalToTime(accolades?.pb_10k));
  const [pbHalfTime, setPbHalfTime] = useState<Time>(parseIntervalToTime(accolades?.pb_half_marathon));
  const [pbMarathonTime, setPbMarathonTime] = useState<Time>(parseIntervalToTime(accolades?.pb_marathon));

  const { data: currentUserAccolades } = useQuery({
    queryKey: ['current-user-accolades'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from("accolades")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      return data;
    },
    enabled: !isEditable,
  });

  const formatTimeToInterval = (time: Time) => {
    return `${time.hours}:${time.minutes}:${time.seconds}`;
  };

  const handleUpdateAccolades = async () => {
    try {
      const updates = {
        pb_5k: formatTimeToInterval(pb5kTime),
        pb_10k: formatTimeToInterval(pb10kTime),
        pb_half_marathon: formatTimeToInterval(pbHalfTime),
        pb_marathon: formatTimeToInterval(pbMarathonTime),
      };

      const { error } = await supabase
        .from("accolades")
        .update(updates)
        .eq("user_id", userId);

      if (error) throw error;

      onAccoladesUpdate(updates);
      setIsEditing(false);
      toast({
        title: "Personal bests updated",
        description: "Your personal best times have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update personal bests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPb5kTime(parseIntervalToTime(accolades?.pb_5k));
    setPb10kTime(parseIntervalToTime(accolades?.pb_10k));
    setPbHalfTime(parseIntervalToTime(accolades?.pb_half_marathon));
    setPbMarathonTime(parseIntervalToTime(accolades?.pb_marathon));
  };

  return (
    <Card className="border-0 bg-zinc-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <Trophy className="h-5 w-5" />
          Personal Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <EditableTimeInputs
            pb5kTime={pb5kTime}
            pb10kTime={pb10kTime}
            pbHalfTime={pbHalfTime}
            pbMarathonTime={pbMarathonTime}
            setPb5kTime={setPb5kTime}
            setPb10kTime={setPb10kTime}
            setPbHalfTime={setPbHalfTime}
            setPbMarathonTime={setPbMarathonTime}
            onSave={handleUpdateAccolades}
            onCancel={handleCancel}
          />
        ) : (
          <div className="relative">
            {isEditable && (
              <Button
                onClick={() => setIsEditing(true)}
                className="absolute top-0 right-0 bg-transparent text-zinc-400"
                size="icon"
                variant="ghost"
              >
                <Pencil className="h-5 w-5 md:h-6 md:w-6" />
              </Button>
            )}
            <PRGrid
              accolades={accolades}
              currentUserAccolades={!isEditable ? currentUserAccolades : undefined}
            />
            <PercentileLegend />
          </div>
        )}
      </CardContent>
    </Card>
  );
};