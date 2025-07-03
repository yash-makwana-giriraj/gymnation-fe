import { BreadcrumbComponentProps } from "@/interfaces/global";
import Link from "next/link";
import Image from "next/image";
import React from "react";

const Breadcrumb = ({ data, className = "" }: BreadcrumbComponentProps) => {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-[4px] text-accent-disabled body2-regular leading-[140%]">
        {data.map((item, index) => (
          <React.Fragment key={index}>
            {index < data.length - 1 ? (
              <>
                <li>{item.label}</li>
                <li>
                  <Image
                    src="/icons/Chevron_right_grey.svg"
                    alt="arrow right"
                    width={14}
                    height={14}
                  />
                </li>
              </>
            ) : (
              <li>
                <Link
                  href={item.href}
                  className="body2-medium text-accent-primary"
                >
                  {item.label}
                </Link>
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
