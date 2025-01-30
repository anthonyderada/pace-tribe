import { supabase } from "@/integrations/supabase/client";

export const calculatePercentile = async (distance: string, time: string | null): Promise<number | null> => {
  if (!time) return null;

  const { data: statistics } = await supabase
    .from('race_statistics')
    .select('*')
    .eq('distance', distance)
    .order('percentile', { ascending: true });

  if (!statistics || statistics.length === 0) return null;

  const timeInSeconds = intervalToSeconds(time);
  
  // Find the appropriate percentile range
  for (let i = 0; i < statistics.length; i++) {
    const statTimeInSeconds = intervalToSeconds(statistics[i].finish_time);
    if (timeInSeconds <= statTimeInSeconds) {
      return statistics[i].percentile;
    }
  }
  
  // If slower than all percentiles, return lower than the lowest
  return statistics[0].percentile - 10;
};

const intervalToSeconds = (interval: string): number => {
  const [hours = "0", minutes = "0", seconds = "0"] = interval.split(':');
  return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
};