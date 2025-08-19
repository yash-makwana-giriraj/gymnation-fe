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
    items: OverviewItem[];
  };
  documents: DocsData[];
  ctaLink: string;
  cardItems: {
    items: Item[];
  };
  scrollableCardItems: {
    items: Item[];
  };
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
  };
  largeText: {
    markup: string;
  };
  videoUrl: string;
}

export interface GoogleReview {
  id: string;
  reviewId: string;
  reviewerProfilePhotoUrl: string;
  reviewerDisplayName: string;
  starRating: string;
  createTime: string;
  updateTime: string;
  name: string;
  comment: string;
  reviewReplyComment: string;
  reviewReplyupdateTime: string;
}

export interface GymReview {
  id: number;
  location: string;
  placeId: string;
  formattedAddress: string;
  ratings: number;
  totalReviews: number;
  updatedDate: string;
  createdDate: string;
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
    };
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
  };
}

export interface accordionItem {
  title: string;
  subTitle?: string;
  image?: MediaImage[];
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
  properties: Properties;
  cultures: Record<
    string,
    { path: string; startItem: { id: string; path: string } }
  >;
  content: {
    properties: Properties;
  };
  items: any;
}

export interface Properties {
  navigation?: {
    items: MenuItem[]
  }
  formTitle?: string
  logo: MediaItem[];
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
  hideInSitemap: boolean;
  headerTheme: string;
  content: {
    items: ContentItem[];
  };
  footerNavigationSections: footerNavigationSections;
  footerLink: Link[];
  footerImage: MediaItem[];
  footerDescription: string;
  footerLogo?: MediaItem[];
  footerNavigation?: {
    items: FooterItem[];
  };
  partnerText?: string;
  copyrightText?: RichTextDescription;
  socialAccounts?: {
    items: SocialMediaItem[];
  };
  socialMediaTitle: string;
  appTitle: string;
  appStoreImage: MediaItem[];
  appStoreHoverImage: MediaItem[];
  appStoreLink: string;
  playStoreHoverImage: MediaItem[];
  playStoreImage: MediaItem[];
  playStoreLink: string;
  sectionTitle: string;
  sectionLinks: Link[];
  description: RichTextDescription | string;
  title?: string;
  icon?: MediaImage[];
  statistics?: string;
  year?: string;
  curved?: string;
  image?: MediaImage[];
  cardLink: Link[];
  name?: string;
  link: Link[];
  callToAction?: Link[];
  flagIcon: MediaImage[];
  countryName: string;
  cityList: CardItems;
  cityName: string;
  languageCode: string;
  cityLocations: {
    items: CityItem[];
  };
  countries: CardItems;
  aPILocations: APILocationsResponse[];
  locations: LinkItem[];
  locationName: string;
  catagoryLocations: APILocationsResponse[];
  locationLatitude: string;
  locationLongitude: string;
  placeId?: string;
  mapAddress: string;
  mapDirectionUrl?: string;
  mapImage: MediaImage[];
  noFollow: boolean;
  excludeFromSiteSearch: boolean;
  excludeFromMenu: boolean;
  showLanguageSwitcher: boolean;
  noOpener: boolean;
  isNewLayout: boolean;
  noFollowExternalLink: boolean;
  markupClass: string | null;
  scripts: string | null;
  enableSalesforce: boolean;
  enableHubSpot: boolean;
  salesforceLeadSource: string;
  salesforceLeadSubCategory: string;
  salesforceSiteLocation: string | null;
  salesforceReturnUrl: string | null;
  enabledCustomSuccessMessage: boolean;
  salesforceSuccessMessage: string | null;
  salesforceReferLink: string | null;
  leadLocations: LeadLocation[];
  referTitle: string | null;
  referLink: string | null;
  whatsappLabelText: string | null;
  emailLabelText: string | null;
  shareViaLabelText: string | null;
  referEmailSubject: string | null;
  customEmailMessage: string | null;
  customWhatsappMessage: string | null;
  isComingSoon: boolean;
  mapWidget: string;
  defaultCountryCode: string;
  currency: string;
  telrCurrency: string;
  tELRStoreID: string;
  tELRAuthorisationKey: string;
  telrRemoteApiAuthKey: string;
  paymentRepeatStartDate: string;
  applePayAuthKey: string;
  isKSA: boolean;
  mapPinText: string;
  polygonCoordinates: null;
  pfgclubId: string;
  isPreSell: boolean;
  prePostOfferText: string | null;
  prePostUserText: string | null;
  timeForProcess: string | null;
  prePostTimeText: string | null;
  higherNumber: number | null;
  minCheckoutUserNumber: number | null;
  userTextForMobile: string | null;
  bottomNumber: number | null;
  enableDayPass: boolean;
  mAPCTA: LinkItem[];
  featureLink: string | null;
  leadTitle: string;
  category: string;
}

export interface APILocationsResponse {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: Route;
  id: string;
  properties: Properties;
  sys: {
    id: string;
  }
}

export interface Route {
  path: string;
  startItem: {
    id: string;
    path: string;
  };
}

export interface ContentBlocks {
  items: ContentBlockItem[];
}

export interface ContentBlockItem {
  content: ContentItem;
  settings: ContentSettings | null;
}

export interface ContentItem {
  contentType: string;
  id: string;
}

export interface ContentSettings {
  contentType: string;
  id: string;
  properties: {
    customClass: string | null;
    customCSSClass: string | null;
    sectionClass: string | null;
  };
}

export interface LinkItem {
  url: string | null;
  queryString: string | null;
  title: string;
  target: string | null;
  destinationId: string;
  destinationType: string;
  route: Route;
  linkType: string;
}

export interface SearchLocationItem {
  features: FeaturesItem[]
}

export interface FeaturesItem {
  place_name: string
}

export interface LeadLocation {
  contentType: string;
  name: string;
  createDate: string;
  updateDate: string;
  route: Route;
  id: string;
}


export interface CityItem {
  content: {
    id: string;
    contentType: string;
    properties: {
      cityName: string;
      arabicCityName: string | null;
      countryLanguageCode: string;
      locations: {
        items: LocationItem[];
      };
    };
  };
  settings: null;
}

export interface LocationItem {
  content: {
    properties: {
      displayName: string;
      sFName?: string;
    };
  };
  settings: null;
}

export interface footerNavigationSections {
  items: ContentResponse[];
}

export interface GoogleReviewResponse {
  id: string;
  reviewId: string;
  reviewerProfilePhotoUrl: string;
  reviewerDisplayName: string;
  starRating: string;
  createTime: string;
  updateTime: string;
  name: string;
  comment: string;
  reviewReplyComment: string;
  reviewReplyupdateTime: string;
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
  title: string;
  content: {
    contentType: "menuItem";
    id: string;
    properties: {
      menuLink: Link[];
      subMenuLink: Link[] | null;
      hasChildren?: boolean;
      hasTreeMenu?: boolean;
      cityTitle: string;
      link?: Link[];
      route?: {
        path: string;
        title: string;
      };
      title: string;
      image: MediaImage[];
      cityList: {
        items: MenuItem[];
      };
      childItems: {
        items: MenuItem[];
      };
      selectRegion: string;
      selectRegions: MenuItem[];
    };
  };
  settings: null;
}

export interface FooterItem {
  content: {
    contentType: "footerItem" | "footerInformation";
    id: string;
    properties: {
      sectionLinks?: Link[];
      sectionTitle?: string | null;
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
      icon: MediaImage[];
      iconBlue: MediaImage[];
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
  logo?: MediaItem[];
  navigation?: {
    items: MenuItem[]
  }
  socialAccounts?: {
    items: SocialMediaItem[];
  };
  socialMediaTitle?: string;
  appTitle?: string;
  appStoreImage?: MediaItem[];
  playStoreImage?: MediaItem[];
  appStoreHoverImage?: MediaItem[];
  playStoreHoverImage?: MediaItem[];
  formTitle?: string;
}

export interface FooterData {
  footerLogo?: MediaItem[];
  partnerText?: string;
  copyrightText?: RichTextDescription;
  socialAccounts?: {
    items: SocialMediaItem[];
  };
  footerNavigationSections?: footerNavigationSections;
  footerLink?: Link[];
  footerImage?: MediaItem[];
  footerDescription?: string;
  socialMediaTitle?: string;
  appTitle?: string;
  appStoreImage?: MediaItem[];
  appStoreHoverImage?: MediaItem[];
  appStoreLink?: string;
  playStoreHoverImage?: MediaItem[];
  playStoreImage?: MediaItem[];
  playStoreLink?: string;
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
  crops: null | never[];
  id: string;
  name: string;
  mediaType: "Image";
  url: string;
  extension: string;
  width: number | null;
  height: number | null;
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

export interface Content {
  contentType: string;
  id: string;
  name: string;
  properties: Properties;
  route: {
    path: string;
    startItem: {
      id: string;
      path: string;
    };
  };
  createDate: string;
  updateDate: string;
  sys: {
    id: string;
  }
}

export interface MapBoxProps {
  apiLocations: Content[];
}

export interface locationContent {
  content: Content;
  settings: null;
}

export interface Item extends locationContent {
  name: string;
  id: string;
}

export interface CardItems {
  items: Item[];
}

export interface CityLocationFilterItems {
  items: ContentResponse[];
  total: number;
  properties: any;
}

// SEO
export interface SeoSitemapConfig {
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
  hideInSitemap: boolean;
}
