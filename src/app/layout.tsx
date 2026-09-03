import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Suspense } from "react";
import { AppProvider } from "@/context/AppContext";
import { AppLayoutClient } from "@/components/AppLayoutClient";

const SITE_URL = "https://ashaal.com.bd";

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Ashaal.com.bd | Online Shopping in Bangladesh - Best Deals, Mobiles, Fashion & Groceries",
    template: "%s | Ashaal Bangladesh - Best Online Shopping Deals",
  },
  description:
    "Shop online at Ashaal.com.bd - Bangladesh's #1 trusted online shopping marketplace for smartphones, laptops, electronics, women's fashion, sarees, men's panjabis, beauty & groceries. Enjoy 100% authentic brands on AshaalMall, instant bKash & Nagad cashback, Cash on Delivery across all 64 districts, 14 days free returns, and 24-hour DEX express delivery. আশাল বাংলাদেশ - কম দামে সেরা অনলাইন শপিং।",
  keywords: [
    // Core Brand & Marketplace
    "Ashaal",
    "Ashaal BD",
    "Ashaal.com.bd",
    "আশাল",
    "আশাল বাংলাদেশ",
    "AshaalMall",
    "Ashaal Mart",
    "Ashaal Express",
    "Daraz alternative bangladesh",
    "online shopping bangladesh",
    "best online shop in bd",
    "ecommerce bangladesh",
    "buy online bd",

    // Mobiles, Laptops & Electronics
    "smartphones in bangladesh",
    "mobile price in bangladesh",
    "xiaomi mobile price in bd",
    "samsung mobile bd",
    "iphone price in bangladesh",
    "realme phone bd",
    "infinix mobile bd",
    "laptops in bangladesh",
    "gaming laptop price bd",
    "hp dell lenovo laptop bd",
    "smartwatches bd",
    "tws earbuds bangladesh",
    "bluetooth headphones",
    "computer accessories bd",
    "dslr camera bangladesh",
    "tv price in bangladesh",
    "smart tv bd",
    "home appliances bd",
    "refrigerators",
    "air conditioner ac price bd",

    // Fashion & Lifestyle
    "fashion online shopping bd",
    "womens saree collection",
    "jamdani saree online",
    "eid panjabi collection bd",
    "mens clothing bangladesh",
    "kurtis for women",
    "mens sneakers",
    "leather shoes bd",
    "cosmetics online bd",
    "original perfumes bangladesh",
    "skincare products bd",

    // Groceries & Daily Needs
    "online grocery dhaka",
    "daily bazar delivery",
    "fresh food shopping bd",
    "cooking oil rice essentials",

    // Shopping Perks & Services
    "cash on delivery bangladesh",
    "free delivery online shop",
    "bkash discount offer",
    "nagad cashback",
    "emi facility online shopping bd",
    "official brand warranty",
    "14 days free return",
    "fast home delivery dhaka",
    "online shopping chittagong",
    "online shopping sylhet",
    "online shopping rajshahi",
    "online shopping khulna",
  ],
  authors: [{ name: "Ashaal Bangladesh", url: SITE_URL }],
  creator: "Ashaal Limited",
  publisher: "Ashaal Bangladesh",
  applicationName: "Ashaal",
  category: "Shopping & E-Commerce",
  classification: "Online Marketplace & Shopping",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": `${SITE_URL}/`,
      "bn-BD": `${SITE_URL}/`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["bn_BD"],
    url: SITE_URL,
    siteName: "Ashaal Bangladesh",
    title:
      "Ashaal.com.bd | Online Shopping in Bangladesh - Best Deals & Fast Delivery",
    description:
      "Shop online at Ashaal for smartphones, electronics, fashion, beauty, appliances & daily groceries. Cash on Delivery nationwide, instant bKash cashback, and 100% authentic AshaalMall brands.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "Ashaal Bangladesh Online Shopping Mega Sale",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ashaalbd",
    creator: "@ashaalbd",
    title: "Ashaal.com.bd | Online Shopping in Bangladesh",
    description:
      "Shop smartphones, electronics, fashion & groceries on Ashaal. Fastest delivery across Bangladesh, Cash on Delivery, & bKash discount!",
    images: [
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=630&q=80",
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-token",
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },
  other: {
    "geo.region": "BD",
    "geo.placename": "Dhaka, Bangladesh",
    "revisit-after": "1 days",
    rating: "general",
    "format-detection": "telephone=no",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Ashaal.com.bd",
      alternateName: [
        "Ashaal",
        "আশাল",
        "Ashaal Bangladesh",
        "Ashaal Online Shopping",
        "Ashaal Mall",
      ],
      description:
        "Bangladesh's leading online shopping marketplace for smartphones, laptops, fashion, groceries & home appliances with Cash on Delivery nationwide.",
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Ashaal Bangladesh",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
        caption: "Ashaal Bangladesh Logo",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+880-16492",
        contactType: "customer service",
        areaServed: "BD",
        availableLanguage: ["English", "Bengali"],
      },
      sameAs: [
        "https://facebook.com/ashaalbd",
        "https://instagram.com/ashaalbd",
        "https://youtube.com/@ashaalbd",
        "https://twitter.com/ashaalbd",
      ],
    },
    {
      "@type": "OnlineStore",
      "@id": `${SITE_URL}/#store`,
      name: "Ashaal Online Store",
      url: SITE_URL,
      priceRange: "৳50 - ৳500,000",
      currenciesAccepted: "BDT",
      paymentAccepted:
        "Cash, Credit Card, bKash, Nagad, Rocket, Cash on Delivery",
      areaServed: {
        "@type": "Country",
        name: "Bangladesh",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased font-sans">
        <Suspense fallback={<div className="min-h-screen bg-[#eff0f5]" />}>
          <AppProvider>
            <AppLayoutClient>{children}</AppLayoutClient>
          </AppProvider>
        </Suspense>
      </body>
    </html>
  );
}
