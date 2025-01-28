import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { Club } from "./types";
import { useClubActions } from "./useClubActions";

interface ClubCardProps {
  club: Club;
  userId?: string;
}

const ClubCard = ({ club, userId }: ClubCardProps) => {
  const { handleJoinLeaveClick, isLoading, isMember } = useClubActions(club, userId);

  return (
    <Card 
      className="bg-black/50 rounded-2xl overflow-hidden hover:bg-black/60 transition-colors cursor-pointer border-0 transform hover:scale-[1.02] transition-all duration-300"
    >
      <CardContent className="p-0">
        {club.thumbnail_url ? (
          <img 
            src={club.thumbnail_url} 
            alt={club.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-white/10 flex items-center justify-center">
            <span className="text-white/60">No image</span>
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">{club.name}</h3>
              <p className="text-gray-300 text-sm mt-1">{club.location || 'Location not specified'}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {club.club_label_assignments?.map((assignment) => (
                  <Badge
                    key={assignment.id}
                    variant="secondary"
                    className="bg-white/10 text-white pointer-events-none"
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
                onClick={(e) => handleJoinLeaveClick(e)}
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
          <p className="text-gray-300 line-clamp-3 mt-4">{club.description || 'No description available'}</p>
          <p className="text-gray-300 text-sm mt-4">{club.club_members?.length || 0} members</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClubCard;