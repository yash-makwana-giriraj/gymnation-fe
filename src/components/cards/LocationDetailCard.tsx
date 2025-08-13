import Image from "next/image";
import Link from "next/link";
import React from "react";

function LocationDetailCard({
  index,
  title,
  isLocationComponent,
  cityName,
  isKsa,
  mapAddress,
  joinLink,
  gymInfoLink,
  registerLink,
  image,
  distance = "1745",
  className,
  onClick,
  isActive,
}: {
  index: number;
  title: string;
  isLocationComponent?: boolean
  cityName: string;
  isKsa: boolean;
  mapAddress: string;
  joinLink?: string;
  gymInfoLink?: string;
  registerLink?: string;
  image: string;
  distance?: string;
  className?: string;
  isActive?: boolean;
  onClick: (index: number) => void;
}) {
  return (
    <>
      {isLocationComponent ? (
        <div
          className={`border-4 hover:border-secondary flex items-center gap-[23px] xs:gap-[29px] sm:gap-[20px] lp:gap-[29px] p-[7px] pl-[15px] rounded-[12px] w-full text-primary ${className} ${isActive ? "bg-secondary border-secondary" : "bg-white border-white"
            }`}
          onClick={() => onClick(index)}
        >
          <div className="flex-1">
            <div className="mb-[12px]">
              <h3 className="break-words text-[16px] mb:text-[18px] leading-[20px] mb:leading-[28px] xs:leading-[28px] mb-[3px] font-extrabold inline cursor-pointer">
                {title}{" "}
              </h3>
              <span
                className={`text-primary py-[3.5px] px-[4px] rounded-[6px] text-[10px] font-bold leading-[14px] whitespace-nowrap ${isActive
                  ? "bg-white"
                  : "bg-secondary group-[.swiper-slide-active]:bg-white"
                  }`}
              >
                {`(${cityName}, ${isKsa ? "KSA" : "UAE"})`}
              </span>
            </div>
            <div className="flex items-center gap-[9px] font-semibold text-[13px] leading-[28px] xs:leading-[23px] mb-[6px] mb:mb-[10px] xs:mb-[16px]">
              <Image
                src="/icons/location-icon-new.svg"
                width={28}
                height={36}
                alt="location icon"
                className="w-full max-w-[16px] xs:max-w-[22px] object-contain"
              />
              {mapAddress}
            </div>
            <div className="flex gap-[3px]">
              {joinLink && (
                <LinkButton
                  variant="primary"
                  link={joinLink}
                  title="Join now"
                  isActive
                  className="!text-xs"
                />
              )}

              {gymInfoLink && (
                <LinkButton
                  variant="white"
                  link={gymInfoLink}
                  title="Gym Info"
                  isActive
                  className="!text-xs"
                />
              )}

              {registerLink && (
                <LinkButton
                  variant="white"
                  link={registerLink}
                  title="Register Now"
                  isActive
                />
              )}
            </div>
          </div>

          <div className="relative w-[128px] h-[126px] hidden mb:block rounded-lg overflow-hidden z-0">
            {/* Main image */}
            <Image
              src={image}
              alt="Image 1"
              fill
              className="object-cover rounded-lg cursor-pointer"
            />

            {registerLink && (
              <>
                <div className="absolute top-0 right-0 h-full w-[160px] z-10 bg-[url('/icons/en-map-cmn-strip-white.svg')] bg-top bg-no-repeat bg-contain pointer-events-none" />
                <div className="absolute top-0 right-0 h-full w-[160px] z-20 bg-[url('/icons/en-map-cmn-strip-yellow.svg')] bg-top bg-no-repeat bg-contain opacity-0 group-hover:opacity-100 pointer-events-none" />
              </>
            )}

            {/* Distance tag */}
            {distance && (
              <span
                className={`bg-secondary hidden mb:block group-[.swiper-slide-active]:bg-white text-primary w-max absolute bottom-0 right-0 rounded-l-full py-[8px] px-[16px] text-p-small font-bold z-30 ${isActive && "bg-white"
                  }`}
              >
                {distance} km
              </span>
            )}
          </div>
        </div>
      ) : (
        <div
          className={`border-4 hover:border-secondary flex items-center gap-[23px] xs:gap-[29px] sm:gap-[20px] lp:gap-[29px] p-[10px] mb:py-[7px] pl-[15px] pr-[7px] xs:py-[10px] xs:px-[31px] sm:px-[18px] lp:px-[27px] rounded-[12px] w-full text-primary ${className} ${isActive ? "bg-secondary border-secondary" : "bg-white border-white"
            }`}
          onClick={() => onClick(index)}
        >
          <div className="flex-1">
            <div className="mb-[12px]">
              <h3 className="break-words text-[16px] mb:text-[18px] xs:text-[22px] leading-[20px] mb:leading-[28px] xs:leading-[28px] mb-[3px] font-extrabold inline cursor-pointer">
                {title}{" "}
              </h3>
              <span
                className={`text-primary py-[3.5px] px-[4px] rounded-[6px] text-[10px] font-bold leading-[14px] whitespace-nowrap ${isActive
                  ? "bg-white"
                  : "bg-secondary group-[.swiper-slide-active]:bg-white"
                  }`}
              >
                {`(${cityName}, ${isKsa ? "KSA" : "UAE"})`}
              </span>
            </div>
            <div className="flex items-center gap-[9px] font-semibold text-[12px] xs:text-[16px] leading-[14px] xs:leading-[23px] mb-[6px] mb:mb-[10px] xs:mb-[16px]">
              <Image
                src="/icons/location-icon-new.svg"
                width={28}
                height={44}
                alt="location icon"
                className="w-full max-w-[16px] xs:max-w-[22px] lp:max-w-[28px] object-contain"
              />
              {mapAddress}
            </div>
            <div className="flex gap-[3px]">
              {joinLink && (
                <LinkButton
                  variant="primary"
                  link={joinLink}
                  title="Join now"
                  isActive
                />
              )}

              {gymInfoLink && (
                <LinkButton
                  variant="white"
                  link={gymInfoLink}
                  title="Gym Info"
                  isActive
                />
              )}

              {registerLink && (
                <LinkButton
                  variant="white"
                  link={registerLink}
                  title="Register Now"
                  isActive
                />
              )}
            </div>
          </div>

          <div className="relative w-[206px] h-[164px] hidden mb:block rounded-lg overflow-hidden z-0">
            {/* Main image */}
            <Image
              src={image}
              alt="Image 1"
              fill
              className="object-cover rounded-lg cursor-pointer"
            />

            {registerLink && (
              <>
                <div className="absolute top-0 right-0 h-full w-[160px] z-10 bg-[url('/icons/en-map-cmn-strip-white.svg')] bg-top bg-no-repeat bg-contain pointer-events-none" />
                <div className="absolute top-0 right-0 h-full w-[160px] z-20 bg-[url('/icons/en-map-cmn-strip-yellow.svg')] bg-top bg-no-repeat bg-contain opacity-0 group-hover:opacity-100 pointer-events-none" />
              </>
            )}

            {/* Distance tag */}
            {distance && (
              <span
                className={`bg-secondary hidden mb:block group-[.swiper-slide-active]:bg-white text-primary w-max absolute bottom-0 right-0 rounded-l-full py-[8px] px-[16px] text-p-small font-bold z-30 ${isActive && "bg-white"
                  }`}
              >
                {distance} km
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const LinkButton = ({
  variant,
  link,
  title,
  className,
  isActive = false,
}: {
  variant: "white" | "primary" | "custom";
  link: string;
  title: string;
  className?: string;
  isActive: boolean;
}) => {
  const commonClass =
    "uppercase h-[30px] text-[10px] leading-[12px] border-2 border-primary rounded-full flex items-center justify-center mb-[5px] px-[8px] py-[3px] font-bold w-full transition-all duration-300 ease-in-out";

  const variantClass = {
    white: "bg-white hover:bg-secondary text-primary",
    primary: "bg-primary hover:bg-secondary text-white hover:text-primary",
    custom: "",
  };

  const variantOutlines = {
    white: "border-primary hover:border-secondary",
    primary: "border-primary hover:border-secondary",
    custom: "",
  };

  return (
    <Link
      href={link}
      target="_blank"
      className={`${commonClass} ${variantClass[variant]} ${variantOutlines[variant]
        } ${isActive && "hover:!border-primary"} ${className}`}
    >
      {title}
    </Link>
  );
};

export default LocationDetailCard;