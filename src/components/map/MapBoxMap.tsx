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
import { APILocationsResponse, GymReview, MapBoxProps } from "@/interfaces/content";
import { fetchGymReviewData } from "@/api-handler/apis/content";
import { usePathname } from "next/navigation";
import { getCookieValue } from "@/helpers/getCookie";

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

const MapBoxMap = forwardRef<MapBoxRef, MapBoxProps>(({ apiLocations }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const pathname = usePathname();

  const [gymReviewData, setGymReviewData] = useState<GymReview[]>([]);

  // 1. Fetch gym reviews once
  useEffect(() => {
    const loadGymReviews = async () => {
      try {
        const resp = await fetchGymReviewData();
        if (Array.isArray(resp)) setGymReviewData(resp);
      } catch (err) {
        console.error("Error fetching gym reviews:", err);
      }
    };
    loadGymReviews();
  }, []);

  // 2. Memoized star generation
  const generateStars = useCallback((ratingStr: string) => {
    const rating = parseFloat(ratingStr);
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    let stars = "";
    for (let i = 0; i < full; i++) {
      stars += '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
    }
    if (half) {
      stars += '<svg class="inline !w-[19px] !h-[19px] fill-current" viewBox="0 0 20 20"><defs><linearGradient id="half-grad"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half-grad)" d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
    }
    for (let i = 0; i < 5 - full - (half ? 1 : 0); i++) {
      stars += '<svg class="inline !w-[19px] !h-[19px] text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>';
    }
    return stars;
  }, []);

  // 3. Memoized popup HTML
  const getMapBoxData = useCallback(
    (loc: APILocationsResponse): string => {
      const { name = "", properties } = loc;
      const {
        mapAddress = "",
        mapDirectionUrl = "#",
        externalRouting = "#",
        isComingSoon = false,
        placeId,
        category = "",
      } = properties;

      const review = gymReviewData.find((r) => r.placeId === placeId);
      const rating = review?.ratings?.toString() || "4.5";
      const total = review?.totalReviews?.toString() || "123";
      const openText = category ? `(${category})` : "";

      return `
        <div class="items-center font-family-primary mb-2">
          <h3 class="text-[18px] inline leading-[23px] pr-[4px] underline decoration-1 uppercase underline-offset-[2.5px] text-primary font-800">${name}</h3>
          <span class="text-[12px] font-500 leading-[12.4px] whitespace-nowrap text-primary">${openText}</span>
        </div>
        <div class="flex justify-start items-center mb-[5px] mt-[8px]">
          <img src="/images/location-pin-dark.svg" alt="location icon" class="w-[15px] h-auto mr-[7px]" />
          <p class="text-[12px] font-500 leading-[12px] text-primary">${mapAddress}</p>
        </div>
        ${rating !== "0"
          ? `<div class="mb-[5px] h-[23px] flex">
              <span class="text-[12px] font-500 mb-[5px] mr-[7px] text-primary">${rating}</span>
              <span class="inline-block align-start !h-[15px] text-secondary mr-[8px] mb-[5px] ml-1">${generateStars(rating)}</span>
              <div class="text-[10px] text-primary mb-[5px]">${total} reviews</div>
            </div>`
          : ""}
        <div class="flex space-x-2">
          ${
            isComingSoon
              ? `<a href="${mapDirectionUrl}" target="_blank" class="flex-1 text-center p-0 text-[12px] capitalize leading-[22.73px] font-800 rounded-[48px] bg-secondary text-primary inline-block border-[2px] border-transparent hover:bg-secondary transition">Register Now</a>`
              : `<a href="${mapDirectionUrl}" target="_blank" class="flex-1 text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border border-transparent hover:border-primary bg-secondary text-primary hover:bg-secondary transition">JOIN NOW</a>
                 <a href="${externalRouting}" target="_blank" class="flex-1 text-primary text-center p-0 text-[12px] leading-[22.73px] font-800 capitalize rounded-[48px] border-[1.2px] border-primary hover:bg-primary hover:text-white transition">GYM INFO</a>`
          }
        </div>
      `;
    },
    [gymReviewData, generateStars]
  );

  const createPopup = useCallback(
    (loc: APILocationsResponse): mapboxgl.Popup =>
      new mapboxgl.Popup({
        offset: 50,
        closeButton: true,
        closeOnClick: false,
      }).setHTML(getMapBoxData(loc)),
    [getMapBoxData]
  );

  // 4. Exposed ref methods
  useImperativeHandle(
    ref,
    () => ({
      flyToLocation: (lat, lng, zoom = 15) => {
        if (!mapRef.current) return;
        popupRef.current?.remove();
        popupRef.current = null;
        mapRef.current.flyTo({ center: [lng, lat], zoom, speed: 1.2, curve: 1.42 });
      },
      flyToLocationWithPopup: (lat, lng, loc, zoom = 15) => {
        if (!mapRef.current) return;
        popupRef.current?.remove();
        popupRef.current = null;
        mapRef.current.flyTo({ center: [lng, lat], zoom, speed: 1.2, curve: 1.42 });
        const onEnd = () => {
          popupRef.current = createPopup(loc).setLngLat([lng, lat]).addTo(mapRef.current!);
          mapRef.current?.off("moveend", onEnd);
        };
        mapRef.current.on("moveend", onEnd);
      },
      openPopupAtLocation: (lat, lng, loc) => {
        if (!mapRef.current) return;
        popupRef.current?.remove();
        popupRef.current = createPopup(loc).setLngLat([lng, lat]).addTo(mapRef.current);
      },
      closePopup: () => {
        popupRef.current?.remove();
        popupRef.current = null;
      },
      getMap: () => mapRef.current,
    }),
    [createPopup]
  );

  // 5. Initialize map (once)
  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;
    const m = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      attributionControl: false,
      center: [55.7206862, 24.2377634],
      zoom: 7,
      cooperativeGestures: true,
    });

    const nav = new mapboxgl.NavigationControl({ showCompass: false });
    const isRTL = getCookieValue("NEXT_LOCALE") === "ar";
    m.addControl(nav, isRTL ? "top-right" : "top-left");

    m.on("click", (e) => {
      if (popupRef.current) {
        const container = popupRef.current._container;
        if (container && !container.contains(e.originalEvent.target as Node)) {
          popupRef.current.remove();
          popupRef.current = null;
        }
      }
    });

    mapRef.current = m;
  }, []);

  // 6. Add markers and manage events
  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    apiLocations?.forEach((loc) => {
      const lat = parseFloat(loc.properties.locationLatitude ?? "");
      const lng = parseFloat(loc.properties.locationLongitude ?? "");
      if (isNaN(lat) || isNaN(lng)) return;

      const el = document.createElement("div");
      el.className = "marker cursor-pointer";
      Object.assign(el.style, {
        backgroundImage: `url(/icons/map-pin.svg)`,
        width: "30px",
        height: "50px",
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
        padding: "0",
      });

      const marker = new mapboxgl.Marker(el, { anchor: "bottom" })
        .setLngLat([lng, lat] as LngLatLike)
        .addTo(mapRef.current!);

      markersRef.current.push(marker);

      el.addEventListener("mouseenter", () => {
        popupRef.current?.remove();
        popupRef.current = createPopup(loc).setLngLat([lng, lat]).addTo(mapRef.current!);
      });

      el.addEventListener("click", () => {
        popupRef.current?.remove();
        popupRef.current = null;
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, speed: 1.2 });
        const onEndClick = () => {
          popupRef.current = createPopup(loc).setLngLat([lng, lat]).addTo(mapRef.current!);
          mapRef.current?.off("moveend", onEndClick);
        };
        mapRef.current?.on("moveend", onEndClick);
      });
    });
  }, [apiLocations, createPopup]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      className={`h-full w-full ${pathname.includes("/gymsnearme") ? "rounded-[12px]" : ""}`}
    />
  );
});

MapBoxMap.displayName = "MapBoxMap";
export default MapBoxMap;
