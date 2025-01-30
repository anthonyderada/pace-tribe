import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { TimeInput } from "./TimeInput";

type Time = {
  hours: string;
  minutes: string;
  seconds: string;
};

const parseIntervalToTime = (interval: string | null): Time => {
  if (!interval) return { hours: "00", minutes: "00", seconds: "00" };
  const [hours = "00", minutes = "00", seconds = "00"] = interval.split(':');
  return {
    hours: hours.padStart(2, '0'),
    minutes: minutes.padStart(2, '0'),
    seconds: seconds.padStart(2, '0')
  };
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

export const PersonalBests = ({ userId, accolades, onAccoladesUpdate, isEditable = true }: PersonalBestsProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const [pb5kTime, setPb5kTime] = useState<Time>(parseIntervalToTime(accolades?.pb_5k));
  const [pb10kTime, setPb10kTime] = useState<Time>(parseIntervalToTime(accolades?.pb_10k));
  const [pbHalfTime, setPbHalfTime] = useState<Time>(parseIntervalToTime(accolades?.pb_half_marathon));
  const [pbMarathonTime, setPbMarathonTime] = useState<Time>(parseIntervalToTime(accolades?.pb_marathon));

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

  const renderTime = (time: string | null) => {
    if (!time) return "Not set";
    const [hours, minutes, seconds] = time.split(':');
    const formattedTime = [];
    
    if (hours !== "00") formattedTime.push(`${parseInt(hours)}h`);
    if (minutes !== "00") formattedTime.push(`${parseInt(minutes)}m`);
    if (seconds !== "00") formattedTime.push(`${parseInt(seconds)}s`);
    
    return formattedTime.join(' ') || "Not set";
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
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">5K</label>
              <TimeInput
                hours={pb5kTime.hours}
                minutes={pb5kTime.minutes}
                seconds={pb5kTime.seconds}
                onChange={setPb5kTime}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">10K</label>
              <TimeInput
                hours={pb10kTime.hours}
                minutes={pb10kTime.minutes}
                seconds={pb10kTime.seconds}
                onChange={setPb10kTime}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Half Marathon</label>
              <TimeInput
                hours={pbHalfTime.hours}
                minutes={pbHalfTime.minutes}
                seconds={pbHalfTime.seconds}
                onChange={setPbHalfTime}
              />
            </div>
            <div>
              <label className="text-sm text-zinc-400 mb-2 block">Marathon</label>
              <TimeInput
                hours={pbMarathonTime.hours}
                minutes={pbMarathonTime.minutes}
                seconds={pbMarathonTime.seconds}
                onChange={setPbMarathonTime}
              />
            </div>
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
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400 mb-1">5K</h3>
                <p className="text-xl font-semibold text-zinc-100">{renderTime(accolades?.pb_5k)}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400 mb-1">10K</h3>
                <p className="text-xl font-semibold text-zinc-100">{renderTime(accolades?.pb_10k)}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400 mb-1">Half Marathon</h3>
                <p className="text-xl font-semibold text-zinc-100">{renderTime(accolades?.pb_half_marathon)}</p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-zinc-400 mb-1">Marathon</h3>
                <p className="text-xl font-semibold text-zinc-100">{renderTime(accolades?.pb_marathon)}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};