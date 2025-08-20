"use client";

import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import Image from "next/image";
import { DynamicComponentData } from "@/interfaces/content";
import { getCookieValue } from "@/helpers/getCookie";

const Rewards = ({ data }: { data: DynamicComponentData }) => {
  const cardData = data.items.items;
  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
    setIsMounted(true);
  }, [isMounted]);

  return (
    <div className="global-spacing !pb-0">
      <div className="my-0 mx-auto max-w-full">
        <div className="w-full overflow-hidden">
          <Swiper
            key={isRTL}
            dir={isRTL}
            modules={[Autoplay]}
            autoplay={{
              delay: 0,
            }}
            slidesPerView="auto"
            loop={true}
            centeredSlides={true}
            freeMode={true}
            breakpoints={{
              0: {
                spaceBetween: 20,
              },
              575: {
                spaceBetween: 20,
              },
              991: {
                spaceBetween: 50,
              },
              1199: {
                spaceBetween: 50,
              },
            }}
            speed={3000}
            className="linear-swiper-slider"
          >
            {cardData.map((card, i) => (
              <SwiperSlide
                key={i}
                className="!h-[127px] mb:!h-[140px] xs:!h-[160px] sm:!h-[250px] lp:!h-[270px] !w-[127px] mb:!w-[140px] xs:!w-[160px] sm:!w-[250px] lp:!w-[270px]"
              >
                {card?.content?.properties?.image?.[0]?.url && (
                  <Image
                    height={127}
                    width={127}
                    src={card?.content?.properties?.image?.[0]?.url}
                    alt={`slide ${i}`}
                    priority={i === 0} 
                    className="h-full w-full"
                  />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
