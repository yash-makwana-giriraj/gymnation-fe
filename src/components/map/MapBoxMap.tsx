import {
  useEffect,
  useRef,
  forwardRef,
  useState,
  useImperativeHandle,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  APILocationsResponse,
  MapBoxProps,
} from "@/interfaces/content";
import { getCookieValue } from "@/helpers/getCookie";

// Enhanced ref interface with popup control
export interface MapBoxRef {
  flyToLocation: (lat: number, lng: number, zoom?: number) => void;
  flyToLocationWithPopup: (
    lat: number,
    lng: number,
    locationData: APILocationsResponse,
    zoom?: number
  ) => void;
  openPopupAtLocation: (
    lat: number,
    lng: number,
    locationData: APILocationsResponse
  ) => void;
  closePopup: () => void;
  getMap: () => mapboxgl.Map | null;
}

const MapBoxMap = forwardRef<MapBoxRef, MapBoxProps>(
  ({ }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
    const [shouldRenderMap, setShouldRenderMap] = useState(false);

    // Set language direction once
    useEffect(() => {
      const lang = getCookieValue("NEXT_LOCALE");
      setIsRTL(lang === "ar" ? "rtl" : "ltr");
    }, []);

    // Lazy load the map only when container is visible
    useEffect(() => {
      if (!mapContainerRef.current) return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setShouldRenderMap(true);
          observer.disconnect();
        }
      });

      observer.observe(mapContainerRef.current);

      return () => observer.disconnect();
    }, []);

    // Initialize Mapbox map
    useEffect(() => {
      if (!shouldRenderMap || mapRef.current || !mapContainerRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        attributionControl: false,
        center: [55.72068621532688, 24.237763395014575],
        zoom: 7,
        cooperativeGestures: true,
      });

      // Optionally add controls based on direction
      const navControl = new mapboxgl.NavigationControl({ showCompass: false });
      mapRef.current.addControl(navControl, isRTL === "rtl" ? "top-right" : "top-left");

      return () => {
        mapRef.current?.remove();
        mapRef.current = null;
      };
    }, [shouldRenderMap, isRTL]);

    // Expose map functions through ref
    useImperativeHandle(ref, () => ({
      flyToLocation: (lat: number, lng: number, zoom?: number) => {
        mapRef.current?.flyTo({ center: [lng, lat], zoom });
      },
      flyToLocationWithPopup: (
        lat: number,
        lng: number,
        locationData: APILocationsResponse,
        zoom?: number
      ) => {
        mapRef.current?.flyTo({ center: [lng, lat], zoom });
        // popup logic here if needed later
      },
      openPopupAtLocation: (
       
      ) => {
        // popup logic here if needed later
      },
      closePopup: () => {
        // popup close logic here if needed later
      },
      getMap: () => mapRef.current,
    }));

    return (
      <div
        ref={mapContainerRef}
        id="map"
        style={{ minHeight: "100%", width: "100%" }}
      />
    );
  }
);

MapBoxMap.displayName = "MapBoxMap";

export default MapBoxMap;
