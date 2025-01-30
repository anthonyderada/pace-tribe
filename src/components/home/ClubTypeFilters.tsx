import { useState } from "react";

type ClubType = 'trails' | 'road' | 'track' | 'performance' | 'social';

const ClubTypeFilters = () => {
  const [selectedType, setSelectedType] = useState<ClubType | null>(null);

  const handleTypeSelect = (type: ClubType) => {
    setSelectedType(type === selectedType ? null : type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center gap-12 md:gap-24">
        {/* Trails */}
        <button
          onClick={() => handleTypeSelect('trails')}
          className={`flex flex-col items-center group ${
            selectedType === 'trails' ? 'text-white' : 'text-zinc-600'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M6 20c2-3 4-5 4-8 0-4-3-7-6-7s-6 3-6 7c0 3 2 5 4 8" />
            <path d="M18 20c2-3 4-5 4-8 0-4-3-7-6-7s-6 3-6 7c0 3 2 5 4 8" />
            <path d="M12 20c2-3 4-5 4-8 0-4-3-7-6-7s-6 3-6 7c0 3 2 5 4 8" />
          </svg>
          <span className="text-sm font-light tracking-wider">Trails</span>
          {selectedType === 'trails' && (
            <div className="h-0.5 w-full bg-white mt-2" />
          )}
        </button>

        {/* Road */}
        <button
          onClick={() => handleTypeSelect('road')}
          className={`flex flex-col items-center group ${
            selectedType === 'road' ? 'text-white' : 'text-zinc-600'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M3 6h18" />
            <path d="M3 12h18" />
            <path d="M3 18h18" />
            <path d="M3 6c2 6 4 9 6 12" />
            <path d="M21 6c-2 6-4 9-6 12" />
          </svg>
          <span className="text-sm font-light tracking-wider">Road</span>
          {selectedType === 'road' && (
            <div className="h-0.5 w-full bg-white mt-2" />
          )}
        </button>

        {/* Track */}
        <button
          onClick={() => handleTypeSelect('track')}
          className={`flex flex-col items-center group ${
            selectedType === 'track' ? 'text-white' : 'text-zinc-600'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <ellipse cx="12" cy="12" rx="10" ry="7" />
            <ellipse cx="12" cy="12" rx="6" ry="3" />
          </svg>
          <span className="text-sm font-light tracking-wider">Track</span>
          {selectedType === 'track' && (
            <div className="h-0.5 w-full bg-white mt-2" />
          )}
        </button>

        {/* Performance */}
        <button
          onClick={() => handleTypeSelect('performance')}
          className={`flex flex-col items-center group ${
            selectedType === 'performance' ? 'text-white' : 'text-zinc-600'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 4a8 8 0 0 1 8 8" />
            <path d="M12 4v4" />
            <circle cx="12" cy="12" r="1" />
          </svg>
          <span className="text-sm font-light tracking-wider">Performance</span>
          {selectedType === 'performance' && (
            <div className="h-0.5 w-full bg-white mt-2" />
          )}
        </button>

        {/* Social */}
        <button
          onClick={() => handleTypeSelect('social')}
          className={`flex flex-col items-center group ${
            selectedType === 'social' ? 'text-white' : 'text-zinc-600'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          >
            <circle cx="8" cy="12" r="2" />
            <circle cx="16" cy="12" r="2" />
            <circle cx="12" cy="8" r="2" />
            <circle cx="12" cy="16" r="2" />
          </svg>
          <span className="text-sm font-light tracking-wider">Social</span>
          {selectedType === 'social' && (
            <div className="h-0.5 w-full bg-white mt-2" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ClubTypeFilters;