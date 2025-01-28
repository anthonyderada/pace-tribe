import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ClubList from "./featured-clubs/ClubList";

const FeaturedClubs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['featuredClubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select(`
          *,
          club_members (
            id,
            user_id
          ),
          club_label_assignments (
            id,
            label_id,
            club_labels (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Clubs</h2>
          <Button 
            variant="link" 
            className="text-emerald-400 hover:text-emerald-300"
            onClick={() => navigate("/clubs")}
          >
            View All Clubs
          </Button>
        </div>
        <ClubList 
          clubs={clubs} 
          isLoading={isLoading}
          userId={user?.id}
        />
      </div>
    </section>
  );
};

export default FeaturedClubs;