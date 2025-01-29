import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type Club = {
  id: string;
  name: string;
  location: string | null;
  thumbnail_url: string | null;
};

interface TribesSectionProps {
  joinedClubs: Club[];
}

export const TribesSection = ({ joinedClubs }: TribesSectionProps) => {
  const navigate = useNavigate();

  return (
    <Card className="border-0 bg-zinc-900/90">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-100">
          <Users className="h-5 w-5" />
          My Tribes
        </CardTitle>
      </CardHeader>
      <CardContent>
        {joinedClubs.length > 0 ? (
          <div className="space-y-4">
            {joinedClubs.map((club) => (
              <Card 
                key={club.id}
                className="border-0 bg-zinc-800/90 cursor-pointer hover:bg-zinc-700/90 transition-colors"
                onClick={() => navigate(`/clubs/${club.id}`)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage 
                        src={club.thumbnail_url || undefined} 
                        alt={club.name}
                      />
                      <AvatarFallback className="bg-emerald-600 text-white">
                        {club.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-zinc-100">{club.name}</CardTitle>
                      {club.location && (
                        <CardDescription className="text-sm text-zinc-400 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {club.location}
                        </CardDescription>
                      )}
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-zinc-400">No tribes joined yet</p>
        )}
      </CardContent>
    </Card>
  );
};