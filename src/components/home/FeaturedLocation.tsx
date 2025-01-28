import { MapPin } from "lucide-react";

const FeaturedLocation = () => {
  return (
    <div className="relative">
      {/* Paper-like background overlay */}
      <div 
        className="absolute inset-0 w-full h-[600px] -z-10"
        style={{
          background: `
            linear-gradient(to bottom, 
              rgba(255, 255, 255, 0.02) 0%,
              rgba(255, 255, 255, 0.05) 100%
            ),
            repeating-linear-gradient(
              45deg,
              rgba(255, 255, 255, 0.01) 0px,
              rgba(255, 255, 255, 0.01) 1px,
              transparent 1px,
              transparent 4px
            )
          `,
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