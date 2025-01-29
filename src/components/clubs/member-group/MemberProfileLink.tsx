import { useNavigate } from "react-router-dom";

interface MemberProfileLinkProps {
  userId: string;
  children: React.ReactNode;
  className?: string;
  clubId?: string;
}

export const MemberProfileLink = ({ userId, children, className = "", clubId }: MemberProfileLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${userId}`, {
      state: { fromClubId: clubId }
    });
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};