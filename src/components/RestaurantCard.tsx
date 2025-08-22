import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, DollarSign } from "lucide-react";
import type { Restaurant } from "@/hooks/useRestaurants";

type RestaurantCardProps = {
  restaurant: Restaurant;
};

const RestaurantCard = ({ restaurant }: RestaurantCardProps) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating
            ? "fill-primary text-primary"
            : "fill-muted text-muted"
        }`}
      />
    ));
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight">{restaurant.name}</h3>
          {restaurant.rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              {renderStars(restaurant.rating)}
              <span className="text-sm font-medium ml-1">{restaurant.rating}</span>
            </div>
          )}
        </div>
        
        {restaurant.location && (
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{restaurant.location}</span>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {restaurant.cuisine && (
            <Badge variant="secondary" className="text-xs">
              {restaurant.cuisine}
            </Badge>
          )}

          {restaurant.price_range && (
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">{restaurant.price_range}</span>
            </div>
          )}

          {restaurant.description && (
            <p className="text-sm text-muted-foreground line-clamp-3">
              {restaurant.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RestaurantCard;