import { useState } from "react";
import ClubFilterButton from "./club-filters/ClubFilterButton";
import { 
  TrailsIcon, 
  RoadIcon, 
  TrackIcon, 
  PerformanceIcon, 
  SocialIcon 
} from "./club-filters/ClubFilterIcons";

type ClubType = 'trails' | 'road' | 'track' | 'performance' | 'social';

const ClubTypeFilters = () => {
  const [selectedType, setSelectedType] = useState<ClubType | null>(null);

  const handleTypeSelect = (type: ClubType) => {
    setSelectedType(type === selectedType ? null : type);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-center gap-12 md:gap-24">
        <ClubFilterButton
          onClick={() => handleTypeSelect('trails')}
          isSelected={selectedType === 'trails'}
          icon={<TrailsIcon />}
          label="Trails"
        />
        <ClubFilterButton
          onClick={() => handleTypeSelect('road')}
          isSelected={selectedType === 'road'}
          icon={<RoadIcon />}
          label="Road"
        />
        <ClubFilterButton
          onClick={() => handleTypeSelect('track')}
          isSelected={selectedType === 'track'}
          icon={<TrackIcon />}
          label="Track"
        />
        <ClubFilterButton
          onClick={() => handleTypeSelect('performance')}
          isSelected={selectedType === 'performance'}
          icon={<PerformanceIcon />}
          label="Performance"
        />
        <ClubFilterButton
          onClick={() => handleTypeSelect('social')}
          isSelected={selectedType === 'social'}
          icon={<SocialIcon />}
          label="Social"
        />
      </div>
    </div>
  );
};

export default ClubTypeFilters;