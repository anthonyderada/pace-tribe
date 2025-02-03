import { useEffect, useState } from "react";
import FeaturedLocation from "./FeaturedLocation";
import ClubTypeFilters from "./ClubTypeFilters";

const StickyFilterSection = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const shouldBeSticky = offset > 100;
      
      // Calculate opacity based on scroll position
      const newOpacity = Math.min((offset - 50) / 50, 1);
      setOpacity(newOpacity);
      
      if (shouldBeSticky !== isSticky) {
        setIsSticky(shouldBeSticky);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky]);

  return (
    <div
      className={`${
        isSticky
          ? "fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-zinc-800/50 transition-all duration-300 ease-in-out"
          : ""
      }`}
      style={{
        backgroundColor: isSticky ? `rgba(0, 0, 0, ${0.85 + opacity * 0.1})` : "transparent",
      }}
    >
      <div className={`py-4 transition-transform duration-300 ease-in-out ${
        isSticky ? "transform-none" : ""
      }`}>
        <FeaturedLocation />
        <ClubTypeFilters />
      </div>
    </div>
  );
};

export default StickyFilterSection;