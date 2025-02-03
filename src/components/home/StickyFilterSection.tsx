import { useEffect, useState } from "react";
import FeaturedLocation from "./FeaturedLocation";
import ClubTypeFilters from "./ClubTypeFilters";

const StickyFilterSection = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setIsSticky(offset > 100); // Reduced threshold for earlier sticky behavior
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-zinc-800/50 transition-all duration-300 ease-in-out"
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