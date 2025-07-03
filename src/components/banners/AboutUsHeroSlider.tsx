import React from "react";
import { DynamicComponentData } from "@/interfaces/content";
import Image from "next/image";
import Button from "../ui/Button";
import Link from "next/link";

const AboutUsHeroSlider = ({ data }: { data: DynamicComponentData }) => {
  return (
    <section className="h-screen pt-[200px] pb-[150px] flex items-center relative before:content-[''] before:absolute before:inset-x-0 before:left-0 before:bottom-[-12px] before:w-full before:h-[100px] before:bg-[url('/images/banner-bottom-shape.webp')] before:bg-no-repeat before:bg-top before:bg-[length:100%_100%] after:content-[''] after:absolute after:inset-0 after:bg-primary after:opacity-60 after:-z-1">
      <Image src={`${data.heroImage?.[0]?.url}`} width={100} height={100} alt="Hero banner image" className="absolute object-cover h-full w-full z-[-1] top-0 left-0" />
      <div className="container !max-w-[1372px]">
        <div className="relative text-white z-[2]">
          <p className="text-p-xlarge font-800 text-yellow-f4 mb-[8px] italic font-800">{data.heroTitle}</p>
          <h1 className="mb-[12px]">{data.heroHeading.split('$').map((part, index) => (
            <React.Fragment key={index}>
              {index > 0 && <br />}
              {part.trim()}
            </React.Fragment>
          ))}
          </h1>
          <h2 className="flex items-center gap-[12px] mb-[30px] text-[40px] leading-[1.3] mb-[30px]">{data.reviewTitle} <Image alt="Google Icon" className="" src={data.googleLogo[0].url} width={142} height={47} /> <span className="title-black">{data.reviewText}</span></h2>
          <div className="flex gap-[30px]">
            <Button variant="white">{data.callToAction[0].title}</Button>
            <Link href={data.redictToAction?.[0]?.route?.path || "#"}>
              <Button>{data.redictToAction[0].title}</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsHeroSlider;
