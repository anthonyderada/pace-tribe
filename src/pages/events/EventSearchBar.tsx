import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface EventSearchBarProps {
  onSearch: (query: string) => void;
}

export const EventSearchBar = ({ onSearch }: EventSearchBarProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
      <Input 
        className="pl-10 bg-zinc-800/50 border-zinc-700 text-zinc-100 placeholder:text-zinc-500" 
        placeholder="Search events..." 
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};