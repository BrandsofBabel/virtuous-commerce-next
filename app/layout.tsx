import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = "https://virtuouscommerce.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Virtuous Commerce — an Amazon agency",
  description:
    "We are an Amazon agency: we help customers find your brand, turn more of them into buyers, keep advertising profitable and inventory lean — until Amazon is your most predictable channel.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Virtuous Commerce — an Amazon agency",
    description:
      "Amazon, run properly: discovery, conversion, advertising, inventory, and a weekly channel P&L — until Amazon is your most predictable channel.",
    siteName: "Virtuous Commerce",
  },
  twitter: {
    card: "summary",
    title: "Virtuous Commerce — an Amazon agency",
    description:
      "Amazon, run properly — until it's your most predictable channel.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
