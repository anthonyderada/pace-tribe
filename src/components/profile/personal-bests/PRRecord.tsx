import { renderTime } from "./utils/timeUtils";
import { TimeComparison } from "./TimeComparison";
import { TimeInput } from "../TimeInput";
import { PercentileDisplay } from "./PercentileDisplay";

interface PRRecordProps {
  title: string;
  time: string | null;
  currentUserTime?: string | null;
  isEditing?: boolean;
  onTimeChange?: (time: { hours: string; minutes: string; seconds: string }) => void;
  initialTime?: { hours: string; minutes: string; seconds: string };
  distanceKey: string;
}

export const PRRecord = ({
  title,
  time,
  currentUserTime,
  isEditing = false,
  onTimeChange,
  initialTime,
  distanceKey,
}: PRRecordProps) => {
  if (isEditing && onTimeChange && initialTime) {
    return (
      <div>
        <label className="text-sm text-zinc-400 mb-2 block">{title}</label>
        <TimeInput
          hours={initialTime.hours}
          minutes={initialTime.minutes}
          seconds={initialTime.seconds}
          onChange={onTimeChange}
        />
      </div>
    );
  }

  return (
    <div className="bg-zinc-800/50 p-4 rounded-lg">
      <h3 className="text-sm font-medium text-zinc-400 mb-1">{title}</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className="text-xl font-semibold text-zinc-100">
            {renderTime(time)}
          </p>
          {currentUserTime && (
            <TimeComparison
              userTime={time}
              currentUserTime={currentUserTime}
            />
          )}
        </div>
        <PercentileDisplay distance={distanceKey} time={time} />
      </div>
    </div>
  );
};