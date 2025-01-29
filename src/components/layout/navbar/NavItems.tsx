import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export const NavItems = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-4">
      <Link to="/clubs">
        <Button variant="ghost" className="text-zinc-400 hover:text-white">
          Run Clubs
        </Button>
      </Link>
      <Link to="/members">
        <Button variant="ghost" className="text-zinc-400 hover:text-white">
          <Users className="h-4 w-4 mr-2" />
          Members
        </Button>
      </Link>
      {user ? (
        <Link to={`/profile/${user.id}`}>
          <Button variant="ghost" className="text-zinc-400 hover:text-white">
            Profile
          </Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button variant="ghost" className="text-zinc-400 hover:text-white">
            Login
          </Button>
        </Link>
      )}
    </div>
  );
};