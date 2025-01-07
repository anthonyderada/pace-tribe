import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-background-light">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};