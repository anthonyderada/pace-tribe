import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-10">
        <Navbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};