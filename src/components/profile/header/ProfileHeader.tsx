import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProfileAvatar } from "./ProfileAvatar";
import { ProfileInfo } from "./ProfileInfo";
import { ProfileEditForm } from "./ProfileEditForm";
import { ImageCropDialog } from "./ImageCropDialog";
import { ProfileActions } from "./ProfileActions";

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
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (imageData: string) => {
    if (!imageData) return;
    
    try {
      setUploading(true);
      const response = await fetch(imageData);
      const blob = await response.blob();
      const filePath = `${user?.id}-${Math.random()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('assets')
        .upload(filePath, blob, {
          contentType: 'image/jpeg'
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      onProfileUpdate({ 
        username, 
        bio, 
        location, 
        avatar_url: publicUrl 
      });
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
      
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
            isOwnProfile={user?.id === profile.id}
          />
        )
      )}

      <ProfileActions 
        isOwnProfile={user?.id === profile?.id} 
        onEdit={() => setIsEditing(true)} 
      />
    </div>
  );
};