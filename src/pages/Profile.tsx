import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Edit2, Save, Trophy, Upload, Pencil, Route } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Profile = {
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  preferred_distance: string | null;
  comfortable_pace: string | null;
};

type Club = {
  id: string;
  name: string;
  location: string | null;
};

type Event = {
  id: string;
  title: string;
  date: string;
  location: string | null;
  club: {
    name: string;
  };
};

type Accolades = {
  personal_bests: string | null;
};

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [joinedClubs, setJoinedClubs] = useState<Club[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [accolades, setAccolades] = useState<Accolades | null>(null);
  const [isEditingAccolades, setIsEditingAccolades] = useState(false);
  const [personalBests, setPersonalBests] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preferredDistance, setPreferredDistance] = useState("");
  const [paceRange, setPaceRange] = useState([8]); // Default to 8 min/mile
  const [comfortablePace, setComfortablePace] = useState("");
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);

  // Helper function to format pace
  const formatPace = (pace: number) => {
    return `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, '0')} min/mile`;
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function getProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, bio, location, preferred_distance, comfortable_pace")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setPreferredDistance(data.preferred_distance || "");
        setComfortablePace(data.comfortable_pace || "");
        
        // Parse the pace from the stored format
        if (data.comfortable_pace) {
          const paceParts = data.comfortable_pace.split(':');
          if (paceParts.length === 2) {
            const minutes = parseInt(paceParts[0]);
            const seconds = parseInt(paceParts[1]);
            setPaceRange([minutes + (seconds / 60)]);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    async function getAccolades() {
      try {
        const { data, error } = await supabase
          .from("accolades")
          .select("personal_bests")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setAccolades(data);
        setPersonalBests(data.personal_bests || "");
      } catch (error) {
        console.error("Error fetching accolades:", error);
      }
    }

    async function getJoinedClubs() {
      try {
        const { data, error } = await supabase
          .from("club_members")
          .select(`
            club_id,
            clubs (
              id,
              name,
              location
            )
          `)
          .eq("user_id", user.id);

        if (error) throw error;

        const clubs = data.map(item => ({
          id: item.clubs.id,
          name: item.clubs.name,
          location: item.clubs.location
        }));

        setJoinedClubs(clubs);
      } catch (error) {
        console.error("Error fetching joined clubs:", error);
      }
    }

    async function getRegisteredEvents() {
      try {
        const { data, error } = await supabase
          .from("event_participants")
          .select(`
            event_id,
            events (
              id,
              title,
              date,
              location,
              clubs (
                name
              )
            )
          `)
          .eq("user_id", user.id);

        if (error) throw error;

        const events = data.map(item => ({
          id: item.events.id,
          title: item.events.title,
          date: item.events.date,
          location: item.events.location,
          club: {
            name: item.events.clubs.name
          }
        }));

        setRegisteredEvents(events);
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoading(false);
      }
    }

    getProfile();
    getAccolades();
    getJoinedClubs();
    getRegisteredEvents();

    const clubsChannel = supabase
      .channel('schema-db-changes-clubs')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'club_members',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          getJoinedClubs();
        }
      )
      .subscribe();

    const eventsChannel = supabase
      .channel('schema-db-changes-events')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'event_participants',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          getRegisteredEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(clubsChannel);
      supabase.removeChannel(eventsChannel);
    };
  }, [user, navigate]);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${user?.id}-${Math.random()}.${fileExt}`;

      setUploading(true);

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

      setProfile(prev => ({ ...prev!, avatar_url: publicUrl }));
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          username,
          bio,
          location
        })
        .eq("id", user?.id);

      if (error) throw error;

      setProfile(prev => ({ 
        ...prev!, 
        username,
        bio,
        location
      }));
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateAccolades = async () => {
    try {
      const { error } = await supabase
        .from("accolades")
        .update({ personal_bests: personalBests })
        .eq("user_id", user?.id);

      if (error) throw error;

      setAccolades(prev => ({ ...prev!, personal_bests: personalBests }));
      setIsEditingAccolades(false);
      toast({
        title: "Personal bests updated",
        description: "Your personal bests have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating personal bests:", error);
      toast({
        title: "Error",
        description: "Failed to update personal bests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUpdatePreferences = async () => {
    try {
      const formattedPace = `${formatPace(paceRange[0])}`;
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          preferred_distance: preferredDistance,
          comfortable_pace: formattedPace
        })
        .eq("id", user?.id);

      if (error) throw error;

      setProfile(prev => ({ 
        ...prev!, 
        preferred_distance: preferredDistance,
        comfortable_pace: formattedPace
      }));
      setIsEditingPreferences(false);
      toast({
        title: "Preferences updated",
        description: "Your running preferences have been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-0 bg-zinc-900/90">
        <CardHeader className="relative">
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 bg-transparent text-zinc-400"
              size="icon"
              variant="ghost"
            >
              <Pencil className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          )}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
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
                    <MapPin className="h-4 w-4" />
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
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-0 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Route className="h-5 w-5" />
              Running Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingPreferences ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Preferred Race Distance
                  </label>
                  <Select
                    value={preferredDistance}
                    onValueChange={setPreferredDistance}
                  >
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue placeholder="Select preferred distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5k">5k</SelectItem>
                      <SelectItem value="10k">10k</SelectItem>
                      <SelectItem value="Half Marathon">Half Marathon</SelectItem>
                      <SelectItem value="Marathon">Marathon</SelectItem>
                      <SelectItem value="Ultras">Ultras</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Comfortable Pace
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={paceRange}
                      onValueChange={setPaceRange}
                      min={5}
                      max={15}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="text-white text-sm">
                      {formatPace(paceRange[0])}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdatePreferences}
                    className="border border-white bg-white text-black"
                    variant="outline"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingPreferences(false);
                      setPreferredDistance(profile?.preferred_distance || "");
                      setComfortablePace(profile?.comfortable_pace || "");
                    }}
                    className="border border-white text-white bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Button
                  onClick={() => setIsEditingPreferences(true)}
                  className="absolute top-0 right-0 bg-transparent text-zinc-400"
                  size="icon"
                  variant="ghost"
                >
                  <Pencil className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                      Preferred race distance
                    </h3>
                    <p className="text-zinc-400">
                      {profile?.preferred_distance || "Not set"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                      Comfortable pace
                    </h3>
                    <p className="text-zinc-400">
                      {profile?.comfortable_pace || "Not set"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Trophy className="h-5 w-5" />
              Personal Bests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditingAccolades ? (
              <div className="space-y-4">
                <Textarea
                  value={personalBests}
                  onChange={(e) => setPersonalBests(e.target.value)}
                  placeholder="Enter your personal best times..."
                  className="min-h-[150px]"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleUpdateAccolades}
                    className="border border-white bg-white text-black"
                    variant="outline"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditingAccolades(false);
                      setPersonalBests(accolades?.personal_bests || "");
                    }}
                    className="border border-white text-white bg-transparent"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative">
                <Button
                  onClick={() => setIsEditingAccolades(true)}
                  className="absolute top-0 right-0 bg-transparent text-zinc-400"
                  size="icon"
                  variant="ghost"
                >
                  <Pencil className="h-5 w-5 md:h-6 md:w-6" />
                </Button>
                <p className="text-zinc-400 whitespace-pre-line mb-4">
                  {accolades?.personal_bests || "No personal bests recorded yet"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Users className="h-5 w-5" />
              My Clubs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {joinedClubs.length > 0 ? (
              <div className="space-y-4">
                {joinedClubs.map((club) => (
                  <Card 
                    key={club.id}
                    className="border-0 bg-zinc-800/90 cursor-pointer hover:bg-zinc-700/90 transition-colors"
                    onClick={() => navigate(`/clubs/${club.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-zinc-100">{club.name}</CardTitle>
                      {club.location && (
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {club.location}
                        </p>
                      )}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No clubs joined yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 bg-zinc-900/90">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-zinc-100">
              <Calendar className="h-5 w-5" />
              Registered Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {registeredEvents.length > 0 ? (
              <div className="space-y-4">
                {registeredEvents.map((event) => (
                  <Card 
                    key={event.id}
                    className="border-0 bg-zinc-800/90 cursor-pointer hover:bg-zinc-700/90 transition-colors"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg text-zinc-100">{event.title}</CardTitle>
                      <div className="space-y-2">
                        <p className="text-sm text-zinc-400 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(event.date), "MMMM d, yyyy - h:mm a")}
                        </p>
                        {event.location && (
                          <p className="text-sm text-zinc-400 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </p>
                        )}
                        <p className="text-sm text-zinc-400">
                          Organized by {event.club.name}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400">No events registered yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
