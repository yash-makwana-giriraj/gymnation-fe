import React, { useEffect, useRef, useState } from "react";

// Components
import Image from "next/image";
import Link from "next/link";
import { DynamicComponentProps } from "@/interfaces/content";

function FeaturedCard({ data }: DynamicComponentProps) {
  const allCards = data.cardItems.items;
  const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const [maxHeight, setMaxHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (titleRefs.current.length) {
      const heights = titleRefs.current.map((ref) => ref?.offsetHeight || 0);
      const max = Math.max(...heights);
      setMaxHeight(max);
    }
  }, [data]);

  return (
    <div className="container w-full max-w-[1196px] relative flex flex-col gap-[16px] xs:gap-[18px] sm:gap-[25px] global-spacing">
      <div className="grid grid-cols-1 xxsmb:grid-cols-2 mmob:grid-cols-4 gap-[16px] xxsmb:gap-x-[8px] xxsmb:gap-y-[16px] xs:gap-[18px]">
        {allCards.slice(0, 4).map((card, i) => (
          <Card
            key={i}
            link={card?.content?.properties?.cardLink?.[0].url}
            icon={card.content.properties.icon?.[0].url}
            title={card.content.properties.title}
            ref={(el) => {
              titleRefs.current[i] = el;
            }}
            style={{ height: maxHeight }}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 xxsmb:grid-cols-2 gap-[8px] xs:gap-[18px] rounded-b-xl">
        {allCards.slice(4).map((card, i) => {
          const index = i + 4;
          return (
            <Card
              key={index}
              link={card?.content?.properties?.cardLink?.[0].url}
              icon={card.content.properties.icon?.[0].url}
              title={card.content.properties.title}
              ref={(el) => {
                titleRefs.current[index] = el;
              }}
              style={{ height: maxHeight }}
            />
          );
        })}
      </div>
    </div>
  );
}

const Card = React.forwardRef(
  (
    {
      link,
      icon,
      title,
      style,
    }: {
      link: string;
      icon?: string;
      title?: string;
      style?: React.CSSProperties;
    },
    ref: React.Ref<HTMLHeadingElement>
  ) => {
    return (
      <Link
        href={link || "/"}
        className="bg-gray-f6 py-[20px] xs:py-[22px] px-[12px] xs:px-[18px] sm:p-[25px] lp:p-[30px] h-fit min-h-auto xxssmb:min-h-[161px] xs:min-h-[230px] sm:min-h-[300px] lp:min-h-[342px] flex flex-col flex-wrap items-center justify-center text-center lp-[29px] rounded-3xl"
      >
        {icon && (
          <Image
            src={icon}
            alt="machines svg"
            width={84}
            height={84}
            className="w-[auto] h-[39px] xs:h-[50px] sm:h-[70px] lp:h-[84px] object-contain mb-[12px] mb:mb-[14px] xs:mb-[16px] sm:mb-[22px] lp:mb-[29px]"
          />
        )}
        <h3
          ref={ref}
          style={style}
          className="w-full text-black-01 text-[16px] mmob:text-[15px] xs:text-[19px] sm:text-[26px] lp:text-[33px] xlg:text-[35px] min-h-auto xxssmb:min-h-[60px]  font-extrabold uppercase"
        >
          {title}
        </h3>
      </Link>
    );
  }
);

Card.displayName = "Card";

export default FeaturedCard;
