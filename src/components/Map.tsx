import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Restaurant } from "@/hooks/useRestaurants";

// Fix default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type MapProps = {
  restaurants: Restaurant[];
};

const Map: React.FC<MapProps> = ({ restaurants }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    mapRef.current = L.map(mapContainer.current, {
      center: [40.7128, -74.0060], // Default to NYC
      zoom: 2,
      zoomControl: true,
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapRef.current);

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const validRestaurants = restaurants.filter(
      (r) => typeof r.lat === "number" && typeof r.lng === "number"
    );

    // Add markers for restaurants with valid coordinates
    validRestaurants.forEach((restaurant) => {
      if (typeof restaurant.lat === "number" && typeof restaurant.lng === "number") {
        const popupContent = `
          <div style="min-width: 200px; font-family: system-ui, sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-weight: 600; font-size: 16px;">${restaurant.name}</h3>
            ${restaurant.address ? `<p style="margin: 0 0 6px 0; font-size: 14px; color: #666;">${restaurant.address}</p>` : ""}
            ${restaurant.cuisine ? `<p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Cuisine:</strong> ${restaurant.cuisine}</p>` : ""}
            ${typeof restaurant.rating === "number" ? `<p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Rating:</strong> ${restaurant.rating}/5</p>` : ""}
            ${restaurant.price_range ? `<p style="margin: 0 0 4px 0; font-size: 14px;"><strong>Price:</strong> ${restaurant.price_range}</p>` : ""}
            ${restaurant.description ? `<p style="margin: 6px 0 0 0; font-size: 13px; color: #555;">${restaurant.description}</p>` : ""}
          </div>
        `;

        const marker = L.marker([restaurant.lat, restaurant.lng])
          .addTo(map)
          .bindPopup(popupContent, {
            maxWidth: 300,
            className: "restaurant-popup",
          });

        markersRef.current.push(marker);
      }
    });

    // Fit map to show all markers
    if (validRestaurants.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      map.fitBounds(group.getBounds(), { padding: [20, 20] });
    }
  }, [restaurants]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};

export default Map;
