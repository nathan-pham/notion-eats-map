import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import RestaurantCard from "./RestaurantCard";
import type { Restaurant } from "@/hooks/useRestaurants";

type RestaurantListProps = {
  restaurants: Restaurant[];
};

const RestaurantList = ({ restaurants }: RestaurantListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const cuisines = useMemo(() => {
    const uniqueCuisines = [...new Set(restaurants.map(r => r.cuisine).filter(Boolean))];
    return uniqueCuisines.sort();
  }, [restaurants]);

  const filteredAndSortedRestaurants = useMemo(() => {
    let filtered = restaurants.filter(restaurant => {
      const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCuisine = cuisineFilter === "all" || restaurant.cuisine === cuisineFilter;
      
      return matchesSearch && matchesCuisine;
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
  }, [restaurants, searchTerm, cuisineFilter, sortBy]);

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

        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={cuisineFilter} onValueChange={setCuisineFilter}>
              <SelectTrigger className="min-w-0">
                <SelectValue placeholder="All cuisines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All cuisines</SelectItem>
                {cuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-auto min-w-[140px]">
              <SelectValue />
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
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No restaurants found matching your criteria.</p>
          <p className="text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;