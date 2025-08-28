import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import RestaurantDetailDialog from "./RestaurantDetailDialog";
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
            placeholder="Search restaurants, locations, or dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cuisines</SelectItem>
                {filterOptions.cuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={foodTypeFilter} onValueChange={setFoodTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Food Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All food types</SelectItem>
              {filterOptions.foodTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={priceRangeFilter} onValueChange={setPriceRangeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All prices</SelectItem>
              {filterOptions.priceRanges.map(price => (
                <SelectItem key={price} value={price}>
                  {price}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ratings</SelectItem>
              {filterOptions.ratings.map(rating => (
                <SelectItem key={rating} value={rating}>
                  {rating === "5" ? "5 stars" : `${rating} stars & up`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={goodDateSpotFilter} onValueChange={setGoodDateSpotFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Date Spot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="yes">Good for dates</SelectItem>
              <SelectItem value="no">Not for dates</SelectItem>
            </SelectContent>
          </Select>

          <Select value={seatingSizeFilter} onValueChange={setSeatingSizeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Seating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              {filterOptions.seatingSizes.map(size => (
                <SelectItem key={size} value={size}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={restaurantTypeFilter} onValueChange={setRestaurantTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {filterOptions.restaurantTypes.map(type => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All locations</SelectItem>
              {filterOptions.locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Sort by Name</SelectItem>
              <SelectItem value="rating">Sort by Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        {filteredAndSortedRestaurants.length} restaurant{filteredAndSortedRestaurants.length !== 1 ? 's' : ''} found
      </div>

      {/* Restaurant Grid */}
      {filteredAndSortedRestaurants.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedRestaurants.map((restaurant) => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant}
              onClick={() => handleRestaurantClick(restaurant)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No restaurants found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
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