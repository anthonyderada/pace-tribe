import { Navigation, Users, MapPin, Route } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Navigation className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Trails</h3>
            <p className="text-gray-400">
              Discover scenic running trails and routes in your area.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Users className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Social</h3>
            <p className="text-gray-400">
              Connect with other runners and build your community.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <MapPin className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Track</h3>
            <p className="text-gray-400">
              Find local tracks and training facilities.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Route className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Road</h3>
            <p className="text-gray-400">
              Explore popular road running routes and races.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;