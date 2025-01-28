import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export const NavItems = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
            onClick={() => navigate("/register")} 
            className="bg-white/20 backdrop-blur-sm text-white border border-white/50 hover:bg-white/30 transition-colors text-base px-6 py-2"
          >
            Join Now
          </Button>
        </>
      ) : (
        <>
          <Button 
            variant="ghost" 
            onClick={() => navigate("/login")}
            className="text-base text-white hover:text-white hover:bg-white/10 px-4 py-2"
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate("/register")} 
            className="bg-white/20 backdrop-blur-sm text-white border border-white/50 hover:bg-white/30 transition-colors text-base px-6 py-2"
          >
            Join Now
          </Button>
        </>
      )}
    </>
  );
};