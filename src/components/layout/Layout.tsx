import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};