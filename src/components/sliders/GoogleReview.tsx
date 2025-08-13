"use client";
import {
  DynamicComponentData,
  GoogleReviewResponse,
} from "@/interfaces/content";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { useState } from "react";
import Image from "next/image";
import "swiper/css";
import "swiper/css/autoplay";
import Button from "../ui/Button";
import { fetchGoogleReviewData } from "@/api-handler/apis/content";
import { getCookieValue } from "@/helpers/getCookie";

const GoogleReview = ({ data }: { data: DynamicComponentData }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [googelReviewContent, setgoogelReviewContent] = useState<
    GoogleReviewResponse[]
  >([]);
  const [isRTL, setIsRTL] = useState<"rtl" | "ltr">("ltr");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const lang = getCookieValue("NEXT_LOCALE");
    setIsRTL(lang === "ar" ? "rtl" : "ltr");
    setIsMounted(true);
  }, [isMounted]);

  useEffect(() => {
    const loadLGooglereviews = async () => {
      try {
        const response = await fetchGoogleReviewData();
        if (response && Array.isArray(response)) {
          setgoogelReviewContent(response);
        }
      } catch (err) {
        console.error("Error fetching latest news:", err);
      }
    };

    loadLGooglereviews();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      month: "long", // Full month name (e.g., 'May')
      day: "2-digit", // Day of the month (e.g., '05')
      year: "numeric", // Full year (e.g., '2025')
    };
    return date.toLocaleDateString("en-US", options); // You can change 'en-US' to any locale if you want
  };

  const starMap: { [key: string]: number } = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
  };
  const splitTitleAndTag = (str: string | undefined) => {
    if (!str) return { title: "", tag: null };
    const [, title, tag] = str.match(/^(.*?)(?:\s*\[(.*)\])?$/) || [];
    return { title: title?.trim() || "", tag: tag?.trim() || null };
  };
  const title = splitTitleAndTag(data.reviewTitle || "").title;
  const tag = splitTitleAndTag(data.reviewTitle || "").tag;
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  return (
    <section className="text-primary global-spacing">
      <div className="w-full text-center text-[30px] sm:text-[36px] leading-[40px] sm:leading-[46px] font-500 px-[15px] xs:px-[12px] mb-[20px] xs:mb-[30px] sm:mb-[40px]">
        <h2 className="leading-[1] mb-[10px] xs:mb-[20px] font-900 text-[6.5vw] xlg:text-[96px]">
          {title}
          <span className="block review-stroke-text text-white tracking-[0.7vw] mob:tracking-[0.5vw] mb:tracking-[0.6vw] sm:tracking-[0.9vw] lp:tracking-[0.5vw] xlg:tracking-[8.5px]">
            {tag}
          </span>
        </h2>
        <p className="text-[16px] xs:text-[20px] sm:text-[30px] xslg:text-[36px] leading-[20px] xs:leading-[30px] sm:leading-[38px] xslg:leading-[46px] max-w-full xs:max-w-[90%] sm:max-w-[60%] xslg:max-w-[54%] w-full font-500 mx-auto">
          {typeof data.description === "string" && data.description}
        </p>
      </div>
      <div className="relative">
        <Button
          ref={prevRef}
          circleButton
          variant="white"
          className="!absolute !w-[30px] mb:!w-[36px] xs:!w-[46px] sm:!w-[55px] slg:!w-[65px] !h-[30px] mb:!h-[36px] xs:!h-[46px] sm:!h-[55px] slg:!h-[65px] !top-[50%] [box-shadow:0_0_4px_rgba(2,_42,_58,_.4)] -translate-y-1/2 z-10 left-[2%] mb:left-[5%]"
        />
        <Button
          ref={nextRef}
          circleButton
          variant="white"
          className="!absolute !top-[50%] !w-[30px] mb:!w-[36px] xs:!w-[46px] sm:!w-[55px] slg:!w-[65px] !h-[30px] mb:!h-[36px] xs:!h-[46px] sm:!h-[55px] slg:!h-[65px] [box-shadow:0_0_4px_rgba(2,_42,_58,_.4)] -translate-y-1/2 z-10 rotate-180 right-[2%] mb:right-[5%]"
        />

        <Swiper
          modules={[Autoplay, Navigation]}
          slidesPerView={2}
          spaceBetween={20}
          centeredSlides
          loop
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          breakpoints={{
            0: {
              slidesPerView: 1.12,
              spaceBetween: 30,
            },
            400: {
              slidesPerView: 1.15,
              spaceBetween: 40,
            },
            430: {
              slidesPerView: 1.1,
              spaceBetween: 30,
            },
            576: {
              slidesPerView: 1.5,
              spaceBetween: -20,
            },
            600: {
              slidesPerView: 1.4,
              spaceBetween: -25,
            },
            700: {
              slidesPerView: 1.4,
              spaceBetween: -30,
            },
            768: {
              slidesPerView: 1.55,
              spaceBetween: -30,
            },
            850: {
              slidesPerView: 1.45,
              spaceBetween: -40,
            },
            991: {
              slidesPerView: 1.75,
              spaceBetween: -35,
            },
            1150: {
              slidesPerView: 1.6,
              spaceBetween: -50,
            },
            1200: {
              slidesPerView: 1.55,
              spaceBetween: -55,
            },
            1300: {
              slidesPerView: 1.5,
              spaceBetween: -60,
            },
            1400: {
              slidesPerView: 2,
              spaceBetween: -40,
            },
            1500: {
              slidesPerView: 2.05,
              spaceBetween: -40,
            },
            1600: {
              slidesPerView: 1.9,
              spaceBetween: -65,
            },
            1700: {
              slidesPerView: 1.8,
              spaceBetween: -70,
            },
            1800: {
              slidesPerView: 1.7,
              spaceBetween: -80,
            },
            1900: {
              slidesPerView: 1.7,
              spaceBetween: -90,
            },
          }}
          className="google-review"
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        >
          {googelReviewContent?.map((review, index) => {
            const stars = starMap[review.starRating.toUpperCase()] || 0;
            return (
              <SwiperSlide key={review.id}>
                <div
                  className={`!w-full !h-full flex-wrap items-center !min-h-auto mb:!min-h-[225px] sm:!min-h-[273px] lp:!min=h=[293px] transition-transform duration-500 ease-in-out rounded-[34px] shadow-md p-[25px] xs:py-[25px] xs:px-[30px] lp:px-[49px] bg-white ${activeIndex === index
                    ? "scale-100 !bg-primary text-white"
                    : "scale-80 !bg-gray-e4 text-primary"
                    }`}
                >
                  <div className="w-full flex items-center gap-[4px] xs:gap-0 mb-[13px] mb:mb-[16px]">
                    <Image
                      width={53}
                      height={39}
                      src="/images/quote-icon-white.svg"
                      className="w-auto h-[21px] xs:h-[25px] sm:h-[34px] lp:h-[39px]"
                      alt="Quote-icon"
                    />
                    <div className="mx-[7px] xs:ml-[15px] sm:ml-[25px] lp:ml-[31px] xs:mr-[10px] lp:mr-[11px]">
                      <Image
                        width={64}
                        height={21}
                        src={
                          "/images/google-icon.webp"
                        }
                        className="h-auto w-[65px] sm:w-[95px]"
                        alt="Google-icon"
                      />
                    </div>
                    <h2 className="text-[12px] mb:text-[14px] xs:text-[16px] sm:text-[20px] lp:text-[24px] leading-[18px] mb:leading-[20px] xs:leading-[22px] sm:leading-[28px] lp:leading-[30px] font-600">
                      Verified Reviews
                    </h2>
                  </div>
                  <div className="w-full pb-[15px] mb:pb-[20px] xs:pb-[24px]">
                    <p className="text-[16px] mb:text-[13px] xs:text-[20px] sm:text-[15px] lp:text-[24px] leading-[26px] mb:leading-[20px] xs:leading-[30px] sm:leading-[23px] lp:leading-[34px] font-600 w-full line-clamp-2 overflow-hidden">
                      {review.comment}
                    </p>
                  </div>
                  <div className="flex-col xs:flex-row xs:flex-wrap flex w-full xs:items-center">
                    <div
                      className={`flex items-center mr-0 xs:mr-[10px] xslg:mr-[20px] mb-[18px] xs:mb-0${isRTL === "rtl" &&
                        "!ml-0 xs:!ml-[10px] xslg:!ml-[20px] !mr-0"
                        }`}
                    >
                      <span
                        className={`mr-[10px] mb:mr-[15px] h-[50px] sm:h-[75px] lp:h-[94px] w-[50px] sm:w-[75px] lp:w-[94px] ${isRTL === "rtl" && "!ml-[10px] mb:!ml-[15px] !mr-0"
                          }`}
                      >
                        <Image
                          src={review.reviewerProfilePhotoUrl}
                          alt={review.name}
                          width={50}
                          height={50}
                          className="rounded-full w-full h-full object-fit"
                        />
                      </span>
                      <div>
                        <h2 className="capitalize font-600 mb-0 text-[14px] mb:text-[16px] sm:text-[20px] lp:text-[24px] leading-[22px] mb:leading-[24px] sm:leading-[28px] lp:leading-[34px]">
                          {review.reviewerDisplayName}
                          <span className="block font-500 mt-0 mb:mt-[2px]">
                            {formatDate(review.createTime)}
                          </span>
                        </h2>
                      </div>
                    </div>
                    <ul className="flex items-center">
                      {Array.from({ length: stars }, (_, index) => (
                        <li className="mr-[4px]" key={`${index}`}>
                          <Image
                            width={20}
                            height={20}
                            alt="star"
                            src="/images/review-star.webp"
                            className="h-auto w-[20px] mb:w-[28px] sm:w-[34px] lp:w-[39px]"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default GoogleReview;
