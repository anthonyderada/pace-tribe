import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { FollowButton } from "@/components/profile/FollowButton";
import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MemberCardProps {
  member: {
    id: string;
    user_id: string;
    profiles: {
      id: string;
      username: string | null;
      avatar_url: string | null;
      location: string | null;
      bio: string | null;
    };
  };
}

export const MemberCard = ({ member }: MemberCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/profile/${member.user_id}`);
  };

  return (
    <Card 
      className="bg-zinc-800/50 hover:bg-zinc-800/70 transition-colors cursor-pointer border-0"
      onClick={handleClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.profiles.avatar_url || undefined} />
            <AvatarFallback>
              {member.profiles.username?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-100">
              {member.profiles.username || 'Anonymous'}
            </h3>
            {member.profiles.location && (
              <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {member.profiles.location}
              </p>
            )}
            {member.profiles.bio && (
              <p className="text-sm text-zinc-400 mt-2 line-clamp-2">
                {member.profiles.bio}
              </p>
            )}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <FollowButton
              userId={member.user_id}
              initialIsFollowing={false}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};