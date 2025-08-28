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
        className={`w-3 h-3 ${
          i < Math.floor(rating)
            ? "text-warning fill-warning"
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  return (
    <Card 
      className="group cursor-pointer bg-gradient-card border-border hover:bg-app-surface-elevated transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
      onClick={onClick}
    >
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
              {restaurant.name}
            </h3>
            {restaurant.good_date_spot && (
              <Heart className="w-4 h-4 text-primary fill-primary flex-shrink-0 mt-0.5" />
            )}
          </div>
          
          {restaurant.location && (
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-xs line-clamp-1">{restaurant.location}</span>
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {restaurant.cuisine && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-app-surface-elevated text-foreground border-border">
              {restaurant.cuisine}
            </Badge>
          )}
          {restaurant.food_type && (
            <Badge variant="outline" className="text-xs px-2 py-0.5 border-border text-muted-foreground">
              {restaurant.food_type}
            </Badge>
          )}
        </div>

        {/* Rating and Details */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {restaurant.rating && (
              <>
                <div className="flex items-center gap-0.5">
                  {renderStars(restaurant.rating)}
                </div>
                <span className="text-xs text-muted-foreground ml-1">
                  {restaurant.rating.toFixed(1)}
                </span>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            {restaurant.price_range && (
              <div className="flex items-center gap-0.5">
                <DollarSign className="w-3 h-3" />
                <span className="text-xs">{restaurant.price_range}</span>
              </div>
            )}
            {restaurant.seating_size && (
              <div className="flex items-center gap-0.5">
                <Users className="w-3 h-3" />
                <span className="text-xs">{restaurant.seating_size}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description Preview */}
        {restaurant.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {restaurant.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;