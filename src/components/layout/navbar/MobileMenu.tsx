import { Button } from "@/components/ui/button";
import { UserCircle2, LogOut, Settings, Users, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const MobileMenu = () => {
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

  if (!user) {
    return (
      <Button
        onClick={() => navigate("/login")}
        variant="ghost"
        size="lg"
        className="text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0 scale-123 -mt-5 -mr-4"
      >
        <UserCircle2 className="h-7 w-7" />
        <span className="ml-2 text-base">Login</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="lg"
          className="text-white hover:bg-white/10 focus:ring-0 focus:ring-offset-0 -mt-5 -mr-4"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-emerald-600 text-white">
              {user.email?.[0]?.toUpperCase() || '?'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-56 bg-black/80 backdrop-blur-md border-white/20 animate-in slide-in-from-right-2 duration-200"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 to-blue-500/10 pointer-events-none" />
        <DropdownMenuItem 
          onClick={() => navigate(`/profile/${user.id}`)} 
          className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
          <User className="mr-2 h-5 w-5" />
          <span className="relative">View Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/clubs")} 
          className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
          <Users className="mr-2 h-5 w-5" />
          <span className="relative">My Clubs</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => navigate("/settings")} 
          className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
          <Settings className="mr-2 h-5 w-5" />
          <span className="relative">Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut}
          className="text-base text-white hover:text-white focus:text-white hover:bg-white/10 focus:bg-white/10 py-3 px-4 transition-all duration-200 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-emerald-500/0 group-hover:from-emerald-500/10 group-hover:to-emerald-500/5 transition-all duration-300" />
          <LogOut className="mr-2 h-5 w-5" />
          <span className="relative">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};