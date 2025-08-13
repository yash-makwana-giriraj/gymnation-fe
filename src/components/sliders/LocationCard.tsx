"use client";
import React, { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { getCookieValue } from "@/helpers/getCookie";
import Image from "next/image";
import { DynamicComponentData, Item } from "@/interfaces/content";
import Link from "next/link";
import Button from "../ui/Button";

const CardSlide = ({ slideData }: { slideData: Item }) => {
  const data = slideData.content.properties;
  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <Link href={data.link[0].route.path} className="!h-full">
      <div className={`${isRTL === "rtl" ? "scrollable-card-rtl" : "scrollable-card"} relative mb-[9px] xs:mb-0 h-full !min-h-auto mb:!min-h-[302px] xxs:!min-h-[473px] xs:!min-h-[314px] xsm:!min-h-[515px] sm:!min-h-[403px] sm:!h-[403px] lp:!h-[490px] sxlg:!min-h-[401px] sxlg:!h-[401px] xxxlg:!h-[453px] xxxlg:mx-auto`}>
        <div className="absolute inset-0">
          <div className="group p-[15px] xxsmob:px-[30px] mob:px-[41px] sm:px-[50px] xxsmob:py-[28px] sm:py-[53px] xs:p-[30px] absolute w-full h-full rounded-[25px] overflow-hidden flex items-end before:content-[''] before:absolute before:border-[5px] before:border-secondary before:opacity-0 hover:before:!opacity-100 before:transition-opacity before:duration-300 before:ease-in-out  before:w-full before:h-full before:rounded-[25px] before:left-0 before:top-0 [box-shadow:4px_4px_7.2px_rgba(0,_0,_0,_.25)] xs:shadow-none">
            {data.image?.[0]?.url && (
              <Image
                src={data.image[0].url}
                width={504}
                height={453}
                alt={data.name || "location"}
                className="absolute left-0 top-0 w-full h-full object-cover -z-10"
              />
            )}

            <h3 className="text-white text-[24px] mob:text-[28px] xs:text-[36px] sm:text-[40px] slg:text-[48px] leading-[1.2] font-800 group-hover:text-secondary">
              {data.link[0].title}
            </h3>
            <div className="sm:hidden max-w-full h-[105px] xxsmob:h-[112px] w-[180px] xxsmob:w-[210px] absolute right-0 top-0 z-[2]" >
              <Image height={210} width={112} alt="Comming-soon" className="comming-soon-img h-auto w-full group-hover:hidden group-active:hidden" src={isRTL === "ltr" ? "/images/coming-soon-strip-en-white-tr.svg" : "/images/coming-soon-strip-ar-white-tr.svg"} />
              <Image height={210} width={112} alt="Comming-soon" className="comming-soon-hover-img h-auto w-full hidden group-hover:block" src={isRTL === "ltr" ? "/images/coming-soon-strip-en-yellow-tr.svg" : "/images/coming-soon-strip-ar-yellow-tr.svg"} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const LocationCard = ({ data }: { data: DynamicComponentData }) => {
  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [isMounted, setIsMounted] = useState(false);
  // Navigation button refs
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <section className="global-spacing !pb-0">
      <div className="location-card-container container relative">
        {/* Custom Nav Buttons */}
        <Button
          ref={prevRef}
          circleButton={true}
          variant="tangaroa"
          className="!absolute left-[26px] xs:left-[30px] sm:left-[52px] lg:left-[-74px] !top-[50%] h-[36px] xs:h-[46px] sm:h-[55px] slg:h-[65px] w-[36px] xs:w-[46px] sm:w-[55px] slg:w-[65px] -translate-y-1/2 z-10"
        ></Button>
        <Button
          ref={nextRef}
          circleButton={true}
          variant="tangaroa"
          className="!absolute right-[26px] xs:right-[30px] sm:right-[52px] lg:right-[-74px] top-1/2 -translate-y-1/2 z-10 rotate-180"
        ></Button>

        <Swiper
          key={isRTL}
          dir={isRTL}
          slidesPerView={2}
          spaceBetween={7}
          centeredSlides={true}
          loop={true}
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.93,
              spaceBetween: 7,
            },
            370: {
              slidesPerView: 1.715,
            },
            425: {
              slidesPerView: 1.585,
            },
            570: {
              slidesPerView: 1.45,
            },
            576: {
              slidesPerView: 1.682,
              spaceBetween: 14,
            },
            600: {
              slidesPerView: 1.5,
            },
            767: {
              slidesPerView: 2,
              spaceBetween: 18,
              centeredSlides: false,
            },
          }}
          onBeforeInit={(swiper) => {
            if (
              swiper.params.navigation && // check navigation exists
              typeof swiper.params.navigation !== "boolean"
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
          }}
          className="location-card-slider"
        >
          {data.locationItems.items.map((slideData, index) => (
            <SwiperSlide key={index}>
              <CardSlide slideData={slideData} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default LocationCard;
