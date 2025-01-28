import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MobileMenuProps {
  onSignOut: () => void;
}

export const MobileMenu = ({ onSignOut }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-white">
          <Menu className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-black/80 backdrop-blur-sm border-white/20">
        <DropdownMenuItem onClick={() => navigate("/clubs")} className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-2">
          Clubs
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/events")} className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-2">
          Events
        </DropdownMenuItem>
        {user ? (
          <>
            <DropdownMenuItem onClick={() => navigate("/profile")} className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-2">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onSignOut} className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-2">
              Sign Out
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={() => navigate("/login")} className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-2">
              Login
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/register")} className="text-white hover:bg-white/20 focus:bg-white/20 transition-colors py-2 text-base">
              Join Now
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};