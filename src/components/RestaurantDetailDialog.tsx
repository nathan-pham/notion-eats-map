import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Star, DollarSign, Clock, Calendar } from "lucide-react";
import type { Restaurant } from "@/hooks/useRestaurants";

type RestaurantDetailDialogProps = {
  restaurant: Restaurant | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const RestaurantDetailDialog = ({ restaurant, open, onOpenChange }: RestaurantDetailDialogProps) => {
  if (!restaurant) return null;

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

  // Extract additional data from attrs
  const properties = restaurant.raw?.properties || {};
  
  // Get all available properties
  const getPropertyValue = (property: any) => {
    if (!property) return null;
    
    if (property.title) return property.title[0]?.plain_text;
    if (property.rich_text) return property.rich_text[0]?.plain_text;
    if (property.select) return property.select.name;
    if (property.multi_select) return property.multi_select.map((item: any) => item.name).join(", ");
    if (property.number !== undefined) return property.number;
    if (property.checkbox !== undefined) return property.checkbox ? "Yes" : "No";
    if (property.date) return property.date.start;
    if (property.url) return property.url;
    if (property.email) return property.email;
    if (property.phone_number) return property.phone_number;
    
    return null;
  };

  const additionalFields = Object.entries(properties)
    .filter(([key]) => !["Restaurant Name", "Location", "Cuisine Type", "Rating (1-5)", "Typical Price (pp)", "What's Good To Try?"].includes(key))
    .map(([key, value]) => ({
      label: key,
      value: getPropertyValue(value)
    }))
    .filter(({ value }) => value !== null && value !== "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{restaurant.name}</DialogTitle>
          <DialogDescription className="sr-only">
            Detailed information about {restaurant.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            {restaurant.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <span className="text-base">{restaurant.location}</span>
              </div>
            )}

            {restaurant.rating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {renderStars(restaurant.rating)}
                  <span className="text-base font-medium ml-1">{restaurant.rating}/5</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 flex-wrap">
              {restaurant.cuisine && (
                <Badge variant="secondary" className="text-sm">
                  {restaurant.cuisine}
                </Badge>
              )}

              {restaurant.price_range && (
                <div className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{restaurant.price_range}</span>
                </div>
              )}
            </div>
          </div>

          {restaurant.description && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">What's Good To Try</h3>
                <p className="text-muted-foreground leading-relaxed">{restaurant.description}</p>
              </div>
            </>
          )}

          {/* Additional Information */}
          {additionalFields.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Additional Details</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {additionalFields.map(({ label, value }) => (
                    <div key={label} className="space-y-1">
                      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
                      <dd className="text-sm">{String(value)}</dd>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Metadata */}
          {restaurant.raw?.created_time && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Information</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Added: {new Date(restaurant.raw.created_time).toLocaleDateString()}</span>
                </div>
                {restaurant.raw.last_edited_time && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Last updated: {new Date(restaurant.raw.last_edited_time).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantDetailDialog;