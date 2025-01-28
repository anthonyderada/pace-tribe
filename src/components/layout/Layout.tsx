import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import VideoBackground from "./VideoBackground";

export const Layout = () => {
  const location = useLocation();
  const isIndexPage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-black">
      {isIndexPage && <VideoBackground />}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};