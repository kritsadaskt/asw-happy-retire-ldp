import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { site } from "@/content/site";
import { absoluteUrl, siteOrigin, withBasePath } from "@/lib/paths";

import { brandFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(withBasePath("/"), siteOrigin),
  title: site.seo.title,
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    siteName: `${site.brandName} ${site.campaignName}`,
    title: site.seo.title,
    description: site.seo.description,
    url: absoluteUrl("/"),
    images: [
      {
        url: absoluteUrl(site.seo.ogImage.src),
        width: site.seo.ogImage.width,
        height: site.seo.ogImage.height,
        alt: site.seo.ogImage.alt,
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.seo.title,
    description: site.seo.description,
    images: [absoluteUrl(site.seo.ogImage.src)],
  },
  icons: {
    icon: [
      {
        url: withBasePath("/favicon.ico"),
        type: "image/x-icon",
        sizes: "any",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#123F6D",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={brandFont.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
