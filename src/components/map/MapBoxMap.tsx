import {
  useEffect,
  useRef,
  forwardRef,
  useState,
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
  ({ }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);

    const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      const lang = getCookieValue("NEXT_LOCALE");
      setIsRTL(lang === "ar" ? "rtl" : "ltr");
      setIsMounted(true);
    }, [isMounted]);

    // Initialize map and markers
    useEffect(() => {
      if (mapRef.current || !mapContainerRef.current) return;

      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/outdoors-v12",
        attributionControl: false,
        center: [55.72068621532688, 24.237763395014575], // Center on UAE (lng, lat)
        zoom: 7,
        cooperativeGestures: true,
      });
    }, [isRTL]);

    return (
      <div
        ref={mapContainerRef}
        id="map"

      />
    );
  }
);

MapBoxMap.displayName = "MapBoxMap";

export default MapBoxMap;
