import React, { useState } from "react";
import Image from "next/image";
import { DynamicComponentData } from "@/interfaces/content";

const getVimeoId = (url: string) => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const WelcomeBlock = ({ data }: { data: DynamicComponentData }) => {
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const vimeoId = getVimeoId(data.videoUrl);

  if (!vimeoId) return null;

  return (
    <section className="global-spacing">
      <div className="container">
        <div
          className="relative overflow-hidden pt-[56.25%] sm:pt-[54.25%] lp:pt-[45.25%] max-w-[900px] lp:max-w-[950px] xlg:!max-w-[100%] xlg:pt-[56.25%] mt-0 mx-auto !w-full rounded-[24px]"
          onClick={() => setIsPlayerActive(true)}
        >
          {/* Iframe (hidden until loaded) */}
          {isPlayerActive && (
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
              title="About Video Gallery"
              allow="autoplay; encrypted-media"
              allowFullScreen
              onLoad={() => setIsIframeLoaded(true)}
              className="absolute top-0 left-0 w-full h-full rounded-[24px]"
              style={{ zIndex: 10 }}
            ></iframe>
          )}

          {/* Placeholder (shows until iframe is loaded) */}
          {(!isPlayerActive || !isIframeLoaded) && (
            <>
              <Image
                src="/images/welcome-block-placeholder.avif"
                alt="Video placeholder"
                fill
                className="object-cover rounded-[24px]"
                priority={false}
                style={{ zIndex: 20 }}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeBlock;
