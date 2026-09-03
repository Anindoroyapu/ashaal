import type { Metadata } from "next";
import "./globals.css";
import { Suspense } from "react";
import { AppProvider } from "@/context/AppContext";
import { AppLayoutClient } from "@/components/AppLayoutClient";

export const metadata: Metadata = {
  title:
    "Ashaal.com.bd | Online Shopping in Bangladesh - Best Deals & Fast Delivery",
  description:
    "Shop online at Ashaal.com.bd for electronics, fashion, beauty, home appliances & groceries with fast nationwide delivery, Cash on Delivery, bKash & Nagad payments, and 100% authentic AshaalMall brands.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
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
