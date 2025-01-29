import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";

interface ProfileAvatarProps {
  isEditing: boolean;
  uploading: boolean;
  profile: {
    avatar_url: string | null;
    username: string | null;
  } | null;
  userEmail?: string;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({
  isEditing,
  uploading,
  profile,
  userEmail,
  onImageUpload,
}: ProfileAvatarProps) => {
  return (
    <div className="relative group">
      <Avatar className="w-32 h-32">
        {isEditing ? (
          <>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-gray-500/20 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src={profile?.avatar_url || undefined} />
            <AvatarFallback className="bg-emerald-600 text-4xl text-white">
              {profile?.username?.[0]?.toUpperCase() || userEmail?.[0]?.toUpperCase()}
            </AvatarFallback>
          </>
        )}
      </Avatar>
      {isEditing && (
        <>
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            id="avatar-upload"
            onChange={onImageUpload}
            disabled={uploading}
          />
          <label
            htmlFor="avatar-upload"
            className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity rounded-full ${
              profile?.avatar_url ? "bg-black/50 opacity-0 group-hover:opacity-100" : ""
            }`}
          >
            {profile?.avatar_url && <Upload className="w-6 h-6 text-white" />}
          </label>
        </>
      )}
    </div>
  );
};