export interface ContentItem {
  content: {
    contentType: string;
    id: string;
    properties: DynamicComponentData;
  };
  settings: null;
}

export interface DynamicComponentProps {
  data: DynamicComponentData;
  contentType?: string;
}

export interface DynamicComponentData {
  cards: CardItems | Item[];
  title: string;
  heading: string;
  subTitle: string;
  subHeading: string;
  description: RichTextDescription | string;
  pDF: PDF[];
  link: Link[];
  image: MediaImage[];
  mobileImage: MediaImage[];
  backgroundImage: MediaImage[];
  sectionBackground: MediaImage[];
  slides: CardItems;
  color: string;
  backgroundColor: string;
  isImageLeft: boolean;
  leaderName: string;
  role: string;
  icon: MediaImage[];
  teamMembers: CardItems;
  formTerms: RichTextDescription;
  tabs: {
    title: string;
  }[];
  members: {
    title: string;
    post: string;
    image: string;
  }[];
  teams: {
    items: Item[];
  };
  textColor: string;
  spacingTop?: string;
  spacingBottom?: string;
  items: { items: ItemData[] };
  images: imageData[];
  iconDescription: string;
  iconTItle: string;
  largeContainer: boolean;
  content: {
    items: OverviewItem[]
  }
  documents: DocsData[];
  ctaLink: string;
  cardItems: {
    items: Item[];
  }



  heroImage: MediaImage[];
  heroTitle: string;
  heroHeading: string;
  reviewTitle: string;
  googleLogo: MediaImage[];
  reviewText: string;
  callToAction: Link[];
  redictToAction: Link[];
  locationItems: {
    items: Item[];
  }
}

export interface DocsData {
  url: string;
  title: string;
}

export interface ItemContent {
  contentType: string;
  id: string;
  properties: {
    title: string;
    tagline: string;
    heading: string;
    number: number;
    statistics: string;
    percentage: string;
    description: string;
    locationName: string;
    icons: MediaImage[];
    logo: MediaImage[];
    icon: MediaImage[];
    cards: {
      items: OverviewItem[];
    };
    info: {
      items: OverviewItem[];
    };
    oilItems: {
      items: OverviewItem[];
    };
    chartItems: {
      items: OverviewItem[];
    };
    items: {
      items: OverviewItem[];
    }
  };
}

export interface OverviewItem {
  content: ItemContent;
}

export interface imageData {
  url: string;
  name: string;
}

export interface ItemData {
  content: {
    properties: accordionItem;
  }
}

export interface accordionItem {
  title: string;
  subTitle?: string;
  description: {
    markup: string;
  };
}
export interface GlobalComponentProps {
  apiData: {
    properties: {
      content?: {
        items: ContentItem[];
      };
      hideInSitemap: boolean;
      sitemapChangeFrequency: string | null;
      sitemapPriority: number;
      seoTitle: string | null;
      seoDescription: string | null;
      seoKeywords: string | null;
      canonicalUrl: string | null;
      noIndex: boolean;
      ogTitle: string | null;
      ogDescription: string | null;
      ogImage: string | null;
      headerTheme: string;
    };
  };
}

// All Page Content
export interface ContentResponse {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  id: string;
  properties: {
    hideInSitemap: boolean;
    sitemapChangeFrequency: string | null;
    sitemapPriority: number;
    seoTitle: string | null;
    seoDescription: string | null;
    seoKeywords: string | null;
    canonicalUrl: string | null;
    noIndex: boolean;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    internalRouting: string | null;
    externalRouting: string | null;
    hideFromInternalSearch: boolean;
    headerTheme: string;
    content: {
      items: ContentItem[];
    };
  };
  cultures: Record<
    string,
    { path: string; startItem: { id: string; path: string } }
  >;
}

// Global Config content
export interface GlobalConfigResponse {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  id: string;
  properties: {
    siteName: string;
    favicon: {
      url: string;
    }[];
    primaryLogo: MediaItem[];
    secondaryLogo: MediaItem[];
    navigationMenu?: {
      items: MenuItem[];
    };
    footerLogo?: MediaItem[];
    footerDescription: RichTextDescription;
    footerNavigation?: {
      items: FooterItem[];
    };
    copyrightText?: string;
    footerSocialMedia?: {
      items: SocialMediaItem[];
    };
  };
  cultures: Record<
    string,
    { path: string; startItem: { id: string; path: string } }
  >;
}

export interface MenuItem {
  content: {
    contentType: "menuItem";
    id: string;
    properties: {
      menuLink: Link[];
      subMenuLink: Link[] | null;
    };
  };
  settings: null;
}

export interface FooterItem {
  content: {
    contentType: "footerItem" | "footerInformation";
    id: string;
    properties: {
      links?: Link[];
      heading?: string | null;
      description: {
        markup: string;
        blocks: null;
      };
    };
  };
  settings: null;
}

export interface MediaItem {
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width: number;
  height: number;
  bytes: number;
  properties: Record<string, null>;
}

export interface SocialMediaItem {
  content: {
    contentType: "imageWithLink";
    id: string;
    properties: {
      socialMedia: string;
      link: Link[];
    };
  };
  settings: null;
}

export interface HeaderWrapperProps {
  data: HeaderData;
}

export interface HeaderData {
  primaryLogo?: MediaItem[];
  secondaryLogo?: MediaItem[];
  navigationMenu?: {
    items: MenuItem[];
  };
}

export interface FooterData {
  footerLogo?: MediaItem[];
  footerDescription?: string;
  footerNavigation?: {
    items: FooterItem[];
  };
  copyrightText?: string;
  footerSocialMedia?: {
    items: SocialMediaItem[];
  };
}

export interface PageProps {
  apiData: {
    properties?: {
      content?: {
        items: ContentItem[];
      };
    };
  };
}

export interface RendorProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Global
export interface MediaImage {
  focalPoint: null;
  crops: null;
  id: string;
  name: string;
  mediaType: "Image";
  url: string;
  extension: string;
  width: number;
  height: number;
  bytes: number;
  properties: Record<string, null>;
}

export interface RouteStartItem {
  id: string;
  path: string;
}

export interface LinkRoute {
  path: string;
  startItem: RouteStartItem;
}

export interface Link {
  url: string;
  queryString: string | null;
  title: string;
  target: string | null;
  destinationId: string;
  destinationType: string;
  route: LinkRoute;
  linkType: "Content";
}

export interface PDF {
  focalPoint: null;
  crops: null;
  id: string;
  name: string;
  mediaType: string;
  url: string;
  extension: string;
  width: null;
  height: null;
  bytes: number;
  properties: object;
}

export interface RichTextDescription {
  markup: string;
  blocks: null;
}

export interface Properties {
  backgroundImage: MediaImage[];
  heading: string;
  description: RichTextDescription | string;
  isTransparent: boolean;
  title?: string;
  icon?: MediaImage[];
  statistics?: string;
  year?: string;
  curved?: string;
  image?: MediaImage[];
  tagLine: string;
  teamMembers: {
    name: string;
  }[];


  name: string;
  link: Link[];
}

export interface Content {
  contentType: string;
  id: string;
  properties: Properties;
}

export interface Item {
  content: Content;
  settings: null;
  name: string;
  id: string;
}

export interface CardItems {
  items: Item[];
}

export interface InitiativeContent {
  properties: {
    description: string;
  };
}

// SEO
export interface SeoSitemapConfig {
  hideInSitemap: boolean;
  sitemapChangeFrequency: string | null;
  sitemapPriority: number;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
}
