import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import VideoBackground from "./VideoBackground";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-black">
      <VideoBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="bg-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
};