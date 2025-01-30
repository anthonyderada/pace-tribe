import { intervalToSeconds, formatTimeDifference } from "./utils/timeUtils";

interface TimeComparisonProps {
  userTime: string | null;
  currentUserTime: string | null;
}

export const TimeComparison = ({ userTime, currentUserTime }: TimeComparisonProps) => {
  if (!userTime || !currentUserTime) return null;
  
  const diff = intervalToSeconds(userTime) - intervalToSeconds(currentUserTime);
  const comparisonText = formatTimeDifference(diff);
  const textColor = diff === 0 ? "text-zinc-400" : diff < 0 ? "text-green-400" : "text-red-400";
  
  return (
    <span className={`text-sm ${textColor}`}>
      {comparisonText}
    </span>
  );
};