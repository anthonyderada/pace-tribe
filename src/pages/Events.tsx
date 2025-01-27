import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Route, Timer, Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
          club:clubs(
            id,
            name,
            thumbnail_url
          ),
          participants:event_participants(user_id)
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
          {/* Temporarily hidden for testing
          {user && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate('/events/new')}
            >
              Create Event
            </Button>
          )}
          */}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="bg-zinc-800/50 rounded-2xl border-0">
              <div className="p-6">
                <Skeleton className="h-6 w-2/3 mb-2 bg-zinc-800" />
                <Skeleton className="h-4 w-1/3 bg-zinc-800" />
                <Skeleton className="h-20 mt-4 bg-zinc-800" />
              </div>
            </Card>
          ))
        ) : events && events.length > 0 ? (
          events.map((event) => (
            <Card 
              key={event.id} 
              className="bg-zinc-800/50 rounded-2xl p-6 hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
              onClick={() => navigate(`/events/${event.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                <span className="text-gray-400 text-sm">
                  {event.participants?.length || 0} participants
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                <Calendar className="h-4 w-4" />
                {format(new Date(event.date), "MMMM d, yyyy - h:mm a")}
              </div>
              {event.location && (
                <div className="flex items-center gap-2 text-gray-400 text-sm mb-2">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
              )}
              <div className="flex flex-wrap gap-4 mb-3">
                {event.distance && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Route className="h-4 w-4" />
                    {(Number(event.distance) * 0.621371).toFixed(1)} miles
                  </div>
                )}
                {event.pace && (
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <Timer className="h-4 w-4" />
                    {event.pace}
                  </div>
                )}
              </div>
              {event.club && (
                <div className="flex items-center gap-2 mb-4">
                  <Avatar className="h-6 w-6">
                    <AvatarImage 
                      src={event.club.thumbnail_url || ''} 
                      alt={event.club.name} 
                    />
                    <AvatarFallback>
                      <Users className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-gray-400 text-sm">
                    Organized by {event.club.name}
                  </span>
                </div>
              )}
              <p className="text-gray-400 line-clamp-3">
                {event.description || 'No description available'}
              </p>
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