import { type ReactNode } from "react";

interface ClubFilterButtonProps {
  onClick: () => void;
  isSelected: boolean;
  icon: ReactNode;
  label: string;
}

const ClubFilterButton = ({ onClick, isSelected, icon, label }: ClubFilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center group transition-colors duration-200 ${
        isSelected ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
      }`}
    >
      <div className="mb-2">{icon}</div>
      <span className="text-sm font-light tracking-wider whitespace-nowrap">{label}</span>
      {isSelected && (
        <div className="h-0.5 w-full bg-white mt-2 transition-all duration-200" />
      )}
    </button>
  );
};

export default ClubFilterButton;