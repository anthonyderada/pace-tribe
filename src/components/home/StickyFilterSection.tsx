import { useEffect, useState } from "react";
import FeaturedLocation from "./FeaturedLocation";
import ClubTypeFilters from "./ClubTypeFilters";

const StickyFilterSection = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 400); // Adjust this value based on when you want the sticky behavior to start
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm shadow-md transition-all duration-300 ease-in-out"
          : ""
      }`}
    >
      <div className="py-4">
        <FeaturedLocation />
        <ClubTypeFilters />
      </div>
    </div>
  );
};

export default StickyFilterSection;