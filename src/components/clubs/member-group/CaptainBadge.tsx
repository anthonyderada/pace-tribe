import { Crown } from "lucide-react";

interface CaptainBadgeProps {
  size?: "sm" | "md";
}

export const CaptainBadge = ({ size = "md" }: CaptainBadgeProps) => {
  const iconSize = size === "sm" ? "h-2.5 w-2.5" : "h-3 w-3";
  
  return (
    <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-0.5" title="Club Captain">
      <Crown className={`${iconSize} text-zinc-900`} />
    </div>
  );
};