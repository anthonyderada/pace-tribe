import { supabase } from "@/integrations/supabase/client";

export const calculatePercentile = async (distance: string, time: string | null): Promise<number | null> => {
  if (!time) return null;

  const { data: statistics, error } = await supabase
    .from('race_statistics')
    .select('*')
    .eq('distance', distance)
    .order('finish_time', { ascending: true });

  if (error || !statistics || statistics.length === 0) {
    console.error('Error fetching race statistics:', error);
    return null;
  }

  const timeInSeconds = intervalToSeconds(time);
  let totalTimes = statistics.length;
  let position = 0;

  // Find position of current time among all times
  for (let i = 0; i < statistics.length; i++) {
    const statTimeInSeconds = intervalToSeconds(statistics[i].finish_time);
    if (timeInSeconds <= statTimeInSeconds) {
      position = i;
      break;
    }
    if (i === statistics.length - 1) {
      position = statistics.length;
    }
  }

  // Calculate percentile (lower time = better percentile)
  const percentile = 100 - Math.round((position / totalTimes) * 100);
  
  // Ensure percentile is between 0 and 100
  return Math.max(0, Math.min(100, percentile));
};

const intervalToSeconds = (interval: string): number => {
  const [hours = "0", minutes = "0", seconds = "0"] = interval.split(':');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};