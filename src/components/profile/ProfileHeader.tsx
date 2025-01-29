import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProfileAvatar } from "./header/ProfileAvatar";
import { ProfileEditForm } from "./header/ProfileEditForm";
import { ProfileInfo } from "./header/ProfileInfo";

type ProfileHeaderProps = {
  profile: {
    id: string;
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

  const { data: captainRoles } = useQuery({
    queryKey: ['captainRoles', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('club_members')
        .select(`
          role,
          clubs (
            id,
            name
          )
        `)
        .eq('user_id', user?.id)
        .eq('role', 'captain');
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

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
    } catch (error: any) {
      console.error('Error uploading image:', error);
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
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative p-6">
      <ProfileAvatar
        isEditing={isEditing}
        uploading={uploading}
        profile={profile}
        userEmail={user?.email}
        onImageUpload={handleImageUpload}
      />
      <div className="flex-1 text-center md:text-left w-full">
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
          <ProfileEditForm
            username={username}
            location={location}
            bio={bio}
            uploading={uploading}
            onUsernameChange={setUsername}
            onLocationChange={setLocation}
            onBioChange={setBio}
            onSave={handleUpdateProfile}
            onCancel={() => {
              setIsEditing(false);
              setUsername(profile?.username || "");
              setLocation(profile?.location || "");
              setBio(profile?.bio || "");
            }}
          />
        ) : (
          profile && (
            <ProfileInfo
              profile={profile}
              captainRoles={captainRoles}
              isOwnProfile={user?.id === profile.id}
            />
          )
        )}
      </div>
    </div>
  );
};