import { Instagram, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialButtonsProps {
  instagramUsername?: string | null;
  stravaAthleteId?: string | null;
}

export const SocialButtons = ({ instagramUsername, stravaAthleteId }: SocialButtonsProps) => {
  return (
    <div className="flex gap-2 mt-2">
      {instagramUsername && (
        <a
          href={`https://instagram.com/${instagramUsername}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="icon"
            className="bg-gradient-to-br from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 border-0"
          >
            <Instagram className="h-5 w-5 text-white" />
          </Button>
        </a>
      )}
      {stravaAthleteId && (
        <a
          href={`https://www.strava.com/athletes/${stravaAthleteId}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            size="icon"
            className="bg-gradient-to-br from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 border-0"
          >
            <Activity className="h-5 w-5 text-white" />
          </Button>
        </a>
      )}
    </div>
  );
};