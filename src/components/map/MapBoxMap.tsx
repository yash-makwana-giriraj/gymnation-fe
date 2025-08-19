import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import { getCookieValue } from "@/helpers/getCookie";
import "mapbox-gl/dist/mapbox-gl.css";

// Lazy load mapbox-gl to reduce initial bundle size
let mapboxgl: any = null;
let mapboxLoaded = false;

const loadMapbox = async () => {
  if (mapboxLoaded) return mapboxgl;

  const [mapboxModule] = await Promise.all([
    import("mapbox-gl")
  ]);

  mapboxgl = mapboxModule.default;
  mapboxLoaded = true;
  return mapboxgl;
};

import {
  APILocationsResponse,
  GymReview,
  MapBoxProps,
} from "@/interfaces/content";

// Enhanced ref interface
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
  getMap: () => any | null;
}

// Pre-compile templates for better performance
const STAR_SVG_FULL = '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
const STAR_SVG_HALF = '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><defs><linearGradient id="half-grad"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half-grad)" d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
const STAR_SVG_EMPTY = '<svg class="inline !w-[19px] !h-[19px] text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';

// Cache for popup HTML to avoid regeneration
const popupCache = new Map<string, string>();

const MapBoxMap = forwardRef<MapBoxRef, MapBoxProps>(
  ({ apiLocations }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const currentPopupRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const gymReviewMapRef = useRef<Map<string, GymReview>>(new Map());

    const [isMapLoaded, setIsMapLoaded] = useState(false);
    const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
    const [isInitialized, setIsInitialized] = useState(false);

    // Lazy load gym reviews only when needed
    const loadGymReviews = useCallback(async () => {
      if (gymReviewMapRef.current.size > 0) return gymReviewMapRef.current;

      try {
        const { fetchGymReviewData } = await import("@/api-handler/apis/content");
        const response = await fetchGymReviewData();

        if (response && Array.isArray(response)) {
          const reviewMap = new Map<string, GymReview>();
          response.forEach(review => {
            if (review.placeId) {
              reviewMap.set(review.placeId, review);
            }
          });
          gymReviewMapRef.current = reviewMap;
        }
      } catch (err) {
        console.error("Error fetching gym reviews:", err);
      }

      return gymReviewMapRef.current;
    }, []);

    // Pre-calculate stars HTML for common ratings
    const starsCache = useMemo(() => {
      const cache = new Map<string, string>();
      for (let i = 0; i <= 50; i++) { // 0 to 5.0 in 0.1 increments
        const rating = i / 10;
        const fullStars = Math.floor(rating);
        const halfStar = rating - fullStars >= 0.5;

        let html = STAR_SVG_FULL.repeat(fullStars);
        if (halfStar) html += STAR_SVG_HALF;

        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        html += STAR_SVG_EMPTY.repeat(emptyStars);

        cache.set(rating.toFixed(1), html);
      }
      return cache;
    }, []);

    const generateStarsOptimized = useCallback((ratingStr: string): string => {
      const rating = parseFloat(ratingStr);
      const key = Math.round(rating * 10) / 10; // Round to nearest 0.1
      return starsCache.get(key.toFixed(1)) || '';
    }, [starsCache]);

    // Optimized popup generation with caching
    const getMapBoxData = useCallback(async (location: APILocationsResponse): Promise<string> => {
      const cacheKey = `${location.sys?.id || location.id}-${location.properties.placeId}`;

      if (popupCache.has(cacheKey)) {
        return popupCache.get(cacheKey)!;
      }

      const gymReviewMap = await loadGymReviews();
      const gymReview = location.properties.placeId ?
        gymReviewMap.get(location.properties.placeId) : null;

      const locationName = location.name ?? "";
      const address = location.properties.mapAddress ?? "";
      const mapurl = location.properties.mapDirectionUrl ?? "#";
      const url = location.properties.externalRouting ?? "#";
      const mapcta = location.properties.mapDirectionUrl ?? "#";
      const iscomingsoon = location.properties.isComingSoon;

      const rating = gymReview?.ratings ? String(gymReview.ratings) : "4.5";
      const totalReview = gymReview?.totalReviews ? String(gymReview.totalReviews) : "123";

      let opentext = location.properties.category ?? "OPEN 24/7";
      if (opentext !== "") opentext = `(${opentext})`;

      const ratingSection = rating !== "0" ? `
        <div class="mb-[5px] h-[23px] flex">
          <span class="text-[12px] font-500 mb-[5px] mr-[7px] text-primary">${rating}</span>
          <span class="inline-block align-start !h-[15px] text-secondary mr-[8px] mb-[5px] ml-1">
            ${generateStarsOptimized(rating)}
          </span>
          <div class="text-[10px] text-primary mb-[5px]">${totalReview} reviews</div>
        </div>
      ` : "";

      const buttonsSection = iscomingsoon ?
        `<a href="${mapurl}" target="_blank" class="flex-1 text-center p-0 text-[12px] capitalize leading-[22.73px] font-800 rounded-[48px] bg-secondary text-primary inline-block border-[2px] border-solid border-transparent hover:bg-secondary transition">Register Now</a>` :
        `<a href="${mapcta}" target="_blank" class="flex-1 text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border border-solid border-transparent hover:border-primary bg-secondary text-primary hover:bg-secondary transition">JOIN NOW</a>
         <a href="${url}" target="_blank" class="flex-1 text-primary text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border-[1.2px] border-primary hover:bg-primary hover:text-white transition">GYM INFO</a>`;

      const html = `
        <div class="items-center font-family-primary mb-2">
          <h3 class="text-[18px] inline leading-[23px] pr-[4px] underline decoration-1 uppercase underline-offset-[2.5px] text-primary font-800">${locationName}</h3>
          <span class="text-[12px] font-500 leading-[12.4px] whitespace-nowrap text-primary">${opentext}</span>
        </div>
        <div class="flex justify-start items-center mb-[5px] mt-[8px]">
          <img src="/images/location-pin-dark.svg" alt="location icon" class="w-[15px] h-auto mr-[7px]" />
          <p class="text-[12px] font-500 leading-[12px] text-primary">${address}</p>
        </div>
        ${ratingSection}
        <div class="flex space-x-2">
          ${buttonsSection}
        </div>
      `;

      popupCache.set(cacheKey, html);
      return html;
    }, [generateStarsOptimized, loadGymReviews]);

    const closeCurrentPopup = useCallback(() => {
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
        currentPopupRef.current = null;
      }
    }, []);

    // Initialize RTL once
    useEffect(() => {
      if (isInitialized) return;

      const lang = getCookieValue("NEXT_LOCALE");
      setIsRTL(lang === "ar" ? "rtl" : "ltr");
      setIsInitialized(true);
    }, [isInitialized]);

    // Load mapbox and initialize map
    useEffect(() => {
      if (!isInitialized || mapRef.current || !mapContainerRef.current) return;

      let isCancelled = false;

      const initMap = async () => {
        try {
          const mapboxgl = await loadMapbox();

          if (isCancelled) return;

          const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
          if (!token) {
            console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
            return;
          }

          mapboxgl.accessToken = token;

          mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current!,
            style: "mapbox://styles/mapbox/outdoors-v12",
            attributionControl: false,
            center: [55.72068621532688, 24.237763395014575],
            zoom: 7,
            cooperativeGestures: true,
          });

          const nav = new mapboxgl.NavigationControl({ showCompass: false });
          const controlPosition = isRTL === "rtl" ? "top-right" : "top-left";
          mapRef.current.addControl(nav, controlPosition);

          mapRef.current.on("click", (e: any) => {
            if (currentPopupRef.current) {
              const popupContainer = currentPopupRef.current._container;
              if (popupContainer && !popupContainer.contains(e.originalEvent.target)) {
                closeCurrentPopup();
              }
            }
          });

          mapRef.current.on('load', () => {
            setIsMapLoaded(true);
          });

        } catch (error) {
          if (!isCancelled) {
            console.error("Error initializing map:", error);
          }
        }
      };

      initMap();

      return () => {
        isCancelled = true;
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }, [isInitialized, isRTL, closeCurrentPopup]);

    // Optimized marker creation with object pooling
    useEffect(() => {
      if (!mapRef.current || !isMapLoaded || !apiLocations.length) return;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Use requestIdleCallback for non-critical marker creation
      const createMarkersWhenIdle = () => {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => createMarkers());
        } else {
          setTimeout(createMarkers, 0);
        }
      };

      const createMarkers = async () => {
        const mapboxgl = await loadMapbox();
        const markers: any[] = [];

        // Process markers in batches to avoid blocking
        const batchSize = 10;
        for (let i = 0; i < apiLocations.length; i += batchSize) {
          const batch = apiLocations.slice(i, i + batchSize);

          batch.forEach((location) => {
            const lat = parseFloat(location.properties.locationLatitude ?? "");
            const lng = parseFloat(location.properties.locationLongitude ?? "");

            if (isNaN(lat) || isNaN(lng)) return;

            const el = document.createElement("div");
            el.className = "marker cursor-pointer";
            el.style.cssText = `
              background-image: url(/icons/map-pin.svg);
              width: 30px;
              height: 50px;
              background-size: 100%;
              background-repeat: no-repeat;
              padding: 0;
            `;

            const marker = new mapboxgl.Marker(el, { anchor: "bottom" })
              .setLngLat([lng, lat])
              .addTo(mapRef.current);

            markers.push(marker);

            const showPopup = async () => {
              closeCurrentPopup();
              const html = await getMapBoxData(location);
              const popup = new mapboxgl.Popup({
                offset: 50,
                closeButton: true,
                closeOnClick: false,
              }).setHTML(html);

              popup.setLngLat([lng, lat]);
              popup.addTo(mapRef.current);
              currentPopupRef.current = popup;
            };

            const flyAndShowPopup = async () => {
              closeCurrentPopup();

              mapRef.current.flyTo({
                center: [lng, lat],
                zoom: 15,
                speed: 1.2,
              });

              const handleMoveEnd = async () => {
                const html = await getMapBoxData(location);
                const popup = new mapboxgl.Popup({
                  offset: 50,
                  closeButton: true,
                  closeOnClick: false,
                }).setHTML(html);

                popup.setLngLat([lng, lat]);
                popup.addTo(mapRef.current);
                currentPopupRef.current = popup;
                mapRef.current.off("moveend", handleMoveEnd);
              };

              mapRef.current.on("moveend", handleMoveEnd);
            };

            el.addEventListener("mouseenter", showPopup, { passive: true });
            el.addEventListener("click", flyAndShowPopup, { passive: true });
          });

          // Yield control between batches
          if (i + batchSize < apiLocations.length) {
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        markersRef.current = markers;
      };

      createMarkersWhenIdle();
    }, [apiLocations, isMapLoaded, getMapBoxData, closeCurrentPopup]);

    // Stable imperative methods
    useImperativeHandle(ref, () => ({
      flyToLocation: (lat: number, lng: number, zoom: number = 15) => {
        if (mapRef.current && isMapLoaded) {
          closeCurrentPopup();
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            speed: 1.2,
            curve: 1.42,
          });
        }
      },
      flyToLocationWithPopup: async (
        lat: number,
        lng: number,
        locationData: APILocationsResponse,
        zoom: number = 15
      ) => {
        if (mapRef.current && isMapLoaded) {
          closeCurrentPopup();

          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            speed: 1.2,
            curve: 1.42,
          });

          const handleMoveEnd = async () => {
            const mapboxgl = await loadMapbox();
            const html = await getMapBoxData(locationData);
            const popup = new mapboxgl.Popup({
              offset: 50,
              closeButton: true,
              closeOnClick: false,
            }).setHTML(html);

            popup.setLngLat([lng, lat]);
            popup.addTo(mapRef.current);
            currentPopupRef.current = popup;
            mapRef.current.off("moveend", handleMoveEnd);
          };

          mapRef.current.on("moveend", handleMoveEnd);
        }
      },
      openPopupAtLocation: async (
        lat: number,
        lng: number,
        locationData: APILocationsResponse
      ) => {
        if (mapRef.current && isMapLoaded) {
          closeCurrentPopup();

          const mapboxgl = await loadMapbox();
          const html = await getMapBoxData(locationData);
          const popup = new mapboxgl.Popup({
            offset: 40,
            closeButton: true,
            closeOnClick: false,
          }).setHTML(html);

          popup.setLngLat([lng, lat]);
          popup.addTo(mapRef.current);
          currentPopupRef.current = popup;
        }
      },
      closePopup: closeCurrentPopup,
      getMap: () => mapRef.current,
    }), [isMapLoaded, closeCurrentPopup, getMapBoxData]);

    // Use pathname from hook only when needed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { usePathname } = require("next/navigation");
    const pathname = usePathname();

    const containerClassName = useMemo(() =>
      `h-full w-full ${pathname.includes("/gymsnearme") ? "rounded-[12px]" : ""}`,
      [pathname]
    );

    if (!isInitialized) {
      return <div className={containerClassName} />;
    }

    return (
      <div
        ref={mapContainerRef}
        id="map"
        className={containerClassName}
        style={{ minHeight: '100%' }}
      />
    );
  }
);

MapBoxMap.displayName = "MapBoxMap";

export default MapBoxMap;