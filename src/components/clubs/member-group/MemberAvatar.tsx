import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberProfileLink } from "./MemberProfileLink";

interface MemberAvatarProps {
  member: {
    user_id: string;
    role?: string;
    profiles: {
      username: string | null;
      avatar_url: string | null;
    };
  };
  size?: "sm" | "md";
  className?: string;
}

export const MemberAvatar = ({ member, size = "md", className = "" }: MemberAvatarProps) => {
  const avatarSize = size === "sm" ? "h-8 w-8" : "h-12 w-12";

  return (
    <MemberProfileLink userId={member.user_id}>
      <Avatar className={`${avatarSize} cursor-pointer ${className}`}>
        <AvatarImage src={member.profiles.avatar_url || undefined} />
        <AvatarFallback>
          {member.profiles.username?.[0]?.toUpperCase() || '?'}
        </AvatarFallback>
      </Avatar>
    </MemberProfileLink>
  );
};