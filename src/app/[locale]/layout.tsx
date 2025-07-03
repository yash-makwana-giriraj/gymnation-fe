import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { IBM_Plex_Sans } from "next/font/google";
import { ReduxProvider } from "@/providers/ReduxProvider";
import "../../styles/globals.css";
import { Metadata } from 'next';

const iBMPlexSans = IBM_Plex_Sans({
  weight: ["300", "400", "500"],
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Gymnation',
  description: 'THE GYM EVERYONE’S TALKING ABOUT',
}

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

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body className={`${iBMPlexSans.variable} antialiased`}>
        <a href="#main" className="skip-link hidden">
          Skip to main content
        </a>
        <NextIntlClientProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}