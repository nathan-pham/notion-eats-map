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

  if (error) throw error;

  return (data || []).map((row: any) => {
    const attrs = row.attrs || {};
    const location = attrs.location || attrs.loc || {};
    const lat = location.lat ?? location.latitude;
    const lng = location.lng ?? location.lon ?? location.longitude;

    return {
      id: row.id,
      name: row.title || attrs.name || "Unnamed Restaurant",
      address: location.address || attrs.address,
      lat: typeof lat === "string" ? parseFloat(lat) : lat,
      lng: typeof lng === "string" ? parseFloat(lng) : lng,
      cuisine: attrs.cuisine,
      rating: typeof attrs.rating === "string" ? parseFloat(attrs.rating) : attrs.rating,
      price_range: attrs.price_range || attrs.priceRange,
      description: attrs.description,
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
