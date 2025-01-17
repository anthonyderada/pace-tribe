import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const Clubs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: clubs, isLoading, error } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select(`
          *,
          club_members (
            id,
            user_id
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (error) {
    console.error('Error loading clubs:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-zinc-100 mb-4">Running Clubs</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
            <Input 
              className="pl-10 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
              placeholder="Search clubs..." 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          [...Array(6)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="bg-zinc-800/50 rounded-2xl border-0">
              <CardContent className="p-0">
                <Skeleton className="h-48 rounded-t-2xl bg-zinc-800" />
                <div className="p-6">
                  <Skeleton className="h-6 w-2/3 mb-2 bg-zinc-800" />
                  <Skeleton className="h-4 w-1/3 bg-zinc-800" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : clubs && clubs.length > 0 ? (
          clubs.map((club) => (
            <Card 
              key={club.id} 
              className="bg-zinc-800/50 rounded-2xl overflow-hidden hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
              onClick={() => navigate(`/clubs/${club.id}`)}
            >
              <CardContent className="p-0">
                {club.thumbnail_url ? (
                  <img 
                    src={club.thumbnail_url} 
                    alt={club.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-zinc-700 flex items-center justify-center">
                    <span className="text-zinc-400">No image</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-white">{club.name}</h3>
                    <span className="text-gray-400 text-sm">{club.club_members?.length || 0} members</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">{club.location || 'Location not specified'}</p>
                  <p className="text-gray-400 line-clamp-3 mt-2">{club.description || 'No description available'}</p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-zinc-400">
            No clubs found
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;