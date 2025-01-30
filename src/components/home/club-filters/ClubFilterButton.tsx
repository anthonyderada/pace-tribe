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
      className={`flex flex-col items-center group ${
        isSelected ? 'text-white' : 'text-zinc-600'
      }`}
    >
      {icon}
      <span className="text-sm font-light tracking-wider">{label}</span>
      {isSelected && (
        <div className="h-0.5 w-full bg-white mt-2" />
      )}
    </button>
  );
};

export default ClubFilterButton;