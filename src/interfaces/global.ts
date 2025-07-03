import React from "react";
import { ItemData } from "./content";
export interface GlobalState {
  isRtl: boolean;
}

export interface ErrorResponse {
  message?: string;
  errors?: string[];
  [key: string]: unknown;
}
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "yellow" | "white" | "tangaroa";
  disabled?: boolean;
  circleButton?: boolean;
  children?: React.ReactNode;
  className?: string;
  isArrow?: boolean;
  isYellow?: boolean;
  onClick?: () => void;
}

export interface InputProps {
  placeholder?: string;
  disabled?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  wrapperClassName?: string;
}

export interface Option {
  label: string;
  value: string;
}

export interface SelectBoxProps {
  options: Option[];
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  wrapperClassName?: string;
}

export interface ImageUploadCardProps {
  onFileUpload?: (file: File | File[]) => void;
  className?: string;
  multiple?: boolean;
}

export interface RadioButtonProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className?: string;
  value?: string;
}

export type BreadcrumbComponentProps = {
  data: BreadcrumbProps[];
  className?: string;
};

export type AccordionProps = {
  items: ItemData[];
  allowMultiple?: boolean;
};

export interface CompanyCardAndImageStatisticsProps {
  title: string;
  label: string;
  data: {
    title: string;
    description: string;
    image: string;
  }[];
}

export interface QuickLinksSectionProps {
  data: {
    image: string;
    links: QuickLinks[];
  };
}

export interface QuickLinks {
  tagline: string;
  title: string;
  description: string;
  cta: string;
}

export interface EnvironmentCardsProps {
  data: {
    image: string;
    tagline: string;
    title: string;
    description: string;
    cards: EnvironmentCards[];
  };
}

export interface EnvironmentCards {
  icon: string;
  title: string;
  description: string;
  cta: string;
}

export interface LatestNewsProps {
  data: {
    tagline: string;
    title: string;
    carddata: CardData[];
  };
}

export interface PressReleaseListPanelProps {
  data: {
    title?: string;
    heading?: string;
    description?: string;
    news: CardData[];
  };
}

export interface CardData {
  bgColor?: string;
  image: string;
  date: string;
  description: string;
  linkTitle?: string;
  link?: string;
}

export interface CapsuleBackGroundTitleData {
  tagline: string;
  title: string;
  description: string;
  imageDesktop: string;
  imageMobile: string;
}

export type CapsuleVariant = "csr" | "career";
export interface CapsuleBackGroundTitleProps {
  data: CapsuleBackGroundTitleData;
  variant: CapsuleVariant;
}

export interface CompanyTeamTabsProps {
  data: {
    tabs: {
      title: string;
    }[];
    members: {
      title: string;
      post: string;
      image: string;
    }[];
  };
}

export interface SectionCenteredContentProps {
  data: {
    topSpacing: number;
    topMobileSpacing: number;
    bottomSpacing: number;
    bottomMobileSpacing: number;
    tagline: string;
    title: string;
    description: string;
    buttonText: string;
    extra: string | null;
    image: string | null;
    bgImage: string | null;
    color: string;
  };
}

export interface NewsLetterSectionProps {
  data: {
    image?: string;
    tagline?: string;
    title?: string;
    description?: string;
    color?: string;
    cta?: string;
  };
}

export interface TabContent {
  title: string;
  content: string;
}

export interface HorizontalTabSectionData {
  image: string;
  tabData: TabContent[];
}
export interface HorizontalTabSectionProps {
  data: HorizontalTabSectionData;
}

export interface TimelineItem {
  title: string;
  description: string;
  position: string;
}

export interface ImageTextContent {
  tagline?: string;
  title: string;
  description?: string;
  buttonText?: string;
  cta?: string;
}

export interface ImageTextSectionProps {
  data: {
    bgImage?: string;
    bgColor?: string;
    color?: string;
    content: ImageTextContent;
    image?: string;
    imagePosition?: string;
    topSpacing?: number;
    topMobileSpacing?: number;
    bottomSpacing?: number;
    bottomMobileSpacing?: number;
    imageWidth?: number;
  };
}

export interface CompanyCsrData {
  icon: string;
  description: string;
}

export interface CompanyCsrSectionProps {
  data: {
    bgImage?: string;
    bgColor?: string;
    color: string;
    tagline: string;
    title: string;
    description: string;
    cardData: CompanyCsrData[];
    cardContentAlign?: string;
    topSpacing?: number;
    topMobileSpacing?: number;
    bottomSpacing?: number;
    bottomMobileSpacing?: number;
  };
}

export interface CardSliderData {
  image: string;
  title: string;
  description: string;
}

export interface slidesData {
  headerdata: {
    InitiativeTagLine: string;
    InitiativeTitle: string;
    InitiativeDescription: string;
  }[];
  data: {
    title: string;
    InitiativeTitle: string;
    desc: string;
    InitiativeDesc: string;
    icon: string;
  }[];
}

export interface TextWithSideImageProps {
  data: {
    bgImage?: string;
    bgColor?: string;
    color?: string;
    tagline?: string;
    title?: string;
    name?: string;
    role?: string;
    image: string;
    imageWidth?: number;
    imageMobileWidth?: number;
    imagePosition?: string;
    topSpacing?: number;
    topMobileSpacing?: number;
    bottomSpacing?: number;
    bottomMobileSpacing?: number;
    sideSpacing?: number;
    sideMobileSpacing?: number;
  };
}

export interface imageData {
  url: string;
  name: string;
}

export interface ImageGalleryPanelProps {
  data: {
    title?: string;
    heading?: string;
    description?: string;
    images?: imageData[];
  };
}

export interface StrategyCardData {
  image: string;
  title: string;
  description: string;
  link: string;
}

export interface StrategyCardPanelProps {
  data: {
    title?: string;
    heading?: string;
    description?: string;
    cards: StrategyCardData[];
  };
}

export interface DocsData {
  title: string;
  link: string;
}

export interface DocumentsPanelProps {
  data: {
    title?: string;
    heading?: string;
    description?: string;
    ctaTitle?: string;
    ctaLink?: string;
    docs: DocsData[];
  };
}

export interface TwoColumnInfoPanelProps {
  data: {
    image: string;
    title: string;
    heading: string;
    description: string;
  };
}

export interface PageBannerPanelProps {
  data: {
    image: string;
    logo?: string;
    title?: string;
    heading: string;
    description?: string;
  };
}

export interface BreadcrumbProps {
  label: string;
  href: string;
}

export interface CenterIconKpiPanelProps {
  data: {
    title: string;
    heading: string;
    description: string;
    iconTitle: string;
    icon: string;
    iconDescription: string;
  };
}

export interface accordionItem {
  title: string;
  subTitle?: string;
  description: {
    markup: string;
  };
}

export interface AccordionPanelProps {
  data: {
    image: string;
    title?: string;
    heading?: string;
    description?: string;
    accordionData?: accordionItem[];
  };
}

export interface CapsuleInfoPanelProps {
  data: {
    title?: string;
    heading?: string;
    description?: string;
    image?: string;
  };
}

export interface slideCardData {
  heading: string;
  description: string;
  link: string;
  linkTitle: string;
}

export interface VideoGallaryProps {
  title: string;
  heading: string;
  backgroundImage: string;
  items: {
    thumbnailImage: string;
    video: string;
  }[];
}

export interface sustainabilityQuickLinkData {
  headerdata: {
    tagline: string;
    title: string;
  }[];
  data: {
    icon: string;
    title: string;
    desc: string;
    arrowicon: string;
  }[];
}

export interface KpiCardProps {
  data: {
    header: {
      tagline: string;
      title: string;
      description: string;
    };
    mainStats?: {
      trainingHours?: {
        value: string;
        label: string;
      };
      hsseSessions?: {
        value: string;
        label: string;
      };
      employeeSessions?: {
        value: string;
        label: string;
      };
    };
    topics: {
      title: string;
      items: string[];
    };
    training?: {
      count: string;
      text: string;
    }[];
    type: string;
  };
}

export interface ReportTableKPIProps {
  data: {
    tagline: string;
    title: string;
    years: string[];
    labels: string[];
    data: {
      [year: string]: string[];
    };
    drop: {
      dropfirst: Drop[];
      dropsecond: Drop[];
    };
  };
}

export interface Drop {
  value: string;
  label: string;
  icon: string;
}

export interface ReportTableContentProps {
  data: {
    tagline: string;
    bottomdescription: string;
    title: string;
    years: string[];
    labels: string[];
    data: {
      [year: string]: string[];
    };
    rightcontent: {
      tagline: string;
      title: string;
      description: string;
    }[];
  };
}

export interface KPITwoColumnData {
  variant: string;
  title: string;
  subtitle: string;
  description: string;
  mainStat: string;
  mainStatLabel: string;
  icon: string;
  extraStats?: {
    icon: string;
    value: string;
    label: string;
  }[];
}

export interface KPITwoColumnProps {
  data: KPITwoColumnData;
  // variant: "energy" | "water";
}

export interface PressReleaseDetailProps {
  data: {
    content: string;
  };
}

export interface InitiativeTwoColumnPanelProps {
  data: {
    backgroundColor?: string;
    title: string;
    heading: string;
    description?: string;
    linkTitle?: string;
    link?: string;
    image?: string;
    isImageLeft?: boolean;
  };
}

export interface contactCards {
  icon: string;
  text: string;
}

export interface ContactUsPanelProps {
  data: {
    image?: string;
    title: string;
    heading: string;
    description?: string;
    cards?: contactCards[];
  };
}

export interface SponsorshipFormPanelProps {
  data: {
    title: string;
    heading?: string;
    description?: string;
  };
}
