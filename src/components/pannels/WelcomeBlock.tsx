"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Player from "@vimeo/player";
import { DynamicComponentData } from "@/interfaces/content";

const getVimeoId = (url: string) => {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return match ? match[1] : null;
};

const WelcomeBlock = ({ data }: { data: DynamicComponentData }) => {
  const [isPlayerActive, setIsPlayerActive] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoId = getVimeoId(data.videoUrl);

  useEffect(() => {
    if (isPlayerActive && iframeRef.current) {
      const player = new Player(iframeRef.current);

      player.on("play", () => {
        setIsVideoReady(true);
      });
    }
  }, [isPlayerActive]);

  if (!vimeoId) return null;

  return (
    <section className="global-spacing">
      <div className="container">
        <div
          className="relative overflow-hidden pt-[56.25%] sm:pt-[54.25%] lp:pt-[45.25%] max-w-[900px] lp:max-w-[950px] xlg:!max-w-[100%] xlg:pt-[56.25%] mt-0 mx-auto !w-full rounded-[24px]"
          onClick={() => setIsPlayerActive(!isPlayerActive)}
        >
          {/* Vimeo Iframe */}
          {isPlayerActive && (
            <iframe
              ref={iframeRef}
              src={`https://player.vimeo.com/video/${vimeoId}?autoplay=1`}
              title="About Video Gallery"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full rounded-[24px]"
              style={{ zIndex: 10 }}
            />
          )}

          {/* Placeholder visible until video starts */}
          {!isVideoReady && (
            <>
              <Image
                src="/images/welcome-block-placeholder.avif"
                alt="Video placeholder"
                fill
                className="object-cover rounded-[24px]"
                priority={false}
                style={{ zIndex: 20 }}
              />
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-30 pointer-events-none">
                <div className="relative w-fit justify-center pointer-events-auto">
                  {/* Tooltip text on hover */}
                  {showTooltip && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-3 py-2 bg-black text-white text-[12px] font-bold rounded-[4px] shadow-md">
                      {isPlayerActive ? "Pause" : "Play"}
                    </div>
                  )}

                  <button
                    aria-label={isPlayerActive ? "Pause video" : "Play video"}
                    className="bg-black cursor-pointer flex items-center justify-center text-white text-[50px] rounded-[4px] py-[4px] px-[16px]"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <Image
                      src={isPlayerActive ? "/images/pause.png" : "/images/play.png"}
                      height={24}
                      width={24}
                      alt={isPlayerActive ? "Pause icon" : "Play icon"}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default WelcomeBlock;
