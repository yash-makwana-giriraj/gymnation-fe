import {
  useEffect,
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  APILocationsResponse,
  GymReview,
  MapBoxProps,
} from "@/interfaces/content";
import { fetchGymReviewData } from "@/api-handler/apis/content";
import { getCookieValue } from "@/helpers/getCookie";

// Exposed functions
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
  const currentPopupRef = useRef<mapboxgl.Popup | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupLockRef = useRef<boolean>(false); // NEW: Prevent hover popups during flyTo/click

  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [shouldRenderMap, setShouldRenderMap] = useState(false);
  const [gymReviewData, setGymReviewData] = useState<GymReview[]>([]);

  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
  }, []);

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

  useEffect(() => {
    const loadGymReviews = async () => {
      try {
        const data = await fetchGymReviewData();
        if (data && Array.isArray(data)) setGymReviewData(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    loadGymReviews();
  }, []);

  const getPopupHTML = useCallback((location: APILocationsResponse) => {
    const locationName = location.name ?? "";
    const address = location.properties.mapAddress ?? "";
    const mapurl = location.properties.mapDirectionUrl ?? "#";
    const url = location.properties.externalRouting ?? "#";
    const mapcta = location.properties.mapDirectionUrl ?? "#";
    const commingsoontext = "Register Now";
    const joinNowText = "JOIN NOW";
    const gymnnfotext = "GYM INFO";
    const iscomingsoon = location.properties.isComingSoon ? "True" : "False";

    const gymReview = gymReviewData.find(
      (review) => review.placeId === location.properties.placeId
    );
    const rating = gymReview?.ratings ? String(gymReview.ratings) : "4.5";
    const totalReview = gymReview?.totalReviews ? String(gymReview.totalReviews) : "123";
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
        <p class="text-[12px] font-500 leading-[12px] text-primary">${address}</p>
      </div>
      ${rating !== "0"
        ? `
        <div class="mb-[5px] h-[23px] flex">
          <span class="text-[12px] font-500 mb-[5px] mr-[7px] text-primary">${rating}</span>
          <span class="flex align-start !h-[15px] text-secondary mr-[8px] mb-[5px] ml-1">
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

  const generateStars = (rating: number | string) => {
    const r = parseFloat(rating.toString());
    const full = Math.floor(r);
    const half = r - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    const fullStar = `<svg class="w-4 h-4 fill-current text-[#FFB800]" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>`;
    const halfStar = `<svg class="w-4 h-4 fill-current text-[#FFB800]" viewBox="0 0 20 20"><defs><linearGradient id="half"><stop offset="50%" stop-color="#FFB800"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#half)" d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>`;
    const emptyStar = `<svg class="w-4 h-4 text-gray-300 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09L5.822 12 1 7.91l6.061-.873L10 2l2.939 5.037 6.06.873-4.82 4.09 1.7 6.09z"/></svg>`;

    return (
      fullStar.repeat(full) +
      (half ? halfStar : "") +
      emptyStar.repeat(empty)
    );
  };

  const createPopup = useCallback((location: APILocationsResponse) => {
    return new mapboxgl.Popup({
      offset: 40,
      closeButton: true,
      closeOnClick: false,
    }).setHTML(getPopupHTML(location));
  }, [getPopupHTML]);

  useEffect(() => {
    if (!shouldRenderMap || mapRef.current || !mapContainerRef.current) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/outdoors-v12",
      center: [55.7206, 24.2377],
      zoom: 7,
      attributionControl: false,
      cooperativeGestures: true,
    });

    const nav = new mapboxgl.NavigationControl({ showCompass: false });
    mapRef.current.addControl(nav, isRTL === "rtl" ? "top-right" : "top-left");

    mapRef.current.on("click", (e) => {
      if (currentPopupRef.current) {
        const container = currentPopupRef.current._container;
        if (container && !container.contains(e.originalEvent.target as Node)) {
          currentPopupRef.current.remove();
          currentPopupRef.current = null;
        }
      }
    });
  }, [shouldRenderMap, isRTL]);

useEffect(() => {
  const canInitMarkers =
    mapRef.current &&
    apiLocations?.length &&
    gymReviewData.length &&
    markersRef.current.length === 0;
  if (!canInitMarkers) return;

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

    const marker = new mapboxgl.Marker(el, { anchor: "bottom" })
      .setLngLat([lng, lat])
      .addTo(mapRef.current!);

    el.addEventListener("mouseenter", () => {
      if (popupLockRef.current) return;

      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
        currentPopupRef.current = null;
      }

      const popup = createPopup(location);
      popup.setLngLat([lng, lat]).addTo(mapRef.current!);
      currentPopupRef.current = popup;
    });

    el.addEventListener("click", () => {
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
        currentPopupRef.current = null;
      }

      popupLockRef.current = true;

      mapRef.current?.flyTo({ center: [lng, lat], zoom: 15, speed: 1.2 });

      const handleFlyEnd = () => {
        const popup = createPopup(location);
        popup.setLngLat([lng, lat]).addTo(mapRef.current!);
        currentPopupRef.current = popup;
        popupLockRef.current = false;

        mapRef.current?.off("moveend", handleFlyEnd);
      };

      mapRef.current?.on("moveend", handleFlyEnd);
    });

    markersRef.current.push(marker);
  });
}, [apiLocations, gymReviewData, createPopup]);



  useImperativeHandle(ref, () => ({
    flyToLocation(lat, lng, zoom = 15) {
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
        currentPopupRef.current = null;
      }
      mapRef.current?.flyTo({ center: [lng, lat], zoom, speed: 1.2 });
    },
    flyToLocationWithPopup(lat, lng, locationData, zoom = 15) {
  if (currentPopupRef.current) {
    currentPopupRef.current.remove();
    currentPopupRef.current = null;
  }

  popupLockRef.current = true;

  mapRef.current?.flyTo({ center: [lng, lat], zoom, speed: 1.2 });

  const handleMoveEnd = () => {
    if (currentPopupRef.current) {
      currentPopupRef.current.remove();
      currentPopupRef.current = null;
    }

    const popup = createPopup(locationData);
    popup.setLngLat([lng, lat]).addTo(mapRef.current!);
    currentPopupRef.current = popup;
    popupLockRef.current = false;

    mapRef.current?.off("moveend", handleMoveEnd);
  };

  mapRef.current?.on("moveend", handleMoveEnd);
},

   openPopupAtLocation(lat, lng, locationData) {
  if (currentPopupRef.current) {
    currentPopupRef.current.remove();
    currentPopupRef.current = null;
  }
  const popup = createPopup(locationData);
  popup.setLngLat([lng, lat]).addTo(mapRef.current!);
  currentPopupRef.current = popup;
},

    closePopup() {
      if (currentPopupRef.current) {
        currentPopupRef.current.remove();
        currentPopupRef.current = null;
      }
    },
    getMap: () => mapRef.current,
  }));

  return <div ref={mapContainerRef} id="map" className="w-full h-full" />;
});

MapBoxMap.displayName = "MapBoxMap";
export default MapBoxMap;
