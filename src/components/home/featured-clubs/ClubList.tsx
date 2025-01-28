import { Skeleton } from "@/components/ui/skeleton";
import { Club } from "./types";
import ClubCard from "./ClubCard";
import { useNavigate } from "react-router-dom";

interface ClubListProps {
  clubs?: Club[];
  isLoading: boolean;
  userId?: string;
}

const ClubList = ({ clubs, isLoading, userId }: ClubListProps) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array(3).fill(0).map((_, i) => (
          <Skeleton key={i} className="h-[400px] bg-white/10 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {clubs?.map((club) => (
        <div key={club.id} onClick={() => navigate(`/clubs/${club.id}`)}>
          <ClubCard club={club} userId={userId} />
        </div>
      ))}
    </div>
  );
};

export default ClubList;