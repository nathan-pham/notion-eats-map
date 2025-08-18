interface GeocodingResult {
  lat: number;
  lng: number;
}

interface NominatimResponse {
  lat: string;
  lon: string;
  display_name: string;
}

export class GeocodingService {
  private static readonly NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search';
  private static cache = new Map<string, GeocodingResult | null>();

  static async geocodeRestaurant(
    restaurantName: string, 
    locationAreas?: string[]
  ): Promise<GeocodingResult | null> {
    // Create cache key
    const cacheKey = `${restaurantName}-${locationAreas?.join(',') || ''}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey) || null;
    }

    try {
      // Build search query
      let searchQuery = restaurantName;
      if (locationAreas && locationAreas.length > 0) {
        searchQuery += `, ${locationAreas.join(', ')}, Melbourne, Australia`;
      } else {
        searchQuery += `, Melbourne, Australia`;
      }

      const url = new URL(this.NOMINATIM_BASE_URL);
      url.searchParams.set('q', searchQuery);
      url.searchParams.set('format', 'json');
      url.searchParams.set('limit', '1');
      url.searchParams.set('addressdetails', '1');

      console.log(`Geocoding: ${searchQuery}`);

      const response = await fetch(url.toString(), {
        headers: {
          'User-Agent': 'RestaurantMap/1.0'
        }
      });

      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data: NominatimResponse[] = await response.json();
      
      if (data && data.length > 0) {
        const result = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
        
        console.log(`Found coordinates for ${restaurantName}:`, result);
        this.cache.set(cacheKey, result);
        return result;
      } else {
        console.log(`No coordinates found for ${restaurantName}`);
        this.cache.set(cacheKey, null);
        return null;
      }
    } catch (error) {
      console.error(`Error geocoding ${restaurantName}:`, error);
      this.cache.set(cacheKey, null);
      return null;
    }
  }

  static clearCache(): void {
    this.cache.clear();
  }
}