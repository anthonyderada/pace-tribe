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
        .select('*')
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
        <h1 className="text-4xl font-bold text-foreground mb-4">Running Clubs</h1>
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input 
              className="pl-10" 
              placeholder="Search clubs..." 
            />
          </div>
          {user && (
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => navigate('/clubs/new')}
            >
              Create Club
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          // Loading skeletons
          [...Array(6)].map((_, index) => (
            <Card key={`skeleton-${index}`} className="border-0">
              <CardHeader>
                <Skeleton className="h-6 w-2/3 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))
        ) : clubs && clubs.length > 0 ? (
          clubs.map((club) => (
            <Card key={club.id} className="border-0">
              <CardHeader>
                <CardTitle className="text-foreground">{club.name}</CardTitle>
                <CardDescription>
                  {club.location || 'Location not specified'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {club.description || 'No description available'}
                </p>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => navigate(`/clubs/${club.id}`)}
                >
                  View Club
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center text-muted-foreground">
            No clubs found
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;