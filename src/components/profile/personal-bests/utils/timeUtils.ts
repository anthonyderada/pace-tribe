export const parseIntervalToTime = (interval: string | null) => {
  if (!interval) return { hours: "00", minutes: "00", seconds: "00" };
  const [hours = "00", minutes = "00", seconds = "00"] = interval.split(':');
  return {
    hours: hours.padStart(2, '0'),
    minutes: minutes.padStart(2, '0'),
    seconds: seconds.padStart(2, '0')
  };
};

export const intervalToSeconds = (interval: string | null): number => {
  if (!interval) return 0;
  const time = parseIntervalToTime(interval);
  return (
    parseInt(time.hours) * 3600 +
    parseInt(time.minutes) * 60 +
    parseInt(time.seconds)
  );
};

export const formatTimeDifference = (diff: number): string => {
  if (diff === 0) return "Equal";
  const isPositive = diff > 0;
  const absDiff = Math.abs(diff);
  const hours = Math.floor(absDiff / 3600);
  const minutes = Math.floor((absDiff % 3600) / 60);
  const seconds = absDiff % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return `${isPositive ? '+' : '-'} ${parts.join(' ')}`;
};

export const renderTime = (time: string | null) => {
  if (!time) return "Not set";
  const [hours, minutes, seconds] = time.split(':');
  const formattedTime = [];
  
  if (hours !== "00") formattedTime.push(`${parseInt(hours)}h`);
  if (minutes !== "00") formattedTime.push(`${parseInt(minutes)}m`);
  if (seconds !== "00") formattedTime.push(`${parseInt(seconds)}s`);
  
  return formattedTime.join(' ') || "Not set";
};