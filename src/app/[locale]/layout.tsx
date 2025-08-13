import { NextIntlClientProvider, hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { IBM_Plex_Sans } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProvider";
import "../../styles/globals.css";
import { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import { fetchContent } from "@/api-handler/apis/content";
import { FooterData, HeaderData } from "@/interfaces/content";
import Header from "@/components/layout/Header";
import { SpeedInsights } from "@vercel/speed-insights/next"

const iBMPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500"],
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gymnation",
  description: "THE GYM EVERYONE’S TALKING ABOUT",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  let headerData: HeaderData = {};
  let footerData: FooterData = {};
  const globalConfig = await fetchContent();

  footerData = {
    footerLink: globalConfig.properties.footerLink,
    footerNavigationSections: globalConfig.properties.footerNavigationSections,
    footerImage: globalConfig.properties.footerImage,
    footerLogo: globalConfig.properties.footerLogo,
    partnerText: globalConfig.properties.partnerText,
    copyrightText: globalConfig.properties.copyrightText,
    socialAccounts: globalConfig.properties.socialAccounts,
    socialMediaTitle: globalConfig.properties.socialMediaTitle,
    appStoreHoverImage: globalConfig.properties.appStoreHoverImage,
    appStoreImage: globalConfig.properties.appStoreImage,
    appStoreLink: globalConfig.properties.appStoreLink,
    appTitle: globalConfig.properties.appTitle,
    playStoreHoverImage: globalConfig.properties.playStoreHoverImage,
    playStoreImage: globalConfig.properties.playStoreImage,
    playStoreLink: globalConfig.properties.playStoreLink,
  }
  headerData = {
    logo: globalConfig.properties.logo,
    navigation: globalConfig.properties.navigation,
    socialAccounts: globalConfig.properties.socialAccounts,
    socialMediaTitle: globalConfig.properties.socialMediaTitle,
    appTitle: globalConfig.properties.appTitle,
    appStoreImage: globalConfig.properties.appStoreImage,
    playStoreImage: globalConfig.properties.playStoreImage,
    formTitle: globalConfig.properties.formTitle
  };

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${iBMPlexSans.variable} antialiased`}>
        <a href="#main" className="skip-link hidden">
          Skip to main content
        </a>
        <NextIntlClientProvider>
          <ReduxProvider>
            <Header data={headerData} />
            {children}
            <Footer data={footerData} />
          </ReduxProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
