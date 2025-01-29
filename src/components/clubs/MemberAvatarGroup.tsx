import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { CollapsedMemberView } from "./member-group/CollapsedMemberView";
import { MemberRow } from "./member-group/MemberRow";

type Member = {
  id: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
};

interface MemberAvatarGroupProps {
  members: Member[];
  clubId: string;
  maxVisible?: number;
}

export const MemberAvatarGroup = ({ members, clubId, maxVisible = 5 }: MemberAvatarGroupProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const visibleMembers = members.slice(0, maxVisible);
  const remainingCount = Math.max(0, members.length - maxVisible);

  useEffect(() => {
    const fetchFollowStatus = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);

      if (error) {
        console.error('Error fetching follow status:', error);
        return;
      }

      const followingSet = new Set(data.map(f => f.following_id));
      const newFollowingMap: Record<string, boolean> = {};
      members.forEach(member => {
        newFollowingMap[member.user_id] = followingSet.has(member.user_id);
      });
      setFollowingMap(newFollowingMap);
    };

    fetchFollowStatus();
  }, [members, user]);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
        >
          <div className="flex items-center justify-between w-full">
            <CollapsedMemberView 
              visibleMembers={visibleMembers}
              remainingCount={remainingCount}
              totalCount={members.length}
            />
            <ChevronDown className={`h-4 w-4 text-zinc-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </div>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2">
        <div className="space-y-2 p-2 bg-zinc-800/20 rounded-lg">
          {members.map((member) => (
            <MemberRow
              key={member.id}
              member={member}
              isFollowing={followingMap[member.user_id] || false}
            />
          ))}
          <Button
            variant="ghost"
            className="w-full mt-2 text-zinc-400 hover:text-zinc-200"
            onClick={() => navigate(`/clubs/${clubId}/members`)}
          >
            View all members
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};