import { TrailIcon, RoadIcon, TrackIcon, PerformanceIcon, SocialIcon } from "@/components/icons/RunningIcons";

const FeaturesSection = () => {
  return (
    <div className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <TrailIcon />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Trails</h3>
            <p className="text-gray-400">
              Discover scenic running trails and routes in your area.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <RoadIcon />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Road</h3>
            <p className="text-gray-400">
              Explore popular road running routes and races.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <TrackIcon />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Track</h3>
            <p className="text-gray-400">
              Find local tracks and training facilities.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <PerformanceIcon />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Performance</h3>
            <p className="text-gray-400">
              Train with focus on speed and achievement.
            </p>
          </div>
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <SocialIcon />
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Social</h3>
            <p className="text-gray-400">
              Connect with other runners and build your community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;