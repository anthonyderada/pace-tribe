import { TimeInput } from "../../TimeInput";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

type Time = {
  hours: string;
  minutes: string;
  seconds: string;
};

interface EditableTimeInputsProps {
  pb5kTime: Time;
  pb10kTime: Time;
  pbHalfTime: Time;
  pbMarathonTime: Time;
  setPb5kTime: (time: Time) => void;
  setPb10kTime: (time: Time) => void;
  setPbHalfTime: (time: Time) => void;
  setPbMarathonTime: (time: Time) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const EditableTimeInputs = ({
  pb5kTime,
  pb10kTime,
  pbHalfTime,
  pbMarathonTime,
  setPb5kTime,
  setPb10kTime,
  setPbHalfTime,
  setPbMarathonTime,
  onSave,
  onCancel,
}: EditableTimeInputsProps) => {
  return (
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