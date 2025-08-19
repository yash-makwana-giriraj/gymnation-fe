import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
  useCallback,
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

    const [gymReviewData, setGymReviewData] = useState<GymReview[]>([]);

    useEffect(() => {
      const loadGymReviews = async () => {
        try {
          const response = await fetchGymReviewData();
          if (response && Array.isArray(response)) {
            setGymReviewData(response);
          }
        } catch (err) {
          console.error("Error fetching latest news:", err);
        }
      };

      loadGymReviews();
    }, []);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      flyToLocation: (lat: number, lng: number, zoom: number = 15) => {
        if (mapRef.current) {
          // Close any open popup before flying
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
            currentPopupRef.current = null;
          }

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
          // Close any open popup before flying
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
            currentPopupRef.current = null;
          }

          mapRef.current.flyTo({
            center: [lng, lat],
            zoom: zoom,
            speed: 1.2,
            curve: 1.42,
          });

          // Open popup after flight completes
          const handleMoveEnd = () => {
            const popup = new mapboxgl.Popup({
              offset: 50,
              closeButton: true,
              closeOnClick: false,
            }).setHTML(getMapBoxData(locationData));

            popup.setLngLat([lng, lat]);
            popup.addTo(mapRef.current!);
            currentPopupRef.current = popup;

            // Remove the event listener after use
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
          // Close existing popup
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
            currentPopupRef.current = null;
          }

          const popup = new mapboxgl.Popup({
            offset: 40,
            closeButton: true,
            closeOnClick: false,
          }).setHTML(getMapBoxData(locationData));

          popup.setLngLat([lng, lat]);
          popup.addTo(mapRef.current);
          currentPopupRef.current = popup;
        }
      },
      closePopup: () => {
        if (currentPopupRef.current) {
          currentPopupRef.current.remove();
          currentPopupRef.current = null;
        }
      },
      getMap: () => mapRef.current,
    }));

    // Function to generate popup HTML with Tailwind CSS based on location data
    const getMapBoxData = useCallback((location: APILocationsResponse): string => {
      const locationName = location.name ?? "";
      const address = location.properties.mapAddress ?? "";
      const mapurl = location.properties.mapDirectionUrl ?? "#";
      const url = location.properties.externalRouting ?? "#";
      const mapcta = location.properties.mapDirectionUrl ?? "#";
      const commingsoontext = "Register Now";
      const joinNowText = "JOIN NOW";
      const gymnnfotext = "GYM INFO";
      const iscomingsoon = location.properties.isComingSoon ? "True" : "False";

      // Find the gym review data based on placeId
      const gymReview = gymReviewData.find(
        (review) => review.placeId === location.properties.placeId
      );
      const rating = gymReview?.ratings ? String(gymReview.ratings) : "4.5";
      const totalReview = gymReview?.totalReviews
        ? String(gymReview.totalReviews)
        : "123";
      const reviewText = "reviews";
      let opentext = location.properties.category ?? "OPEN 24/7";
      if (opentext !== "") opentext = `(${opentext})`;

      return `
        <div class="items-center font-family-primary mb-2">
          <h3 class="text-[18px] inline leading-[23px] pr-[4px] underline decoration-1 uppercase underline-offset-[2.5px] text-primary font-800">${locationName}</h3>
          <span class="text-[12px] font-500 leading-[12.4px] whitespace-nowrap text-primary">${opentext}</span>
        </div>
        <div class="flex justify-start items-center mb-[5px] mt-[8px]">
          <img src="/images/location-pin-dark.svg" alt="location icon" class="w-[15px] h-auto mr-[7px]" />
          <p class="text-[12px] font-500 leading-[12px]  text-primary">${address}</p>
        </div>
        ${rating !== "0"
          ? `
          <div class="mb-[5px] h-[23px] flex ">
            <span class="text-[12px] font-500 mb-[5px] mr-[7px] text-primary">${rating}</span>

            <span class="inline-block align-start !h-[15px] text-secondary mr-[8px] mb-[5px] ml-1">
              ${generateStars(rating)}
            </span>
            <div class="text-[10px] text-primary mb-[5px]">${totalReview} ${reviewText}</div>
          </div>
        `
          : ""
        }
        <div class="flex space-x-2">
          ${iscomingsoon === "True"
          ? `<a href="${mapurl}" target="_blank" class="flex-1 text-center p-0 text-[12px] capitalize leading-[22.73px] font-800 rounded-[48px] bg-secondary text-primary inline-block border-[2px] border-solid border-transparent hover:bg-secondary transition">${commingsoontext}</a>`
          : `
                <a href="${mapcta}" target="_blank" class="flex-1 text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border border-solid border-transparent hover:border-primary bg-secondary text-primary hover:bg-secondary transition">${joinNowText}</a>
                <a href="${url}" target="_blank" class="flex-1 text-primary text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border-[1.2px] border-primary  hover:bg-primary hover:text-white transition">${gymnnfotext}</a>
              `
        }
        </div>
    `;
    }, [gymReviewData]);

    // Helper function to generate star icons based on rating (supports half stars)
    function generateStars(ratingStr: string) {
      const rating = parseFloat(ratingStr);
      const fullStars = Math.floor(rating);
      const halfStar = rating - fullStars >= 0.5;
      let starsHTML = "";

      for (let i = 0; i < fullStars; i++) {
        starsHTML +=
          '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
      }
      if (halfStar) {
        starsHTML +=
          '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><defs><linearGradient id="half-grad"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half-grad)" d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
      }
      const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
      for (let i = 0; i < emptyStars; i++) {
        starsHTML +=
          '<svg class="inline !w-[19px] !h-[19px] text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
      }
      return starsHTML;
    }

    // Create popup for a specific location with current data
    const createPopupForLocation = useCallback((location: APILocationsResponse) => {
      return new mapboxgl.Popup({
        offset: 50,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(getMapBoxData(location));
    }, [getMapBoxData]);

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

      const nav = new mapboxgl.NavigationControl({
        showCompass: false,
      });

      if (isRTL === "rtl") {
        mapRef.current.addControl(nav, "top-right");
      } else if (isRTL === "ltr") {
        mapRef.current.addControl(nav, "top-left");
      }
      // Close popup when clicking outside of it
      mapRef.current?.on("click", (e) => {
        if (currentPopupRef.current) {
          const popupContainer = currentPopupRef.current._container;
          if (
            popupContainer &&
            !popupContainer.contains(e.originalEvent.target as Node)
          ) {
            currentPopupRef.current.remove();
            currentPopupRef.current = null;
          }
        }
      });
    }, [isRTL]);

    // Create/update markers when locations or gym review data changes
    useEffect(() => {
      if (!mapRef.current || !apiLocations.length) return;

      // Clear existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Store markers for potential future use
      const markers: mapboxgl.Marker[] = [];

      apiLocations.forEach((location) => {
        const lat = parseFloat(location.properties.locationLatitude ?? "");
        const lng = parseFloat(location.properties.locationLongitude ?? "");

        if (isNaN(lat) || isNaN(lng)) return;

        const el = document.createElement("div");
        el.className = "marker cursor-pointer";
        el.style.backgroundImage = `url(/icons/map-pin.svg)`;
        el.style.width = "30px";
        el.style.height = "50px";
        el.style.backgroundSize = "100%";
        el.style.backgroundRepeat = "no-repeat";
        el.style.padding = "0";

        const marker = new mapboxgl.Marker(el, { anchor: "bottom" })
          .setLngLat([lng, lat] as LngLatLike)
          .addTo(mapRef.current!);

        markers.push(marker);

        // Show popup on hover - creates fresh popup with current data
        el.addEventListener("mouseenter", () => {
          // Close any open popup
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
            currentPopupRef.current = null;
          }

          const popup = createPopupForLocation(location);
          popup.addTo(mapRef.current!);
          popup.setLngLat([lng, lat]);
          currentPopupRef.current = popup;
        });

        // On click, fly to the marker location and open the popup
        el.addEventListener("click", () => {
          // Close the existing popup before opening a new one
          if (currentPopupRef.current) {
            currentPopupRef.current.remove();
            currentPopupRef.current = null;
          }

          // Fly to the marker location
          mapRef.current?.flyTo({
            center: [lng, lat],
            zoom: 15,
            speed: 1.2,
          });

          // Open the popup after fly-to completes
          const handleMoveEnd = () => {
            const popup = createPopupForLocation(location);
            popup.addTo(mapRef.current!);
            popup.setLngLat([lng, lat]);
            currentPopupRef.current = popup;
            mapRef.current?.off("moveend", handleMoveEnd);
          };

          mapRef.current?.on("moveend", handleMoveEnd);
        });
      });

      markersRef.current = markers;
    }, [apiLocations, gymReviewData, createPopupForLocation]); // Re-run when gymReviewData changes

    return (
      <div
        ref={mapContainerRef}
        id="map"
        className={`h-full w-full ${pathname.includes("/gymsnearme") ? "rounded-[12px]" : ""
          }`}
      />
    );
  }
);

MapBoxMap.displayName = "MapBoxMap";

export default MapBoxMap;
