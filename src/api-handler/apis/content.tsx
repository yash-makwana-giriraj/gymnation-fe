import {
  CityLocationFilterItems,
  ContentResponse,
  GlobalConfigResponse,
  GoogleReviewResponse,
  GymReview,
} from "@/interfaces/content";
import { getRequest } from "../axios-handler";

// Fetch content data based on locale
export const fetchContent = async (formattedSlug?: string): Promise<ContentResponse> => {
  const safeSlug = formattedSlug ?? ""
  const response = await getRequest<ContentResponse>(
    `/umbraco/api/CommonContent/GetContentWithSasUrls?pagename=${safeSlug}`
  );
  return response;
};

export const fetchGlobalConfig = async (
  locale: string
): Promise<GlobalConfigResponse> => {
  const response = await getRequest<GlobalConfigResponse>(
    `/umbraco/delivery/api/v2/content/item/${locale}/config/configuration/?expand=properties[$all]`
  );
  return response;
};

export const fetchGoogleReviewData =
  async (): Promise<GoogleReviewResponse> => {
    const response = await getRequest<GoogleReviewResponse>(
      `/umbraco/api/CommonApi/getLatestReview`
    );
    return response;
  };

export const fetchCityWithLocationData = async (): Promise<ContentResponse> => {
  const response = await getRequest<ContentResponse>(
    `/umbraco/api/CommonContent/GetContentWithSasUrls?pagename=site-settings/city-location?expand=properties[$all]`
  );
  return response;
};

export const fetchCityLocationFilters =
  async (): Promise<CityLocationFilterItems> => {
    const response = await getRequest<CityLocationFilterItems>(
      `/umbraco/delivery/api/v2/content?fetch=children:254af728-c37c-44bd-9c6f-2e18e2db940f`
    );
    return response;
  };

export const fetchGymReviewData = async (): Promise<GymReview> => {
  const response = await getRequest<GymReview>(
    `/umbraco/api/CommonApi/GetAllLocationRatings`
  );
  return response;
};
