"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import parse from "html-react-parser";
import { AccordionProps } from "@/interfaces/global";

const Accordion = ({ items, allowMultiple = false }: AccordionProps) => {
  const [openIndices, setOpenIndices] = useState<number[]>([]);

  // 🟢 Automatically open first item on mount
  useEffect(() => {
    if (items.length > 0) {
      setOpenIndices(allowMultiple ? [0] : [0]);
    }
  }, [items, allowMultiple]);

  const toggleIndex = (index: number) => {
    if (allowMultiple) {
      setOpenIndices((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenIndices((prev) => (prev[0] === index ? [] : [index]));
    }
  };

  return (
    <div className="flex flex-col gap-[24px] w-full h-full">
      {items.map((item, index) => {
        const data = item.content.properties
        const description = data.description.markup && parse(data.description.markup) as string
        return (
          <AccordionSection
            key={index}
            title={data.title}
            subTitle={data.subTitle}
            content={description}
            isOpen={openIndices.includes(index)}
            onToggle={() => toggleIndex(index)}
          />
        )
      })}
    </div>
  );
};

const AccordionSection = ({
  title,
  subTitle,
  content,
  isOpen,
  onToggle,
}: {
  title?: string;
  subTitle?: string;
  content?: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col w-full">
      <div
        className="flex justify-between gap-[16px] items-center w-full backdrop-blur-[33px] bg-[#FFFFFF33] rounded-lg p-[20px] cursor-pointer"
        onClick={onToggle}
      >
        <div className="grid grid-cols-[42px_auto] gap-[16px] items-center">
          <div>
            <Image
              src="/icons/square-outline.svg"
              alt="square outline"
              width={42}
              height={42}
            />
          </div>
          <div className="flex-1 min-w-0">
            {title && (
              <h4 className="heading-h4-medium leading-[100%]">{title}</h4>
            )}
            {subTitle && (
              <p className="body1-regular truncate mt-[13px] py-2 block leading-[140%]">
                {subTitle}
              </p>
            )}
          </div>
        </div>
        <button className="min-w-[42px]">
          {isOpen ? (
            <Image
              src="/icons/Remove.svg"
              alt="square outline"
              width={42}
              height={42}
            />
          ) : (
            <Image
              src="/icons/Add.svg"
              alt="square outline"
              width={42}
              height={42}
            />
          )}
        </button>
      </div>

      {content && (
        <div
          ref={contentRef}
          className="overflow-hidden transition-all duration-500 ease-in-out backdrop-blur-[33px] bg-[#FFFFFF33] rounded-lg"
          style={{
            maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
            marginTop: isOpen ? "20px" : "0px",
          }}
        >
          <div className="p-[20px]">{content}</div>
        </div>
      )}
    </div>
  );
};

export default Accordion;
