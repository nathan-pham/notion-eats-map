import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Restaurant = {
  id: string;
  name: string;
  location?: string;
  cuisine?: string;
  rating?: number;
  price_range?: string;
  description?: string;
  food_type?: string;
  good_date_spot?: boolean;
  seating_size?: string;
  restaurant_type?: string;
  raw?: any;
};

async function fetchRestaurants(): Promise<Restaurant[]> {
  const { data, error } = await supabase.rpc('get_restaurant_data');

  if (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }

  const restaurants = (data || []).map((row: any) => {
    const attrs = row.attrs || {};
    const properties = attrs.properties || {};

    // Extract restaurant name from title property
    const nameProperty = properties["Restaurant Name"]?.title?.[0]?.plain_text || "Unnamed Restaurant";
    
    // Extract cuisine from Cuisine Type property
    const cuisineProperty = properties["Cuisine Type"]?.select?.name;
    
    // Extract rating from Rating (1-5) property
    const ratingProperty = properties["Rating (1-5)"]?.number;
    
    // Extract price range from Typical Price (pp) property
    const priceProperty = properties["Typical Price (pp)"]?.select?.name;
    
    // Extract location from Location multi_select property
    const locationProperty = properties["Location"]?.multi_select;
    const locationAreas = locationProperty?.map((loc: any) => loc.name);
    const locationText = locationAreas?.join(", ");

    // Extract additional properties
    const foodTypeProperty = properties["Food Type"]?.select?.name;
    const goodDateSpotProperty = properties["Good Date Spot?"]?.checkbox;
    const seatingSizeProperty = properties["Seating Size"]?.select?.name;
    const restaurantTypeProperty = properties["Restaurant Type"]?.select?.name;

    return {
      id: row.id,
      name: nameProperty,
      location: locationText,
      cuisine: cuisineProperty,
      rating: ratingProperty,
      price_range: priceProperty,
      description: properties["What's Good To Try?"]?.rich_text?.[0]?.plain_text,
      food_type: foodTypeProperty,
      good_date_spot: goodDateSpotProperty,
      seating_size: seatingSizeProperty,
      restaurant_type: restaurantTypeProperty,
      raw: attrs,
    };
  });

  return restaurants;
}

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });
}
