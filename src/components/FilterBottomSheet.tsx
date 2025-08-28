import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { SlidersHorizontal, X } from "lucide-react";

type FilterOptions = {
  cuisines: string[];
  foodTypes: string[];
  priceRanges: string[];
  ratings: string[];
  seatingSizes: string[];
  restaurantTypes: string[];
  locations: string[];
};

type FilterBottomSheetProps = {
  filterOptions: FilterOptions;
  filters: {
    cuisine: string;
    foodType: string;
    priceRange: string;
    rating: string;
    goodDateSpot: string;
    seatingSize: string;
    restaurantType: string;
    location: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
};

const FilterBottomSheet = ({ 
  filterOptions, 
  filters, 
  onFilterChange, 
  onClearFilters,
  activeFilterCount 
}: FilterBottomSheetProps) => {
  const [open, setOpen] = useState(false);

  const filterSections = [
    {
      title: "Cuisine",
      key: "cuisine",
      options: [{ value: "all", label: "All cuisines" }, ...filterOptions.cuisines.map(c => ({ value: c, label: c }))],
      value: filters.cuisine
    },
    {
      title: "Food Type",
      key: "foodType",
      options: [{ value: "all", label: "All types" }, ...filterOptions.foodTypes.map(c => ({ value: c, label: c }))],
      value: filters.foodType
    },
    {
      title: "Price Range",
      key: "priceRange",
      options: [{ value: "all", label: "Any price" }, ...filterOptions.priceRanges.map(c => ({ value: c, label: c }))],
      value: filters.priceRange
    },
    {
      title: "Rating",
      key: "rating",
      options: [
        { value: "all", label: "Any rating" },
        ...filterOptions.ratings.map(r => ({ 
          value: r, 
          label: r === "5" ? "5 stars" : `${r} stars & up` 
        }))
      ],
      value: filters.rating
    },
    {
      title: "Good for Dates",
      key: "goodDateSpot",
      options: [
        { value: "all", label: "Any" },
        { value: "yes", label: "Perfect for dates" },
        { value: "no", label: "Not for dates" }
      ],
      value: filters.goodDateSpot
    },
    {
      title: "Seating Size",
      key: "seatingSize",
      options: [{ value: "all", label: "Any size" }, ...filterOptions.seatingSizes.map(c => ({ value: c, label: c }))],
      value: filters.seatingSize
    },
    {
      title: "Restaurant Type",
      key: "restaurantType",
      options: [{ value: "all", label: "All types" }, ...filterOptions.restaurantTypes.map(c => ({ value: c, label: c }))],
      value: filters.restaurantType
    },
    {
      title: "Location",
      key: "location",
      options: [{ value: "all", label: "All locations" }, ...filterOptions.locations.map(c => ({ value: c, label: c }))],
      value: filters.location
    }
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative bg-app-surface-elevated border-border hover:bg-muted">
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-1.5 py-0.5 min-w-[20px] h-5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="bg-app-surface border-border max-h-[85vh] overflow-y-auto">
        <SheetHeader className="text-left pb-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-foreground">Filter Restaurants</SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Find exactly what you're craving
              </SheetDescription>
            </div>
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="grid gap-6 pb-6">
          {filterSections.map((section) => (
            <div key={section.key} className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                {section.title}
              </label>
              <Select 
                value={section.value} 
                onValueChange={(value) => onFilterChange(section.key, value)}
              >
                <SelectTrigger className="w-full bg-app-surface-elevated border-border">
                  <SelectValue placeholder={`Select ${section.title.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {section.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-6 border-t border-border">
          <Button 
            onClick={() => setOpen(false)}
            className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground"
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterBottomSheet;