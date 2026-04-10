import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cloudcompass.dev";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "CloudCompass — Master AWS, GCP & Azure",
    template: "%s — CloudCompass",
  },
  description:
    "Learn, compare, and practice AWS, GCP, and Azure. Structured paths for software engineers, cloud engineers, and DevOps professionals.",
  keywords: ["AWS", "GCP", "Azure", "cloud", "cloud computing", "DevOps", "learn cloud"],
  openGraph: {
    type: "website",
    siteName: "CloudCompass",
    title: "CloudCompass — Master AWS, GCP & Azure",
    description:
      "Learn, compare, and practice the three major cloud platforms. Built for engineers.",
    url: siteUrl,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CloudCompass" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CloudCompass — Master AWS, GCP & Azure",
    description: "Learn, compare, and practice AWS, GCP, and Azure.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body suppressHydrationWarning style={{ minHeight: "100%", display: "flex", flexDirection: "column", WebkitFontSmoothing: "antialiased" }}>{children}</body>
    </html>
  );
}
