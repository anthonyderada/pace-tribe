import { Home, Search, Plus, Users, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export const MobileNav = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  const isActive = (path: string) => {
    if (path === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Explore", path: "/members" },
    { icon: Plus, label: "Create", path: "/events/new" },
    { icon: Users, label: "Clubs", path: "/clubs" },
    { icon: User, label: "Profile", path: user ? `/profile/${user.id}` : "/login" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ icon: Icon, label, path }) => (
          <Link
            key={label}
            to={path}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full px-2 transition-colors",
              isActive(path) 
                ? "text-white" 
                : "text-zinc-400 hover:text-zinc-100"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs mt-1">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};