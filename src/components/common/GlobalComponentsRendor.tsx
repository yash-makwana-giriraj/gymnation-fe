"use client";
import React, { ComponentType, memo } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { setHeaderType } from "@/store/slices/headerSlice";
import {
  ContentItem,
  DynamicComponentProps,
  GlobalComponentProps,
} from "@/interfaces/content";

// Lazy-load components using Next.js dynamic imports
const AboutUsHeroSlider = dynamic(
  () => import("@/components/banners/AboutUsHeroSlider"),
  { ssr: true }
);
const aboutUsHero = dynamic(
  () => import("@/components/banners/AboutUsHeroSlider"),
  { ssr: true }
);
const LocationCard = dynamic(
  () => import("@/components/sliders/LocationCard"),
  { ssr: true }
);
const LargeTextComponent = dynamic(
  () => import("@/components/pannels/LargeTextComponent"),
  { ssr: true }
);
const WelcomeBlock = dynamic(
  () => import("@/components/pannels/WelcomeBlock"),
  { ssr: true }
);
const Rewards = dynamic(() => import("@/components/sliders/Rewards"), {
  ssr: true,
});
const FeaturedCard = dynamic(() => import("@/components/cards/FeaturedCard"), {
  ssr: true,
});
const dayPassForm = dynamic(
  () => import("@/components/pannels/FreeTrailForm"),
  { ssr: true }
);

const FreeTrailForm = dynamic(
  () => import("@/components/pannels/FreeTrailForm"),
  { ssr: true }
);
const GoogleReview = dynamic(
  () => import("@/components/sliders/GoogleReview"),
  { ssr: true }
);
const ScrollableClassesCard = dynamic(
  () => import("@/components/sliders/ScrollableClassesCard"),
  { ssr: true }
);
const ImageGalleryWithDescription = dynamic(
  () => import("@/components/sliders/ImageGalleryWithDescription"),
  { ssr: true }
);

const LocationMap = dynamic(() => import("@/components/pannels/LocationMap"), {
  ssr: true,
});

const informationSection = dynamic(() => import("@/components/pannels/Description"), {
  ssr: true,
});

const NewLocationMap = dynamic(() => import("@/components/pannels/NewLocationMap"), {
  ssr: true,
});

// Define component map with proper typing
const components: Record<string, ComponentType<DynamicComponentProps>> = {
  AboutUsHeroSlider,
  aboutUsHero,
  LocationCard,
  LargeTextComponent,
  WelcomeBlock,
  Rewards,
  FeaturedCard,
  dayPassForm,
  FreeTrailForm,
  GoogleReview,
  ScrollableClassesCard,
  ImageGalleryWithDescription,
  informationSection,
  LocationMap,
  NewLocationMap
};

// Define the component map with lowercase keys for case-insensitive lookup
const componentMap: Record<
  string,
  ComponentType<DynamicComponentProps>
> = Object.fromEntries(
  Object.entries(components).map(([key, component]) => [
    key
      .toLowerCase()
      .replace(/([A-Z])/g, (_match, char: string) => char.toLowerCase()),
    component,
  ])
);

// Memoize the FallbackComponent to prevent unnecessary re-renders
const FallbackComponent = memo(({ contentType }: { contentType: string }) => (
  <div style={{ padding: "20px", background: "#ffe6e6" }}>
    Component for {contentType} not found
  </div>
));
FallbackComponent.displayName = "FallbackComponent";

// Memoize the entire component to prevent re-renders if apiData doesn't change
const GlobalComponentsRendor = memo(function GlobalComponentsRendor({
  apiData,
}: GlobalComponentProps) {
  const dispatch = useDispatch();

  if (apiData?.properties?.headerTheme) {
    dispatch(setHeaderType(apiData.properties.headerTheme));
  }

  const contentItems: ContentItem[] = apiData?.properties?.content?.items || [];

  return (
    <div>
      {contentItems.map((item, index) => {
        const { contentType, properties, id } = item.content;
        const normalizedContentType = contentType.toLowerCase();
        const Component =
          componentMap[normalizedContentType] || FallbackComponent;

        return (
          <Component
            key={id || index}
            data={properties}
            contentType={contentType}
          />
        );
      })}
    </div>
  );
});

GlobalComponentsRendor.displayName = "GlobalComponentsRendor";

export default GlobalComponentsRendor;
