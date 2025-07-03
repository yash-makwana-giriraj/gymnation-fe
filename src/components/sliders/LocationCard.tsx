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
  return (
    <div className="relative">
      <Link href={data.link[0].route.path}>
        <div className="xl:min-h-[401px] xxl:min-h-[490px]">
          <div className="group px-[50px] py-[53px] absolute w-full h-full rounded-[24px] overflow-hidden flex items-end 
            before:content-[''] before:absolute before:border-[5px] before:border-secondary before:opacity-0 
            hover:before:!opacity-100 before:transition-opacity before:duration-300 before:ease-in-out 
            before:w-full before:h-full before:rounded-[24px] before:left-0 before:top-0">

            {data.image?.[0]?.url && (
              <Image
                src={data.image[0].url}
                width={100}
                height={100}
                alt={data.name || "location"}
                className="absolute left-0 top-0 w-full h-full object-cover -z-10"
              />
            )}

            <h3 className="text-white font-800 group-hover:text-secondary">
              {data.link[0].title}
            </h3>
          </div>
        </div>
      </Link>
    </div>
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
    <div className="pt-[60px]">
      <div className="container relative">
        {/* Custom Nav Buttons */}
        <Button ref={prevRef} circleButton={true} variant="tangaroa" className="!absolute left-[-74px] !top-[50%] -translate-y-1/2 z-10"></Button>
        <Button ref={nextRef} circleButton={true} variant="tangaroa" className="!absolute !right-[-74px] top-1/2 -translate-y-1/2 z-10 rotate-180"></Button>

        <Swiper
          key={isRTL}
          dir={isRTL}
          slidesPerView={2}
          spaceBetween={18}
          loop={true}
          modules={[Navigation]}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
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
    </div>
  );
};

export default LocationCard;
