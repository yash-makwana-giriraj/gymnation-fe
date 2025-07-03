"use client";

import { SelectBoxProps } from "@/interfaces/global";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

const SelectBox: React.FC<SelectBoxProps> = ({
  options,
  value,
  onChange,
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
    <div ref={containerRef} className={`relative w-full ${wrapperClassName}`}>
      {/* Trigger */}
      <div
        className={`
            bg-basic-primary rounded-full border border-accent-secondary px-[24px] py-[11.5px] flex justify-between items-center h-full min-h-[48px]
            ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer hover:border-accent-primary-hover active:border-accent-primary-pressed"
            }
            ${className}
        `}
        onClick={() => !disabled && setOpen((prev) => !prev)}
      >
        <span className="body1-regular text-basic-primary leading-[140%]">
          {selectedOption?.label || placeholder}
        </span>
        <Image
          src={
            open ? "/icons/Chevron-up-blue.svg" : "/icons/Chevron-down-blue.svg"
          }
          alt="arrow"
          width={20}
          height={20}
          style={disabled ? { filter: "invert(50%)" } : undefined}
        />
      </div>

      {/* Dropdown */}
      <div
        className={`
          absolute top-full left-0 w-full mt-2 z-50
          bg-white border border-accent-secondary rounded-lg shadow-md
          overflow-hidden transition-all duration-200 ease-in-out origin-top
          ${
            open
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-95 pointer-events-none"
          }
        `}
        style={{ transformOrigin: "top" }}
      >
        <ul className="max-h-[193px] overflow-auto">
          {options.map((opt) => (
            <li
              key={opt.label}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-[24px] py-[12px] hover:bg-gray-100 text-basic-primary cursor-pointer body1-regular leading-[140%] ${
                opt.value === value ? "bg-gray-100" : ""
              }`}
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
