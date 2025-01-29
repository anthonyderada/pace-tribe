import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Club {
  id: string;
  name: string;
  description: string | null;
  location: string | null;
  thumbnail_url: string | null;
  club_members: { id: string; user_id: string }[];
  club_label_assignments: {
    id: string;
    club_labels: {
      id: string;
      name: string;
    };
  }[];
}

interface ClubCardProps {
  club: Club;
  userId?: string;
  onJoinLeave: (clubId: string, isMember: boolean, e: React.MouseEvent) => void;
  isLoading: boolean;
}

export const ClubCard = ({ club, userId, onJoinLeave, isLoading }: ClubCardProps) => {
  const navigate = useNavigate();
  const isMember = club.club_members?.some(member => member.user_id === userId);

  return (
    <Card 
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
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{club.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{club.location || 'Location not specified'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {club.club_label_assignments?.map((assignment) => (
                  <Badge
                    key={assignment.id}
                    variant="secondary"
                    className="bg-zinc-800 text-zinc-100 pointer-events-none"
                  >
                    {assignment.club_labels.name}
                  </Badge>
                ))}
              </div>
            </div>
            {userId && (
              <Button
                className={`w-24 ${
                  isMember
                    ? "border border-white text-white bg-transparent hover:bg-white/10"
                    : "border border-white bg-white text-black hover:bg-gray-100"
                }`}
                onClick={(e) => onJoinLeave(club.id, isMember, e)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : isMember ? (
                  'Leave'
                ) : (
                  'Join'
                )}
              </Button>
            )}
          </div>
          <p className="text-gray-400 line-clamp-3 mt-4">{club.description || 'No description available'}</p>
          <p className="text-gray-400 text-sm mt-4">{club.club_members?.length || 0} members</p>
        </div>
      </CardContent>
    </Card>
  );
};