"use client";

import { SelectBoxProps } from "@/interfaces/global";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  value,
  onChange,
  varient,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  wrapperClassName = "",
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={containerRef} className={`relative w-full location-dropdown ${wrapperClassName}`}>
      {/* Trigger */}
      <div
        className={`${varient === "trail"?"location-label text-primary border border-gray-e4 bg-gray-e4 pl-[13px] mb:pl-[20px] lp:pl-[24px] py-[7px] mb:py-[12px] sm:py-[15px] pr-[36px] xs:pr-[50px] sm:pr-[60px] !h-[34px] mb:!h-[44px] sm:!h-[46px] lp:!h-[50px] flex gap-[8px] w-full min-h-full":""} 
            bg-basic-primary border border-accent-secondary px-[24px] py-[11.5px] flex justify-between items-center h-full min-h-[48px]
            ${open?"location-label-active rounded-t-[24px]":"rounded-full"}
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:border-accent-primary-hover active:border-accent-primary-pressed"
            }
            ${className}
        `}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className={`body1-regular text-basic-primary leading-[140%] ${varient === "trail"?"placeholder:text-primary font-500 text-[13px] mb:text-[16px]  leading-[20px] m rounded-[96px]":""}`}>
          {selectedOption?.label || placeholder}
        </span>
        {varient === "trail"?<></>:<Image
          src={
            open ? "/icons/Chevron-up-blue.svg" : "/icons/Chevron-down-blue.svg"
          }
          alt="arrow"
          width={20}
          height={20}
          style={disabled ? { filter: "invert(50%)" } : undefined}
        />}
      </div>

      {/* Dropdown */}
      <div
        className={`
          absolute top-full left-0 w-full mt-2 z-50
          bg-white border border-accent-secondary shadow-md
          overflow-hidden transition-all duration-200 ease-in-out origin-top
          ${varient === "trail" && "!mt-[2px] !bg-gray-e4 border-0 rounded-b-[24px] py-[8px] mb:py-[12px] sm:py-[15px] !rounded-t-0 shadow-md overflow-hidden transition-all duration-200 ease-in-out origin-top"}
          ${
            open
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-95 pointer-events-none"
          }
        `}
        style={{ transformOrigin: "top" }}
      >
        <ul className={`max-h-[193px] overflow-auto ${varient === "trail" && "!max-h-[180px] mb:!max-h-[228px] sm:!max-h-[240px] lp:!max-h-[280px] !rounded-t-0"} `}>
          {options.map((opt) => (
            <li
              key={opt.label}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-[13px] mb:px-[20px] sm:px-[24px] py-[5px] mb:py-[7px] sm:py-[8px] hover:bg-gray-100 text-basic-primary cursor-pointer body1-regular leading-[140%] ${
                opt.value === value ? "bg-white" : ""
              } ${varient === "trail" && "hover:bg-white text-[13px] mb:text-[16px] leading-[20px] mb:leading-[24px] font-500"}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SelectBox;
