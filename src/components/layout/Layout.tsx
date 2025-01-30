import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { MobileNav } from "./MobileNav";
import VideoBackground from "./VideoBackground";

export const Layout = () => {
  return (
    <div className="min-h-screen relative">
      <VideoBackground />
      <div className="relative">
        <Navbar />
        <main className="pb-16 md:pb-0">
          <Outlet />
        </main>
        <MobileNav />
      </div>
    </div>
  );
};