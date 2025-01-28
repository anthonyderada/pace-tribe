import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { NavItems } from "./navbar/NavItems";
import { MobileMenu } from "./navbar/MobileMenu";
import { Logo } from "./navbar/Logo";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <nav className="bg-transparent">
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
            <MobileMenu />
          </div>
        </div>
      </div>
    </nav>
  );
};