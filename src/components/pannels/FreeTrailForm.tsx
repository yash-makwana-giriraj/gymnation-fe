"use client";
import React, { useEffect, useState } from "react";
import Input from "../ui/Input";
import SelectBox from "../ui/Select";
import Button from "../ui/Button";
import {
  ContentResponse,
  DynamicComponentData,
} from "@/interfaces/content";
import parse from "html-react-parser";
import { fetchCityWithLocationData } from "@/api-handler/apis/content";
import { Option } from "@/interfaces/global";
import { getCookieValue } from "@/helpers/getCookie";
import { useDispatch } from "react-redux";
import { setCityLocations, CityLocation } from "@/store/slices/freeTrialFormSlice";

const FreeTrailForm = ({ data }: { data: DynamicComponentData }) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const handleClick = () => {
    setIsClicked(true);
  };
  const [selectedCity, setSelectedCity] = useState<string>();
  const [selectedLocation, setSelectedLocation] = useState<string>();
  const [cityWithLocationContent, setCityWithLocationContent] =
    useState<ContentResponse>();
  const [locations, setLocations] = useState<Option[]>([]);
  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [isMounted, setIsMounted] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
    setIsMounted(true);
  }, [isMounted]);

  const handleCityClick = (cityValue: string) => {
    setSelectedCity(cityValue);

    const matchedCity =
      cityWithLocationContent?.properties?.cityLocations?.items?.find(
        (city) => city?.content?.properties?.cityName === cityValue
      );

    const rawLocations =
      matchedCity?.content?.properties?.locations?.items ?? [];

    const formatted: Option[] = rawLocations
      .map((locationItem) => {
        const name = locationItem?.content?.properties?.displayName;
        return name ? { label: name, value: name } : null;
      })
      .filter((item): item is Option => item !== null);

    setLocations(formatted);
  };

  const handleLocationClick = (locationValue: string) => {
    setSelectedLocation(locationValue);
  };

  const transformToCityLocations = (response: ContentResponse): CityLocation[] => {
    return response?.properties?.cityLocations?.items?.map((city) => {
      const cityName = city?.content?.properties?.cityName || '';
      const locations = city?.content?.properties?.locations?.items
        ?.map((location) => location?.content?.properties?.displayName)
        ?.filter((name): name is string => Boolean(name)) || [];

      return { cityName, locations };
    })?.filter((city) => city.cityName) || [];
  };

  useEffect(() => {
    const loadCitesWithLocation = async () => {
      try {
        const response = await fetchCityWithLocationData();
        if (response) {
          setCityWithLocationContent(response);
          const simplifiedData = transformToCityLocations(response);
          dispatch(setCityLocations(simplifiedData));
        }
      } catch (err) {
        console.error("Error fetching latest news:", err);
      }
    };
    loadCitesWithLocation();
  }, [dispatch]);

  const cityOptions =
    cityWithLocationContent?.properties?.cityLocations?.items
      ?.map((city) => ({
        label: city.content?.properties?.cityName,
        value: city.content?.properties?.cityName,
      }))
      ?.filter((opt) => opt.label && opt.value) ?? [];

  return (
    <section className="w-full global-spacing free-trial-section !py-0">
      <div className="free-trial-in relative !z-1 bg-[#f6f6f6] border-[2px] border-solid border-[#022A3A] rounded-[24px] mx-auto my-0 max-w-[1454px] xlg:max-w-full overflow-hidden px-0 py-[40px] mb:py-[50px] xs:py-[60] sm:py-[80px] slg:py-[84px] w-[calc(100%-24px)] xs:w-[calc(100%-32px)] sm:w-[calc(100%-40px)] lp:w-[calc(100%-60px)] slg:w-[calc(100%-80px)]">
        <div className="container max-w-full w-full mb:max-w-[540px] xs:max-w-[720px] sm:max-w-[960px] lp:max-w-[1202px]">
          <div className="mx-auto w-full sm:w-[776px] max-w-full text-[#022a3a]">
            <div className="mb-[15px] mb:mb-[26px] sm:mb-[36px] text-center uppercase">
              <h2 className="mb-[10px] text-[24px] mb:text-[30px] xs:text-[35px] sm:text-[45px] slg:text-[48px] font-extrabold leading-[32px] mb:leading-[45px] sm:leading-[55px] slg:leading-[60px] xs:mb-[10px] slg:mb-[8px]">
                {data.title}
              </h2>
              <div className="rte-content">
                {typeof data.description !== "string" &&
                  parse(data.description.markup)}
              </div>
            </div>
            <div className="w-[260px] mb:w-[360px] xs:w-[463px] sm:w-[563px] max-w-full my-0 mx-auto">
              <form action="">
                {!isClicked && (
                  <div onClick={handleClick} className="relative">
                    <div>
                      <Input
                        varient="trial"
                        placeholder="FIRST NAME"
                        className="!pl-[13px] mb:!pl-[20px] lp:!pl-[23px] !py-[6px] mb:!py-[11px] lp:!py-[14px] !pr-[90px] xs:!pr-[158px] sm:!pr-[180px] lp:!pr-[212px] !h-[33px] mb:!h-[46px] sm:!h-[50px] lp:!h-[60px] rounded-full !text-[13px] mb:!text-[16px] sm:!text-[24px] !leading-[19px] mb:!leading-[22px] sm:!leading-[30px]"
                      />
                    </div>
                    <div
                      className={`absolute  ${isRTL === "rtl"
                        ? "left-0 top-0 w-fit h-fit"
                        : "top-0 right-0"
                        }`}
                    >
                      <Button
                        variant="tangaroa"
                        isArrow={false}
                        className="border border-primary !py-[6px] mb:!py-[11] sm:!py-[12px] lp:!py-[14px] text-white !px-[11px] sm:!px-[20px] lp:!px-[24px] !text-[14px] mb:!text-[16px] sm:!text-[20px] lp:!text-[24px] !leading-[19px] mb:!leading-[22px] sm:!leading-[24px] lp:!leading-[30px] mb:!min-w-[140px] sm:!min-w-[160px] lp:!min-w-[189px] hover:border-secondary hover:text-primary"
                      >
                        SUBMIT
                      </Button>
                    </div>
                  </div>
                )}
                {isClicked && (
                  <div>
                    <div>
                      <div className="mb-[14px] xs:mb-[20px]">
                        <SelectBox
                          varient="trail"
                          placeholder="SELECT CITY"
                          onChange={handleCityClick}
                          value={selectedCity}
                          options={cityOptions}
                          className="!h-[34px] mb:!h-[44px] sm:!h-[46px] lp:!h-[50px] mb:!text-[16px]"
                        />
                      </div>
                      {selectedCity && (
                        <div className="mb-[14px] xs:mb-[20px]">
                          <SelectBox
                            varient="trail"
                            placeholder="SELECT LOCATION"
                            onChange={handleLocationClick}
                            options={locations}
                            value={selectedLocation}
                            className="!h-[34px] mb:!h-[44px] sm:!h-[46px] lp:!h-[50px] mb:!text-[16px]"
                          />
                        </div>
                      )}
                    </div>
                    <div className="mb-[14px] xs:mb-[20px]">
                      <Input varient="trial" placeholder="FIRST NAME" />
                    </div>
                    <div className="mb-[14px] xs:mb-[20px]">
                      <Input varient="trial" placeholder="EMAIL ADDRESS" />
                    </div>
                    <div className="mb-[14px] xs:mb-[20px]">
                      <Input
                        varient="trial"
                        placeholder="PHONE (Eg 569462182)"
                      />
                    </div>
                    <div className="w-full flex justify-center">
                      <Button
                        isArrow={false}
                        className="!py-[6px] mb:!py-[11] sm:!py-[12px] lp:!py-[14px] !mt-[10] xs:!mt-[16px] sm:!mt-[16px] lp:!mt-[27px] !px-[24px] sm:!px-[20px] lp:!px-[24px] !text-[15px] mb:!text-[16px] sm:!text-[20px] lp:!text-[24px] !leading-[19px] mb:!leading-[22px] sm:!leading-[24px] lp:!leading-[30px] mb:!min-w-[140px] sm:!min-w-[160px] lp:!min-w-[189px] hover:!bg-primary hover:text-white"
                      >
                        SUBMIT
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeTrailForm;