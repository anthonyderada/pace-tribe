import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const NavItems = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Signed out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

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
        <>
          <Link to={`/profile/${user.id}`}>
            <Button variant="ghost" className="text-zinc-400 hover:text-white">
              Profile
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            className="text-zinc-400 hover:text-white"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </>
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