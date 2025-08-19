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

import { MapBoxRef } from "../map/MapBoxMap";

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

const LocationMap = ({ }: { data: DynamicComponentData }) => {
  // variables
  const [loading, setLoading] = useState<boolean>(true);
  const [cityLocationData, setCityLocationData] = useState<Properties>();
  const [cityLocationFilters, setFilters] = useState<ContentResponse[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<number>(0);
  // Mapbox map
  const mapRef = useRef<MapBoxRef>(null);

  // Tab selection
  const [activeTab, setActiveTab] = useState<number | undefined>(undefined);
  const [isSelectBoxVisible, setSelectionBoxVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  // Autocomplete input
  const [query, setQuery] = useState<string>("");
  const [cityList, setCityList] = useState<Item[]>([]);
  const [isSelectedQuery, setIsSelectedQuery] = useState(false);

  // Filter Modal
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<string[]>([]);
  const [tempFilters, setTempFilters] = useState<string[]>([]);

  // Location Card
  const [activeCard, setActiveCard] = useState<undefined | number | null>(null);

  // Swiper
  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const languageCode = "en";

  const [locations, setLocations] = useState<string[]>([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);
  const [isNoMatchLocations, setIsNoMatchLocations] = useState<boolean>(false);
  const [lastLocation, setLastLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [selectedCordinates, setSelectedCordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const searchLocations = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setLocations([]);
      return;
    }

    try {
      const url = new URL(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json`
      );

      const params = new URLSearchParams({
        access_token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN!,
        language: languageCode,
        limit: "10",
        country: "ae",
        proximity: `25.276987,55.296249`,
      });
      url.search = params.toString();
      const response = await fetch(url.toString());
      const data = await response.json();

      const placeNames = data.features.map(
        (feature: FeaturesItem) => feature.place_name
      );

      const coordinates = data.features[0].geometry.coordinates
      setSelectedCordinates({
        lat: coordinates[1],
        lng: coordinates[0],
      });

      setLocations(placeNames);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setLocations([]);
    }
  }, []);

  const debouncedSearchLocations = useMemo(() => {
    return debounce((searchQuery: string) => {
      searchLocations(searchQuery);
    }, 500);
  }, [searchLocations]);

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
      debouncedSearchLocations.cancel();
    };
  }, [query, isSelectedQuery, debouncedSearchLocations]);

  // Initial data loading (unchanged)
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const cityResponse = await fetchCityWithLocationData();
        setCityLocationData(cityResponse.properties);
        const filterResponse = await fetchCityLocationFilters();
        setFilters(filterResponse.items);
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
  }, []);

  const countries = cityLocationData?.countries.items;
  const apiLocations = cityLocationData?.aPILocations;
  useEffect(() => {
    if (typeof activeTab === "undefined") return;
    setSelectedLocation("");
    const cityList =
      countries?.[activeTab]?.content?.properties?.cityList?.items;
    if (cityList) setCityList(cityList);
  }, [activeTab, countries]);

  const handleTabButtonClick = (index: number) => {
    setActiveTab(index);
    setSelectionBoxVisible(true);
  };

  // Handle autoSelect
  const handleSelect = (selectedValue: string) => {
    setQuery(selectedValue);
    setLocations([]);
    setIsSelectedQuery(true)
    if (cityLocationData) {
      const nearestLocation = findNearestLocation(selectedCordinates, cityLocationData);
      if (nearestLocation) {
        const lat = parseFloat(nearestLocation.properties.locationLatitude ?? "");
        const lng = parseFloat(nearestLocation.properties.locationLongitude ?? "");

        if (!isNaN(lat) && !isNaN(lng)) {
          mapRef.current?.flyToLocationWithPopup(lat, lng, nearestLocation, 15);
        }
      }
    }
  };

  const openFilterModal = () => {
    setTempFilters(appliedFilters);
    setFilterModalOpen(true);
  };

  // Close Filter modal
  const closeFilterModal = () => {
    setFilterModalOpen(false);
  };

  // Clear filter
  const clearFilters = () => {
    setAppliedFilters([]);
    setSelectedCheckboxes([]);
    setSelectedLocation("");
    setSelectionBoxVisible(false);
    setActiveTab(undefined);
    setIsNoMatchLocations(false);
  };

  // Handle submit filter
  const submitFilters = (newFilters: string[]) => {
    setAppliedFilters(newFilters);
    setFilterModalOpen(false);
  };

  // Handle location card
  const onCardClick = (index: number) => {
    setActiveCard(index);
    const data = filteredLocations[index];

    const lat = parseFloat(data.properties.locationLatitude ?? "");
    const lng = parseFloat(data.properties.locationLongitude ?? "");

    if (!isNaN(lat) && !isNaN(lng)) {
      mapRef.current?.flyToLocationWithPopup(lat, lng, data, 15);
    }
  };

  const getFilteredLocations = () => {
    if (!apiLocations) return [];

    let filtered = apiLocations;

    if (isNoMatchLocations === true) {
      return [];
    }

    if (selectedLocation) {
      filtered = filtered.filter(
        (location: APILocationsResponse) =>
          location.properties.cityName?.toLowerCase() ===
          selectedLocation.toLowerCase()
      );
    }

    if (appliedFilters.length > 0) {
      filtered = filtered.filter((location: APILocationsResponse) => {
        const locationId = location.sys?.id || location.id || "";
        return appliedFilters.includes(locationId);
      });
    }

    return filtered;
  };

  const filteredLocations = getFilteredLocations();

  useEffect(() => {
    if (filteredLocations.length > 0) {
      const firstLocation = filteredLocations[0];
      const lat = parseFloat(firstLocation.properties.locationLatitude ?? "");
      const lng = parseFloat(firstLocation.properties.locationLongitude ?? "");

      if (!isNaN(lat) && !isNaN(lng)) {
        if (lastLocation?.lat !== lat || lastLocation?.lng !== lng) {
          mapRef.current?.flyToLocationWithPopup(lat, lng, firstLocation, 10);
          setLastLocation({ lat, lng });
        }
      }
    }
  }, [filteredLocations, lastLocation]);

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
                      onClick={() => setSelectionBoxVisible(false)}
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
                        onChange={setSelectedLocation}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Autocomplete box with loading indicator */}
            <AutocompleteInput
              value={query}
              onChange={setQuery}
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
                  alt="arrow"
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
                  {appliedFilters.length > 0 || isNoMatchLocations ? (
                    `Filters(${selectedFilters})`
                  ) : (
                    <Image
                      src="/icons/filter-btn.svg"
                      width={30}
                      height={23}
                      className="h-[13px] mb:h-[22px] mb:w-auto"
                      alt="arrow"
                    />
                  )}
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

            {/* Location Card */}
            <div className="hidden sm:block">
              {isNoMatchLocations ? (
                <div>
                  <h2 className="text-red text-center text-[16px] font-600 leading-[28px] mb-[22px] uppercase">
                    No Location Found
                  </h2>
                </div>
              ) : (
                <Swiper
                  key={isRTL}
                  dir={isRTL}
                  direction={"vertical"}
                  slidesPerView={"auto"}
                  freeMode={true}
                  scrollbar={{ draggable: true }}
                  mousewheel={true}
                  modules={[FreeMode, Scrollbar, Mousewheel]}
                  className="location-card-swiper max-h-[285px]"
                >
                  <SwiperSlide className="space-y-[26px] ltr:xs:pr-[28px] rtl:xs:pl-[28px]">
                    {filteredLocations.map(
                      (location: APILocationsResponse, index: number) => (
                        <LocationDetailCard
                          key={index}
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
                          image={location.properties.mapImage[0].url}
                          onClick={onCardClick}
                          className="group"
                          isActive={index === activeCard}
                        />
                      )
                    )}
                  </SwiperSlide>
                </Swiper>
              )}
            </div>
            <div
              className={`absolute top-[315%] mb:top-[345%] xs:top-0 block xs:relative sm:hidden w-[calc(100%_+_35px)] ${isNoMatchLocations &&
                "z-2 top-[370%]  mb:top-[425%] xs:top-0 xs:relative"
                }`}
            >
              {isNoMatchLocations ? (
                <div className="w-full ">
                  <h2 className="text-red text-center text-[16px] font-600 leading-[28px] mb-[22px] uppercase">
                    No Location Found
                  </h2>
                </div>
              ) : (
                <Swiper
                  key={isRTL}
                  dir={isRTL}
                  slidesPerView={1.25}
                  spaceBetween={13}
                  className="map-swapper"
                  onSlideChange={(swiper) => {
                    const activeSlideIndex = swiper.activeIndex; // Get the active slide index
                    const location = filteredLocations[activeSlideIndex]; // Get the location data for the active slide

                    // Extract coordinates from the location data
                    const lat = parseFloat(
                      location.properties.locationLatitude ?? ""
                    );
                    const lng = parseFloat(
                      location.properties.locationLongitude ?? ""
                    );

                    // Check if coordinates are valid and fly to the location on the map
                    if (!isNaN(lat) && !isNaN(lng)) {
                      mapRef.current?.flyToLocationWithPopup(
                        lat,
                        lng,
                        location,
                        15
                      ); // Fly to the location on the map
                    }
                  }}
                >
                  {filteredLocations.map(
                    (location: APILocationsResponse, index: number) => (
                      <SwiperSlide
                        key={index}
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
                          image={location.properties.mapImage[0].url}
                          onClick={onCardClick}
                          className="group-[.swiper-slide-active]:bg-secondary group-[.swiper-slide-active]:border-secondary flex flex-auto h-fit"
                          isActive={index === activeCard}
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              )}
            </div>
          </div>
          <div className="relative w-full !h-[530px] mb:!h-[703px] xs:!h-[325px] sm:!h-[530px] xs:bg-primary xs:px-[35px] xs:pb-[45px] sm:p-[0] sm:bg-white">
            {/* <MapBoxMap ref={mapRef} apiLocations={filteredLocations} /> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;