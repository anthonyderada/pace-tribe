import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const Events = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          clubs (
            name
          ),
          event_participants (
            user_id
          )
        `)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  if (error) {
    console.error('Error loading events:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">Running Events</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <Input 
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
              placeholder="Search events..." 
            />
          </div>
          {user && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate('/events/new')}
            >
              Create Event
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="border-0 bg-zinc-900/50">
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2 bg-zinc-800" />
                <Skeleton className="h-4 w-1/3 bg-zinc-800" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 mb-4 bg-zinc-800" />
                <Skeleton className="h-10 w-full bg-zinc-800" />
              </CardContent>
            </Card>
          ))
        ) : events && events.length > 0 ? (
          events.map((event) => (
            <Card key={event.id} className="border-0 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors">
              <CardHeader>
                <CardTitle className="text-zinc-100">{event.title}</CardTitle>
                <CardDescription className="text-zinc-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {format(new Date(event.date), "MMMM d, yyyy - h:mm a")}
                </CardDescription>
                <CardDescription className="text-zinc-400">
                  Organized by {event.clubs?.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 mb-4">
                  {event.description || 'No description available'}
                </p>
                <div className="text-zinc-400 mb-4">
                  {event.location || 'Location TBD'}
                </div>
                <div className="text-zinc-400 mb-4">
                  {event.event_participants?.length || 0} participants
                </div>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  View Event
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-zinc-400">
            No events found
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;