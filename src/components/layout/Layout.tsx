import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import VideoBackground from "./VideoBackground";

export const Layout = () => {
  return (
    <div className="min-h-screen">
      <VideoBackground />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};