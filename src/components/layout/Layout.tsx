import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import VideoBackground from "./VideoBackground";

export const Layout = () => {
  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <div className="relative">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};