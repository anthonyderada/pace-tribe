import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-[#1d1e20]">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};