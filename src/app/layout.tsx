import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CloudCompass — Master AWS, GCP & Azure",
  description:
    "Learn, compare, and practice the three major cloud platforms. Built for software engineers, cloud engineers, and DevOps professionals.",
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
