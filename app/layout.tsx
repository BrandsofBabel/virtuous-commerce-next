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
  title: {
    default:
      "Virtuous Commerce — Grow Amazon profit without agency bloat",
    template: "%s — Virtuous Commerce",
  },
  description:
    "The next-gen operating system for brands on Amazon. Virtuous Commerce increases sales, protects margin, and reduces management drag by operating advertising, catalog, content, inventory, marketplace intelligence, and P&L as one connected system.",
  keywords: [
    "Amazon operating system",
    "Amazon profit",
    "Amazon agency alternative",
    "contribution margin",
    "Amazon advertising",
    "marketplace intelligence",
    "profit leak audit",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Virtuous Commerce — Grow Amazon profit without agency bloat",
    description:
      "Operate advertising, catalog, content, inventory, marketplace intelligence, and P&L as one connected system. Request a free Profit Leak Audit.",
    siteName: "Virtuous Commerce",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtuous Commerce — Grow Amazon profit without agency bloat",
    description:
      "The next-gen operating system for brands on Amazon. Sales, margin, and execution in one connected model.",
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
