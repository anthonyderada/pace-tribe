import { useQuery } from "@tanstack/react-query";
import { calculatePercentile } from "./utils/percentileUtils";
import { Trophy } from "lucide-react";

type PercentileDisplayProps = {
  distance: string;
  time: string | null;
};

export const PercentileDisplay = ({ distance, time }: PercentileDisplayProps) => {
  const { data: percentile } = useQuery({
    queryKey: ['percentile', distance, time],
    queryFn: () => calculatePercentile(distance, time),
    enabled: !!time,
  });

  if (!percentile) return null;

  const getColor = (percentile: number) => {
    if (percentile >= 95) return "text-yellow-400";
    if (percentile >= 85) return "text-emerald-400";
    if (percentile >= 70) return "text-blue-400";
    return "text-zinc-400";
  };

  return (
    <div className={`flex items-center gap-1 text-sm ${getColor(percentile)}`}>
      <Trophy className="h-3 w-3" />
      <span>Top {percentile}%</span>
    </div>
  );
};