import { MapPin } from "lucide-react";

const FeaturedLocation = () => {
  return (
    <div className="relative">
      {/* Gradient overlay */}
      <div 
        className="absolute inset-0 w-full h-[600px] -z-10"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.4) 100%)',
          maskImage: 'linear-gradient(to bottom, transparent, black)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, black)',
        }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center gap-2 text-zinc-400">
          <MapPin className="h-5 w-5" />
          <span className="text-lg">Currently Featuring Clubs in</span>
          <span className="text-white font-medium">Miami, FL</span>
        </div>
      </div>
    </div>
  );
};

export default FeaturedLocation;