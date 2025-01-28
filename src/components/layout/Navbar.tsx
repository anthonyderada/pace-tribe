import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { NavItems } from "./navbar/NavItems";
import { MobileMenu } from "./navbar/MobileMenu";
import { Logo } from "./navbar/Logo";
import { Button } from "../ui/button";
import { UserCircle2 } from "lucide-react";

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

  return (
    <nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 pt-4 md:pt-0">
          <div className="flex">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            {user ? (
              <MobileMenu onSignOut={handleSignOut} />
            ) : (
              <Button
                onClick={() => navigate("/login")}
                variant="ghost"
                size="lg"
                className="text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0 scale-120 -mt-2.5 -mr-4"
              >
                <UserCircle2 className="h-7 w-7" />
                <span className="ml-2 text-base">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};