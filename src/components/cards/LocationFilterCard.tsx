import Image from "next/image";
import React, { useEffect } from "react";
import Button from "../ui/Button";
import { APILocationsResponse, ContentResponse } from "@/interfaces/content";

function LocationFilterCard({
  state = false,
  title,
  value = [],
  list = [],
  onClear,
  onClose,
  onSubmit,
  setSelectedFilters,
  setSelectedCheckboxes,
  setIsNoMatchLocations,
  selectedCheckboxes
}: {
  state: boolean;
  title?: string;
  value: string[];
  list: ContentResponse[];
  selectedCheckboxes: string[];
  setSelectedCheckboxes: React.Dispatch<React.SetStateAction<string[]>>;
  onClear: () => void;
  onClose: () => void;
  onSubmit: (value: string[]) => void;
  setIsNoMatchLocations: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedFilters: React.Dispatch<React.SetStateAction<number>>;
}) {

  useEffect(() => {
    if (state) {
      setSelectedCheckboxes(selectedCheckboxes);
    }
  }, [state, selectedCheckboxes, setSelectedCheckboxes]);

  const handleCheckboxChange = (val: string) => {
    setSelectedCheckboxes((prev) => {
      const newSelection = prev.includes(val)
        ? prev.filter((v) => v !== val)
        : [...prev, val];
      return newSelection;
    });
  };

  useEffect(() => {
    setSelectedFilters(selectedCheckboxes.length);
  }, [selectedCheckboxes, setSelectedFilters ,value]);

  const handleClear = () => {
    setSelectedCheckboxes([]);
    setSelectedFilters(0);
    setIsNoMatchLocations(false);
    onClear(); // Call the parent callback
  };

  const handleSubmit = () => {
    if (selectedCheckboxes.length === 0) {
      onSubmit([]);
      return;
    }

    const locationGroups = selectedCheckboxes
      .map((id) => {
        const cat = list.find((c) => c.id === id);
        return (
          cat?.properties?.catagoryLocations?.map((loc: APILocationsResponse) => loc.id) || []
        );
      })
      .filter((group) => group.length > 0);

    if (locationGroups.length === 0) {
      onSubmit([]);
      return;
    }

    const intersected = locationGroups.reduce((acc, curr) =>
      acc.filter((id: string) => curr.includes(id))
    );

    if (intersected.length === 0) {
      setIsNoMatchLocations(true);
    } else {
      setIsNoMatchLocations(false);
    }

    onSubmit(intersected);
  };

  return (
    <div
      className={`absolute bg-white rounded-lg left-0 right-0 top-0 h-auto min-h-[260px] w-full sm:w-[calc(100%-28px)] z-12 pt-[5px] px-[20px] pb-[10px] mmob:pt-[8px] mmob:px-[10px] mmob:pb-[13px] xmb:px-[16px] text-primary font-semibold shadow-[0_0px_6px_rgba(2,42,58,0.5)] ${state ? "block" : "hidden"}`}
    >
      <div className="flex justify-between capitalize pb-[5px] mmob:pb-[8px] xmb:pb-[12px]">
        <p className="text-[15px] leading-[20px] xmb:text-[16px] xmb:leading-[24px]">
          {title || "Filters"}
        </p>
        <button onClick={onClose}>
          <Image
            src="/icons/cross-dark-m.svg"
            width={18}
            height={18}
            className="w-[12px] mmob:w-[18px] flex-shrink-0 cursor-pointer"
            alt="close"
          />
        </button>
      </div>
      <hr className="border-primary" />
      <div className="grid grid-cols-2 py-[8px] xmb:py-[22px] xmb:px-[10px] gap-[6px] xmb:gap-[8px]">
        {list.map((elem, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`checkbox${index}`}
              checked={selectedCheckboxes.includes(elem.id)}
              onChange={() => handleCheckboxChange(elem.id)}
            />
            <label
              className="text-[12px] leading-[16px] xxsmb:text-[13px] mmob:text-[14px] xmb:text-[16px] xmb:leading-[24px]"
              htmlFor={`checkbox${index}`}
            >
              {elem.name}
            </label>
          </div>
        ))}
      </div>
      <hr className="border-primary" />
      <div className="flex flex-wrap gap-2 justify-center sm:justify-between pt-[15px] px-[10px]">
        <Button
          variant="tangaroa"
          isArrow={false}
          onClick={handleSubmit}
          className="!text-white hover:!text-primary uppercase !text-[12px] !leading-[18px] xmb:!text-[14px] xmb:!leading-[20px] !font-extrabold h-[38px] xs:min-w-[274px] !py-[3px] !pl-[16px] !pr-[16px] mb:!py-[8px] mb:!pl-[8px] mb:!pr-[8px]"
        >
          Show Results
        </Button>

        <Button
          variant="white"
          isArrow={false}
          onClick={handleClear}
          className="border border-primary hover:!bg-primary hover:!text-white uppercase !text-[12px] !leading-[18px] xmb:!text-[14px] xmb:!leading-[20px] !font-extrabold h-[38px] !py-[3px] !pl-[16px] !pr-[16px] mb:!py-[8px] mb:!pl-[8px] mb:!pr-[8px]"
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}

export default LocationFilterCard;
