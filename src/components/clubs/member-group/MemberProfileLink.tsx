import { useNavigate } from "react-router-dom";

interface MemberProfileLinkProps {
  userId: string;
  children: React.ReactNode;
  className?: string;
}

export const MemberProfileLink = ({ userId, children, className = "" }: MemberProfileLinkProps) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/profile/${userId}`);
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};