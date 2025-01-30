import { Info } from "lucide-react";

export const PercentileLegend = () => {
  return (
    <div className="mt-4 p-4 bg-zinc-800/30 rounded-lg">
      <div className="flex items-center gap-2 mb-2 text-zinc-300">
        <Info className="h-4 w-4" />
        <span className="text-sm font-medium">Percentile Ranking System</span>
      </div>
      <div className="space-y-1 text-sm">
        <div className="flex items-center text-yellow-400">
          <span>99th percentile:</span>
          <span className="ml-2">Elite times</span>
        </div>
        <div className="flex items-center text-emerald-400">
          <span>90-95th percentile:</span>
          <span className="ml-2">Strong amateur times</span>
        </div>
        <div className="flex items-center text-blue-400">
          <span>50th percentile:</span>
          <span className="ml-2">Median times</span>
        </div>
        <div className="flex items-center text-zinc-400">
          <span>Lower percentiles:</span>
          <span className="ml-2">Recreational times</span>
        </div>
        <div className="flex items-center text-zinc-500">
          <span>1st percentile:</span>
          <span className="ml-2">Slowest times</span>
        </div>
      </div>
    </div>
  );
};