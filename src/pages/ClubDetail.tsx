import { Card, CardContent } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { MemberAvatarGroup } from "@/components/clubs/MemberAvatarGroup";
import { NextEventOverlay } from "@/components/clubs/NextEventOverlay";
import { Badge } from "@/components/ui/badge";
import { ClubMembershipButton } from "@/components/clubs/ClubMembershipButton";
import { ClubEventsList } from "@/components/clubs/ClubEventsList";

const ClubDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  const { data: club, isLoading: isClubLoading } = useQuery({
    queryKey: ['club', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clubs")
        .select(`
          *,
          club_members (
            id,
            user_id,
            profiles (
              username,
              avatar_url,
              location
            )
          ),
          events (
            *,
            event_participants (
              id,
              user_id,
              profiles (
                username,
                avatar_url
              )
            )
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
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      if (!data) throw new Error("Club not found");
      return data;
    },
  });

  if (isClubLoading || !club) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
          <CardContent className="p-6">
            <div className="h-8 w-3/4 bg-zinc-800 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-zinc-800 rounded animate-pulse mt-2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const nextEvent = club.events
    ?.filter(event => new Date(event.date) > new Date())
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const isMember = club?.club_members?.some(member => member.user_id === user?.id);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl overflow-hidden">
        <div className="relative">
          {club.thumbnail_url && (
            <div className="w-full h-64 relative">
              <img
                src={club.thumbnail_url}
                alt={club.name}
                className="w-full h-full object-cover"
              />
              {nextEvent && <NextEventOverlay event={nextEvent} />}
            </div>
          )}
        </div>
        <CardContent className="p-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold text-zinc-100 mb-2">{club.name}</h1>
              {club.location && (
                <div className="flex items-center gap-2 text-zinc-400 mb-4">
                  <MapPin className="h-4 w-4" />
                  {club.location}
                </div>
              )}
              <p className="text-zinc-400 mb-4">
                {club.description || "No description available."}
              </p>
              <div className="flex flex-wrap gap-2">
                {club.club_label_assignments?.map((assignment) => (
                  <Badge
                    key={assignment.id}
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-100"
                  >
                    {assignment.club_labels.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <MemberAvatarGroup 
                members={club.club_members} 
                clubId={club.id}
              />
              <ClubMembershipButton
                clubId={club.id}
                isMember={isMember}
                userId={user?.id}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-zinc-800 bg-zinc-900/90 rounded-2xl">
        <CardContent>
          <ClubEventsList
            events={club.events || []}
            clubId={club.id}
            userId={user?.id}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubDetail;