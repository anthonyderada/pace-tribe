import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Pencil, Save, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

type ProfileHeaderProps = {
  profile: {
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
  } | null;
  user: {
    id: string;
    email?: string;
  } | null;
  onProfileUpdate: (updates: {
    username: string;
    bio: string;
    location: string;
    avatar_url?: string;
  }) => void;
};

export const ProfileHeader = ({ profile, user, onProfileUpdate }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user?.id);

      if (updateError) {
        throw updateError;
      }

      onProfileUpdate({ username, bio, location, avatar_url: publicUrl });
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          bio,
          location,
        })
        .eq('id', user?.id);

      if (error) throw error;

      onProfileUpdate({ username, bio, location });
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative p-6">
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
                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
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
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <label
              htmlFor="avatar-upload"
              className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity rounded-full ${
                profile?.avatar_url 
                  ? 'bg-black/50 opacity-0 group-hover:opacity-100' 
                  : ''
              }`}
            >
              {profile?.avatar_url && <Upload className="w-6 h-6 text-white" />}
            </label>
          </>
        )}
      </div>
      <div className="flex-1 text-center md:text-left">
        {user && !isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 hover:bg-zinc-800/50"
            size="icon"
            variant="ghost"
          >
            <Pencil className="h-5 w-5 text-zinc-400" />
          </Button>
        )}
        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="max-w-xs"
            />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="max-w-xs"
            />
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about your running goals and ambitions..."
              className="min-h-[100px]"
            />
            <div className="flex gap-2 justify-center md:justify-start">
              <Button
                onClick={handleUpdateProfile}
                className="border border-white bg-white text-black"
                variant="outline"
                disabled={uploading}
              >
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setUsername(profile?.username || "");
                  setLocation(profile?.location || "");
                  setBio(profile?.bio || "");
                }}
                disabled={uploading}
                className="border border-white text-white bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-zinc-100 mb-2">
              {profile?.username || user?.email}
            </h1>
            <p className="text-zinc-400 flex items-center justify-center md:justify-start gap-2 mb-4">
              {profile?.location || "Not set"}
            </p>
            <div className="space-y-4">
              <p className="text-zinc-400">
                {profile?.bio || "No bio added yet"}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};