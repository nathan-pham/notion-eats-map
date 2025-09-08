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
        <Button 
          variant="outline" 
          className="relative bg-app-surface-elevated/80 backdrop-blur-sm border-border/50 hover:bg-app-surface-elevated hover:border-border rounded-full px-4 py-2 h-10 transition-all duration-200"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          <span className="font-medium">Filters</span>
          {activeFilterCount > 0 && (
            <Badge className="ml-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 min-w-[20px] h-5 rounded-full animate-bounce-in">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent 
        side="bottom" 
        className="bg-background/95 backdrop-blur-xl border-border/50 max-h-[90vh] overflow-y-auto rounded-t-3xl border-t-0 animate-slide-up"
      >
        <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6 mt-2" />
        
        <SheetHeader className="text-left pb-6">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-foreground text-2xl font-bold">Filters</SheetTitle>
              <SheetDescription className="text-muted-foreground text-base mt-1">
                Find exactly what you're craving
              </SheetDescription>
            </div>
            {activeFilterCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-muted-foreground hover:text-foreground rounded-full h-10 px-4"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="grid gap-6 pb-8">
          {filterSections.map((section, index) => (
            <div 
              key={section.key} 
              className="space-y-3 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <label className="text-sm font-semibold text-foreground uppercase tracking-wide">
                {section.title}
              </label>
              <Select 
                value={section.value} 
                onValueChange={(value) => onFilterChange(section.key, value)}
              >
                <SelectTrigger className="w-full bg-app-surface-elevated/50 backdrop-blur-sm border-border/50 rounded-xl h-12 text-base hover:bg-app-surface-elevated hover:border-border transition-all duration-200">
                  <SelectValue placeholder={`Select ${section.title.toLowerCase()}`} />
                </SelectTrigger>
                <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50 rounded-xl">
                  {section.options.map((option) => (
                    <SelectItem 
                      key={option.value} 
                      value={option.value}
                      className="rounded-lg py-3 px-4 text-base"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-6 border-t border-border/30 pb-safe-bottom">
          <Button 
            onClick={() => setOpen(false)}
            className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground rounded-xl h-12 text-base font-semibold shadow-lg"
          >
            Show Results
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterBottomSheet;