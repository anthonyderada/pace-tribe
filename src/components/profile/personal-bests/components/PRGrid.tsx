import { PRRecord } from "../PRRecord";

interface PRGridProps {
  accolades: {
    pb_5k: string | null;
    pb_10k: string | null;
    pb_half_marathon: string | null;
    pb_marathon: string | null;
  } | null;
  currentUserAccolades?: {
    pb_5k: string | null;
    pb_10k: string | null;
    pb_half_marathon: string | null;
    pb_marathon: string | null;
  } | null;
}

export const PRGrid = ({ accolades, currentUserAccolades }: PRGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <PRRecord
        title="5K"
        time={accolades?.pb_5k}
        currentUserTime={currentUserAccolades?.pb_5k}
        distanceKey="5k"
      />
      <PRRecord
        title="10K"
        time={accolades?.pb_10k}
        currentUserTime={currentUserAccolades?.pb_10k}
        distanceKey="10k"
      />
      <PRRecord
        title="Half Marathon"
        time={accolades?.pb_half_marathon}
        currentUserTime={currentUserAccolades?.pb_half_marathon}
        distanceKey="half_marathon"
      />
      <PRRecord
        title="Marathon"
        time={accolades?.pb_marathon}
        currentUserTime={currentUserAccolades?.pb_marathon}
        distanceKey="marathon"
      />
    </div>
  );
};