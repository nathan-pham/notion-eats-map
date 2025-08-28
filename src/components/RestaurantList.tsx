import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ArrowUpDown } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import RestaurantDetailDialog from "./RestaurantDetailDialog";
import FilterBottomSheet from "./FilterBottomSheet";
import type { Restaurant } from "@/hooks/useRestaurants";

type RestaurantListProps = {
  restaurants: Restaurant[];
};

const RestaurantList = ({ restaurants }: RestaurantListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string>("all");
  const [foodTypeFilter, setFoodTypeFilter] = useState<string>("all");
  const [priceRangeFilter, setPriceRangeFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [goodDateSpotFilter, setGoodDateSpotFilter] = useState<string>("all");
  const [seatingSizeFilter, setSeatingSizeFilter] = useState<string>("all");
  const [restaurantTypeFilter, setRestaurantTypeFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Generate filter options from restaurant data
  const filterOptions = useMemo(() => {
    return {
      cuisines: [...new Set(restaurants.map(r => r.cuisine).filter(Boolean))].sort(),
      foodTypes: [...new Set(restaurants.map(r => r.food_type).filter(Boolean))].sort(),
      priceRanges: [...new Set(restaurants.map(r => r.price_range).filter(Boolean))].sort(),
      ratings: ["1+", "2+", "3+", "4+", "5"],
      seatingSizes: [...new Set(restaurants.map(r => r.seating_size).filter(Boolean))].sort(),
      restaurantTypes: [...new Set(restaurants.map(r => r.restaurant_type).filter(Boolean))].sort(),
      locations: [...new Set(restaurants.map(r => r.location).filter(Boolean))].sort(),
    };
  }, [restaurants]);

  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCuisine = cuisineFilter === "all" || restaurant.cuisine === cuisineFilter;
      const matchesFoodType = foodTypeFilter === "all" || restaurant.food_type === foodTypeFilter;
      const matchesPriceRange = priceRangeFilter === "all" || restaurant.price_range === priceRangeFilter;
      const matchesSeatingSize = seatingSizeFilter === "all" || restaurant.seating_size === seatingSizeFilter;
      const matchesRestaurantType = restaurantTypeFilter === "all" || restaurant.restaurant_type === restaurantTypeFilter;
      const matchesLocation = locationFilter === "all" || restaurant.location === locationFilter;
      const matchesGoodDateSpot = goodDateSpotFilter === "all" || 
        (goodDateSpotFilter === "yes" && restaurant.good_date_spot) ||
        (goodDateSpotFilter === "no" && !restaurant.good_date_spot);
      
      const matchesRating = ratingFilter === "all" || (() => {
        const minRating = parseInt(ratingFilter.replace("+", ""));
        return (restaurant.rating || 0) >= minRating;
      })();
      
      return matchesSearch && matchesCuisine && matchesFoodType && matchesPriceRange && 
             matchesSeatingSize && matchesRestaurantType && matchesLocation && 
             matchesGoodDateSpot && matchesRating;
    });

    // Sort restaurants
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [restaurants, searchTerm, cuisineFilter, foodTypeFilter, priceRangeFilter, 
      ratingFilter, goodDateSpotFilter, seatingSizeFilter, restaurantTypeFilter, 
      locationFilter, sortBy]);

  const filters = {
    cuisine: cuisineFilter,
    foodType: foodTypeFilter,
    priceRange: priceRangeFilter,
    rating: ratingFilter,
    goodDateSpot: goodDateSpotFilter,
    seatingSize: seatingSizeFilter,
    restaurantType: restaurantTypeFilter,
    location: locationFilter
  };

  const activeFilterCount = Object.values(filters).filter(value => value !== "all").length;

  const handleFilterChange = (filterType: string, value: string) => {
    switch (filterType) {
      case "cuisine":
        setCuisineFilter(value);
        break;
      case "foodType":
        setFoodTypeFilter(value);
        break;
      case "priceRange":
        setPriceRangeFilter(value);
        break;
      case "rating":
        setRatingFilter(value);
        break;
      case "goodDateSpot":
        setGoodDateSpotFilter(value);
        break;
      case "seatingSize":
        setSeatingSizeFilter(value);
        break;
      case "restaurantType":
        setRestaurantTypeFilter(value);
        break;
      case "location":
        setLocationFilter(value);
        break;
    }
  };

  const handleClearFilters = () => {
    setCuisineFilter("all");
    setFoodTypeFilter("all");
    setPriceRangeFilter("all");
    setRatingFilter("all");
    setGoodDateSpotFilter("all");
    setSeatingSizeFilter("all");
    setRestaurantTypeFilter("all");
    setLocationFilter("all");
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Controls */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search restaurants, dishes, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-app-surface-elevated border-border placeholder:text-muted-foreground focus:ring-primary"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <FilterBottomSheet
            filterOptions={filterOptions}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFilterCount={activeFilterCount}
          />
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto min-w-[140px] bg-app-surface-elevated border-border">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="name">Name A-Z</SelectItem>
              <SelectItem value="rating">Best Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {filteredAndSortedRestaurants.length} restaurant{filteredAndSortedRestaurants.length !== 1 ? 's' : ''} found
        </div>
        {activeFilterCount > 0 && (
          <div className="text-xs text-primary">
            {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
          </div>
        )}
      </div>

      {/* Restaurant Grid */}
      {filteredAndSortedRestaurants.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
          {filteredAndSortedRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant}
              onClick={() => handleRestaurantClick(restaurant)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 space-y-2 animate-fade-in">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-lg text-foreground">No restaurants found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters to discover new places</p>
        </div>
      )}

      {/* Detail Dialog */}
      <RestaurantDetailDialog
        restaurant={selectedRestaurant}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default RestaurantList;