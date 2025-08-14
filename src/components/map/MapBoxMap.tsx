import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapBoxProps, APILocationsResponse } from "@/interfaces/content";
import { usePathname } from "next/navigation";
import { getCookieValue } from "@/helpers/getCookie";

// Exposed methods to parent
export interface MapBoxRef {
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;
  flyToLocationWithPopup: (
    lat: number,
    lng: number,
    locationData: APILocationsResponse,
    zoom?: number
  ) => void;
  getMap: () => mapboxgl.Map | null;
}

const MapBoxMap = forwardRef<MapBoxRef, MapBoxProps>(
  ({ apiLocations }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const pathname = usePathname();

    const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");

    // Expose methods
    useImperativeHandle(ref, () => ({
      flyToLocation: (lat: number, lng: number, zoom: number = 15) => {
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom,
            speed: 1.2,
            curve: 1.42,
          });
        }
      },
      flyToLocationWithPopup: (
        lat: number,
        lng: number,
        _locationData: APILocationsResponse,
        zoom: number = 15
      ) => {
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom,
            speed: 1.2,
            curve: 1.42,
          });
        }
      },
      getMap: () => mapRef.current,
    }));

    // RTL/LTR check
    useEffect(() => {
      const lang = getCookieValue("NEXT_LOCALE");
      setIsRTL(lang === "ar" ? "rtl" : "ltr");
    }, []);

    // Initialize Map
    useEffect(() => {
      if (mapRef.current || !mapContainerRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12", // <-- Keep default Mapbox style
        attributionControl: false,
        center: [55.72068621532688, 24.237763395014575], // Default UAE center
        zoom: 7,
        cooperativeGestures: true,
      });

      const nav = new mapboxgl.NavigationControl({ showCompass: false });
      mapRef.current.addControl(nav, isRTL === "rtl" ? "top-right" : "top-left");
    }, [isRTL]);

    // Add default markers (without custom DOM or popups)
    useEffect(() => {
      if (!mapRef.current || !apiLocations.length) return;

      // Clear old markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add default Mapbox markers
      apiLocations.forEach((location) => {
        const lat = parseFloat(location.properties.locationLatitude ?? "");
        const lng = parseFloat(location.properties.locationLongitude ?? "");

        if (isNaN(lat) || isNaN(lng)) return;

        const marker = new mapboxgl.Marker({ anchor: "bottom" })
          .setLngLat([lng, lat] as LngLatLike)
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      });
    }, [apiLocations]);

    return (
      <div
        ref={mapContainerRef}
        id="map"
        className={`h-full w-full ${
          pathname.includes("/gymsnearme") ? "rounded-[12px]" : ""
        }`}
      />
    );
  }
);

MapBoxMap.displayName = "MapBoxMap";

export default MapBoxMap;
