const FeaturesSection = () => {
  return (
    <div className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Join Running Clubs</h3>
            <p className="text-gray-400">
              Find and join local running clubs that match your pace and goals.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Participate in Events</h3>
            <p className="text-gray-400">
              Discover and register for running events in your area.
            </p>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Connect with Runners</h3>
            <p className="text-gray-400">
              Meet other runners and build your running community.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;