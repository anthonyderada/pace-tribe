import { useAuth } from "@/contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ProfileContainer } from "@/components/profile/ProfileContainer";
import { ProfileContent } from "@/components/profile/ProfileContent";
import { LoadingState } from "@/components/profile/LoadingState";
import { useProfileData } from "@/hooks/useProfileData";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: profileId } = useParams();
  const { toast } = useToast();
  
  const {
    profile,
    accolades,
    joinedClubs,
    registeredEvents,
    isLoading,
    error
  } = useProfileData(profileId);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (error) {
      console.error("Profile error:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [error, navigate, toast]);

  if (!user) return null;
  if (isLoading) return <LoadingState />;
  if (!profile) return null;

  const isOwnProfile = user?.id === profileId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black text-white pb-12">
      <ProfileContainer
        profile={profile}
        user={user}
        isOwnProfile={isOwnProfile}
        onProfileUpdate={(updates) => {
          toast({
            title: "Success",
            description: "Profile updated successfully.",
          });
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProfileContent
          userId={profileId}
          profile={profile}
          accolades={accolades}
          joinedClubs={joinedClubs || []}
          registeredEvents={registeredEvents || []}
          isEditable={isOwnProfile}
          onPreferencesUpdate={(preferences) => {
            toast({
              title: "Success",
              description: "Preferences updated successfully.",
            });
          }}
          onAccoladesUpdate={(newAccolades) => {
            toast({
              title: "Success",
              description: "Personal bests updated successfully.",
            });
          }}
        />
      </div>
    </div>
  );
};

export default Profile;