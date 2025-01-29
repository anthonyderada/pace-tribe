import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface ProfileEditFormProps {
  username: string;
  location: string;
  bio: string;
  uploading: boolean;
  onUsernameChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onBioChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileEditForm = ({
  username,
  location,
  bio,
  uploading,
  onUsernameChange,
  onLocationChange,
  onBioChange,
  onSave,
  onCancel,
}: ProfileEditFormProps) => {
  return (
    <div className="space-y-4">
      <Input
        value={username}
        onChange={(e) => onUsernameChange(e.target.value)}
        placeholder="Username"
        className="max-w-xs"
      />
      <Input
        value={location}
        onChange={(e) => onLocationChange(e.target.value)}
        placeholder="Location"
        className="max-w-xs"
      />
      <Textarea
        value={bio}
        onChange={(e) => onBioChange(e.target.value)}
        placeholder="Tell us about your running goals and ambitions..."
        className="min-h-[100px]"
      />
      <div className="flex gap-2 justify-center md:justify-start">
        <Button
          onClick={onSave}
          className="border border-white bg-white text-black"
          variant="outline"
          disabled={uploading}
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={uploading}
          className="border border-white text-white bg-transparent"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};