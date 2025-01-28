import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import VideoBackground from "../home/VideoBackground";
import { useLocation } from "react-router-dom";

export const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black">
      {isHomePage && <VideoBackground />}
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};