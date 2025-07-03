import { fetchContent } from "@/api-handler/apis/content";
import { SeoSitemapConfig } from "@/interfaces/content";
import { renderContent } from "@/services/renderContent";

// Generate metadata for SEO
export async function generateMetadata() {

  const apiData = await fetchContent();

  const seoConfig: SeoSitemapConfig = {
    seoTitle: apiData?.properties?.seoTitle || "OQ8",
    seoDescription: apiData?.properties?.seoDescription || "DUQM Refinery",
    seoKeywords: apiData?.properties?.seoKeywords,
    canonicalUrl: apiData?.properties?.canonicalUrl,
    noIndex: apiData?.properties?.noIndex || false,
    ogTitle: apiData?.properties?.ogTitle || "OQ8",
    ogDescription: apiData?.properties?.ogDescription || "DUQM Refinery",
    ogImage: apiData?.properties?.ogImage,
    hideInSitemap: apiData?.properties?.hideInSitemap,
    sitemapChangeFrequency: apiData?.properties?.sitemapChangeFrequency,
    sitemapPriority: apiData?.properties?.sitemapPriority,
  };

  return {
    title: seoConfig.seoTitle,
    description: seoConfig.seoDescription,
    keywords: seoConfig.seoKeywords,
    robots: seoConfig.noIndex ? "noindex" : undefined,
    openGraph: {
      title: seoConfig.ogTitle,
      description: seoConfig.ogDescription,
      images: seoConfig.ogImage ? [seoConfig.ogImage] : undefined,
      type: "website",
    },
    alternates: {
      canonical: seoConfig.canonicalUrl,
    },
  };
}

export default async function DynamicRender() {
  return await renderContent();
}