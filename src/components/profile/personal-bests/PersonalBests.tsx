import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TimeInput } from "../TimeInput";
import { useQuery } from "@tanstack/react-query";
import { parseIntervalToTime } from "./utils/timeUtils";
import { PRRecord } from "./PRRecord";

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
      const { error } = await supabase
        .from("accolades")
        .update({
          pb_5k: formatTimeToInterval(pb5kTime),
          pb_10k: formatTimeToInterval(pb10kTime),
          pb_half_marathon: formatTimeToInterval(pbHalfTime),
          pb_marathon: formatTimeToInterval(pbMarathonTime),
        })
        .eq("user_id", userId);

      if (error) throw error;

      onAccoladesUpdate({
        pb_5k: formatTimeToInterval(pb5kTime),
        pb_10k: formatTimeToInterval(pb10kTime),
        pb_half_marathon: formatTimeToInterval(pbHalfTime),
        pb_marathon: formatTimeToInterval(pbMarathonTime),
      });
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
          <div className="space-y-4">
            <PRRecord
              title="5K"
              time={accolades?.pb_5k}
              isEditing={true}
              onTimeChange={setPb5kTime}
              initialTime={pb5kTime}
              distanceKey="5k"
            />
            <PRRecord
              title="10K"
              time={accolades?.pb_10k}
              isEditing={true}
              onTimeChange={setPb10kTime}
              initialTime={pb10kTime}
              distanceKey="10k"
            />
            <PRRecord
              title="Half Marathon"
              time={accolades?.pb_half_marathon}
              isEditing={true}
              onTimeChange={setPbHalfTime}
              initialTime={pbHalfTime}
              distanceKey="half_marathon"
            />
            <PRRecord
              title="Marathon"
              time={accolades?.pb_marathon}
              isEditing={true}
              onTimeChange={setPbMarathonTime}
              initialTime={pbMarathonTime}
              distanceKey="marathon"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleUpdateAccolades}
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
                  setPb5kTime(parseIntervalToTime(accolades?.pb_5k));
                  setPb10kTime(parseIntervalToTime(accolades?.pb_10k));
                  setPbHalfTime(parseIntervalToTime(accolades?.pb_half_marathon));
                  setPbMarathonTime(parseIntervalToTime(accolades?.pb_marathon));
                }}
                className="border border-white text-white bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
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
            <div className="grid grid-cols-2 gap-6">
              <PRRecord
                title="5K"
                time={accolades?.pb_5k}
                currentUserTime={!isEditable ? currentUserAccolades?.pb_5k : undefined}
                distanceKey="5k"
              />
              <PRRecord
                title="10K"
                time={accolades?.pb_10k}
                currentUserTime={!isEditable ? currentUserAccolades?.pb_10k : undefined}
                distanceKey="10k"
              />
              <PRRecord
                title="Half Marathon"
                time={accolades?.pb_half_marathon}
                currentUserTime={!isEditable ? currentUserAccolades?.pb_half_marathon : undefined}
                distanceKey="half_marathon"
              />
              <PRRecord
                title="Marathon"
                time={accolades?.pb_marathon}
                currentUserTime={!isEditable ? currentUserAccolades?.pb_marathon : undefined}
                distanceKey="marathon"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};