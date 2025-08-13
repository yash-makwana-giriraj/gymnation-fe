"use client";
import React, { useState } from "react";
import { FooterData } from "@/interfaces/content";
import parse from "html-react-parser";
import Button from "../ui/Button";
import Image from "next/image";
import Link from "next/link";

const Footer = ({ data }: { data: FooterData }) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [selctedTitleIndex, setSelctedTitleIndex] = useState<number>();
  const handleClick = (index: number) => {
    if (selctedTitleIndex === index) {
      setIsActive(!isActive);
    } else {
      setIsActive(true);
      setSelctedTitleIndex(index);
    }
  };
  return (
    <>
      <section className="global-spacing !px-[12px] xs:!px-[16px] sm:!px-[20px] lp:!px-[40px] !pt-0">
        <div className="py-[22px] mb:py-[40px] sm:py-[50px] px-[16px] mb:px-[30px] sm:px-[40px] lp:p-[65px] bg-gray-f6 rounded-[24px] w-full">
          <div className=" ">
            <div className="flex flex-col text-center">
              <h2 className="text-primary text-[16px] xsmb:text-[18px] mb:text-[26px] xs:text-[34px] sm:text-[45px] slg:text-[48px] leading-[20px] mb:leading-[1.2] uppercase mb-[12px] mb:mb-[26px] font-800 mt-0">
                {data.socialMediaTitle}
              </h2>
              <ul className="flex justify-center px-[-6px] mb:px-[12px] sm:px-[15px] mb-[6px] mb:mb-[12px] sm:mb-[11px] lp:mb-[11px]">
                {data.socialAccounts?.items.map((socialItems, socialIndex) => {
                  return (
                    <li
                      key={socialIndex}
                      className="px-[6px] mb:px-[12px] sm:px-[15px] pb-[6px] mb:pb-[12px] sm:pb-[15px]"
                    >
                      <a
                        className="w-[30px] mb:w-[55px] sm:w-[64px] lp:w-[72px] h-[30px] mb:h-[55px] sm:h-[64px] lp:h-[72px] relative bg-primary hover:bg-secondary rounded-full inline-flex items-center justify-center group"
                        href={socialItems.content.properties.link[0].url}
                      >
                        <Image
                          src={socialItems.content.properties.icon[0].url}
                          width={56}
                          height={91}
                          className="object-contain w-[20px] mb:w-[32px] sm:w-[36px] lp:w-[42px] h-[18px] mb:h-[32px] sm:h-[36px] lp:h-[47px]"
                          alt={socialItems.content.properties.icon[0].name}
                        />
                        <Image
                          src={socialItems.content.properties.iconBlue[0].url}
                          width={56}
                          height={91}
                          className="opacity-0 absolute transition-opacity duration-300 group-hover:opacity-100 object-contain w-[20px] mb:w-[32px] sm:w-[36px] lp:w-[42px] h-[18px] mb:h-[32px] sm:h-[36px] lp:h-[47px]"
                          alt={socialItems.content.properties.iconBlue[0].name}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
              <h3 className="text-primary text-[14px] xsmb:text-[16px] xsmob:text-[18px] mb:text-[24px] xs:text-[32px] sm:text-[45px] slg:text-[48px] leading-[20px] mb:leading-[1.2] mb-[10px] mb:mb-[28px] sm:mb-[32px] font-800">
                {data.appTitle}
              </h3>
              <div className="w-full flex flex-wrap justify-center -mb-[6px] mb:-mb-[8px] xs:-mb-[16px] px-0">
                <div className="mb-0 mb:mb-[2px] xs:mb-[10] mx-[8px] mb:mx-[8px] xs:mx-[12px]">
                  <a href={data.appStoreLink} className="relative block group leading-none">
                    {data.appStoreImage?.[0].url && (
                      <Image
                        alt="App Store"
                        className="block w-auto object-contain h-[30px] mb:h-[40px] xs:h-[56px] lp:h-[62px] group-hover:opacity-0 group-hover:invisible"
                        src={data.appStoreImage[0].url}
                        width={209}
                        height={62}
                      />
                    )}
                    {data.appStoreHoverImage?.[0].url && (
                      <Image
                        alt="App Store Hover"
                        className="block w-full object-contain opacity-0 absolute top-0 left-0 transition-opacity duration-200 h-[30px] mb:h-[40px] xs:h-[56px] lp:h-[62px] group-hover:opacity-100 group-hover:visible"
                        src={data.appStoreHoverImage[0].url}
                        width={209}
                        height={62}
                      />
                    )}
                  </a>
                </div>
                <div className="mb-0 mb:mb-[2px] xs:mb-[10] mx-[8px] mb:mx-[8px] xs:mx-[12px]">
                  <a href={data.playStoreLink} className="!relative inline-block leading-0 group">
                    {data.playStoreImage?.[0].url && (
                      <Image
                        alt="Play Store"
                        className="block w-auto object-contain h-[30px] mb:h-[40px] xs:h-[56px] lp:h-[62px] group-hover:opacity-0 group-hover:invisible"
                        src={data.playStoreImage[0].url}
                        width={209}
                        height={62}
                      />
                    )}
                    {data.playStoreHoverImage?.[0].url && (
                      <Image
                        alt="Play Store Hover"
                        className="block w-full object-contain opacity-0 absolute top-0 left-0 transition-opacity duration-300 h-[30px] mb:h-[40px] xs:h-[56px] lp:h-[62px] group-hover:opacity-100 group-hover:visible"
                        src={data.playStoreHoverImage[0].url}
                        width={209}
                        height={62}
                      />
                    )}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-white relative mt-[6px] mb:mt-[8px] xs:mt-[10px] sm:mt-[15px] lp:mt-[16px] pt-[60px] xxsmob:pt-[74px] mb:pt-[100px] xs:pt-[90px] sm:pt-[114px] lp:pt-[150px] pb-[50px] xs:pb-[60px] sm:pb-[70px] lp:pb-[100px]">
        <div className="footer-container container">
          <div className="flink-group flex flex-wrap justify-between mx-[-12px]">
            {data.footerNavigationSections?.items.map((item, index) => {
              return (
                <div
                  key={index}
                  className="flink-box !max-w-full xs:!max-w-[25%] w-full xs:w-auto text-center xs:text-start px-[12px]"
                >
                  <h3
                    onClick={() => handleClick(index)}
                    className={`relative uppercase inline-block font-800 tracking-[1px] text-[20px] mb:text-[24px] xs:text-[17px] sm:text-[17px] lp:text-[20px] leading-[26px] mb:leading-[30px] xs:leading-[23px] sm:leading-[26px] lp:leading-[28px] py-[10px] mb:py-[12px] pr-[18px] mb:pr-[20px] xs:p-0 xs:mb-[14px]
                    ${
                      ( selctedTitleIndex === index &&
                      isActive ) && 
                      "text-secondary xs:text-white active"
                    } `}
                  >
                    {item?.content?.properties.sectionTitle}
                  </h3>
                  <div
                    className={`${
                      selctedTitleIndex === index && isActive
                        ? "max-h-[5000px] opacity-100 duration-900 ease-in-out"
                        : "max-h-0 xs:max-h-full opacity-0 xs:opacity-100 duration-300 ease-out"
                    } overflow-hidden transition-all`}
                  >
                    <ul className="pt-[10px] mb:pt-[12px] pb-[16px] mb:pb-[20px] xs:p-0">
                      {item.content.properties.sectionLinks?.map(
                        (linkItem, linkIndex) => {
                          return (
                            <li
                              key={linkIndex}
                              className="!h-fit flex justify-center xs:justify-start p-0 mb-[12px] mb:mb-[18px] xs:mb-[8px] sm:mb-[10px] lp:mb-[12px] last:mb-0"
                            >
                              <Link className="flex" href={linkItem.route.path}>
                                <h2 className="capitalize hover:text-secondary decoration-0 inline-block font-500 lp:font-600 tracking-0 text-[16px] mb:text-[20px] xs:text-[14px] sm:text-[15px] lp:text-[16px] leading-[22px] mb:leading-[24px] xs:leading-[22px] sm:leading-[23px] lp:leading-[24px]">
                                  {linkItem.title}
                                </h2>
                              </Link>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-col items-center text-center w-full pt-[40px] mb:pt-[57px] xs:pt-[36px] sm:pt-[44px] lp:pt-[60px] lg:pt-[72px]">
            <Link href={data?.footerLink?.[0]?.route?.path ?? "/"}>
            <Button className="footer-button inline-block xs:text-[20px] sm:text-[28px] lp:text-[36px] mb-[40px] mb:mb-[57px] xs:mb-[36px] lp:mb-[55px] !gap-[8px] mb:!gap-[12px] xs:!gap-[12px] sm:!gap-[14px] lp:!gap-[10px] !py-[6.5px] mb:!py-[9.5px] xs:!py-[8px] sm:!py-[9px] lp:!py-[8.5px] !pl-[19px] mb:!pl-[29px] xs:!pl-[22px] sm:!pl-[26px] lp:!pl-[25px] !pr-[22px] mb:!pr-[30px] xs:!pr-[14px] sm:!pr-[15px] lp:!pr-[17px]">
              {data.footerLink?.[0]?.title ?? ""}
            </Button>
            </Link>
            <h2 className="text-[13px] mb:text-[16px] font-700 tracking-[0.4px] leading-[20px] mb:leading-[24px] mb-[20px] uppercase">
              {data.partnerText}
            </h2>
            <div className="flex flex-wrap justify-center mx-[-15px] mb:mx-0 mb-[-20px]">
              {data.footerImage?.map((imageItem, imageIndex) => {
                return (
                  <div
                    className="inline-block mx-[25px] mb-[20px]"
                    key={imageIndex}
                  >
                    <Image
                      className="h-[60px] mb:h-[85px] w-auto"
                      src={imageItem.url}
                      width={85}
                      height={127}
                      alt=""
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="copyright-text mt-[50px] lp:mt-[55px] lg:mt-[68px] text-center w-full">
            {parse(data.copyrightText?.markup ?? "")}
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
