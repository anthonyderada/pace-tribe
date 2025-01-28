import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const NavItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate("/");
      toast.success("Successfully signed out");
    } catch (error: any) {
      console.error("Error signing out:", error.message);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  return (
    <>
      <Button 
        variant="ghost" 
        onClick={() => navigate("/clubs")}
        className="text-base text-white hover:text-white hover:bg-white/10 px-4 py-2"
      >
        Clubs
      </Button>
      <Button 
        variant="ghost" 
        onClick={() => navigate("/events")}
        className="text-base text-white hover:text-white hover:bg-white/10 px-4 py-2"
      >
        Events
      </Button>
      {user ? (
        <>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/profile")}
            className="text-base text-white hover:text-white hover:bg-white/10 px-4 py-2"
          >
            Profile
          </Button>
          <Button 
            onClick={handleSignOut}
            className="bg-white/20 backdrop-blur-sm text-white border border-white/50 hover:bg-white/30 transition-colors text-base px-6 py-2"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <Button 
          onClick={() => navigate("/register")} 
          className="bg-white/20 backdrop-blur-sm text-white border border-white/50 hover:bg-white/30 transition-colors text-base px-6 py-2"
        >
          Sign In / Register
        </Button>
      )}
    </>
  );
};