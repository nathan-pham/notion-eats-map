import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Restaurant } from "@/hooks/useRestaurants";

type MapProps = {
  accessToken: string;
  restaurants: Restaurant[];
};

const Map: React.FC<MapProps> = ({ accessToken, restaurants }) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapContainer.current || !accessToken) return;

    mapboxgl.accessToken = accessToken;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [0, 20],
      zoom: 1.5,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [accessToken]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    const bounds = new mapboxgl.LngLatBounds();
    let added = 0;

    restaurants.forEach((r) => {
      if (typeof r.lng === "number" && typeof r.lat === "number") {
        const popupHtml = `
          <div style="min-width: 200px">
            <h3 style="margin:0 0 4px 0;font-weight:600">${r.name}</h3>
            ${r.address ? `<div style="font-size:12px;color:#666">${r.address}</div>` : ""}
            ${r.cuisine ? `<div style="font-size:12px;margin-top:6px">Cuisine: ${r.cuisine}</div>` : ""}
            ${typeof r.rating === "number" ? `<div style="font-size:12px">Rating: ${r.rating}</div>` : ""}
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 24 }).setHTML(popupHtml);

        const marker = new mapboxgl.Marker({ color: "#dc2626" })
          .setLngLat([r.lng, r.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);
        bounds.extend([r.lng, r.lat]);
        added++;
      }
    });

    if (added > 0) {
      map.fitBounds(bounds, { padding: 40, duration: 800 });
    }
  }, [restaurants]);

  return <div ref={mapContainer} className="w-full h-full rounded-lg" />;
};

export default Map;
