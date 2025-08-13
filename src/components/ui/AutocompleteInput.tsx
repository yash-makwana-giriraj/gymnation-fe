import React, { useEffect, useState } from "react";
import Button from "./Button";
import Image from "next/image";

const AutocompleteInput = ({
  value,
  onChange,
  onSelect,
  placeholder,
  className,
  list,
}: {
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  placeholder?: string;
  className?: string;
  list: string[];
}) => {
  const [filteredData, setFilteredData] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  useEffect(() => {
    if (value.trim() === "") {
      setFilteredData([]);
      setShowDropdown(false);
      return;
    }

    if (value.length < 3) {
      setFilteredData([]);
      setShowDropdown(false);
      return;
    }

    setFilteredData(() => {
      return list.filter((item) => {
        const itemWords = item.toLowerCase().split(/[\s,]+/);
        const searchWords = value.toLowerCase().split(/\s+/);
        return searchWords.some((searchWord) =>
          itemWords.some((itemWord) => itemWord.startsWith(searchWord))
        );
      });
    });
    setShowDropdown(value.length > 0);
  }, [value, list]);

  const handleSelect = (val: string) => {
    onChange(val);
    onSelect(val);
    setShowDropdown(false);
  };

  return (
    <div className={`map-autocomplete relative w-full ${className}`}>
      <div className="bg-[#FFFFFF2B] rounded-full flex">
        <input
          type="search"
          name="search"
          className="w-full py-[5px] pr-[12px] mb:py-[9px] mb:pr-[4px] xs:py-[11px] xs:pr-[17px] pl-[20px] rounded-full focus:outline-none text-[12px] mb:text-[14px] xs:text-[18px] leading-[24px] mmob:leading-[26px] font-medium placeholder:capitalize map-search-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (filteredData.length > 0) setShowDropdown(true);
          }}
          onBlur={() => {
            setShowDropdown(false);
          }}
          placeholder={placeholder}
        />
        <Button
          variant="white"
          isArrow={false}
          className="ltr:rounded-l-none rtl:rounded-r-none h-[36px] mb:h-[44px] xs:h-[48px] !pl-[22.5px] !pr-[22.5px] mb:!pl-[14.5px] mb:!pr-[14.5px] xs:!pl-[22px] xs:!pr-[22px]"
          onClick={() => onChange(value)}
        >
          <Image
            src="/icons/search-medium-dark.svg"
            width={29}
            height={28}
            className="h-auto w-[21px] mb:w-[25px] xs:w-[29px]"
            alt="arrow"
          />
        </Button>
      </div>
      <div className="relative rounded-md">
        {showDropdown && (
          <ul className="autocomplete-suggestion overflow-auto max-h-[280px] p-[20px] absolute z-10 w-full bg-white rounded-md mt-[1px]">
            {filteredData.length === 0 ? (
              <li className="cursor-pointer rounded-md text-primary text-[16px] font-bold leading-[24px]">
                Locations not found.
              </li>
            ) : (
              filteredData.map((item, idx) => (
                <li
                  key={idx}
                  onMouseDown={() => handleSelect(item)}
                  className="pb-[13px] mb-[12px] cursor-pointer border-b-1 border-gray-200 rounded-md text-primary text-[16px] font-bold leading-[24px]"
                >
                  {item}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AutocompleteInput;
