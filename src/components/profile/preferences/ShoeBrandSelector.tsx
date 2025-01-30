import { Checkbox } from "@/components/ui/checkbox";

interface ShoeBrandSelectorProps {
  selectedBrands: string[];
  onBrandsChange: (brands: string[]) => void;
}

const shoeBrands = [
  "Nike", "Hoka", "ON", "Asics", "Saucony", "Brooks", "Adidas",
  "Mizuno", "Altra", "New Balance"
];

export const ShoeBrandSelector = ({
  selectedBrands,
  onBrandsChange,
}: ShoeBrandSelectorProps) => {
  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter(b => b !== brand));
    } else {
      onBrandsChange([...selectedBrands, brand]);
    }
  };

  return (
    <div>
      <label className="text-sm text-zinc-400 mb-2 block">
        Preferred Shoe Brands
      </label>
      <div className="grid grid-cols-2 gap-2">
        {shoeBrands.map((brand) => (
          <div key={brand} className="flex items-center space-x-2">
            <Checkbox
              id={`shoe-brand-${brand}`}
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleBrand(brand)}
              className="border-white data-[state=checked]:bg-white data-[state=checked]:text-black"
            />
            <label
              htmlFor={`shoe-brand-${brand}`}
              className="text-sm font-medium leading-none text-white peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {brand}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};