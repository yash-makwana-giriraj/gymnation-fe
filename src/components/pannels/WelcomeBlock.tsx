import { DynamicComponentData } from "@/interfaces/content";
import React from "react";

const WelcomeBlock = ({ data }: { data: DynamicComponentData }) => {
  return (
    <section className="global-spacing">
      <div className="container">
        <div className="relative overflow-hidden pt-[56.25%] sm:pt-[54.25%] lp:pt-[45.25%] max-w-[900px] lp:max-w-[950px] xlg:!max-w-[100%] xlg:pt-[56.25%] mt-0 mx-auto !w-full rounded-[24px]">
          <iframe
            width="640"
            height="360"
            title="About Video Gallery"
            allow="autoplay; encrypted-media"
            allowFullScreen
            src={data.videoUrl}
            data-loaded="true"
            className="!absolute !h-full !w-full !top-0 !left-0"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default WelcomeBlock;
