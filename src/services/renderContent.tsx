import { fetchContent } from "@/api-handler/apis/content";
import GlobalComponentsRendor from "@/components/common/GlobalComponentsRendor";
import { notFound } from "next/navigation";

export async function renderContent() {
    try {
        const apiData = await fetchContent();

        return <GlobalComponentsRendor apiData={apiData} />;
    } catch (error) {
        console.warn(error);
        notFound();
    }
}