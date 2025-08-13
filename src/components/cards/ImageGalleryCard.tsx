// Components
import Link from "next/link";
import Button from "../ui/Button";
import Image from "next/image";

const CardSlide = ({
  index,
  image,
  title,
  tag,
  description,
  link,
  wrapperClass,
  borderRadius = 24,
}: {
  index: number;
  image: string;
  title?: string;
  tag?: string | null;
  description?: string;
  link?: string;
  wrapperClass?: string;
  borderRadius?: number;
}) => {
  const hasContent = title || tag || description || link;

  return (
    <div
      className={`scrollable-card relative w-full overflow-hidden shadow-[4px_4px_8px_rgba(0,0,0,0.25)] md:shadow-[7px_9px_7px_rgba(0,0,0,0.25)] ${wrapperClass}`}
      style={{ borderRadius: `${borderRadius}px` }}
    >
      <div className="card-item absolute inset-0">
        <Image
          src={image}
          alt={`slide ${index}`}
          fill
          sizes="auto"
          className="object-cover w-full h-full"
          style={{ borderRadius: `${borderRadius}px` }}
        />
        {hasContent && (
          <div className="card-content relative z-10 h-full flex flex-col justify-end px-[16px] pb-[16px]  xs:px-6 xs:pb-6 xs:pt-12 transition-all duration-300 text-white">
            <h3 className="ltr:border-l-[4px] rtl:border-r-[4px] border-secondary ltr:pl-[16px] ltr:xs:pl-[20px] rtl:pr-[16px] rtl:xs:pr-[20px]  text-[16px] mob:text-[22px] md:text-[28px] lp:text-[32px] font-extrabold">
              {title} {tag && <span className="text-secondary"> {tag}</span>}
            </h3>

            <div
              className="card-description
            max-h-0 overflow-hidden opacity-0 invisible 
            group-hover:max-h-[500px] group-hover:opacity-100 group-hover:visible
            group-[.swiper-slide-active]:max-h-[500px]
            group-[.swiper-slide-active]:opacity-100 
            group-[.swiper-slide-active]:visible
            transition-all duration-500 ease-in-out mt-[6px] sm:mt-[12px] pl-[16px] xs:pl-[24px]"
            >
              {description && (
                <>
                  {/* Truncate to 2 lines on screens < xs */}
                  <div className="xs:hidden font-medium line-clamp-2 text-[12px] xxsmb:text-[14px] xs:text-[16px] sm:text-[18px]">
                    {description}
                  </div>

                  {/* Full content on xs and above */}
                  <div className="hidden xs:block font-medium text-[12px] xxsmb:text-[14px] xs:text-[16px] sm:text-[18px]">
                    {description}
                  </div>
                </>
              )}

              {link && (
                <Link href={link}>
                  <Button className="mt-[12px] !py-[5px] !px-[12px] xs:!py-[4px] xs:!pr-[6px] sm:!py-[6px] sm:!pl-[18px] sm:!pr-[6px] !text-[10px] xs:!text-[16px] sm:!text-[18px] lg:!text-[18px] [&>img]:w-[16.99px] [&>img]:xs:w-[30px] uppercase text-start !gap-[6px] xs:!gap-[6px] sm:!gap-[20px] !flex items-center">
                    Explore More
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardSlide;
