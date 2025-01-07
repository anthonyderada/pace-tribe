import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();
  const isAuthenticated = false; // TODO: Replace with actual auth state

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span 
                className="text-2xl font-bold text-emerald-500 cursor-pointer" 
                onClick={() => navigate("/")}
              >
                Pace Tribe
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/clubs")}
              className="text-gray-300 hover:text-white hover:bg-gray-800">
              Clubs
            </Button>
            <Button variant="ghost" onClick={() => navigate("/events")}
              className="text-gray-300 hover:text-white hover:bg-gray-800">
              Events
            </Button>
            <Button variant="ghost" onClick={() => navigate("/profile")}
              className="text-gray-300 hover:text-white hover:bg-gray-800">
              Profile
            </Button>
            <Button variant="ghost" onClick={() => navigate("/login")}
              className="text-gray-300 hover:text-white hover:bg-gray-800">
              Login
            </Button>
            <Button 
              onClick={() => navigate("/register")} 
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Join Now
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};