import FeaturedLocation from "./FeaturedLocation";
import ClubTypeFilters from "./ClubTypeFilters";

const StickyFilterBar = () => {
  return (
    <div className="sticky top-0 z-30 bg-black/80 backdrop-blur-lg border-b border-white/10">
      <div className="py-4">
        <FeaturedLocation />
        <ClubTypeFilters />
      </div>
    </div>
  );
};

export default StickyFilterBar;