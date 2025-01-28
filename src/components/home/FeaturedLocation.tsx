import { MapPin } from "lucide-react";

const FeaturedLocation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="flex items-center gap-2 text-zinc-400">
        <MapPin className="h-5 w-5" />
        <span className="text-lg">Currently Featuring Clubs in</span>
        <span className="text-lg font-semibold">San Francisco Bay Area</span>
      </div>
    </div>
  );
};

export default FeaturedLocation;