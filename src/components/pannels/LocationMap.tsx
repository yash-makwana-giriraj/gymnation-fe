"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo, lazy, Suspense } from "react";
import { getCookieValue, debounce, findNearestLocation } from "@/helpers/getCookie";

// Lazy load heavy components
const MapBoxMap = lazy(() => import("../map/MapBoxMap"));
const Swiper = lazy(() => import("swiper/react").then(mod => ({ default: mod.Swiper })));
const SwiperSlide = lazy(() => import("swiper/react").then(mod => ({ default: mod.SwiperSlide })));

// Regular components (keep these as they're lighter)
import TabButtons from "../ui/TabButtons";
import Button from "../ui/Button";
import Image from "next/image";
import LocationSelectBox from "../ui/LocationSelectBox";
import AutocompleteInput from "../ui/AutocompleteInput";
import LocationFilterCard from "../cards/LocationFilterCard";
import LocationDetailCard from "../cards/LocationDetailCard";
import { MapBoxRef } from "../map/MapBoxMap";

// Types
import {
  APILocationsResponse,
  ContentResponse,
  DynamicComponentData,
  FeaturesItem,
  Properties,
} from "@/interfaces/content";
import { FreeMode, Scrollbar, Mousewheel, Virtual } from "swiper/modules";

// Constants
const MAPBOX_API_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const DEFAULT_PROXIMITY = "25.276987,55.296249";
const DEBOUNCE_DELAY = 300; // Reduced from 500ms
const DEFAULT_ZOOM = 15;
const LIST_ZOOM = 10;

interface LocationCoordinates {
  lat: number;
  lng: number;
}

// Memoized sub-components
const MemoizedTabButtons = React.memo(TabButtons);
const MemoizedButton = React.memo(Button);
const MemoizedLocationSelectBox = React.memo(LocationSelectBox);
const MemoizedAutoCompleteInput = React.memo(AutocompleteInput);
const MemoizedLocationFilterCard = React.memo(LocationFilterCard);
const MemoizedLocationDetailCard = React.memo(LocationDetailCard);

const LocationMap = ({ }: { data: DynamicComponentData }) => {
  // Core state
  const [loading, setLoading] = useState<boolean>(true);
  const [cityLocationData, setCityLocationData] = useState<Properties>();
  const [cityLocationFilters, setFilters] = useState<ContentResponse[]>([]);

  // UI state  
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);
  const [isSelectBoxVisible, setSelectionBoxVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");

  // Search state
  const [query, setQuery] = useState<string>("");
  const [locations, setLocations] = useState<string[]>([]);
  const [isSelectedQuery, setIsSelectedQuery] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState<LocationCoordinates | null>(null);

  // Filter state
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [tempFilters, setTempFilters] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<number>(0);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [isNoMatchLocations, setIsNoMatchLocations] = useState<boolean>(false);

  // Map state
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const [lastLocation, setLastLocation] = useState<LocationCoordinates | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Refs
  const mapRef = useRef<MapBoxRef>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Memoized expensive computations
  const countries = useMemo(() => cityLocationData?.countries.items, [cityLocationData]);
  const apiLocations = useMemo(() => cityLocationData?.aPILocations || [], [cityLocationData]);

  const cityList = useMemo(() => {
    if (typeof activeTab === "undefined" || !countries) return [];
    return countries[activeTab]?.content?.properties?.cityList?.items || [];
  }, [activeTab, countries]);

  // Ultra-optimized filtered locations with virtualization concept
  const filteredLocations = useMemo(() => {
    if (!apiLocations.length || isNoMatchLocations) return [];

    let filtered = apiLocations;

    // Use Set for faster lookups if we have many filters
    const filterSet = appliedFilters.length > 10 ? new Set(appliedFilters) : null;

    // Chain filters efficiently
    if (selectedLocation) {
      const selectedLower = selectedLocation.toLowerCase();
      filtered = filtered.filter(
        (location: APILocationsResponse) =>
          location.properties.cityName?.toLowerCase() === selectedLower
      );
    }

    if (appliedFilters.length > 0) {
      if (filterSet) {
        filtered = filtered.filter((location: APILocationsResponse) => {
          const locationId = location.sys?.id || location.id || "";
          return filterSet.has(locationId);
        });
      } else {
        filtered = filtered.filter((location: APILocationsResponse) => {
          const locationId = location.sys?.id || location.id || "";
          return appliedFilters.includes(locationId);
        });
      }
    }

    return filtered;
  }, [apiLocations, selectedLocation, appliedFilters, isNoMatchLocations]);

  // Optimized search with better debouncing
  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setLocations([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const url = `${MAPBOX_API_BASE}/${encodeURIComponent(searchQuery)}.json?` +
        new URLSearchParams({
          access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
          language: "en",
          limit: "5", // Reduced from 10
          country: "ae",
          proximity: DEFAULT_PROXIMITY,
        });

      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const data = await response.json();

      if (data.features?.length > 0) {
        const placeNames = data.features.map((feature: FeaturesItem) => feature.place_name);
        const [lng, lat] = data.features[0].geometry.coordinates;

        setSelectedCoordinates({ lat, lng });
        setLocations(placeNames);
      } else {
        setLocations([]);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Search error:", error);
        setLocations([]);
      }
    }
  }, []);

  // Improved debounced search
  const debouncedSearch = useMemo(
    () => debounce(searchLocations, DEBOUNCE_DELAY),
    [searchLocations]
  );

  // Stable event handlers
  const handleTabButtonClick = useCallback((index: number) => {
    setActiveTab(index);
    setSelectionBoxVisible(true);
  }, []);

  const handleBackToTabs = useCallback(() => {
    setSelectionBoxVisible(false);
  }, []);

  const handleLocationChange = useCallback((value: string) => {
    setSelectedLocation(value);
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleSelect = useCallback((selectedValue: string) => {
    setQuery(selectedValue);
    setLocations([]);
    setIsSelectedQuery(true);

    if (cityLocationData && selectedCoordinates && isMapReady) {
      // Use requestAnimationFrame for smooth interaction
      requestAnimationFrame(() => {
        const nearestLocation = findNearestLocation(selectedCoordinates, cityLocationData);
        if (nearestLocation) {
          const lat = parseFloat(nearestLocation.properties.locationLatitude ?? "");
          const lng = parseFloat(nearestLocation.properties.locationLongitude ?? "");

          if (!isNaN(lat) && !isNaN(lng)) {
            mapRef.current?.flyToLocationWithPopup(lat, lng, nearestLocation, DEFAULT_ZOOM);
          }
        }
      });
    }
  }, [cityLocationData, selectedCoordinates, isMapReady]);

  const openFilterModal = useCallback(() => {
    setTempFilters([...appliedFilters]); // Shallow copy
    setFilterModalOpen(true);
  }, [appliedFilters]);

  const closeFilterModal = useCallback(() => {
    setFilterModalOpen(false);
  }, []);

  const clearFilters = useCallback(() => {
    // Batch state updates
    setAppliedFilters([]);
    setSelectedCheckboxes([]);
    setSelectedLocation("");
    setSelectionBoxVisible(false);
    setActiveTab(undefined);
    setIsNoMatchLocations(false);
  }, []);

  const submitFilters = useCallback((newFilters: string[]) => {
    setAppliedFilters(newFilters);
    setFilterModalOpen(false);
  }, []);

  const onCardClick = useCallback((index: number) => {
    if (!isMapReady) return;

    setActiveCard(index);
    const location = filteredLocations[index];
    if (!location) return;

    const lat = parseFloat(location.properties.locationLatitude ?? "");
    const lng = parseFloat(location.properties.locationLongitude ?? "");

    if (!isNaN(lat) && !isNaN(lng)) {
      // Use RAF for smooth interaction
      requestAnimationFrame(() => {
        mapRef.current?.flyToLocationWithPopup(lat, lng, location, DEFAULT_ZOOM);
      });
    }
  }, [filteredLocations, isMapReady]);

  const handleSwiperSlideChange = useCallback((swiper: any) => {
    if (!isMapReady) return;

    const activeSlideIndex = swiper.activeIndex;
    const location = filteredLocations[activeSlideIndex];
    if (!location) return;

    const lat = parseFloat(location.properties.locationLatitude ?? "");
    const lng = parseFloat(location.properties.locationLongitude ?? "");

    if (!isNaN(lat) && !isNaN(lng)) {
      // Throttle map updates for swiper
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(() => {
        mapRef.current?.flyToLocationWithPopup(lat, lng, location, DEFAULT_ZOOM);
      }, 100); // Small delay to avoid too frequent updates
    }
  }, [filteredLocations, isMapReady]);

  // Initialize component with performance optimizations
  useEffect(() => {
    let isCancelled = false;

    const initializeComponent = async () => {
      try {
        setLoading(true);

        // Set RTL immediately
        const lang = getCookieValue("NEXT_LOCALE");
        setIsRTL(lang === "ar" ? "rtl" : "ltr");

        // Load data in parallel with timeout
        const dataPromises = [
          import("@/api-handler/apis/content").then(mod => mod.fetchCityWithLocationData()),
          import("@/api-handler/apis/content").then(mod => mod.fetchCityLocationFilters()),
        ];

        const results = await Promise.allSettled(dataPromises);

        if (isCancelled) return;

        // Handle results
        if (results[0].status === 'fulfilled') {
          setCityLocationData(results[0].value?.properties);
        }

        if (results[1].status === 'fulfilled') {
          setFilters(results[1].value?.items);
        }

        // Indicate map can be loaded
        setTimeout(() => setIsMapReady(true), 100);

      } catch (err) {
        if (!isCancelled) {
          console.error("Error loading data:", err);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    initializeComponent();

    return () => {
      isCancelled = true;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Handle search query changes with improved performance
  useEffect(() => {
    if (isSelectedQuery) {
      setIsSelectedQuery(false);
      return;
    }

    if (!query.trim()) {
      setLocations([]);
      return;
    }

    debouncedSearch(query);

    return () => {
      debouncedSearch.cancel?.();
    };
  }, [query, isSelectedQuery, debouncedSearch]);

  // Handle automatic map navigation with performance optimization
  useEffect(() => {
    if (!filteredLocations.length || !isMapReady) return;

    const firstLocation = filteredLocations[0];
    const lat = parseFloat(firstLocation.properties.locationLatitude ?? "");
    const lng = parseFloat(firstLocation.properties.locationLongitude ?? "");

    if (!isNaN(lat) && !isNaN(lng)) {
      // Only fly if location actually changed
      if (!lastLocation || lastLocation.lat !== lat || lastLocation.lng !== lng) {
        // Use requestIdleCallback for non-critical map updates
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(() => {
            mapRef.current?.flyToLocationWithPopup(lat, lng, firstLocation, LIST_ZOOM);
            setLastLocation({ lat, lng });
          });
        } else {
          setTimeout(() => {
            mapRef.current?.flyToLocationWithPopup(lat, lng, firstLocation, LIST_ZOOM);
            setLastLocation({ lat, lng });
          }, 0);
        }
      }
    }
  }, [filteredLocations, lastLocation, isMapReady]);

  // Memoized components with proper keys
  const filterButtonContent = useMemo(() => {
    if (appliedFilters.length > 0 || isNoMatchLocations) {
      return `Filters(${selectedFilters})`;
    }
    return (
      <Image
        src="/icons/filter-btn.svg"
        width={30}
        height={23}
        className="h-[13px] mb:h-[22px] mb:w-auto"
        alt="filter"
      />
    );
  }, [appliedFilters.length, isNoMatchLocations, selectedFilters]);

  // Memoized desktop location cards with virtual support
  const desktopLocationSlides = useMemo(() => {
    return filteredLocations.map((location: APILocationsResponse, index: number) => {
      const locationKey = `${location.sys?.id || location.id || index}-${location.name}`;

      return (
        <SwiperSlide
          key={locationKey}
          virtualIndex={index}
          className="ltr:xs:pr-[28px] rtl:xs:pl-[28px]"
        >
          <MemoizedLocationDetailCard
            index={index}
            title={location.name}
            cityName={location.properties.cityName}
            isKsa={location.properties.isKSA}
            mapAddress={location.properties.mapAddress}
            joinLink={
              !location.properties.isComingSoon
                ? location.properties.mapDirectionUrl
                : undefined
            }
            gymInfoLink={
              !location.properties.isComingSoon
                ? location.route.path
                : undefined
            }
            registerLink={
              location.properties.isComingSoon
                ? location.route.path
                : undefined
            }
            image={location.properties.mapImage[0]?.url}
            onClick={onCardClick}
            className="group"
            isActive={index === activeCard}
          />
        </SwiperSlide>
      );
    });
  }, [filteredLocations, activeCard, onCardClick]);

  // Memoized mobile location cards
  const mobileLocationCards = useMemo(() => {
    return filteredLocations.map((location: APILocationsResponse, index: number) => {
      const locationKey = `mobile-${location.sys?.id || location.id || index}-${location.name}`;

      return (
        <SwiperSlide
          key={locationKey}
          virtualIndex={index}
          className="group swiper-slide-active:!group !h-auto xs:!min-h-[192px]"
        >
          <MemoizedLocationDetailCard
            index={index}
            title={location.name}
            cityName={location.properties.cityName}
            isKsa={location.properties.isKSA}
            mapAddress={location.properties.mapAddress}
            joinLink={
              !location.properties.isComingSoon
                ? location.properties.mapDirectionUrl
                : undefined
            }
            gymInfoLink={
              !location.properties.isComingSoon
                ? location.route.path
                : undefined
            }
            registerLink={
              location.properties.isComingSoon
                ? location.route.path
                : undefined
            }
            image={location.properties.mapImage[0]?.url}
            onClick={onCardClick}
            className="group-[.swiper-slide-active]:bg-secondary group-[.swiper-slide-active]:border-secondary flex flex-auto h-fit"
            isActive={index === activeCard}
          />
        </SwiperSlide>
      );
    });
  }, [filteredLocations, onCardClick, activeCard]);

  // Loading placeholder
  if (loading) {
    return (
      <section className="global-spacing !pb-0 map-container">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-[560px_minmax(200px,1fr)] xslg:grid-cols-[minmax(605px,1fr)_minmax(200px,1fr)] lg:grid-cols-[648px_1fr] text-white xs:rounded-[48px] overflow-hidden w-full">
            <div className="bg-primary sm:min-h-[530px] animate-pulse"></div>
            <div className="bg-gray-300 sm:min-h-[530px] animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="global-spacing !pb-0 map-container">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-[560px_minmax(200px,1fr)] xslg:grid-cols-[minmax(605px,1fr)_minmax(200px,1fr)] lg:grid-cols-[648px_1fr] text-white xs:rounded-[48px] overflow-hidden w-full">
          <div className="relative block pt-[30px] px-[15px] pb-[16px] mb:px-[12px] xs:py-[25px] xs:px-[35px] sm:p-[20px] sm:pt-[40px] slg:pl-[25px] lg:pl-[37px] bg-primary sm:min-h-[530px]">
            {/* Tab button and city selection */}
            {countries && countries.length > 0 && (
              <div className="flex w-full ltr:sm:pr-[28px] rtl:sm:pl-[28px]">
                {!isSelectBoxVisible ? (
                  <MemoizedTabButtons
                    tabs={countries}
                    onButtonClick={handleTabButtonClick}
                    activeButtonIndex={activeTab}
                  />
                ) : (
                  <div className="flex w-full h-full border-1 border-white border-solid bg-primary rounded-full">
                    <MemoizedButton
                      variant="white"
                      isArrow={false}
                      className="rounded-r-none h-[34px] mb:h-[42px] xs:h-[46px] min-w-[54px] xs:min-w-[67px] !pl-0 !pr-0 !py-0"
                      onClick={handleBackToTabs}
                    >
                      <Image
                        src="/icons/arrow_slide.svg"
                        width={36}
                        height={36}
                        className="w-[24px] xs:w-[36px]"
                        alt="arrow"
                        priority
                      />
                    </MemoizedButton>

                    <div className="flex items-center w-full h-[34px] mb:h-[42px] xs:h-[46px]">
                      <MemoizedLocationSelectBox
                        value={selectedLocation}
                        options={cityList}
                        placeholder="Select city"
                        onChange={handleLocationChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Autocomplete box */}
            <MemoizedAutoCompleteInput
              value={query}
              onChange={handleQueryChange}
              onSelect={handleSelect}
              list={locations}
              placeholder="Search by address"
              className="mt-[19px] mb-[14px] ltr:sm:pr-[28px] rtl:sm:pl-[28px]"
            />

            {/* Location and Filters */}
            <div className="relative flex items-center justify-between w-full xs:mb-[22px] ltr:sm:pr-[28px] rtl:sm:pl-[28px] gap-2">
              <div className="flex items-start gap-2 text-white text-[11px] leading-[18px] xxsmb:text-[10px] xxsmob:text-[12px] mb:text-[16px] mb:leading-[28px] font-semibold uppercase min-w-0 cursor-pointer">
                <Image
                  src="/icons/noun-location-white.svg"
                  width={21}
                  height={22}
                  className="w-[13px] h-[15px] mb:w-[21px] mb:h-[22px] flex-shrink-0 mt-[3px]"
                  alt="location"
                  priority
                />
                <span className="break-words underline underline-offset-4 hover:no-underline">
                  use current location
                </span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <MemoizedButton
                  isArrow={false}
                  variant="tangaroa"
                  className="!text-white hover:!text-primary uppercase border border-white hover:border-secondary h-[24px] mb:h-[34px] !text-[8px] mb:!text-[14px] !leading-[11px] mb:!leading-[20px] !font-extrabold !py-[6px] !pl-[8] !pr-[8px]"
                  onClick={clearFilters}
                >
                  Clear All
                </MemoizedButton>
                <MemoizedButton
                  isArrow={false}
                  variant="white"
                  className={`text-white hover:text-primary hover:bg-white !p-0 !h-[25px] mb:!pl-[20px] mb:!pr-[20px] mb:!h-[34px] capitalize min-w-[42px] mb:min-w-[68px] ${appliedFilters.length > 0 || isNoMatchLocations
                    ? "!text-primary !bg-secondary !text-[14px] !leading-[20px] !font-extrabold"
                    : ""
                    }`}
                  onClick={openFilterModal}
                >
                  {filterButtonContent}
                </MemoizedButton>
              </div>

              <MemoizedLocationFilterCard
                state={filterModalOpen}
                title="Filters"
                value={tempFilters}
                list={cityLocationFilters}
                selectedCheckboxes={selectedCheckboxes}
                setSelectedCheckboxes={setSelectedCheckboxes}
                onClear={clearFilters}
                onClose={closeFilterModal}
                onSubmit={submitFilters}
                setIsNoMatchLocations={setIsNoMatchLocations}
                setSelectedFilters={setSelectedFilters}
              />
            </div>

            {/* Desktop Location Cards */}
            <div className="hidden sm:block">
              {isNoMatchLocations ? (
                <div>
                  <h2 className="text-red text-center text-[16px] font-600 leading-[28px] mb-[22px] uppercase">
                    No Location Found
                  </h2>
                </div>
              ) : (
                <Suspense fallback={<div className="h-[285px] animate-pulse bg-gray-700 rounded"></div>}>
                  <Swiper
                    key={`desktop-${isRTL}`}
                    dir={isRTL}
                    direction="vertical"
                    slidesPerView="auto"
                    freeMode={true}
                    scrollbar={{ draggable: true }}
                    mousewheel={true}
                    modules={[FreeMode, Scrollbar, Mousewheel, Virtual]}
                    className="location-card-swiper max-h-[285px]"
                    virtual={{ enabled: true }}
                    spaceBetween={26}
                  >
                    {desktopLocationSlides}
                  </Swiper>
                </Suspense>
              )}
            </div>

            {/* Mobile Location Cards */}
            <div
              className={`absolute top-[315%] mb:top-[345%] xs:top-0 block xs:relative sm:hidden w-[calc(100%_+_35px)] ${isNoMatchLocations && "z-2 top-[370%] mb:top-[425%] xs:top-0 xs:relative"
                }`}
            >
              {isNoMatchLocations ? (
                <div className="w-full">
                  <h2 className="text-red text-center text-[16px] font-600 leading-[28px] mb-[22px] uppercase">
                    No Location Found
                  </h2>
                </div>
              ) : (
                <Suspense fallback={<div className="h-[192px] animate-pulse bg-gray-700 rounded"></div>}>
                  <Swiper
                    key={`mobile-${isRTL}`}
                    dir={isRTL}
                    slidesPerView={1.25}
                    spaceBetween={13}
                    className="map-swapper"
                    onSlideChange={handleSwiperSlideChange}
                    modules={[Virtual]}
                    virtual={{ enabled: true }}
                  >
                    {mobileLocationCards}
                  </Swiper>
                </Suspense>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full !h-[530px] mb:!h-[703px] xs:!h-[325px] sm:!h-[530px] xs:bg-primary xs:px-[35px] xs:pb-[45px] sm:p-[0] sm:bg-white">
            {isMapReady ? (
              <Suspense fallback={
                <div className="h-full w-full bg-gray-300 animate-pulse flex items-center justify-center">
                  <div className="text-gray-600">Loading Map...</div>
                </div>
              }>
                <MapBoxMap ref={mapRef} apiLocations={filteredLocations} />
              </Suspense>
            ) : (
              <div className="h-full w-full bg-gray-300 animate-pulse flex items-center justify-center">
                <div className="text-gray-600">Preparing Map...</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;