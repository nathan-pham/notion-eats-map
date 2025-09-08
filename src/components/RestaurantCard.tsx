import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, DollarSign, Heart, Users } from "lucide-react";
import type { Restaurant } from "@/hooks/useRestaurants";

type RestaurantCardProps = {
  restaurant: Restaurant;
  onClick: () => void;
};

const RestaurantCard = ({ restaurant, onClick }: RestaurantCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3.5 h-3.5 ${
          i < Math.floor(rating)
            ? "text-warning fill-warning"
            : "text-muted-foreground/30"
        }`}
      />
    ));
  };

  return (
    <Card 
      className="group cursor-pointer bg-app-surface-elevated/50 backdrop-blur-sm border border-border/50 hover:bg-app-surface-elevated hover:border-border hover:shadow-lg transition-all duration-300 ease-out hover:scale-[1.02] active:scale-[0.98] rounded-2xl overflow-hidden"
      onClick={onClick}
    >
      <CardContent className="p-5 space-y-4">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-200">
              {restaurant.name}
            </h3>
            {restaurant.good_date_spot && (
              <div className="flex-shrink-0 p-1.5 rounded-full bg-primary/10">
                <Heart className="w-4 h-4 text-primary fill-primary" />
              </div>
            )}
          </div>
          
          {restaurant.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm line-clamp-1 font-medium">{restaurant.location}</span>
            </div>
          )}
        </div>

        {/* Rating - Prominently displayed */}
        {restaurant.rating && (
          <div className="flex items-center gap-2 py-2">
            <div className="flex items-center gap-1">
              {renderStars(restaurant.rating)}
            </div>
            <span className="text-sm font-semibold text-foreground">
              {restaurant.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">
              ({Math.floor(restaurant.rating * 12)} reviews)
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          {restaurant.cuisine && (
            <Badge variant="secondary" className="text-xs px-3 py-1 bg-primary/10 text-primary border-0 rounded-full font-medium">
              {restaurant.cuisine}
            </Badge>
          )}
          {restaurant.food_type && (
            <Badge variant="outline" className="text-xs px-3 py-1 border-border/50 text-muted-foreground rounded-full">
              {restaurant.food_type}
            </Badge>
          )}
        </div>

        {/* Details Row */}
        <div className="flex items-center gap-4 text-muted-foreground pt-2 border-t border-border/30">
          {restaurant.price_range && (
            <div className="flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">{restaurant.price_range}</span>
            </div>
          )}
          {restaurant.seating_size && (
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{restaurant.seating_size}</span>
            </div>
          )}
        </div>

        {/* Description Preview */}
        {restaurant.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed pt-2">
            {restaurant.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;