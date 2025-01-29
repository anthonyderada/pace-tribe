import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberCard } from "@/components/clubs/members/MemberCard";
import { MapPin, Users } from "lucide-react";

const Members = () => {
  const { id } = useParams();

  const { data: members, isLoading } = useQuery({
    queryKey: ['club-members', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("club_members")
        .select(`
          id,
          user_id,
          profiles (
            id,
            username,
            avatar_url,
            location,
            bio
          )
        `)
        .eq("club_id", id);

      if (error) throw error;
      return data;
    },
  });

  const { data: club } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select("name")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-zinc-800 bg-zinc-900/90">
          <CardContent className="p-6">
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="border border-zinc-800 bg-zinc-900/90">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {club?.name} Members ({members?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members?.map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Members;