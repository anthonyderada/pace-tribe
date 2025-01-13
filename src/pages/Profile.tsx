import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Edit2, Save, Trophy, Upload, Pencil, Route, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
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
  seeking_training_partners: boolean | null;
  seeking_casual_meetups: boolean | null;
  seeking_race_pacers: boolean | null;
  preferred_shoe_brand: string[] | null;
};

type Accolades = {
  pb_5k: string | null;
  pb_10k: string | null;
  pb_half_marathon: string | null;
  pb_marathon: string | null;
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

const TimeInput = ({ 
  hours, 
  minutes, 
  seconds, 
  onChange 
}: { 
  hours: string; 
  minutes: string; 
  seconds: string; 
  onChange: (time: { hours: string; minutes: string; seconds: string }) => void;
}) => {
  const validateTimeValue = (value: string, max: number) => {
    const num = parseInt(value);
    if (isNaN(num)) return "00";
    if (num < 0) return "00";
    if (num > max) return max.toString().padStart(2, '0');
    return num.toString().padStart(2, '0');
  };

  const handleChange = (field: 'hours' | 'minutes' | 'seconds', value: string) => {
    const newValue = validateTimeValue(value, field === 'hours' ? 99 : 59);
    onChange({
      hours: field === 'hours' ? newValue : hours,
      minutes: field === 'minutes' ? newValue : minutes,
      seconds: field === 'seconds' ? newValue : seconds,
    });
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="number"
        min="0"
        max="99"
        value={hours}
        onChange={(e) => handleChange('hours', e.target.value)}
        className="w-20"
        placeholder="hr"
      />
      <span className="text-zinc-400">:</span>
      <Input
        type="number"
        min="0"
        max="59"
        value={minutes}
        onChange={(e) => handleChange('minutes', e.target.value)}
        className="w-20"
        placeholder="min"
      />
      <span className="text-zinc-400">:</span>
      <Input
        type="number"
        min="0"
        max="59"
        value={seconds}
        onChange={(e) => handleChange('seconds', e.target.value)}
        className="w-20"
        placeholder="sec"
      />
    </div>
  );
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
  const [pb5kTime, setPb5kTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [pb10kTime, setPb10kTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [pbHalfTime, setPbHalfTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [pbMarathonTime, setPbMarathonTime] = useState({ hours: "00", minutes: "00", seconds: "00" });
  const [uploading, setUploading] = useState(false);
  const [preferredDistance, setPreferredDistance] = useState("");
  const [paceRange, setPaceRange] = useState([6, 7]);
  const [comfortablePace, setComfortablePace] = useState("");
  const [isEditingPreferences, setIsEditingPreferences] = useState(false);
  const [seekingTrainingPartners, setSeekingTrainingPartners] = useState(false);
  const [seekingCasualMeetups, setSeekingCasualMeetups] = useState(false);
  const [seekingRacePacers, setSeekingRacePacers] = useState(false);
  const [preferredShoeBrands, setPreferredShoeBrands] = useState<string[]>([]);

  const formatTimeToInterval = (time: { hours: string; minutes: string; seconds: string }) => {
    return `${time.hours}:${time.minutes}:${time.seconds}`;
  };

  const parseIntervalToTime = (interval: string | null) => {
    if (!interval) return { hours: "00", minutes: "00", seconds: "00" };
    const [hours = "00", minutes = "00", seconds = "00"] = interval.split(':');
    return {
      hours: hours.padStart(2, '0'),
      minutes: minutes.padStart(2, '0'),
      seconds: seconds.padStart(2, '0')
    };
  };

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

      setProfile(prev => ({ ...prev!, avatar_url: publicUrl }));
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

      setProfile(prev => ({
        ...prev!,
        username,
        bio,
        location,
      }));
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

  const handleUpdateAccolades = async () => {
    try {
      const { error } = await supabase
        .from("accolades")
        .update({
          pb_5k: formatTimeToInterval(pb5kTime),
          pb_10k: formatTimeToInterval(pb10kTime),
          pb_half_marathon: formatTimeToInterval(pbHalfTime),
          pb_marathon: formatTimeToInterval(pbMarathonTime),
        })
        .eq("user_id", user?.id);

      if (error) throw error;

      setAccolades({
        pb_5k: formatTimeToInterval(pb5kTime),
        pb_10k: formatTimeToInterval(pb10kTime),
        pb_half_marathon: formatTimeToInterval(pbHalfTime),
        pb_marathon: formatTimeToInterval(pbMarathonTime),
      });
      setIsEditingAccolades(false);
      toast({
        title: "Personal bests updated",
        description: "Your personal best times have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update personal bests. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatPace = (pace: number) => {
    return `${Math.floor(pace)}:${((pace % 1) * 60).toFixed(0).padStart(2, '0')} min/mile`;
  };

  const formatPaceRange = (range: number[]) => {
    return `${formatPace(range[0])} - ${formatPace(range[1])}`;
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
          .select("username, avatar_url, bio, location, preferred_distance, comfortable_pace, seeking_training_partners, seeking_casual_meetups, seeking_race_pacers, preferred_shoe_brand")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setPreferredDistance(data.preferred_distance || "");
        setComfortablePace(data.comfortable_pace || "");
        setSeekingTrainingPartners(data.seeking_training_partners || false);
        setSeekingCasualMeetups(data.seeking_casual_meetups || false);
        setSeekingRacePacers(data.seeking_race_pacers || false);
        setPreferredShoeBrands(data.preferred_shoe_brand || []);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    }

    async function getAccolades() {
      try {
        const { data, error } = await supabase
          .from("accolades")
          .select("pb_5k, pb_10k, pb_half_marathon, pb_marathon")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setAccolades({
          pb_5k: data.pb_5k as string | null,
          pb_10k: data.pb_10k as string | null,
          pb_half_marathon: data.pb_half_marathon as string | null,
          pb_marathon: data.pb_marathon as string | null
        });
        setPb5kTime(parseIntervalToTime(data.pb_5k));
        setPb10kTime(parseIntervalToTime(data.pb_10k));
        setPbHalfTime(parseIntervalToTime(data.pb_half_marathon));
        setPbMarathonTime(parseIntervalToTime(data.pb_marathon));
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

  const handleUpdatePreferences = async () => {
    try {
      const formattedPaceRange = formatPaceRange(paceRange);
      
      const { error } = await supabase
        .from("profiles")
        .update({ 
          preferred_distance: preferredDistance,
          comfortable_pace: formattedPaceRange,
          seeking_training_partners: seekingTrainingPartners,
          seeking_casual_meetups: seekingCasualMeetups,
          seeking_race_pacers: seekingRacePacers,
          preferred_shoe_brand: preferredShoeBrands
        })
        .eq("id", user?.id);

      if (error) throw error;

      setProfile(prev => ({ 
        ...prev!, 
        preferred_distance: preferredDistance,
        comfortable_pace: formattedPaceRange,
        seeking_training_partners: seekingTrainingPartners,
        seeking_casual_meetups: seekingCasualMeetups,
        seeking_race_pacers: seekingRacePacers,
        preferred_shoe_brand: preferredShoeBrands
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

  const shoeBrands = [
    "Nike",
    "Hoka",
    "ON",
    "Asics",
    "Saucony",
    "Brooks",
    "Adidas",
    "Mizuno",
    "Altra",
    "New Balance",
    "Salomon",
    "La Sportiva",
    "Merrel",
    "Topo Athletic"
  ];

  const toggleShoeBrand = (brand: string) => {
    setPreferredShoeBrands(current => {
      if (current.includes(brand)) {
        return current.filter(b => b !== brand);
      } else {
        return [...current, brand];
      }
    });
  };

  const getConnectionPreferences = () => {
    const preferences = [];
    if (profile?.seeking_training_partners) preferences.push("Looking for Training Partners");
    if (profile?.seeking_casual_meetups) preferences.push("Interested in Casual Meetups");
    if (profile?.seeking_race_pacers) preferences.push("Looking for Race Day Pacers");
    return preferences.length > 0 ? preferences : ["No preference"];
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
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Preferred Shoe Brands
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {shoeBrands.map((brand) => (
                      <div key={brand} className="flex items-center space-x-2">
                        <Checkbox
                          id={`shoe-brand-${brand}`}
                          checked={preferredShoeBrands.includes(brand)}
                          onCheckedChange={() => toggleShoeBrand(brand)}
                          className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                        />
                        <label
                          htmlFor={`shoe-brand-${brand}`}
                          className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">
                    Comfortable Pace Range
                  </label>
                  <div className="space-y-2">
                    <Slider
                      value={paceRange}
                      onValueChange={setPaceRange}
                      min={4.5}
                      max={10}
                      step={0.25}
                      className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white [&_[role=slider]]:shadow-sm [&_[role=slider]]:ring-white [&_[role=slider]]:ring-offset-black [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-white [&_[role=slider]]:focus:ring-offset-2 [&_[role=slider]]:focus:ring-offset-black [&_[role=slider]]:hover:border-white/80 [&_[role=slider]]:active:border-white/70 [&_[role=track]]:bg-zinc-700 [&_[role=range]]:bg-white"
                    />
                    <div className="text-white text-sm">
                      {formatPaceRange(paceRange)}
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-sm text-zinc-400 block">
                    Connection Preferences
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="training-partners"
                        checked={seekingTrainingPartners}
                        onCheckedChange={(checked) => 
                          setSeekingTrainingPartners(checked as boolean)
                        }
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor="training-partners"
                        className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Looking for Training Partners
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="casual-meetups"
                        checked={seekingCasualMeetups}
                        onCheckedChange={(checked) => 
                          setSeekingCasualMeetups(checked as boolean)
                        }
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor="casual-meetups"
                        className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Interested in Casual Meetups
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="race-pacers"
                        checked={seekingRacePacers}
                        onCheckedChange={(checked) => 
                          setSeekingRacePacers(checked as boolean)
                        }
                        className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label
                        htmlFor="race-pacers"
                        className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Looking for Race Day Pacers
                      </label>
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
                      setSeekingTrainingPartners(profile?.seeking_training_partners || false);
                      setSeekingCasualMeetups(profile?.seeking_casual_meetups || false);
                      setSeekingRacePacers(profile?.seeking_race_pacers || false);
                      setPreferredShoeBrands(profile?.preferred_shoe_brand || []);
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
                      Preferred shoe brands
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {profile?.preferred_shoe_brand && profile.preferred_shoe_brand.length > 0 ? (
                        profile.preferred_shoe_brand.map((brand) => (
                          <span
                            key={brand}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-100"
                          >
                            {brand}
                          </span>
                        ))
                      ) : (
                        <p className="text-zinc-400">No preference</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                      Comfortable pace
                    </h3>
                    <p className="text-zinc-400">
                      {profile?.comfortable_pace || "Not set"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100 mb-2">
                      Connection Preferences
                    </h3>
                    <div className="space-y-1">
                      {getConnectionPreferences().map((preference, index) => (
                        <p key={index} className="text-zinc-400 flex items-center gap-2">
                          <UserPlus className="h-4 w-4" />
                          {preference}
                        </p>
                      ))}
                    </div>
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
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">5K</label>
                  <TimeInput
                    hours={pb5kTime.hours}
                    minutes={pb5kTime.minutes}
                    seconds={pb5kTime.seconds}
                    onChange={setPb5kTime}
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">10K</label>
                  <TimeInput
                    hours={pb10kTime.hours}
                    minutes={pb10kTime.minutes}
                    seconds={pb10kTime.seconds}
                    onChange={setPb10kTime}
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Half Marathon</label>
                  <TimeInput
                    hours={pbHalfTime.hours}
                    minutes={pbHalfTime.minutes}
                    seconds={pbHalfTime.seconds}
                    onChange={setPbHalfTime}
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">Marathon</label>
                  <TimeInput
                    hours={pbMarathonTime.hours}
                    minutes={pbMarathonTime.minutes}
                    seconds={pbMarathonTime.seconds}
                    onChange={setPbMarathonTime}
                  />
                </div>
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
                      setPb5kTime(parseIntervalToTime(accolades?.pb_5k));
                      setPb10kTime(parseIntervalToTime(accolades?.pb_10k));
                      setPbHalfTime(parseIntervalToTime(accolades?.pb_half_marathon));
                      setPbMarathonTime(parseIntervalToTime(accolades?.pb_marathon));
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
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">5K</h3>
                    <p className="text-zinc-400">{accolades?.pb_5k || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">10K</h3>
                    <p className="text-zinc-400">{accolades?.pb_10k || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Half Marathon</h3>
                    <p className="text-zinc-400">{accolades?.pb_half_marathon || "Not set"}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">Marathon</h3>
                    <p className="text-zinc-400">{accolades?.pb_marathon || "Not set"}</p>
                  </div>
                </div>
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

