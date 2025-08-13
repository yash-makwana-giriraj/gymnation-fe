"use client";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import parse from "html-react-parser";

// Types and Interface
import { getCookieValue } from "@/helpers/getCookie";
import { DynamicComponentData } from "@/interfaces/content";

// Components
import Button from "../ui/Button";
import CardSlide from "../cards/ImageGalleryCard";

const ScrollableClassesCard = ({ data }: { data: DynamicComponentData }) => {
  const cardData = data?.scrollableCardItems?.items;

  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [isMounted, setIsMounted] = useState(false);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
    setIsMounted(true);
  }, []);

  const splitTitleAndTag = (str: string | undefined) => {
    if (!str) return { title: "", tag: null };
    const [, title, tag] = str.match(/^(.*?)(?:\s*\[(.*)\])?$/) || [];
    return { title: title?.trim() || "", tag: tag?.trim() || null };
  };

  if (!isMounted) return null;

  return (
    <div className="relative global-spacing !pb-0">
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
        modules={[Navigation]}
        navigation={{
          prevEl: isRTL === "rtl" ? nextRef.current : prevRef.current,
          nextEl: isRTL === "rtl" ? prevRef.current : nextRef.current,
        }}
        speed={500}
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
        breakpoints={{
          0: {
            slidesPerView: 1.72,
            spaceBetween: 7,
          },
          377: {
            slidesPerView: 1.65,
            spaceBetween: 7,
          },
          481: {
            slidesPerView: 1.64,
            spaceBetween: 7,
          },
          576: {
            slidesPerView: 1.69,
            spaceBetween: 14,
          },
          768: {
            slidesPerView: 2.15,
            spaceBetween: 14,
          },
          992: {
            slidesPerView: 2.14,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 2.16,
            spaceBetween: 20,
          },
          1440: {
            slidesPerView: 2.06,
            spaceBetween: 20,
          },
          1441: {
            slidesPerView: 2.6,
            spaceBetween: 20,
          },
          1700: {
            slidesPerView: 3.26,
            spaceBetween: 29,
          },
          1800: {
            slidesPerView: 4.5,
            spaceBetween: 29,
          },
          1801: {
            slidesPerView: 4.25,
            spaceBetween: 29,
          },
          1920: {
            slidesPerView: 3.62,
            spaceBetween: 29,
          },
          2000: {
            slidesPerView: 4.72,
            spaceBetween: 29,
          },
          2500: {
            slidesPerView: 4.78,
            spaceBetween: 29,
          },
          3500: {
            slidesPerView: 6.67,
            spaceBetween: 29,
          },
          4000: {
            slidesPerView: 6.5,
            spaceBetween: 29,
          },
          6000: {
            slidesPerView: 7.5,
            spaceBetween: 29,
          },
        }}
      >
        {cardData.map((slideData, index) => {
          // Extracting image, title, tag, and description from slideData
          const image = slideData?.content?.properties?.image?.[0].url || "";

          const split = splitTitleAndTag(slideData?.content?.properties?.title);
          const title = split.title;
          const tag = split.tag;

          const descProp = slideData?.content?.properties?.description;
          const description =
            descProp && typeof descProp !== "string" && "markup" in descProp
              ? (parse(descProp.markup) as string)
              : undefined;

          const link =
            slideData?.content?.properties?.callToAction?.[0]?.route?.path;

          return (
            <SwiperSlide
              key={index}
              className="cursor-default pt-[10px] pb-[15px] group swiper-slide-active:!group"
            >
              <CardSlide
                index={index}
                image={image}
                title={title}
                tag={tag}
                description={description}
                link={link}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default ScrollableClassesCard;
