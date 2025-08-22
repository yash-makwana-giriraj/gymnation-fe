"use client";

import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";

import Image from "next/image";
import { HeaderData } from "@/interfaces/content";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import house from '../../../public/images/home-white.svg'
import houseHover from '../../../public/images/home.svg'
import { usePathname } from "next/navigation";
import Modal from "@/components/ui/Modal";
import FreeTrialFormHeader from "../pannels/FreeTrialFormHeader";
import placholderImg from '../../../public/images/header-placholder.svg'
import { useLocale } from "next-intl";
import { useRouter } from "@/i18n/navigation";

const HeaderMain = ({ data }: { data: HeaderData }) => {
  const searchRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState<number | null>(null);
  const [activeRegionIndex, setActiveRegionIndex] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const targetLocale = locale === 'en' ? 'ar' : 'en';
  const isRootLocalePage = pathname === '/en' || pathname === '/ar';

  const megaMenuData = data?.navigation?.items ?? [];
  const formTitle = data?.formTitle

  const activeItem = hoveredIndex !== null ? megaMenuData[hoveredIndex] : null;
  const hasChildren = activeItem?.content?.properties?.hasChildren;
  const hasTreeMenu = activeItem?.content?.properties?.hasTreeMenu;

  const childItems = useMemo(() => {
    return activeItem?.content?.properties?.childItems?.items || [];
  }, [activeItem]);

  const handleLangChange = () => {
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/';

    startTransition(() => {
      router.replace(pathWithoutLocale, { locale: targetLocale });
    });
  }

  const updateSelectedShop = useCallback(() => {
    if (hoveredIndex !== null && hasTreeMenu && childItems.length > 0) {
      const firstCity = childItems[0]?.content?.properties?.cityTitle || null;
      setSelectedShop(firstCity);
    } else {
      setSelectedShop(null);
    }
    setIsMenuOpen(hoveredIndex !== null && !!hasChildren);
  }, [hoveredIndex, hasChildren, hasTreeMenu, childItems]);

  useEffect(() => {
    updateSelectedShop();
  }, [updateSelectedShop]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  return (
    <>
      <header className="header-in fixed top-0 left-0 z-50 w-full bg-opacity-90">
        <div
          onMouseLeave={() => {
            setHoveredIndex(null);
            setIsMenuOpen(false);
          }}
          className="container max-w-full max-h-[80px] mmob:max-h-[86px] lp:max-h-[91px] !px-5 mmob:!px-[26px] xs:!px-10 sm:px-[15px] md:!px-10 bg-[#022a3a] border-t-0 border-b-[5px] lg:border-b-[7px] border-l-0 border-r-0 xl:border-l xl:border-r border-[#f4cd00] rounded-b-[24px] xs:rounded-b-[45px] xl:rounded-b-[75px]">
          <div className="flex items-center justify-between w-full"
          >
            <Link href='/'>
              <div className="header-logo my-3 lg:w-[165px] lg:h-[39px]">
                <Image
                  src="/images/gymnation-logo-mobile.svg"
                  width={48}
                  height={45}
                  priority
                  alt="Logo"
                  className="h-auto xxsmob:w-[50px] mt-[10px] xs:mt-[14px] mmob:mt-0 xl:hidden"
                />
                <Image
                  src="/images/gymnation-logo.svg"
                  width={135}
                  height={32}
                  alt="Logo"
                  priority
                  className="hidden xl:block lg:w-[165px] lg:h-[39px]"
                />
              </div>
            </Link>
            {/* Mobile Toggle */}
            <div className="xl:hidden flex pl-[8px] items-center gap-[10px] xxsmob:gap-[18px]">
              <div className="flex mt-[-7px] mmob:mt-0 xsmb:ml-[25px] ml-[10px]">
                <Button
                  onClick={() => setShowModal(true)}
                  variant="white"
                  className="header-btn !gap-[2px] mob:!gap-[5px] mmob:!gap-[2px] h-fit !text-[10px] mob:!text-[13px] mmob:!text-sm leading-[12px] mob:leading-[18px] !py-[3.5px] mob:!py-[6.5px] mmob:!py-[5px] !pl-[4px] xsmb:!pl-[11px] mmob:!pl-[11px] xs:!pl-[9px] !pr-[7px] mob:!pr-[5px] mmob:!pr-[15px] xs:!pr-[8px]"
                ><span className="mt-[2px] mob:mt-0">FREE TRIAL</span>

                </Button>

                <Button className="header-btn !gap-[2px] mob:!gap-[5px] mmob:!gap-[2px] h-fit !text-[10px] mob:!text-[13px] mmob:!text-sm leading-[12px] mob:leading-[18px] !py-[3.5px] mob:!py-[6.5px] mmob:!py-[5px] ml-1 xxsmob:ml-[6px] xs:ml-[7px] !pl-[4px] mmob:!pl-[11px] xs:!pl-[9px] !pr-[7px] mob:!pr-[5px] mmob:!pr-[15px] xs:!pr-[8px]">
                  <span className="mt-[2px] mob:mt-0">JOIN NOW</span>
                </Button>
              </div>
              <div>
                <Link href={""} className="lang-btn !h-[30px] mmob:!h-[32px] mmob:mt-[6px]" title="عربي"></Link>
              </div>
              <Button
                isArrow={false} variant="tangaroa"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`hover:!bg-transparent relative overflow-hidden !w-12 h-16 mr-[-8px] border-none cursor-pointer transition-colors duration-500 focus:outline-none`}
                aria-label="Toggle menu"
              >
                <span className="sr-only">toggle menu</span>

                <div
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                    }`}
                >
                  <Image
                    src="/images/cross-dark.svg"
                    width={10}
                    height={10}
                    alt="Menu"
                    className="w-10 h-10 bg-white p-2 rounded-full"
                  />
                </div>

                <div className="absolute inset-0">
                  <span
                    className={`absolute left-2 right-2 h-[5px] bg-white block top-7 rounded-lg transition-all duration-200 ease-out ${mobileMenuOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                      }`}
                    style={{ transitionDelay: mobileMenuOpen ? '0ms' : '100ms' }}
                  />
                  <span
                    className={`absolute left-2 right-2 h-[5px] bg-white block rounded-lg transition-all duration-300 ease-out origin-bottom ${mobileMenuOpen ? 'opacity-0 scale-y-0 top-11' : 'opacity-100 scale-y-100'
                      }`}
                    style={{
                      top: mobileMenuOpen ? '44px' : '17px',
                      transitionDelay: mobileMenuOpen ? '0ms' : '300ms',
                    }}
                  />
                  <span
                    className={`absolute left-2 right-2 h-[5px] bg-white block rounded-lg transition-all duration-300 ease-out origin-top ${mobileMenuOpen ? 'opacity-0 scale-y-0 top-9' : 'opacity-100 scale-y-100'
                      }`}
                    style={{
                      top: mobileMenuOpen ? '44px' : '39px',
                      transitionDelay: mobileMenuOpen ? '0ms' : '300ms',
                    }}
                  />
                </div>
              </Button>

            </div>
            <div className="hidden w-full xl:flex items-center pl-[8px] lg:pl-[13px]"
            >
              <nav className="bg-primary !max-w-[797px] mx-auto">
                <ul className="flex flex-col md:flex-row p-4 md:p-0 mt-4 md:mt-0 border-none">
                  {!isRootLocalePage && <li className="my-8 group cursor-pointer">
                    <Link href='/'>
                      <Image
                        src={houseHover}
                        width={5}
                        height={5}
                        alt="Toggle Menu"
                        className="w-[18px] h-[18px] mr-2 hidden group-hover:block"
                      />
                      <Image
                        src={house}
                        width={5}
                        height={5}
                        alt="Toggle Menu"
                        className="w-[18px] h-[18px] mr-2 block group-hover:hidden"
                      />
                    </Link>
                  </li>}
                  {megaMenuData.map((item, index) => {
                    const props = item.content?.properties;
                    const title = props?.link?.[0]?.title;
                    const path = props?.link?.[0]?.route?.path;
                    const hasChildren = props?.hasChildren;

                    return (
                      <li
                        key={index}
                        className="group relative"
                        onMouseEnter={() => setHoveredIndex(index)}
                      >
                        <a
                          href={path}
                          className="flex items-center hover:text-secondary gap-1 cursor-pointer py-8 px-[4px] lg:px-[7px] !text-[12px] lg:!text-[13px] xlg:!text-sm font-800 text-white uppercase"
                        >
                          {title}
                          {hasChildren && (
                            <Image
                              src={`${hoveredIndex === index ? "/images/caret-right-yellow.svg" : "/images/caret-right-white.svg"}`}
                              alt="Dropdown Icon"
                              height={7}
                              width={7}
                              priority
                              className={`ml-1 w-auto transition-transform duration-400 ${hoveredIndex === index ? "rotate-90" : ""}`}
                            />
                          )}
                        </a>
                      </li>
                    );
                  })}
                  <li className="hidden xl:flex cursor-pointer mx-3">
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)}>
                      <Image
                        src="/images/search-icon-white.svg"
                        width={18}
                        height={16}
                        alt="Search"
                      />
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Buttons */}
              <div className="header-btn-container mb-[-1px] flex mr-0 pl-2 lg:pl-[22px]">
                <Button
                  isArrow={false}
                  variant="tangaroa"
                  onClick={handleLangChange}
                  className="header-btn arabic !gap-[6px] flex items-center !text-sm !py-[0px] !-pt-[2px] mr-1 lg:mr-[2px] !pr-2 !pl-[10px] border border-white hover:border-transparent text-white hover:text-primary group relative"
                >
                  <span className={`${locale === 'en' ? 'mb-[5px]' : ''}`}>{locale === 'en' ? 'عربي' : 'English'}</span>

                  <Image
                    src="/images/lang-icon-black.svg"
                    width={18}
                    height={18}
                    alt="lang"
                    className="hidden group-hover:block !w-[18px] !h-[18px]"
                  />
                  <Image
                    src="/images/lang-icon-white.svg"
                    width={18}
                    height={18}
                    alt="lang"
                    className="block group-hover:hidden !w-[18px] !h-[18px]"
                  />
                </Button>
                <div className="ml-[11px]">
                  <Button
                    onClick={() => setShowModal(true)}
                    variant="white"
                    className={`${locale === 'ar' ? 'mr-1' : ''} header-btn !gap-[6px] !text-sm !py-[3px] !pl-[14px] !pr-[8px] lg:!py-[4px]`}
                  >
                    FREE TRIAL
                  </Button>
                  <Button className={`${locale === 'ar' ? 'mr-1' : ''} header-btn !gap-[7px] !text-sm !py-[4px] ml-3 !pl-[14px] !pr-[8px]`}>
                    JOIN NOW
                  </Button>
                </div>
              </div>
            </div>

            {isMenuOpen && (
              <div
                key={`menu-${hoveredIndex}`}
                className="container absolute left-0 right-0 top-full bg-[#fffffffc] border-1 border-secondary border-b-6 rounded-3xl shadow-md z-40 transform transition-all duration-500 ease-in-out animate-slideDown overflow-hidden"
              >
                <div className="mx-auto py-6 px-[30px]">
                  {hasTreeMenu ? (
                    <>
                      <div className="flex flex-wrap gap-4 mb-1">
                        {childItems?.map((group, index) => {
                          const cityTitle = group.content?.properties?.cityTitle;
                          const flag = group.content?.properties.image[0].url;
                          return (
                            <div
                              key={index}
                              onMouseEnter={() => setSelectedShop(cityTitle)}
                            >
                              <Button
                                isArrow={false}
                                className="bg-transparent !px-5 !py-3.5 !text-base border-2 border-primary gap-1 hover:border-transparent hover:!bg-secondary transition-all duration-200"
                              >
                                <Image src={flag} width={20} height={10} alt={cityTitle} />
                                {cityTitle}
                              </Button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
                        {childItems
                          ?.filter(
                            (group) =>
                              group.content?.properties?.cityTitle === selectedShop
                          )
                          ?.flatMap(
                            (group) => group.content?.properties?.cityList?.items || []
                          )
                          ?.map((loc, index) => {
                            const props = loc.content?.properties;
                            const title = props?.cityTitle;
                            const path = props?.link?.[0]?.route?.path;
                            const image = props?.image?.[0]?.url;
                            return (
                              <a
                                key={`${selectedShop}-${index}`}
                                href={path}
                                className="relative rounded-lg border-3 border-transparent hover:border-[#f4cd00] overflow-hidden cursor-pointer transition-all duration-300 block"
                              >
                                <Image
                                  src={image || placholderImg.src}
                                  alt={title || "alter"}
                                  width={266}
                                  height={84}
                                  placeholder="blur"
                                  blurDataURL={placholderImg.src}
                                  className="w-full h-[84px] object-cover"
                                  priority
                                />
                                <div className="absolute inset-0 p-2 bg-opacity-40 flex items-end">
                                  <span className="text-white font-bold text-center text-sm md:text-base px-2">
                                    {title}
                                  </span>
                                </div>
                              </a>
                            );
                          })}
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-1">
                      {childItems?.map((item, index) => {
                        const link = item.content?.properties?.link?.[0];
                        const city = item.content?.properties?.cityTitle;
                        const image = item.content?.properties?.image?.[0]?.url;
                        const slug = link?.route?.path;
                        return (
                          <a
                            key={index}
                            href={slug}
                            className="relative w-full h-[84px] my-[2px] rounded-lg border-3 border-transparent hover:border-[#f4cd00] overflow-hidden cursor-pointer transition-all duration-300 block"
                          >
                            <Image
                              src={image || placholderImg.src}
                              alt={city || "Alter"}
                              width={266}
                              height={84}
                              placeholder="blur"
                              blurDataURL={placholderImg.src}
                              priority
                              className="object-cover"
                            />
                            <div className="absolute inset-0 p-2 bg-opacity-40 flex items-end">
                              <span className="text-white font-bold text-center text-sm md:text-base px-2">
                                {city}
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isSearchOpen && (
              <div
                ref={searchRef}
                className="container mx-5 hover:!cursor-pointer search-shadow py-6 px-8 absolute left-0 right-0 backdrop-blur-md top-full mt-2 bg-[#ffffffe6] border-1 border-secondary rounded-3xl shadow-md z-40 hadow-lg transform transition-all duration-300">
                <div className="relative">
                  <div>
                    <Input
                      varient="search"
                      className="min-h-[48px] bg-white !py-[24px]"
                      placeholder="What would you like to search for?"
                      rightIcon={
                        "/images/search-icon-white.svg"
                      }
                    />
                  </div>
                  <div className="absolute top-0 right-0">
                    <Button
                      variant="tangaroa"
                      isArrow={false}
                      className="!py-[20px] !px-12"
                    >
                      <Image
                        src={"/images/search-icon-white.svg"}
                        width={30}
                        height={30}
                        alt="search"
                      />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-[#022a3af7] text-white xl:hidden transition-transform duration-300 ease-in-out z-40 overflow-hidden ${mobileMenuOpen
          ? 'transform translate-y-0'
          : 'transform -translate-y-full'
          }`}
      >
        <div className="px-[35px] xs:px-[46px] py-4 pt-24">
          <div className="relative">
            <div>
              <Input
                varient="search"
                className="bg-white !py-[8px] xs:!py-[14px] my-5 text-gray-600 text-xs xs:text-[16px]"
                placeholder="What are you looking for?" />
            </div>
            <div className="absolute top-0 right-0 bg-yellow">
              <Button
                variant="yellow"
                isArrow={false}
                className="hover!bg-primary !py-[6px] xs:!py-[15px] !px-4 xs:!px-6 group"
              >
                <Image
                  src={"/images/search-icon-dark.svg"}
                  width={20}
                  height={20}
                  alt="search"
                  className="block group-hover:hidden"
                />
                <Image
                  src={"https://gymnation.com/build/svg/icons/search-icon-white.svg"}
                  width={20}
                  height={20}
                  alt="search"
                  className="hidden group-hover:block"
                />
              </Button>
            </div>
          </div>
          <ul className="font-bold">
            {megaMenuData.map((item, index) => {
              const props = item.content?.properties;
              const title = props?.link?.[0]?.title;
              const hasChildren = props?.hasChildren;
              const hasTreeMenu = props?.hasTreeMenu;
              const childList = item.content?.properties?.childItems?.items || [];
              const selectRegions = props?.selectRegions || [];
              const isActive = activeMobileIndex === index;

              return (
                <li key={index}>
                  <div
                    className={`text-[13px] xs:text-xl flex justify-between items-center cursor-pointer py-3 uppercase transition-colors duration-200 ${isActive ? '' : 'border-b border-white'
                      }`}
                    onClick={() => {
                      if (isActive) {
                        setActiveMobileIndex(null);
                        setActiveRegionIndex(null);
                      } else if (hasChildren) {
                        setActiveMobileIndex(index);
                        setActiveRegionIndex(null);
                      } else {
                        setMobileMenuOpen(false);
                      }
                    }}
                  >
                    <span
                      className={`${isActive ? "text-secondary" : "text-white"
                        } transition-colors duration-200`}
                    >
                      {title}
                    </span>
                    {hasChildren && (
                      <Image
                        src={`${isActive
                          ? "/images/caret-right-yellow.svg"
                          : "/images/caret-right-white.svg"
                          }`}
                        alt="Caret"
                        height={10}
                        width={10}
                        className={`transform transition-transform duration-200 ${isActive ? "rotate-90" : ""
                          }`}
                      />
                    )}
                  </div>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                  >
                    {hasTreeMenu ? (
                      <div>
                        {selectRegions.map((item, regionIndex) => {
                          const isRegionActive = activeRegionIndex === `${index}-${regionIndex}`;
                          const regionCities = childList.filter(
                            child => child.content?.properties?.selectRegion === item.title
                          );

                          return (
                            <div key={regionIndex}>
                              <div
                                className="flex justify-between items-center cursor-pointer py-2 text-lg xs:text-xl text-white uppercase hover:text-secondary transition-colors duration-200"
                                onClick={() => {
                                  if (isRegionActive) {
                                    setActiveRegionIndex(null);
                                  } else {
                                    setActiveRegionIndex(`${index}-${regionIndex}`);
                                  }
                                }}
                              >
                                <span
                                  className={`rounded-md text-sm md:text-base py-1 px-2.5 transition-colors duration-200 ${isRegionActive ? "bg-secondary text-primary" : "text-white"
                                    }`}
                                >
                                  {item.title}
                                </span>
                                <Image
                                  src={`${isRegionActive
                                    ? "/images/caret-right-yellow.svg"
                                    : "/images/caret-right-white.svg"
                                    }`}
                                  alt="Caret"
                                  height={8}
                                  width={8}
                                  className={`transform transition-transform duration-200 ${isRegionActive ? "rotate-90" : ""
                                    }`}
                                />
                              </div>

                              <div
                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isRegionActive ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                  }`}
                              >
                                <ul className="ml-6 list-[circle] pl-10">
                                  {regionCities.map((city, cityIndex) => {
                                    const cityLabel = city.content?.properties?.cityTitle || "-";
                                    return (
                                      <li
                                        key={cityIndex}
                                        className="py-2 text-base xs:text-lg uppercase cursor-pointer hover:text-[#f4cd00] transition-colors duration-200 text-gray-300"
                                        onClick={() => setMobileMenuOpen(false)}
                                      >
                                        {cityLabel}
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div>
                        {childList.map((child, idx) => {
                          const label = child.content?.properties?.cityTitle || "-";
                          return (
                            <p
                              key={idx}
                              className="ml-4 py-[6px] text-[13px] xs:text-xl uppercase cursor-pointer hover:text-[#f4cd00] transition-colors duration-200"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {label}
                            </p>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          {/* social media */}
          <div className="text-center py-16">
            <h3 className="text-[15px] xs:!text-[24px]  mb-4">
              {data.socialMediaTitle}
            </h3>
            <ul className="flex justify-center px-[-6px] mb:px-[12px] sm:px-[15px] mb-[6px] mb:mb-[12px] sm:mb-[11px] lp:mb-[14px]">
              {data.socialAccounts?.items.map((socialItems, socialIndex) => {
                return (
                  <li
                    key={socialIndex}
                    className="px-[6px] mb:px-[12px] sm:px-[15px] mb:pb-[12px] sm:pb-[15px]"
                  >
                    <a
                      className="w-[42px] xs:w-[54px] mb:w-[40px] h-[42px] xs:h-[54px] mb:h-[40px] relative bg-white hover:bg-secondary rounded-full inline-flex items-center justify-center group"
                      href={socialItems.content.properties.link[0].url}
                    >
                      <Image
                        src={socialItems.content.properties.icon[0].url}
                        width={56}
                        height={91}
                        className="object-contain w-[22px] xs:w-[34px] mb:w-[26px] sm:w-[30px] lp:w-[42px] h-[18px] xs:h-[34px] mb:h-[32px] sm:h-[36px] lp:h-[47px]"
                        alt={socialItems.content.properties.icon[0].name}
                      />
                      <Image
                        src={socialItems.content.properties.iconBlue[0].url}
                        width={56}
                        height={91}
                        className="absolute transition-opacity duration-300 group-hover:opacity-100 object-contain w-[23px] xs:w-[34px] mb:w-[26px] sm:w-[36px] lp:w-[42px] h-[23px] xs:h-[34px] mb:h-[26px] sm:h-[36px] lp:h-[47px]"
                        alt={socialItems.content.properties.iconBlue[0].name}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
            <h3 className="text-[15px] xs:!text-[24px] my-4">
              {data.appTitle}
            </h3>
            <div className="w-full flex justify-center mb-[-6px] mb:mb-[-8px] xs:mb-[-16] px-[-6px] mb:px-[-8px] xs:px-[-12px] ">
              <div className="mb-[6px] mb:mb-[8px] xs:mb-[16] px-[6px] mb:px-[8px] xs:px-[12px]">
                <a href="" className="relative inline-block leading-0 group">
                  {data.appStoreImage?.[0].url && (
                    <Image
                      alt="ENG 1"
                      className="lozad w-auto object-contain h-[36px] mb:h-[40px] xs:h-[50] lp:h-[62px] group-hover:opacity-0 group-hover:invisible"
                      src={data.appStoreImage?.[0].url}
                      width={209}
                      height={62}
                    />
                  )}
                  {data.appStoreHoverImage?.[0].url && (
                    <Image
                      alt="ENG 1"
                      className="w-full object-contain opacity-0 absolute top-0 left-0 transition-opacity duration-200 h-[36px] mb:h-[40px] xs:h-[50] lp:h-[62px] group-hover:opacity-100 group-hover:visible"
                      src={data.appStoreHoverImage[0].url}
                      width={209}
                      height={62}
                    />
                  )}
                </a>
              </div>
              <div className="mb-[6px] mb:mb-[8px] xs:mb-[16] px-[6px] mb:px-[8px] xs:px-[12px]">
                <a href="" className="!relative inline-block leading-0 group">
                  {data.playStoreImage?.[0].url && (
                    <Image
                      alt="ENG 1"
                      className="w-fit lozad h-[36px] mb:h-[40px] xs:h-[50px] lp:h-[62px] group-hover:opacity-0 group-hover:invisible"
                      src={data.playStoreImage[0].url}
                      width={209}
                      height={62}
                      data-loaded="true"
                    />
                  )}
                  {data.playStoreHoverImage?.[0].url && (
                    <Image
                      alt="ENG 1"
                      className="w-full opacity-0 absolute top-0 left-0 !transition-opacity duration-300 h-[36px] mb:h-[40px] xs:h-[50px] lp:h-[62px] group-hover:opacity-100 group-hover:visible"
                      src={data.playStoreHoverImage[0].url}
                      width={209}
                      height={62}
                      data-loaded="true"
                    />
                  )}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30 xl:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <FreeTrialFormHeader title={formTitle} />
      </Modal>
    </>
  );
};

export default HeaderMain;
