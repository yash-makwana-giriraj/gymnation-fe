"use client";
import { useEffect, useRef, useState } from "react";
import { getCookieValue } from "@/helpers/getCookie";

// Types and Interfaces
import { DynamicComponentData } from "@/interfaces/content";
import type { AutoplayOptions, Swiper as SwiperType } from "swiper/types";

// Component
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import Button from "../ui/Button";
import CardSlide from "../cards/ImageGalleryCard";

const ImageGalleryWithDescription = ({
  data,
}: {
  data: DynamicComponentData;
}) => {
  const cardData = data?.images;

  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [isMounted, setIsMounted] = useState(false);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
    setIsMounted(true);
  }, []);

  const restartAutoplay = (swiper: SwiperType) => {
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }

    restartTimeoutRef.current = setTimeout(() => {
      const autoplay = swiper.params.autoplay as AutoplayOptions;
      autoplay.delay = 0;
      swiper.params.speed = 3000;
      swiper.autoplay.start();
    }, 3000);
  };

  if (!isMounted) return null;

  return (
    <>
      <style>{`
        .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>

      <div className="relative global-spacing !py-0">
        <Button
          ref={prevRef}
          circleButton
          variant="white"
          className="!absolute !top-[50%] -translate-y-1/2 z-10 left-[20px] xs:left-[30px] slg:left-[52px]"
        />
        <Button
          ref={nextRef}
          circleButton
          variant="white"
          className="!absolute !top-[50%] -translate-y-1/2 z-10 rotate-180 right-[20px] xs:right-[30px] slg:right-[52px]"
        />

        <Swiper
          key={isRTL}
          dir={isRTL}
          spaceBetween={29}
          loop={true}
          centeredSlides={true}
          freeMode={true}
          modules={[Navigation, Autoplay]}
          navigation={{
            prevEl: isRTL === "rtl" ? nextRef.current : prevRef.current,
            nextEl: isRTL === "rtl" ? prevRef.current : nextRef.current,
          }}
          autoplay={{
            delay: 0,
          }}
          speed={3000}
          onBeforeInit={(swiper) => {
            if (
              swiper.params.navigation &&
              typeof swiper.params.navigation !== "boolean"
            ) {
              swiper.params.navigation.prevEl =
                isRTL === "rtl" ? nextRef.current : prevRef.current;
              swiper.params.navigation.nextEl =
                isRTL === "rtl" ? prevRef.current : nextRef.current;
            }
          }}
          onNavigationNext={(swiper) => {
            swiper.autoplay.stop();
            const autoplay = swiper.params.autoplay as AutoplayOptions;
            autoplay.delay = 3000;
            swiper.params.speed = 500;
            swiper.slideNext(500, true);
            restartAutoplay(swiper);
          }}
          onNavigationPrev={(swiper) => {
            swiper.autoplay.stop();
            const autoplay = swiper.params.autoplay as AutoplayOptions;
            autoplay.delay = 3000;
            swiper.params.speed = 500;
            swiper.slidePrev(500, true);
            restartAutoplay(swiper);
          }}
          breakpoints={{
            0: { slidesPerView: 1.8, spaceBetween: 19 },
            377: { slidesPerView: 1.7, spaceBetween: 19 },
            481: { slidesPerView: 1.56, spaceBetween: 19 },
            576: { slidesPerView: 1.68, spaceBetween: 19 },
            768: { slidesPerView: 2.13, spaceBetween: 19 },
            992: { slidesPerView: 2.14, spaceBetween: 20 },
            1200: { slidesPerView: 2.14, spaceBetween: 29 },
            1440: { slidesPerView: 2.11, spaceBetween: 29 },
            1441: { slidesPerView: 2.58, spaceBetween: 29 },
            1700: { slidesPerView: 3.27, spaceBetween: 29 },
            1800: { slidesPerView: 4.5, spaceBetween: 29 },
            1801: { slidesPerView: 4.25, spaceBetween: 29 },
            1920: { slidesPerView: 3.62, spaceBetween: 29 },
            2000: { slidesPerView: 4.72, spaceBetween: 29 },
            2500: { slidesPerView: 4.78, spaceBetween: 29 },
            3500: { slidesPerView: 6.67, spaceBetween: 29 },
            4000: { slidesPerView: 6.5, spaceBetween: 29 },
            6000: { slidesPerView: 7.5, spaceBetween: 29 },
          }}
          className="linear-swiper-slider"
        >
          {cardData.map((slideData, index) => {
            const image = slideData?.url;
            return (
              <SwiperSlide
                key={index}
                virtualIndex={index}
                className="cursor-default pt-[10px] pb-[15px] group swiper-slide-active:!group"
              >
                <CardSlide
                  index={index}
                  image={image}
                  borderRadius={12}
                  wrapperClass="gallery-card"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default ImageGalleryWithDescription;
