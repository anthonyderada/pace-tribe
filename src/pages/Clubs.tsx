import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
          {/* Temporarily hidden for testing
          {user && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate('/clubs/new')}
            >
              Create Club
            </Button>
          )}
          */}
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
              </CardContent>
            </Card>
          ))
        ) : clubs && clubs.length > 0 ? (
          clubs.map((club) => (
            <Card 
              key={club.id} 
              className="border-0 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors cursor-pointer"
              onClick={() => navigate(`/clubs/${club.id}`)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-zinc-100">{club.name}</CardTitle>
                  <span className="text-sm text-zinc-400">
                    {club.club_members?.length || 0} members
                  </span>
                </div>
                <CardDescription className="text-zinc-400">
                  {club.location || 'Location not specified'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-400 line-clamp-3">
                  {club.description || 'No description available'}
                </p>
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