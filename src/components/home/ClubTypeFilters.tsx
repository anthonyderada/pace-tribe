import { useState } from "react";

type ClubType = 'trails' | 'road' | 'track' | 'performance' | 'social';

const ClubTypeFilters = () => {
  const [selectedType, setSelectedType] = useState<ClubType | null>(null);

  const handleTypeSelect = (type: ClubType) => {
    setSelectedType(type === selectedType ? null : type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center gap-8 md:gap-16">
        {/* Trails */}
        <button
          onClick={() => handleTypeSelect('trails')}
          className={`flex flex-col items-center group ${
            selectedType === 'trails' ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22c-4.2-3-7-6.5-7-10.5C5 7.1 8.1 4 12 4s7 3.1 7 7.5c0 4-2.8 7.5-7 10.5z" />
            <path d="M12 14a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <span className="text-sm font-medium">Trails</span>
        </button>

        {/* Road */}
        <button
          onClick={() => handleTypeSelect('road')}
          className={`flex flex-col items-center group ${
            selectedType === 'road' ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 19h16" />
            <path d="M4 15h16" />
            <path d="M4 11h16" />
            <path d="M4 7h16" />
          </svg>
          <span className="text-sm font-medium">Road</span>
        </button>

        {/* Track */}
        <button
          onClick={() => handleTypeSelect('track')}
          className={`flex flex-col items-center group ${
            selectedType === 'track' ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <ellipse cx="12" cy="12" rx="8" ry="6" />
            <ellipse cx="12" cy="12" rx="5" ry="3" />
          </svg>
          <span className="text-sm font-medium">Track</span>
        </button>

        {/* Performance */}
        <button
          onClick={() => handleTypeSelect('performance')}
          className={`flex flex-col items-center group ${
            selectedType === 'performance' ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-sm font-medium">Performance</span>
        </button>

        {/* Social */}
        <button
          onClick={() => handleTypeSelect('social')}
          className={`flex flex-col items-center group ${
            selectedType === 'social' ? 'text-emerald-400' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <svg
            viewBox="0 0 24 24"
            className="w-8 h-8 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="8" cy="12" r="3" />
            <circle cx="16" cy="12" r="3" />
            <circle cx="12" cy="8" r="3" />
          </svg>
          <span className="text-sm font-medium">Social</span>
        </button>
      </div>
    </div>
  );
};

export default ClubTypeFilters;