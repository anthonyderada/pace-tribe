import { Input } from "@/components/ui/input";

type TimeInputProps = {
  hours: string;
  minutes: string;
  seconds: string;
  onChange: (time: { hours: string; minutes: string; seconds: string }) => void;
};

export const TimeInput = ({ hours, minutes, seconds, onChange }: TimeInputProps) => {
  const validateTimeValue = (value: string, max: number) => {
    const num = parseInt(value);
    if (isNaN(num)) return "00";
    if (num < 0) return "00";
    if (num > max) return max.toString().padStart(2, '0');
    return num.toString().padStart(2, '0');
  };

  const handleChange = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
    const newValue = validateTimeValue(value, field === 'hours' ? 99 : 59);
    onChange({
      hours: field === 'hours' ? newValue : hours,
      minutes: field === 'minutes' ? newValue : minutes,
      seconds: field === 'seconds' ? newValue : seconds,
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="number"
        min="0"
        max="99"
        value={hours}
        onChange={(e) => handleChange('hours', e.target.value)}
        className="w-20"
        placeholder="hr"
      />
      <span className="text-zinc-400">:</span>
      <Input
        type="number"
        min="0"
        max="59"
        value={minutes}
        onChange={(e) => handleChange('minutes', e.target.value)}
        className="w-20"
        placeholder="min"
      />
      <span className="text-zinc-400">:</span>
      <Input
        type="number"
        min="0"
        max="59"
        value={seconds}
        onChange={(e) => handleChange('seconds', e.target.value)}
        className="w-20"
        placeholder="sec"
      />
    </div>
  );
};