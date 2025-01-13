import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

type Club = {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  created_at: string;
};

type Event = {
  id: string;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  club_id: string;
  event_participants: { id: string }[];
};

const ClubDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [club, setClub] = useState<Club | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMember, setIsMember] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    async function getClubDetails() {
      try {
        // Get club details
        const { data: clubData, error: clubError } = await supabase
          .from("clubs")
          .select("*")
          .eq("id", id)
          .single();

        if (clubError) throw clubError;
        setClub(clubData);

        // Get club events
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select(`
            *,
            event_participants(id)
          `)
          .eq("club_id", id)
          .gte("date", new Date().toISOString())
          .order("date", { ascending: true });

        if (eventsError) throw eventsError;
        setEvents(eventsData);

        // Get member count
        const { count, error: countError } = await supabase
          .from("club_members")
          .select("*", { count: 'exact', head: true })
          .eq("club_id", id);

        if (countError) throw countError;
        setMemberCount(count || 0);

        // Check if current user is a member
        if (user) {
          const { data: memberData, error: memberError } = await supabase
            .from("club_members")
            .select("*")
            .eq("club_id", id)
            .eq("user_id", user.id)
            .maybeSingle();

          if (memberError) throw memberError;
          setIsMember(!!memberData);
        }
      } catch (error) {
        console.error("Error fetching club details:", error);
        toast({
          title: "Error",
          description: "Failed to load club details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    getClubDetails();

    // Set up real-time subscription for member count and events
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'club_members',
          filter: `club_id=eq.${id}`
        },
        async () => {
          // Update member count
          const { count } = await supabase
            .from("club_members")
            .select("*", { count: 'exact', head: true })
            .eq("club_id", id);
          
          setMemberCount(count || 0);

          // Update membership status if user is logged in
          if (user) {
            const { data } = await supabase
              .from("club_members")
              .select("*")
              .eq("club_id", id)
              .eq("user_id", user.id)
              .maybeSingle();
            
            setIsMember(!!data);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `club_id=eq.${id}`
        },
        async () => {
          // Update events list
          const { data } = await supabase
            .from("events")
            .select(`
              *,
              event_participants(id)
            `)
            .eq("club_id", id)
            .gte("date", new Date().toISOString())
            .order("date", { ascending: true });
          
          if (data) setEvents(data);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, user, toast]);

  const handleJoinClub = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setIsJoining(true);
    try {
      const { error } = await supabase
        .from("club_members")
        .insert({
          club_id: id,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have successfully joined the club!",
      });
    } catch (error) {
      console.error("Error joining club:", error);
      toast({
        title: "Error",
        description: "Failed to join the club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveClub = async () => {
    setIsJoining(true);
    try {
      const { error } = await supabase
        .from("club_members")
        .delete()
        .eq("club_id", id)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "You have left the club.",
      });
    } catch (error) {
      console.error("Error leaving club:", error);
      toast({
        title: "Error",
        description: "Failed to leave the club. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  if (isLoading || !club) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-4xl font-bold text-zinc-100">{club.name}</CardTitle>
          {club.location && (
            <CardDescription className="flex items-center gap-2 text-zinc-400">
              <MapPin className="h-4 w-4" />
              {club.location}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-zinc-100">About</h3>
            <p className="text-zinc-400">
              {club.description || "No description available."}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-400">{memberCount} members</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-400">
                  Founded {new Date(club.created_at).getFullYear()}
                </span>
              </div>
            </div>
          </div>
          {user ? (
            <div className="flex gap-2 mt-8">
              <Button
                onClick={isMember ? handleLeaveClub : handleJoinClub}
                className={isMember 
                  ? "w-full border border-white text-white bg-transparent hover:bg-white/10"
                  : "w-full border border-white bg-white text-black hover:bg-gray-100"}
                variant="outline"
                disabled={isJoining}
              >
                {isJoining ? "Processing..." : (isMember ? "Unfollow" : "Follow")}
              </Button>
            </div>
          ) : (
            <Button 
              className="w-full mt-8 border border-white bg-white text-black hover:bg-gray-100"
              variant="outline"
              onClick={() => navigate('/login')}
            >
              Login to Follow
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-zinc-100">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length > 0 ? (
              events.map((event) => (
                <Card 
                  key={event.id}
                  className="border border-zinc-800 bg-zinc-800/50 rounded-xl cursor-pointer hover:bg-zinc-800/80 transition-colors"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-zinc-100">{event.title}</CardTitle>
                    <CardDescription className="text-zinc-400">
                      {format(new Date(event.date), "MMMM d, yyyy - h:mm a")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-zinc-400 mb-2">
                      {event.description || "No description available."}
                    </p>
                    {event.location && (
                      <div className="flex items-center gap-2 text-zinc-400 text-sm">
                        <MapPin className="h-4 w-4" />
                        {event.location}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-zinc-400 text-sm mt-2">
                      <Users className="h-4 w-4" />
                      {event.event_participants.length} participants
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-zinc-400">No upcoming events scheduled.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;