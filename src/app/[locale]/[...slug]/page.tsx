import { fetchContent } from "@/api-handler/apis/content";
import { RendorProps, SeoSitemapConfig } from "@/interfaces/content";
import { renderContent } from "@/services/renderContent";

// Generate metadata for SEO
export async function generateMetadata({ params }: RendorProps) {
  const { slug } = await params;
  const formattedSlug = slug.join('/')
  const apiData = await fetchContent(formattedSlug);

  const seoConfig: SeoSitemapConfig = {
    seoTitle: apiData?.properties?.seoTitle || "GYMNATION",
    seoDescription: apiData?.properties?.seoDescription || "DUQM Refinery",
    seoKeywords: apiData?.properties?.seoKeywords,
    canonicalUrl: apiData?.properties?.canonicalUrl,
    noIndex: apiData?.properties?.noIndex || false,
    ogTitle: apiData?.properties?.ogTitle || "GYMNATION",
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

export default async function DynamicRender({ params }: RendorProps) {
  const { slug } = await params;
  const formattedSlug = slug.join('/')
  return await renderContent(formattedSlug);
}