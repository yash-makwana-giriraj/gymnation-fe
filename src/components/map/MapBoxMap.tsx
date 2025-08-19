import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  APILocationsResponse,
  GymReview,
  MapBoxProps,
} from "@/interfaces/content";
import { fetchGymReviewData } from "@/api-handler/apis/content";
import { usePathname } from "next/navigation";
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
  ({ apiLocations }, ref) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const currentPopupRef = useRef<mapboxgl.Popup | null>(null);
    const markersRef = useRef<mapboxgl.Marker[]>([]);
    const pathname = usePathname();
    const eventListenersRef = useRef<(() => void)[]>([]);

    const [gymReviewData, setGymReviewData] = useState<GymReview[]>([]);
    const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
    const [isMounted, setIsMounted] = useState(false);

    // Memoize gym review data as a Map for O(1) lookups
    const gymReviewMap = useMemo(() => {
      const map = new Map<string, GymReview>();
      gymReviewData.forEach(review => {
        if (review.placeId) {
          map.set(review.placeId, review);
        }
      });
      return map;
    }, [gymReviewData]);

    // Initialize RTL state once
    useEffect(() => {
      if (isMounted) return;
      const lang = getCookieValue("NEXT_LOCALE");
      setIsRTL(lang === "ar" ? "rtl" : "ltr");
      setIsMounted(true);
    }, [isMounted]);

    // Fetch gym reviews once
    useEffect(() => {
      let isCancelled = false;

      const loadGymReviews = async () => {
        try {
          const response = await fetchGymReviewData();
          if (!isCancelled && response && Array.isArray(response)) {
            setGymReviewData(response);
          }
        } catch (err) {
          if (!isCancelled) {
            console.error("Error fetching gym reviews:", err);
          }
        }
      };

      loadGymReviews();

      return () => {
        isCancelled = true;
      };
    }, []);

    // Helper function to generate star icons (memoized)
    const generateStars = useCallback((ratingStr: string): string => {
      const rating = parseFloat(ratingStr);
      const fullStars = Math.floor(rating);
      const halfStar = rating - fullStars >= 0.5;
      let starsHTML = "";

      // Full stars
      const fullStarSVG = '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
      starsHTML += fullStarSVG.repeat(fullStars);

      // Half star
      if (halfStar) {
        starsHTML += '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><defs><linearGradient id="half-grad"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half-grad)" d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
      }

      // Empty stars
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      const emptyStarSVG = '<svg class="inline !w-[19px] !h-[19px] text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
      starsHTML += emptyStarSVG.repeat(emptyStars);

      return starsHTML;
    }, []);

    // Function to generate popup HTML (memoized with proper dependencies)
    const getMapBoxData = useCallback((location: APILocationsResponse): string => {
      const locationName = location.name ?? "";
      const address = location.properties.mapAddress ?? "";
      const mapurl = location.properties.mapDirectionUrl ?? "#";
      const url = location.properties.externalRouting ?? "#";
      const mapcta = location.properties.mapDirectionUrl ?? "#";
      const commingsoontext = "Register Now";
      const joinNowText = "JOIN NOW";
      const gymnnfotext = "GYM INFO";
      const iscomingsoon = location.properties.isComingSoon;

      // Use memoized gym review map for O(1) lookup
      const gymReview = location.properties.placeId ?
        gymReviewMap.get(location.properties.placeId) : null;

      const rating = gymReview?.ratings ? String(gymReview.ratings) : "4.5";
      const totalReview = gymReview?.totalReviews ? String(gymReview.totalReviews) : "123";
      const reviewText = "reviews";
      let opentext = location.properties.category ?? "OPEN 24/7";
      if (opentext !== "") opentext = `(${opentext})`;

      const ratingSection = rating !== "0" ? `
        <div class="mb-[5px] h-[23px] flex ">
          <span class="text-[12px] font-500 mb-[5px] mr-[7px] text-primary">${rating}</span>
          <span class="inline-block align-start !h-[15px] text-secondary mr-[8px] mb-[5px] ml-1">
            ${generateStars(rating)}
          </span>
          <div class="text-[10px] text-primary mb-[5px]">${totalReview} ${reviewText}</div>
        </div>
      ` : "";

      const buttonsSection = iscomingsoon ?
        `<a href="${mapurl}" target="_blank" class="flex-1 text-center p-0 text-[12px] capitalize leading-[22.73px] font-800 rounded-[48px] bg-secondary text-primary inline-block border-[2px] border-solid border-transparent hover:bg-secondary transition">${commingsoontext}</a>` :
        `<a href="${mapcta}" target="_blank" class="flex-1 text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border border-solid border-transparent hover:border-primary bg-secondary text-primary hover:bg-secondary transition">${joinNowText}</a>
         <a href="${url}" target="_blank" class="flex-1 text-primary text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border-[1.2px] border-primary  hover:bg-primary hover:text-white transition">${gymnnfotext}</a>`;

      return `
        <div class="items-center font-family-primary mb-2">
          <h3 class="text-[18px] inline leading-[23px] pr-[4px] underline decoration-1 uppercase underline-offset-[2.5px] text-primary font-800">${locationName}</h3>
          <span class="text-[12px] font-500 leading-[12.4px] whitespace-nowrap text-primary">${opentext}</span>
        </div>
        <div class="flex justify-start items-center mb-[5px] mt-[8px]">
          <img src="/images/location-pin-dark.svg" alt="location icon" class="w-[15px] h-auto mr-[7px]" />
          <p class="text-[12px] font-500 leading-[12px]  text-primary">${address}</p>
        </div>
        ${ratingSection}
        <div class="flex space-x-2">
          ${buttonsSection}
        </div>
      `;
    }, [gymReviewMap, generateStars]);

    // Create popup for a specific location (stable reference)
    const createPopupForLocation = useCallback((location: APILocationsResponse) => {
      return new mapboxgl.Popup({
        offset: 50,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(getMapBoxData(location));
    }, [getMapBoxData]);

    // Cleanup function for event listeners
    const cleanupEventListeners = useCallback(() => {
      eventListenersRef.current.forEach(cleanup => cleanup());
      eventListenersRef.current = [];
    }, []);

    // Close popup helper
    const closeCurrentPopup = useCallback(() => {
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
        currentPopupRef.current = null;
      }
    }, []);

    // Expose methods to parent component (stable references)
    useImperativeHandle(ref, () => ({
      flyToLocation: (lat: number, lng: number, zoom: number = 15) => {
        if (mapRef.current) {
          closeCurrentPopup();
          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            speed: 1.2,
            curve: 1.42,
          });
        }
      },
      flyToLocationWithPopup: (
        lat: number,
        lng: number,
        locationData: APILocationsResponse,
        zoom: number = 15
      ) => {
        if (mapRef.current) {
          closeCurrentPopup();

          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            speed: 1.2,
            curve: 1.42,
          });

          const handleMoveEnd = () => {
            const popup = createPopupForLocation(locationData);
            popup.setLngLat([lng, lat]);
            popup.addTo(mapRef.current!);
            currentPopupRef.current = popup;
            mapRef.current?.off("moveend", handleMoveEnd);
          };

          mapRef.current.on("moveend", handleMoveEnd);
        }
      },
      openPopupAtLocation: (
        lat: number,
        lng: number,
        locationData: APILocationsResponse
      ) => {
        if (mapRef.current) {
          closeCurrentPopup();

          const popup = createPopupForLocation(locationData);
          popup.setLngLat([lng, lat]);
          popup.addTo(mapRef.current);
          currentPopupRef.current = popup;
        }
      },
      closePopup: closeCurrentPopup,
      getMap: () => mapRef.current,
    }), [closeCurrentPopup, createPopupForLocation]);

    // Initialize map (only once, when RTL is determined)
    useEffect(() => {
      if (mapRef.current || !mapContainerRef.current || !isMounted) return;

      const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      if (!token) {
        console.error("NEXT_PUBLIC_MAPBOX_TOKEN is not set");
        return;
      }

      mapboxgl.accessToken = token;

      try {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/outdoors-v12",
          attributionControl: false,
          center: [55.72068621532688, 24.237763395014575],
          zoom: 7,
          cooperativeGestures: true,
        });

        const nav = new mapboxgl.NavigationControl({
          showCompass: false,
        });

        const controlPosition = isRTL === "rtl" ? "top-right" : "top-left";
        mapRef.current.addControl(nav, controlPosition);

        // Handle clicks outside popup
        const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
          if (currentPopupRef.current) {
            const popupContainer = currentPopupRef.current._container;
            if (popupContainer &&
              !popupContainer.contains(e.originalEvent.target as Node)) {
              closeCurrentPopup();
            }
          }
        };

        mapRef.current.on("click", handleMapClick);

        // Store cleanup function
        eventListenersRef.current.push(() => {
          mapRef.current?.off("click", handleMapClick);
        });

      } catch (error) {
        console.error("Error initializing map:", error);
      }

      // Cleanup on unmount
      return () => {
        cleanupEventListeners();
        closeCurrentPopup();
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        if (mapRef.current) {
          mapRef.current.remove();
          mapRef.current = null;
        }
      };
    }, [isMounted, isRTL, closeCurrentPopup, cleanupEventListeners]);

    // Create/update markers (optimized with proper cleanup)
    useEffect(() => {
      if (!mapRef.current || !apiLocations.length || !isMounted) return;

      // Clear existing markers and their event listeners
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      cleanupEventListeners();

      const markers: mapboxgl.Marker[] = [];

      apiLocations.forEach((location) => {
        const lat = parseFloat(location.properties.locationLatitude ?? "");
        const lng = parseFloat(location.properties.locationLongitude ?? "");

        if (isNaN(lat) || isNaN(lng)) return;

        // Create marker element
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
          .setLngLat([lng, lat] as LngLatLike)
          .addTo(mapRef.current!);

        markers.push(marker);

        // Hover handler
        const handleMouseEnter = () => {
          closeCurrentPopup();
          const popup = createPopupForLocation(location);
          popup.addTo(mapRef.current!);
          popup.setLngLat([lng, lat]);
          currentPopupRef.current = popup;
        };

        // Click handler
        const handleClick = () => {
          closeCurrentPopup();

          mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: 15,
            speed: 1.2,
          });

          const handleMoveEnd = () => {
            const popup = createPopupForLocation(location);
            popup.addTo(mapRef.current!);
            popup.setLngLat([lng, lat]);
            currentPopupRef.current = popup;
            mapRef.current?.off("moveend", handleMoveEnd);
          };

          mapRef.current?.on("moveend", handleMoveEnd);
        };

        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("click", handleClick);

        // Store cleanup functions
        eventListenersRef.current.push(() => {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("click", handleClick);
        });
      });

      markersRef.current = markers;
    }, [apiLocations, isMounted, createPopupForLocation, closeCurrentPopup, cleanupEventListeners]);

    // Memoize the className to prevent unnecessary re-renders
    const containerClassName = useMemo(() =>
      `h-full w-full ${pathname.includes("/gymsnearme") ? "rounded-[12px]" : ""}`,
      [pathname]
    );

    if (!isMounted) {
      return <div className={containerClassName} />; // Render placeholder while mounting
    }

    return (
      <div
        ref={mapContainerRef}
        id="map"
        className={containerClassName}
      />
    );
  }
);

MapBoxMap.displayName = "MapBoxMap";

export default MapBoxMap;