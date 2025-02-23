import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProfileAvatar } from "./header/ProfileAvatar";
import { ProfileEditForm } from "./header/ProfileEditForm";
import { ProfileInfo } from "./header/ProfileInfo";
import { ImageCropDialog } from "./header/ImageCropDialog";

type ProfileHeaderProps = {
  profile: {
    id: string;
    username: string | null;
    avatar_url: string | null;
    bio: string | null;
    location: string | null;
    instagram_username: string | null;
    strava_athlete_id: string | null;
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
    instagram_username?: string;
    strava_athlete_id?: string;
  }) => void;
};

export const ProfileHeader = ({ profile, user, onProfileUpdate }: ProfileHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile?.username || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [location, setLocation] = useState(profile?.location || "");
  const [instagramUsername, setInstagramUsername] = useState(profile?.instagram_username || "");
  const [stravaAthleteId, setStravaAthleteId] = useState(profile?.strava_athlete_id || "");
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  const handleImageUpload = async (imageData: string) => {
    if (!imageData) return;
    
    try {
      setUploading(true);
      
      // Convert base64 to blob
      const response = await fetch(imageData);
      const blob = await response.blob();
      
      const filePath = `${user?.id}-${Math.random()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, blob, {
          contentType: 'image/jpeg'
        });

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
      
      // Close the crop dialog after successful upload
      setCropDialogOpen(false);
      setSelectedImage(null);
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

  return (
    <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative p-6">
      <ProfileAvatar
        isEditing={isEditing}
        uploading={uploading}
        profile={profile}
        userEmail={user?.email}
        onImageSelect={(imageData) => {
          setSelectedImage(imageData);
          setCropDialogOpen(true);
        }}
      />
      {selectedImage && (
        <ImageCropDialog
          open={cropDialogOpen}
          onClose={() => {
            setCropDialogOpen(false);
            setSelectedImage(null);
          }}
          imageSrc={selectedImage}
          onCropComplete={handleImageUpload}
        />
      )}
      {isEditing ? (
        <ProfileEditForm
          username={username}
          location={location}
          bio={bio}
          instagramUsername={instagramUsername}
          stravaAthleteId={stravaAthleteId}
          uploading={uploading}
          onUsernameChange={setUsername}
          onLocationChange={setLocation}
          onBioChange={setBio}
          onInstagramUsernameChange={setInstagramUsername}
          onStravaAthleteIdChange={setStravaAthleteId}
          onSave={() => {
            onProfileUpdate({
              username,
              bio,
              location,
              instagram_username: instagramUsername,
              strava_athlete_id: stravaAthleteId
            });
            setIsEditing(false);
          }}
          onCancel={() => {
            setIsEditing(false);
            setUsername(profile?.username || "");
            setLocation(profile?.location || "");
            setBio(profile?.bio || "");
            setInstagramUsername(profile?.instagram_username || "");
            setStravaAthleteId(profile?.strava_athlete_id || "");
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
    </div>
  );
};