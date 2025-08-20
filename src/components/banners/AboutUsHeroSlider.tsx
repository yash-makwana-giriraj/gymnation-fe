import React from "react";
import { DynamicComponentData } from "@/interfaces/content";
import Image from "next/image";
import Button from "../ui/Button";
import Link from "next/link";

const AboutUsHeroSlider = ({ data }: { data: DynamicComponentData }) => {
  return (
    <section className="about-hero min-h-[calc(100vh-50px)] mmob:min-h-[calc(100vh-60px)] xs:min-h-[100vh] mt-[50px] mmob:mt-[60px] xs:mt-0 pt-[68px] mmob:pt-[92px] xs:pt-[200px] pb-[72px] xsmb:pb-[80px] xxsmob:pb-[82px] mmob:pb-[95px] mb:pb-[106px] sm:pb-[120px] lp:pb-[150px] flex items-center relative after:content-[''] after:absolute after:inset-0 after:bg-primary after:!h-full after:!w-full after:opacity-60 after:-z-1">
      <Image
        src={data.heroImage?.[0]?.url}
        width={1080}
        height={608}
        alt="Hero banner image"
        priority
        fetchPriority="high"
        className="absolute object-cover h-full w-full z-[-1] top-0 left-0"
      />
      <div className="container !mx-auto lp:!max-w-[1372px]">
        <div className="relative text-white z-[2]">
          <p className="text-[16px] xxxsmb:text-[20px] xs:text-[24px] slg:text-[28px] leading-[20px] xxxsmb:leading-[24px] xs:leading-[1.2] text-yellow-f4 mb-[8px] xxxsmb:mb-[14px] xs:mb-[8px] italic font-800">
            {data.heroTitle}
          </p>
          <h1 className="w-full text-[48px] xs:text-[70px] sm:text-[90px] slg:text-[96px] leading-[1] xs:leading-[76px] sm:leading-[86px] mb-[12px]">
            {data.heroHeading.split("$").map((part, index) => (
              <React.Fragment key={index}>
                {index > 0 && <br />}
                {part.trim()}
              </React.Fragment>
            ))}
          </h1>
          <h2 className="flex items-center xxxsmb:items-end gap-[4px] xxxsmb:gap-[6px] xs:gap-[8px] sm:gap-[10px] lp:gap-[12px] text-[14px] xxxsmb:text-[22px] mb:text-[24px] xs:text-[28px] sm:text-[35px] slg:text-[40px] leading-[22px] xxxsmb:leading-[28px] mb:leading-[1.3] mb-[18px] xsmb:mb-[30px] mob:mb-[40px] mb:mb-[24px] sm:mb-[30px] font-700">
            {data.reviewTitle}{" "}
            <Image
              alt="Google Icon"
              className="!w-auto object-contain h-[15px] xxxsmb:h-[24px] mb:h-[28px] xs:h-[30px] sm:h-[37px] slg:h-[47px] !mt-[2px] xxxsmb:!mt-0 xxxsmb:mb-[1px] sm:mb-0"
              src={data.googleLogo[0].url}
              width={142}
              height={47}
            />{" "}
            <span className="title-black ">{data.reviewText}</span>
          </h2>
          <div className="w-full mt-[20px] mb-[-10px] mb:mt-[24px] sm:mt-[30px] xxxsmb:mb-[-12px] xs:mb-[-8px]">
            <Button
              variant="white"
              className="about-us-buttons text-center !text-[16px] sm:!text-[20px] lp:!text-[22px] !leading-[20px] sm:!leading-[26px] py-[9px] sm:py-[13px] lp:py-[15px] !px-[12px] sm:!px-[18px] max-h-[38px] sm:max-h-[52px] lp:max-h-[58px] block w-full mb:w-auto mb-[10px] xxxsmb:mb-[12px] xs:mb-[8px] mr-0 mb:mr-[16px] sm:mr-[30px] mb:!pr-[10px] sm:!pr-[14px] lp:!pr-[15px]"
            >
              {data.callToAction[0].title}
            </Button>
            <Link href={data.redictToAction?.[0]?.route?.path || "#"}>
              <Button className="about-us-buttons text-center !text-[16px] sm:!text-[20px] lp:!text-[22px] !leading-[20px] sm:!leading-[26px] py-[9px] sm:py-[13px] lp:py-[15px] !px-[12px] sm:!px-[18px] max-h-[38px] sm:max-h-[52px] lp:max-h-[58px] block w-full mb:w-auto mb-[10px] xxxsmb:mb-[12px] xs:mb-[8px] mr-0 mb:mr-[12px] sm:mr-[26px] mb:!pr-[10px] sm:!pr-[14px] lp:!pr-[15px]">
                {data.redictToAction[0].title}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHeroSlider;
