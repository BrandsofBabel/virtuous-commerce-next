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
  alternates: { canonical: "/" },
  title: "Virtuous Commerce | Amazon Agency",
  description:
    "Virtuous Commerce is an Amazon agency: we get your brand found, turn shoppers into buyers, and keep ads profitable and inventory lean. Amazon, run properly.",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Virtuous Commerce | Amazon Agency",
    description:
      "Discovery, conversion, advertising, inventory, and a weekly channel P&L. Amazon, run properly.",
    siteName: "Virtuous Commerce",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtuous Commerce | Amazon Agency",
    description:
      "Amazon, run properly: until it's your most predictable channel.",
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
      <body className="min-h-full antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Virtuous Commerce",
              url: siteUrl,
              logo: `${siteUrl}/icon.svg`,
              email: "hello@virtuouscommerce.com",
              description:
                "Virtuous Commerce is an Amazon agency: discovery, conversion, advertising, inventory, and a weekly channel P&L.",
            }),
          }}
        />
      </body>
    </html>
  );
}
