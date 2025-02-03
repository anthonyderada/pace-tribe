import { MapPin } from "lucide-react";

const FeaturedLocation = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div className="flex items-center justify-center gap-2 text-zinc-400">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">Currently Featuring Clubs in</span>
        <span className="text-sm font-semibold text-white">Miami, FL</span>
      </div>
    </div>
  );
};

export default FeaturedLocation;