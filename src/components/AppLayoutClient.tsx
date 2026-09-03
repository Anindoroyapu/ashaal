"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { LoginModal, LocationModal } from "./Modals";

const ScrollToTop: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [pathname, searchParams]);

  return null;
};

export const AppLayoutClient: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const isManageRoute = pathname?.startsWith("/manage");

  if (isManageRoute) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
        <ScrollToTop />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#eff0f5] text-[#212121] font-sans selection:bg-[#16a34a] selection:text-white">
      <ScrollToTop />
      <Header />
      <main className="flex-1 w-full">{children}</main>
      <Footer />
      <LoginModal />
      <LocationModal />
    </div>
  );
};
