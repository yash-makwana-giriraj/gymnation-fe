import { ContentResponse, GlobalConfigResponse, InitiativeContent } from "@/interfaces/content";
import { getRequest } from "../axios-handler";

// Fetch content data based on locale
export const fetchContent = async (): Promise<ContentResponse> => {
  const response = await getRequest<ContentResponse>(
    `/api/headless-content/1086`
  );
  return response;
};

export const fetchGlobalConfig = async (locale: string): Promise<GlobalConfigResponse> => {
  const response = await getRequest<GlobalConfigResponse>(
    `/umbraco/delivery/api/v2/content/item/${locale}/config/configuration/?expand=properties[$all]`
  );
  return response;
};

// Fetch Initiative Content
export const fetchInitiativeData = async (id: string): Promise<InitiativeContent | undefined> => {
  const response = await getRequest<InitiativeContent | undefined>(
    `/umbraco/delivery/api/v2/content/item/${id}`
  );
  return response;
};
