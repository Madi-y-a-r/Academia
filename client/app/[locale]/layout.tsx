import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { Suspense } from "react";
import Providers from "./providers";
import { getLocale, getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import  { ruRU, enUS } from "@clerk/localizations"
import { kk } from "@/i18n/kk";

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans"
});

export const metadata: Metadata = {
  title: "STUDYT",
  description: "Platform for learning everything!"
};

const getClerkLocalization = (locale: string) => {
  switch (locale) {
    case "ru":
      return ruRU;
    case "kk":
      return kk;
    case "en":
      return enUS; 
    default:
      return undefined; 
  }
};



export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  if (!routing.locales.includes(locale as "en" | "ru")) {
    notFound();
  }
  const messages = await getMessages({ locale: locale}); 
  return (
    <ClerkProvider localization={getClerkLocalization(locale)}>
      <html lang={locale}>
        <body className={`${dmSans.className}`}>
          <Providers messages={messages} locale={locale}>
            <Suspense fallback={null}>
              <div className="root-layout">{children}</div>
            </Suspense>
            <Toaster richColors closeButton />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
