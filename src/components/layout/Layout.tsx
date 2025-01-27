import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
    </div>
  );
};