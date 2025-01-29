import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { CollapsibleTriggerButton } from "./member-group/CollapsibleTriggerButton";
import { CollapsibleMemberList } from "./member-group/CollapsibleMemberList";

type Member = {
  id: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
    location: string | null;
  };
};

interface MemberAvatarGroupProps {
  members: Member[];
  clubId: string;
  maxVisible?: number;
}

export const MemberAvatarGroup = ({ 
  members, 
  clubId, 
  maxVisible = 5 
}: MemberAvatarGroupProps) => {
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
      <CollapsibleTriggerButton 
        visibleMembers={visibleMembers}
        remainingCount={remainingCount}
        totalCount={members.length}
        isOpen={isOpen}
      />
      <CollapsibleContent className="mt-2">
        <CollapsibleMemberList 
          members={members}
          followingMap={followingMap}
        />
      </CollapsibleContent>
    </Collapsible>
  );
};