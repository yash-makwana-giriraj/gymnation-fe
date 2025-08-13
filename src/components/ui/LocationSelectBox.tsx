import { Item } from "@/interfaces/content";
import Image from "next/image";
import React, { useState } from "react";

const LocationSelectBox = ({
  value,
  options,
  placeholder = "Select option",
  onChange,
}: {
  value: string;
  options: Item[];
  placeholder?: string;
  onChange: (value: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (selectedValue: string | undefined) => {
    if (!selectedValue) return;
    onChange(selectedValue);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full px-[6px]">
      {/* Selection Box */}
      <div
        className="flex items-center justify-between bg-white text-primary border border-gray-300 rounded-full cursor-pointer px-[10px] uppercase"
        onClick={toggleDropdown}
      >
        <label className="text-[12px] leading-[28px] font-semibold rounded-full">
          {value || placeholder}
        </label>

        {/* Rectangle with Dynamic Triangle */}
        <div className="flex items-center justify-center rounded text-primary">
          <svg
            width="20"
            height="14"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            className={`transform transition-transform duration-300 ease-in-out ${isOpen ? "scale-y-100" : "scale-y-[-1]"
              }`}
          >
            <polygon points="50,0 0,100 100,100" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Dropdown List with collapse animation */}
      <ul
        className={`absolute left-[6px] right-[6px] border border-white rounded-[24px] bg-primary text-white shadow-md z-10 p-[12px] xs:px-[14px] xs:pt-[21px] xs:pb-[13px] flex flex-col gap-[6px]
          overflow-hidden
          transition-[max-height,opacity] duration-300 ease-in-out
          ${isOpen
            ? "max-h-60 opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
          }
        `}
      >
        {options.map((option, idx) => {
          const cityName = option?.content?.properties?.cityName;
          return (
            <li
              key={idx}
              onClick={(e) => {
                e.preventDefault(); // Prevent default browser behavior
                handleSelect(cityName);
              }}
              className={`pl-[10px] pr-[20px] hover:bg-[#f5f5f599] text-[12px] font-bold leading-[25px] cursor-pointer rounded-[6px] before:content-['⚬'] before:mr-[8px] uppercase inline-flex
                ${cityName === value ? "bg-[#f5f5f599] text-secondary" : ""}
              `}
            >
              <div className="flex items-center justify-between w-full">
                {cityName || "Unknown City"}
                {cityName === value && (
                  <Image
                    src="/icons/arrow-check-yellow.svg"
                    alt={`check ${idx}`}
                    width={16}
                    height={12}
                    className="ml-2"
                  />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LocationSelectBox;