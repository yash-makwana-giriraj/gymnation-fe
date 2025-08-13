import { locationContent } from "@/interfaces/content";
import Image from "next/image";

const TabButtons = ({
  tabs,
  onButtonClick,
  activeButtonIndex,
  wrapperClass,
  className,
}: {
  tabs: locationContent[];
  onButtonClick: (tab: number) => void;
  activeButtonIndex?: number;
  wrapperClass?: string;
  className?: string;
}) => {
  // button styles
  const buttonStyles =
    "flex gap-[9px] items-center justify-center w-1/2 py-[9px] px-[20px] cursor-pointer text-[16px] mb:text-[20px] xs:text-[25px] leading-[20px] mb:leading-[24px] xs:leading-[28px] font-800 uppercase";

  return (
    <>
      <div
        className={`flex items-center justify-center w-full ${wrapperClass}`}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`
              ${buttonStyles} h-[36px] mb:h-[44px] xs:h-[48px] border border-white border-solid focus:border-none focus:outline-none active:bg-secondary active:text-primary focus:bg-white focus:text-primary
              ${
                index === 0 &&
                "ltr:rounded-tl-[48px] ltr:rounded-bl-[48px] rtl:rounded-tr-[48px] rtl:rounded-br-[48px]"
              }
              ${
                index === tabs.length - 1 &&
                "ltr:rounded-tr-[48px] ltr:rounded-br-[48px] rtl:rounded-tl-[48px] rtl:rounded-bl-[48px]"
              }
              ${index === activeButtonIndex && "bg-white text-primary"}
              ${className}
            `}
            onClick={() => onButtonClick(index)}
          >
            {tab?.content?.properties?.flagIcon && (
              <Image
                src={tab?.content?.properties?.flagIcon?.[0].url}
                alt={tab?.content?.properties?.flagIcon?.[0].name}
                width={30}
                height={17}
              />
            )}
            {tab?.content?.properties?.countryName}
          </button>
        ))}
      </div>
    </>
  );
};

export default TabButtons;
