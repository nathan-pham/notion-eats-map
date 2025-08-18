import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Restaurant = {
  id: string;
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
  cuisine?: string;
  rating?: number;
  price_range?: string;
  description?: string;
  raw?: any;
};

async function fetchRestaurants(): Promise<Restaurant[]> {
  const client = supabase as any;
  const { data, error } = await client
    .schema("notion")
    .from("pages")
    .select("id, title, attrs");

  if (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }

  return (data || []).map((row: any) => {
    const attrs = row.attrs || {};
    const properties = attrs.properties || {};

    // Extract restaurant name from title property
    const nameProperty = properties["Restaurant Name"]?.title?.[0]?.plain_text || row.title || "Unnamed Restaurant";
    
    // Extract cuisine from Cuisine Type property
    const cuisineProperty = properties["Cuisine Type"]?.select?.name;
    
    // Extract rating from Rating (1-5) property
    const ratingProperty = properties["Rating (1-5)"]?.number;
    
    // Extract price range from Typical Price (pp) property
    const priceProperty = properties["Typical Price (pp)"]?.select?.name;
    
    // Extract location from Location multi_select property
    const locationProperty = properties["Location"]?.multi_select;
    const locationText = locationProperty?.map((loc: any) => loc.name).join(", ");

    // Since this data doesn't have lat/lng coordinates, we'll need to handle that differently
    // For now, we'll return restaurants without coordinates and they won't show on the map
    
    return {
      id: row.id,
      name: nameProperty,
      address: locationText,
      lat: undefined, // No coordinates in the Notion data
      lng: undefined, // No coordinates in the Notion data
      cuisine: cuisineProperty,
      rating: ratingProperty,
      price_range: priceProperty,
      description: properties["What's Good To Try?"]?.rich_text?.[0]?.plain_text,
      raw: attrs,
    } as Restaurant;
  });
}

export function useRestaurants() {
  return useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });
}
