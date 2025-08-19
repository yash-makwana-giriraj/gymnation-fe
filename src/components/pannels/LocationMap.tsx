"use client";
import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";

// API Handlers
import {
  fetchCityWithLocationData,
  fetchCityLocationFilters,
} from "@/api-handler/apis/content";

// Components
import TabButtons from "../ui/TabButtons";
import Button from "../ui/Button";
import Image from "next/image";
import LocationSelectBox from "../ui/LocationSelectBox";
import AutocompleteInput from "../ui/AutocompleteInput";
import LocationFilterCard from "../cards/LocationFilterCard";
import LocationDetailCard from "../cards/LocationDetailCard";
import MapBoxMap, { MapBoxRef } from "../map/MapBoxMap";

// Helpers
import { getCookieValue, debounce, findNearestLocation } from "@/helpers/getCookie";

// Types and models
import {
  APILocationsResponse,
  ContentResponse,
  DynamicComponentData,
  FeaturesItem,
  Item,
  Properties,
} from "@/interfaces/content";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Scrollbar, Mousewheel } from "swiper/modules";

// Constants
const MAPBOX_API_BASE = "https://api.mapbox.com/geocoding/v5/mapbox.places";
const DEFAULT_PROXIMITY = "25.276987,55.296249";
const DEBOUNCE_DELAY = 500;
const DEFAULT_ZOOM = 15;
const LIST_ZOOM = 10;

interface LocationCoordinates {
  lat: number;
  lng: number;
}

const LocationMap = ({ data }: { data: DynamicComponentData }) => {
  // Core data state
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

  // Refs
  const mapRef = useRef<MapBoxRef>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Memoized values
  const languageCode = "en";
  const countries = useMemo(() => cityLocationData?.countries.items, [cityLocationData]);
  const apiLocations = useMemo(() => cityLocationData?.aPILocations || [], [cityLocationData]);

  // Memoized city list based on active tab
  const cityList = useMemo(() => {
    if (typeof activeTab === "undefined" || !countries) return [];
    return countries[activeTab]?.content?.properties?.cityList?.items || [];
  }, [activeTab, countries]);

  // Optimized search function with abort controller
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
      const url = new URL(`${MAPBOX_API_BASE}/${encodeURIComponent(searchQuery)}.json`);
      const params = new URLSearchParams({
        access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
        language: languageCode,
        limit: "10",
        country: "ae",
        proximity: DEFAULT_PROXIMITY,
      });
      url.search = params.toString();

      const response = await fetch(url.toString(), {
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const placeNames = data.features.map((feature: FeaturesItem) => feature.place_name);
        const coordinates = data.features[0].geometry.coordinates;

        setSelectedCoordinates({
          lat: coordinates[1],
          lng: coordinates[0],
        });
        setLocations(placeNames);
      } else {
        setLocations([]);
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching locations:", error);
        setLocations([]);
      }
    }
  }, []);

  // Memoized debounced search
  const debouncedSearchLocations = useMemo(
    () => debounce(searchLocations, DEBOUNCE_DELAY),
    [searchLocations]
  );

  // Optimized filtered locations with memoization
  const filteredLocations = useMemo(() => {
    if (!apiLocations.length || isNoMatchLocations) return [];

    let filtered = apiLocations;

    // Filter by selected location
    if (selectedLocation) {
      filtered = filtered.filter(
        (location: APILocationsResponse) =>
          location.properties.cityName?.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    // Filter by applied filters
    if (appliedFilters.length > 0) {
      filtered = filtered.filter((location: APILocationsResponse) => {
        const locationId = location.sys?.id || location.id || "";
        return appliedFilters.includes(locationId);
      });
    }

    return filtered;
  }, [apiLocations, selectedLocation, appliedFilters, isNoMatchLocations]);

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

    if (cityLocationData && selectedCoordinates) {
      const nearestLocation = findNearestLocation(selectedCoordinates, cityLocationData);
      if (nearestLocation) {
        const lat = parseFloat(nearestLocation.properties.locationLatitude ?? "");
        const lng = parseFloat(nearestLocation.properties.locationLongitude ?? "");

        if (!isNaN(lat) && !isNaN(lng)) {
          mapRef.current?.flyToLocationWithPopup(lat, lng, nearestLocation, DEFAULT_ZOOM);
        }
      }
    }
  }, [cityLocationData, selectedCoordinates]);

  const openFilterModal = useCallback(() => {
    setTempFilters(appliedFilters);
    setFilterModalOpen(true);
  }, [appliedFilters]);

  const closeFilterModal = useCallback(() => {
    setFilterModalOpen(false);
  }, []);

  const clearFilters = useCallback(() => {
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
    setActiveCard(index);
    const data = filteredLocations[index];

    const lat = parseFloat(data.properties.locationLatitude ?? "");
    const lng = parseFloat(data.properties.locationLongitude ?? "");

    if (!isNaN(lat) && !isNaN(lng)) {
      mapRef.current?.flyToLocationWithPopup(lat, lng, data, DEFAULT_ZOOM);
    }
  }, [filteredLocations]);

  const handleSwiperSlideChange = useCallback((swiper: any) => {
    const activeSlideIndex = swiper.activeIndex;
    const location = filteredLocations[activeSlideIndex];

    if (!location) return;

    const lat = parseFloat(location.properties.locationLatitude ?? "");
    const lng = parseFloat(location.properties.locationLongitude ?? "");

    if (!isNaN(lat) && !isNaN(lng)) {
      mapRef.current?.flyToLocationWithPopup(lat, lng, location, DEFAULT_ZOOM);
    }
  }, [filteredLocations]);

  // Initialize RTL and load data
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        setLoading(true);

        // Set RTL
        const lang = getCookieValue("NEXT_LOCALE");
        setIsRTL(lang === "ar" ? "rtl" : "ltr");

        // Load data in parallel
        const [cityResponse, filterResponse] = await Promise.all([
          fetchCityWithLocationData(),
          fetchCityLocationFilters(),
        ]);

        setCityLocationData(cityResponse.properties);
        setFilters(filterResponse.items);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeComponent();

    // Cleanup on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (isSelectedQuery) {
      setIsSelectedQuery(false);
      return;
    }

    if (!query.trim()) {
      setLocations([]);
      return;
    }

    debouncedSearchLocations(query);

    return () => {
      debouncedSearchLocations.cancel?.();
    };
  }, [query, isSelectedQuery, debouncedSearchLocations]);

  // Handle automatic map navigation to first filtered location
  useEffect(() => {
    if (filteredLocations.length === 0) return;

    const firstLocation = filteredLocations[0];
    const lat = parseFloat(firstLocation.properties.locationLatitude ?? "");
    const lng = parseFloat(firstLocation.properties.locationLongitude ?? "");

    if (!isNaN(lat) && !isNaN(lng)) {
      // Only fly if location actually changed
      if (!lastLocation || lastLocation.lat !== lat || lastLocation.lng !== lng) {
        mapRef.current?.flyToLocationWithPopup(lat, lng, firstLocation, LIST_ZOOM);
        setLastLocation({ lat, lng });
      }
    }
  }, [filteredLocations, lastLocation]);

  // Memoized filter button content
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

  // Memoized Swiper component for desktop
  const desktopSwiper = useMemo(() => (
    <Swiper
      key={`desktop-${isRTL}`}
      dir={isRTL}
      direction="vertical"
      slidesPerView="auto"
      freeMode={true}
      scrollbar={{ draggable: true }}
      mousewheel={true}
      modules={[FreeMode, Scrollbar, Mousewheel]}
      className="location-card-swiper max-h-[285px]"
    >
      <SwiperSlide className="space-y-[26px] ltr:xs:pr-[28px] rtl:xs:pl-[28px]">
        {filteredLocations.map((location: APILocationsResponse, index: number) => (
          <LocationDetailCard
            key={`${location.sys?.id || location.id || index}`}
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
        ))}
      </SwiperSlide>
    </Swiper>
  ), [isRTL, filteredLocations, activeCard, onCardClick]);

  // Memoized Swiper component for mobile
  const mobileSwiper = useMemo(() => (
    <Swiper
      key={`mobile-${isRTL}`}
      dir={isRTL}
      slidesPerView={1.25}
      spaceBetween={13}
      className="map-swapper"
      onSlideChange={handleSwiperSlideChange}
    >
      {filteredLocations.map((location: APILocationsResponse, index: number) => (
        <SwiperSlide
          key={`${location.sys?.id || location.id || index}`}
          className="group swiper-slide-active:!group !h-auto xs:!min-h-[192px]"
        >
          <LocationDetailCard
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
      ))}
    </Swiper>
  ), [isRTL, filteredLocations, handleSwiperSlideChange, onCardClick, activeCard]);

  if (loading) {
    return null;
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
                  <TabButtons
                    tabs={countries}
                    onButtonClick={handleTabButtonClick}
                    activeButtonIndex={activeTab}
                  />
                ) : (
                  <div className="flex w-full h-full border-1 border-white border-solid bg-primary rounded-full">
                    <Button
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
                      />
                    </Button>

                    <div className="flex items-center w-full h-[34px] mb:h-[42px] xs:h-[46px]">
                      <LocationSelectBox
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
            <AutocompleteInput
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
                />
                <span className="break-words underline underline-offset-4 hover:no-underline">
                  use current location
                </span>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                <Button
                  isArrow={false}
                  variant="tangaroa"
                  className="!text-white hover:!text-primary uppercase border border-white hover:border-secondary h-[24px] mb:h-[34px] !text-[8px] mb:!text-[14px] !leading-[11px] mb:!leading-[20px] !font-extrabold !py-[6px] !pl-[8] !pr-[8px]"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
                <Button
                  isArrow={false}
                  variant="white"
                  className={`text-white hover:text-primary hover:bg-white !p-0 !h-[25px] mb:!pl-[20px] mb:!pr-[20px] mb:!h-[34px] capitalize min-w-[42px] mb:min-w-[68px] ${appliedFilters.length > 0 || isNoMatchLocations
                    ? "!text-primary !bg-secondary !text-[14px] !leading-[20px] !font-extrabold"
                    : ""
                    }`}
                  onClick={openFilterModal}
                >
                  {filterButtonContent}
                </Button>
              </div>

              <LocationFilterCard
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
                desktopSwiper
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
                mobileSwiper
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="relative w-full !h-[530px] mb:!h-[703px] xs:!h-[325px] sm:!h-[530px] xs:bg-primary xs:px-[35px] xs:pb-[45px] sm:p-[0] sm:bg-white">
            <MapBoxMap ref={mapRef} apiLocations={filteredLocations} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;