import React, { useState } from "react";
import { DynamicComponentData } from "@/interfaces/content";

const WelcomeBlock = ({ data }: { data: DynamicComponentData }) => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleLoadVideo = () => {
    setIsVideoLoaded(true);
  };

  return (
    <section className="global-spacing">
      <div className="container">
        <div className="relative overflow-hidden pt-[56.25%] sm:pt-[54.25%] lp:pt-[45.25%] max-w-[900px] lp:max-w-[950px] xlg:!max-w-[100%] xlg:pt-[56.25%] mt-0 mx-auto !w-full rounded-[24px]">
          {!isVideoLoaded ? (
            <div
              className="absolute top-0 left-0 w-full h-full bg-black cursor-pointer flex items-center justify-center rounded-[24px]"
              onClick={handleLoadVideo}
            >
              {/* Simple Play Button Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-[70px] h-[70px] text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          ) : (
            <iframe
              width="640"
              height="360"
              title="About Video Gallery"
              allow="autoplay; encrypted-media"
              allowFullScreen
              loading="lazy"
              src={data.videoUrl}
              className="!absolute !h-full !w-full !top-0 !left-0 rounded-[24px]"
            ></iframe>
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeBlock;
