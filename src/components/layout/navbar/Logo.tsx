import { useNavigate } from "react-router-dom";

export const Logo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex-shrink-0 flex items-center pt-1">
      <img 
        src="/lovable-uploads/3ebe28ba-92cf-406c-9111-8d73785be588.png"
        alt="Logo"
        className="h-10 md:h-12 w-auto cursor-pointer" 
        onClick={() => navigate("/")}
      />
    </div>
  );
};