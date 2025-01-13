import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, Users, Edit2, Save, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

type Profile = {
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
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

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function getProfile() {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("username, avatar_url, bio, location")
          .eq("id", user.id)
          .single();

        if (error) throw error;

        setProfile(data);
        setUsername(data.username || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
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

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8 border-0 bg-zinc-900/90">
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-full bg-emerald-600 flex items-center justify-center">
              <span className="text-4xl text-white">
                {profile?.username?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </span>
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
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
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
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
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
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-zinc-400 whitespace-pre-line mb-4">
                  {accolades?.personal_bests || "No personal bests recorded yet"}
                </p>
                <Button
                  onClick={() => setIsEditingAccolades(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Personal Bests
                </Button>
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
