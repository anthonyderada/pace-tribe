import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal } from "lucide-react";

type PersonalBestsProps = {
  userId: string;
  accolades: {
    pb_5k: string | null;
    pb_10k: string | null;
    pb_half_marathon: string | null;
    pb_marathon: string | null;
  } | null;
  onAccoladesUpdate?: (accolades: PersonalBestsProps["accolades"]) => void;
  readOnly?: boolean;
};

export const PersonalBests = ({
  accolades,
  readOnly = false
}: PersonalBestsProps) => {
  const hasAnyPB = accolades && Object.values(accolades).some(value => value !== null);

  return (
    <Card className="border-0 bg-zinc-900/90">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-zinc-100">
          Personal Bests
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!hasAnyPB ? (
          <p className="text-zinc-400">No personal bests recorded yet</p>
        ) : (
          <div className="space-y-4">
            {accolades?.pb_5k && (
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                <span className="text-zinc-400">5K: {accolades.pb_5k}</span>
              </div>
            )}
            {accolades?.pb_10k && (
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                <span className="text-zinc-400">10K: {accolades.pb_10k}</span>
              </div>
            )}
            {accolades?.pb_half_marathon && (
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                <span className="text-zinc-400">Half Marathon: {accolades.pb_half_marathon}</span>
              </div>
            )}
            {accolades?.pb_marathon && (
              <div className="flex items-center gap-2">
                <Medal className="h-5 w-5 text-yellow-500" />
                <span className="text-zinc-400">Marathon: {accolades.pb_marathon}</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};