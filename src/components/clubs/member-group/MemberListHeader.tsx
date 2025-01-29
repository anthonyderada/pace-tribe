import { Badge } from "@/components/ui/badge";

interface MemberListHeaderProps {
  totalCount: number;
}

export const MemberListHeader = ({ totalCount }: MemberListHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-medium text-zinc-100">Members</h3>
        <Badge variant="secondary" className="bg-zinc-800 text-zinc-400">
          {totalCount}
        </Badge>
      </div>
    </div>
  );
};