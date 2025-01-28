import { Button } from "@/components/ui/button";
import { UserCircle2 } from "lucide-react";
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
        <Button 
          variant="ghost" 
          size="lg"
          className="text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0 relative overflow-hidden group"
        >
          <UserCircle2 className="h-7 w-7" />
          <span className="ml-2 text-base">Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-black/80 backdrop-blur-md border-white/20 animate-in slide-in-from-right-2 duration-200"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-blue-500/10 pointer-events-none" />
        <DropdownMenuItem 
          onClick={() => navigate("/clubs")} 
          className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
          <span className="relative">Clubs</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/events")} 
          className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
          <span className="relative">Events</span>
        </DropdownMenuItem>
        {user && (
          <>
            <DropdownMenuItem 
              onClick={() => navigate("/profile")} 
              className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
              <span className="relative">Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={onSignOut} 
              className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
              <span className="relative">Sign Out</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};