import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  onEdit: () => void;
}

export const ProfileActions = ({ isOwnProfile, onEdit }: ProfileActionsProps) => {
  if (!isOwnProfile) return null;

  return (
    <Button
      onClick={onEdit}
      className="absolute top-4 right-4 hover:bg-zinc-800/50"
      size="icon"
      variant="ghost"
    >
      <Pencil className="h-5 w-5 text-zinc-400" />
    </Button>
  );
};