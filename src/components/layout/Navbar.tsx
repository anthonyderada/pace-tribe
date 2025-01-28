import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Menu } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
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

  const NavItems = () => (
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
            variant="ghost" 
            className="text-base text-white hover:text-white hover:bg-white/10 px-4 py-2"
          >
            Sign Out
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
            className="bg-white text-black border border-white hover:bg-transparent hover:text-white transition-colors text-base px-6 py-2"
          >
            Join Now
          </Button>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="/lovable-uploads/3ebe28ba-92cf-406c-9111-8d73785be588.png"
                alt="Logo"
                className="h-12 w-auto cursor-pointer" 
                onClick={() => navigate("/")}
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-black/95">
                <DropdownMenuItem onClick={() => navigate("/clubs")} className="text-base text-white hover:text-white focus:text-white focus:bg-white/10 py-2">
                  Clubs
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/events")} className="text-base text-white hover:text-white focus:text-white focus:bg-white/10 py-2">
                  Events
                </DropdownMenuItem>
                {user ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="text-base text-white hover:text-white focus:text-white focus:bg-white/10 py-2">
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="text-base text-white hover:text-white focus:text-white focus:bg-white/10 py-2">
                      Sign Out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/login")} className="text-base text-white hover:text-white focus:text-white focus:bg-white/10 py-2">
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/register")} className="text-white hover:text-black hover:bg-white focus:text-black focus:bg-white transition-colors py-2 text-base">
                      Join Now
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};