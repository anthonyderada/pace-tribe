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
    <div className="py-8">
      <div 
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 rounded-3xl p-8 shadow-2xl"
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(0, 0, 0, 0.4),
              rgba(0, 0, 0, 0.6)
            ),
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.015) 0px,
              rgba(255, 255, 255, 0.015) 1px,
              transparent 1px,
              transparent 4px
            )
          `,
          boxShadow: `
            0 0 0 1px rgba(255, 255, 255, 0.05),
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06)
          `
        }}
      >
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
    </div>
  );
};

export default FeaturedClubs;