import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = false; // TODO: Replace with actual auth state

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-accent-primary cursor-pointer" onClick={() => navigate("/")}>
                Pace Tribe
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Button variant="ghost" onClick={() => navigate("/clubs")}>
                  Clubs
                </Button>
                <Button variant="ghost" onClick={() => navigate("/events")}>
                  Events
                </Button>
                <Button variant="ghost" onClick={() => navigate("/profile")}>
                  Profile
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")} className="bg-accent-primary hover:bg-accent-dark text-white">
                  Join Now
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};