import { useEffect, useState } from "react";
import FeaturedLocation from "./FeaturedLocation";
import ClubTypeFilters from "./ClubTypeFilters";

const StickyFilterSection = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [transform, setTransform] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      const threshold = 100;
      const transitionZone = 50;
      
      // Calculate opacity and transform based on scroll position
      const progress = Math.max(0, Math.min((offset - (threshold - transitionZone)) / transitionZone, 1));
      const shouldBeSticky = offset > threshold - transitionZone;
      
      setOpacity(progress);
      setTransform(progress);
      
      if (shouldBeSticky !== isSticky) {
        setIsSticky(shouldBeSticky);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isSticky]);

  return (
    <div
      className={`transition-all duration-300 ease-in-out ${
        isSticky ? "fixed top-0 left-0 right-0 z-50" : "relative"
      }`}
      style={{
        backgroundColor: isSticky ? `rgba(0, 0, 0, ${0.85 + opacity * 0.15})` : "transparent",
        backdropFilter: isSticky ? "blur(8px)" : "none",
        borderBottom: isSticky ? "1px solid rgba(39, 39, 42, 0.5)" : "none",
        transform: isSticky ? `translateY(${(transform - 1) * 8}px)` : "none",
      }}
    >
      <div 
        className="py-4"
        style={{
          opacity: isSticky ? 1 : Math.max(0.4, opacity),
          transform: `translateY(${(1 - opacity) * 4}px)`,
          transition: "all 0.3s ease-in-out",
        }}
      >
        <FeaturedLocation />
        <ClubTypeFilters />
      </div>
    </div>
  );
};

export default StickyFilterSection;