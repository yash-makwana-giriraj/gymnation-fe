"use client";

import { useEffect, useState } from "react";
import Image from 'next/image'
import Closeicon from "../../../../public/icons/Close.svg";
import Menuicon from "../../../../public/icons/Menu.svg";
import Chevronrighticon from "../../../../public/icons/Chevron-right.svg";
import Searchicon from "../../../../public/icons/Search.svg";
import Searchblueicon from "../../../../public/icons/Search-blue.svg";
import Button from "@/components/ui/Button";
import LanguageSwitcher from "../../common/LanguageSwitcher";
import Input from "@/components/ui/Input";
import { HeaderData } from "@/interfaces/content";
import { apiBaseUrl } from "@/api-handler/axios-handler";
import Link from "next/link";

const HeaderMain = ({ data }: { data: HeaderData }) => {
  const [openSubmenu, setOpenSubmenu] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (menuOpen === false) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }

    // Optional cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const toggleSubmenu = (index: number) => {
    setOpenSubmenu(openSubmenu === index ? null : index);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setSearchOpen(false); // Close search if opening menu hopefully
    if (!menuOpen) setOpenSubmenu(null);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) setMenuOpen(false); // Close menu if opening search
    if (!searchOpen) setOpenSubmenu(null);
  };

  return (
    <>
      <div className="relative">
        {/* MAIN HEADER (always visible) */}  {/* max-w-[1296] */}
        <header className="w-full py-3 z-50 absolute max-w-100% xl:max-w-[1296px] 2xl:max-w-[100%] mx-auto px-[24px] 2xl:px-[96px] justify-self-anchor-center">
          <div className="flex items-center justify-between bg-basic-primary/20 backdrop-blur-md rounded-xl px-[16px] py-[16px] shadow-md text-basic-inverse">
            {/* LOGO */}
            <div className="flex items-center space-x-2">
              <Link href="/" className="cursor-pointer">
                {data?.primaryLogo?.[0].url &&
                  <Image src={`${apiBaseUrl}${data?.primaryLogo?.[0].url}`} width={96} height={68} alt="OQ8 Logo" />
                }
              </Link>
            </div>

            {/* RIGHT CONTROLS */}
            <div className="flex items-center space-x-[16px] ">

              {/* <div className="cursor-pointer hidden md:flex ">العربية</div> */}
              <div className="cursor-pointer hidden md:flex items-center justify-center"> <LanguageSwitcher /></div>

              {/* Search Button */}
              <div
                className={`search-btn px-[24px] py-[6px] rounded-full bg-basic-inverse/20 cursor-pointer  `}
                onClick={toggleSearch}
              >
                <Image src={Searchicon} width={24} height={24} alt="Searchicon" />
              </div>
              {/* Toggle Menu */}
              {menuOpen ? (
                <Image src={Closeicon} alt="Closeicon" width={32} height={32} className="cursor-pointer" onClick={toggleMenu} />
              ) : (
                <Image src={Menuicon} alt="Menuicon" width={32} height={32} className="menuicon cursor-pointer" onClick={toggleMenu} />
              )}
            </div>
          </div>
        </header>

        {/* FULL SCREEN MENU */}
        <div
          className={`absolute top-0 left-0 right-0 h-[772] md:h-[812px] bg-accent-primary text-basic-inverse z-40 overflow-y-auto shadow-xl transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
        >

          {/* MENU LINKS */}
          <nav className="flex flex-col min-h-[560px] md:min-h-[700px]  mt-28 max-w-[1296] 2xl:max-w-[100%] mx-auto px-[24px] 2xl:px-[96px]">
            {data?.navigationMenu?.items.map((item, idx) => {
              const itemData = item.content.properties;
              const hasSubmenu = itemData?.subMenuLink && itemData.subMenuLink.length > 0;
              const isOpen = openSubmenu === idx;

              return (
                <div key={idx} className={`relative overflow-hidden ${openSubmenu === idx ? '' : 'border-b border-white/20'}`}>
                  {/* Main Menu Item */}
                  <div
                    className="heading-h4-medium flex items-center justify-between px-4 xl:px-0 py-[25px] md:py-[31px] hover:bg-white/10 cursor-pointer transition-colors duration-200"
                    onClick={() => hasSubmenu ? toggleSubmenu(idx) : null}
                  >
                    {hasSubmenu ? (
                      <span>{itemData?.menuLink?.[0]?.title}</span>
                    ) : (
                      <Link href={itemData?.menuLink?.[0]?.url || '#'}>
                        {itemData?.menuLink?.[0]?.title}
                      </Link>
                    )}

                    <Image
                      src={Chevronrighticon} width={20} height={20}
                      alt="Chevronrighticon"
                      className={`chevronright transition-transform duration-300 ease-in-out ${hasSubmenu && isOpen ? 'rotate-90' : ''
                        }`}
                    />
                  </div>

                  {/* Submenu Items with smooth slide animation */}
                  {hasSubmenu && (
                    <div
                      className={`rounded-[20px] bg-[#2135A9]  transition-all duration-300 ease-in-out ${isOpen
                        ? 'max-h-96 opacity-100'
                        : 'max-h-0 opacity-0 border-transparent'
                        }`}
                      style={{
                        overflow: 'hidden',
                      }}
                    >
                      <div className=" rounded-[20px]">
                        {itemData.subMenuLink?.map((subItem, subIdx) => {
                          return (
                            <Link
                              key={subIdx}
                              href={subItem?.route?.path ?? "#"}
                              className="px-[24px] py-[28px] hover:text-white hover:bg-white/10 transition-colors duration-200 transform translate-y-0 flex justify-between items-center"
                              onClick={() => setMenuOpen(false)}
                            >
                              {subItem?.title}

                              <Image
                                src={Chevronrighticon} width={20} height={20}
                                alt="Chevronrighticon"
                                className={`chevronright transition-transform duration-300 ease-in-out `}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="cursor-pointer flex md:hidden justify-center items-center mt-[16px] px-4 xl:px-0 py-[22px]">
              <LanguageSwitcher />
            </div>
          </nav>
        </div>

        {/* SEARCH PANEL */}
        <div
          className={`absolute top-0 left-0 right-0 h-[297px] md:h-[244px] bg-accent-primary text-basic-inverse z-40 transition-transform duration-300 ease-in-out ${searchOpen ? 'translate-y-0' : '-translate-y-full'
            }`}
        >
          <div className="max-w-[1296] 2xl:max-w-[100%] mx-auto px-[24px] 2xl:px-[96px]  pb-[32px] pt-[26px] mt-26 md:mt-28">


            {/* Search Bar */}
            <div className="flex flex-wrap md:flex-nowrap items-center gap-[16px] md:gap-[28px]">
              <Input className="min-h-[48px]" placeholder="What would you like to search for?" leftIcon={Searchblueicon} />
              <Button className="leading-[169%] md:leading-normal md:min-w-[130px]">Search</Button>
            </div>
            <hr className="mt-[24px] md:mt-[26px]  border-white/20" />
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderMain;
