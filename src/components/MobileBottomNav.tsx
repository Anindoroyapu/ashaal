"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { useApp } from "../context/AppContext";
import {
  Home,
  LayoutGrid,
  Flame,
  ShoppingCart,
  User,
  Sparkles,
} from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const pathname = usePathname();
  const {
    navigate,
    cartCount,
    user,
    isLoggedIn,
    setIsLoginModalOpen,
    setIsMobileCategoryDrawerOpen,
    t,
  } = useApp();

  // Hide bottom nav on Product Details and Checkout to let action bars breathe
  const isProductPage =
    pathname?.startsWith("/product/") ||
    pathname?.startsWith("/products/") ||
    pathname === "/product";
  const isCheckoutPage = pathname === "/checkout";

  if (isProductPage || isCheckoutPage) {
    return null;
  }

  const isHome = pathname === "/";
  const isDeals = pathname === "/flash-sale" || pathname === "/ashaalmall";
  const isCart = pathname === "/cart";
  const isAccount = pathname === "/my-account";

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] md:hidden pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5">
      <div className="grid grid-cols-5 items-center justify-around px-1 max-w-lg mx-auto">
        {/* 1. Home Tab */}
        <button
          onClick={() => navigate("home")}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 ${
            isHome ? "text-[#16a34a]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <div className="relative">
            <Home
              className={`w-5 h-5 transition-transform ${
                isHome ? "scale-110 stroke-[2.5]" : ""
              }`}
            />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#16a34a] rounded-full" />
            )}
          </div>
          <span
            className={`text-[10px] mt-1 font-semibold leading-tight ${
              isHome ? "font-bold text-[#16a34a]" : ""
            }`}
          >
            {t("Home", "হোম")}
          </span>
        </button>

        {/* 2. Categories Tab (Opens Mobile Category Drawer) */}
        <button
          onClick={() => setIsMobileCategoryDrawerOpen(true)}
          className="flex flex-col items-center justify-center py-1 transition-all cursor-pointer text-gray-500 hover:text-gray-900 active:scale-95"
        >
          <div className="relative">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-1 font-semibold leading-tight">
            {t("Categories", "ক্যাটাগরি")}
          </span>
        </button>

        {/* 3. Deals / Flash Sale Tab */}
        <button
          onClick={() => navigate("flash-sale")}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 relative ${
            isDeals ? "text-[#16a34a]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <div className="relative">
            <Flame
              className={`w-5 h-5 text-amber-500 fill-amber-500 transition-transform ${
                isDeals ? "scale-110" : ""
              }`}
            />
            {/* Pulsing Hot Badge */}
            <span className="absolute -top-1.5 -right-3 bg-red-500 text-white font-black text-[8px] px-1 py-0.2 rounded-full uppercase tracking-tighter animate-pulse">
              HOT
            </span>
          </div>
          <span
            className={`text-[10px] mt-1 font-semibold leading-tight ${
              isDeals ? "font-bold text-[#16a34a]" : ""
            }`}
          >
            {t("Deals", "ডিল")}
          </span>
        </button>

        {/* 4. Cart Tab */}
        <button
          onClick={() => navigate("cart")}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 relative ${
            isCart ? "text-[#16a34a]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <div className="relative">
            <ShoppingCart
              className={`w-5 h-5 transition-transform ${
                isCart ? "scale-110 stroke-[2.5]" : ""
              }`}
            />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-red-600 text-white font-extrabold text-[9px] min-w-[17px] h-[17px] rounded-full flex items-center justify-center px-1 shadow-xs border border-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
            {isCart && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#16a34a] rounded-full" />
            )}
          </div>
          <span
            className={`text-[10px] mt-1 font-semibold leading-tight ${
              isCart ? "font-bold text-[#16a34a]" : ""
            }`}
          >
            {t("Cart", "কার্ট")}
          </span>
        </button>

        {/* 5. Account / Profile Tab */}
        <button
          onClick={() => {
            if (isLoggedIn) {
              navigate("my-account");
            } else {
              setIsLoginModalOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 ${
            isAccount ? "text-[#16a34a]" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          <div className="relative">
            {isLoggedIn && user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className={`w-5 h-5 rounded-full object-cover border ${
                  isAccount
                    ? "border-[#16a34a] ring-1 ring-[#16a34a]"
                    : "border-gray-300"
                }`}
              />
            ) : (
              <User
                className={`w-5 h-5 transition-transform ${
                  isAccount ? "scale-110 stroke-[2.5]" : ""
                }`}
              />
            )}
            {isAccount && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#16a34a] rounded-full" />
            )}
          </div>
          <span
            className={`text-[10px] mt-1 font-semibold leading-tight ${
              isAccount ? "font-bold text-[#16a34a]" : ""
            }`}
          >
            {isLoggedIn ? t("Account", "অ্যাকাউন্ট") : t("Login", "লগইন")}
          </span>
        </button>
      </div>
    </nav>
  );
};
