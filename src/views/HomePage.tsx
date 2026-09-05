"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { PROMO_CHANNELS } from "../data/bannersData";
import { CATEGORIES_DATA } from "../data/categoriesData";

import { ProductCard } from "../components/ProductCard";
import { SEO } from "../components/SEO";
import {
  Zap,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Flame,
  Truck,
  Sparkles,
  ShoppingBag,
  Coins,
  TicketPercent,
  Globe,
  Tag,
  Store,
  Clock,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  LayoutGrid,
  Columns,
} from "lucide-react";

export const HomePage: React.FC = () => {
  const {
    language,
    navigate,
    vouchers,
    claimVoucher,
    t,
    products: dynamicProducts,
    banners: dynamicBanners,
  } = useApp();

  const productsList = dynamicProducts || [];
  const bannersList = dynamicBanners || [];

  // Carousel slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Touch swipe support for mobile hero slider
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 45;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const totalBanners = bannersList.length || 1;
    if (distance > minSwipeDistance) {
      setCurrentSlide((prev) => (prev + 1) % totalBanners);
    } else if (distance < -minSwipeDistance) {
      setCurrentSlide((prev) => (prev === 0 ? totalBanners - 1 : prev - 1));
    }
  };

  useEffect(() => {
    if (bannersList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannersList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [bannersList.length]);

  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Flash sale mobile view mode: 'shelf' (horizontal swipe) | 'grid' (2-column grid)
  const [flashSaleMode, setFlashSaleMode] = useState<"shelf" | "grid">("shelf");

  // Tab filter & sorting for "Just For You"
  const [justForYouTab, setJustForYouTab] = useState<
    "all" | "electronics" | "fashion" | "beauty" | "groceries"
  >("all");
  const [sortBy, setSortBy] = useState<
    "popular" | "price-low" | "price-high" | "rating"
  >("popular");
  const [visibleCount, setVisibleCount] = useState(8);

  // Daily coin check-in state
  const [claimedDailyCoins, setClaimedDailyCoins] = useState(false);
  const [showCoinSuccess, setShowCoinSuccess] = useState(false);

  // Floating Back-to-Top state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        setShowScrollTop(window.scrollY > 320);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleClaimDailyCoins = () => {
    setClaimedDailyCoins(true);
    setShowCoinSuccess(true);
    setTimeout(() => setShowCoinSuccess(false), 3500);
  };

  const flashSaleProducts = productsList.filter((p) => p.isFlashSale);
  const darazMallProducts = productsList.filter((p) => p.isDarazMall);

  const filteredJustForYou = productsList.filter((p) => {
    if (justForYouTab === "electronics")
      return p.categorySlug.includes("electronic");
    if (justForYouTab === "fashion") return p.categorySlug.includes("fashion");
    if (justForYouTab === "beauty") return p.categorySlug.includes("beauty");
    if (justForYouTab === "groceries")
      return p.categorySlug.includes("groceries");
    return true;
  });

  const sortedJustForYou = [...filteredJustForYou].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "rating") return b.rating - a.rating;
    return b.soldCount - a.soldCount; // 'popular'
  });

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case "ShieldCheck":
        return <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case "Zap":
        return <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-white" />;
      case "Truck":
        return <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case "Coins":
        return <Coins className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case "TicketPercent":
        return <TicketPercent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case "Globe":
        return <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case "Tag":
        return <Tag className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      case "Store":
        return <Store className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
      default:
        return <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />;
    }
  };

  const getChannelGradient = (id: string) => {
    switch (id) {
      case "ch-1":
        return "bg-gradient-to-br from-orange-500 to-red-600";
      case "ch-2":
        return "bg-gradient-to-br from-amber-500 to-orange-500";
      case "ch-3":
        return "bg-gradient-to-br from-emerald-500 to-teal-600";
      case "ch-4":
        return "bg-gradient-to-br from-yellow-400 to-amber-500";
      case "ch-5":
        return "bg-gradient-to-br from-purple-500 to-indigo-600";
      case "ch-6":
        return "bg-gradient-to-br from-blue-500 to-cyan-600";
      case "ch-7":
        return "bg-gradient-to-br from-pink-500 to-rose-600";
      case "ch-8":
        return "bg-gradient-to-br from-orange-600 to-amber-600";
      default:
        return "bg-gradient-to-br from-emerald-500 to-green-600";
    }
  };

  const trendingSearches = [
    { label: t("Smartphones", "স্মার্টফোন"), q: "phone" },
    { label: t("TWS Earbuds", "ইয়ারবাডস"), q: "earbuds" },
    { label: t("Smartwatches", "স্মার্টওয়াচ"), q: "smartwatch" },
    { label: t("Men's Panjabi", "পাঞ্জাবি"), q: "panjabi" },
    { label: t("Sharee & Fabrics", "শাড়ি"), q: "saree" },
    { label: t("Fast Power Bank", "পাওয়ার ব্যাংক"), q: "power bank" },
    { label: t("Skin Face Wash", "ফেস ওয়াশ"), q: "face wash" },
    { label: t("Dry Fruits & Honey", "ড্রাই ফ্রুটস"), q: "dry fruits" },
  ];

  const topBrands = [
    {
      name: "Samsung",
      logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=120&q=80",
      badge: t("Official Flagship", "অফিশিয়াল স্টোর"),
      query: "samsung",
    },
    {
      name: "Xiaomi",
      logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=120&q=80",
      badge: t("Direct Brand", "ব্র্যান্ড আউটলেট"),
      query: "xiaomi",
    },
    {
      name: "Realme",
      logo: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=80",
      badge: t("Official Store", "অথরাইজড স্টোর"),
      query: "realme",
    },
    {
      name: "Unilever",
      logo: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=120&q=80",
      badge: t("Certified Care", "১০০% আসল প্রসাধন"),
      query: "unilever",
    },
    {
      name: "Bata BD",
      logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=120&q=80",
      badge: t("Footwear Flagship", "জুতো ও ফুটওয়্যার"),
      query: "bata",
    },
    {
      name: "Apex",
      logo: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&q=80",
      badge: t("Authentic Leather", "লেদার ও সুজ"),
      query: "apex",
    },
  ];

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-8 sm:pb-12">
      <SEO
        title={t(
          "Online Shopping in Bangladesh | Flash Deals, Free Shipping & AshaalMall",
          "অনলাইন শপিং বাংলাদেশ | ফ্ল্যাশ ডিল ও ফ্রি শিপিং",
        )}
        description={t(
          "Shop online at Ashaal.com.bd for electronics, fashion, beauty, groceries & home appliances with Cash on Delivery, bKash & Nagad payments and fast nationwide delivery.",
          "আশাল ডট কম ডট বিডি থেকে ইলেকট্রনিক্স, ফ্যাশন, প্রসাধনী ও গৃহস্থালির পণ্য কিনুন ক্যাশ অন ডেলিভারি এবং দ্রুততম হোম ডেলিভারিতে।",
        )}
      />

      {/* 1. Hero Carousel & Promo Column */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6 pt-2 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Main Banner Slider with Touch Swipe */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="lg:col-span-9 relative rounded-xl sm:rounded-2xl overflow-hidden shadow-sm h-[175px] sm:h-[280px] md:h-[350px] lg:h-[380px] group bg-gray-900 select-none"
          >
            {bannersList.map((banner, index) => (
              <div
                key={banner.id}
                onClick={() => {
                  if (banner.linkType === "flash-sale") navigate("flash-sale");
                  else if (banner.linkType === "daraz-mall")
                    navigate("daraz-mall");
                  else if (banner.linkType === "category" && banner.targetId) {
                    navigate("search", { categorySlug: banner.targetId });
                  }
                }}
                className={`absolute inset-0 transition-opacity duration-500 cursor-pointer ${
                  index === currentSlide
                    ? "opacity-100 z-10"
                    : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex flex-col justify-end p-3.5 sm:p-7">
                  {banner.badge && (
                    <span className="inline-block w-fit bg-[#16a34a] text-white text-[9.5px] sm:text-[11px] font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full uppercase tracking-wider mb-1.5 shadow-sm">
                      {banner.badge}
                    </span>
                  )}
                  <h2 className="text-white text-sm sm:text-2xl md:text-3xl font-black max-w-xl leading-tight drop-shadow-md line-clamp-1 sm:line-clamp-2">
                    {banner.title}
                  </h2>
                  <p className="text-gray-200 text-[11px] sm:text-sm mt-0.5 sm:mt-1 max-w-lg drop-shadow line-clamp-1 sm:line-clamp-none">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Slider Desktop Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) =>
                  prev === 0 ? bannersList.length - 1 : prev - 1,
                );
              }}
              className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) =>
                  prev === bannersList.length - 1 ? 0 : prev + 1,
                );
              }}
              className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
              {bannersList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentSlide
                      ? "w-5 sm:w-6 bg-[#16a34a]"
                      : "w-1.5 sm:w-2 bg-white/70"
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Desktop Right Side Promotion Column */}
          <div className="hidden lg:flex lg:col-span-3 flex-col justify-between gap-3">
            {/* Voucher Collection Quick Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-[#15803d] text-white p-4 rounded-xl shadow-xs relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    {t("Special Offer", "বিশেষ অফার")}
                  </span>
                  <TicketPercent className="w-5 h-5 text-emerald-200" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight mt-2">
                  {t(
                    "Get ৳100 OFF First Order!",
                    "প্রথম অর্ডারে ১০০ টাকা ছাড়!",
                  )}
                </h3>
                <p className="text-[11px] text-emerald-100 mt-1">
                  {t(
                    "Use code: ASHAALBD100 on checkout",
                    "কুপন কোড: ASHAALBD100 ব্যবহার করুন",
                  )}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/20 relative z-10">
                <button
                  onClick={() => claimVoucher("v-1")}
                  className="w-full bg-white hover:bg-emerald-50 text-[#16a34a] font-bold py-2 rounded-lg text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <TicketPercent className="w-3.5 h-3.5" />
                  <span>
                    {vouchers.find((v) => v.id === "v-1")?.isClaimed
                      ? t("Collected ✓", "সংগ্রহ করা হয়েছে ✓")
                      : t("Collect Voucher", "ভাউচার সংগ্রহ করুন")}
                  </span>
                </button>
              </div>
            </div>

            {/* App Promotion Box */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-2xs flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-[#16a34a] rounded-lg flex items-center justify-center font-black text-xl shrink-0">
                a
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xs text-gray-900 leading-tight">
                  {t("Try Ashaal App", "আশাল অ্যাপ ব্যবহার করুন")}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {t(
                    "Faster checkout & exclusive flash deals",
                    "দ্রুত কেনাকাটা ও এক্সক্লুসিভ অফার",
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-Only Voucher Strip (Clean, Compact, 1-Tap) */}
        <div className="lg:hidden mt-2 bg-gradient-to-r from-emerald-600 via-[#15803d] to-emerald-700 text-white p-2.5 rounded-xl shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <TicketPercent className="w-4 h-4 text-emerald-100" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight truncate">
                {t(
                  "৳100 OFF First Order! Code: ASHAALBD100",
                  "প্রথম অর্ডারে ১০০ টাকা ছাড়! কোড: ASHAALBD100",
                )}
              </p>
              <p className="text-[10px] text-emerald-100 leading-tight">
                {t("Min. spend ৳500 on checkout", "ন্যূনতম ৫০০ টাকার অর্ডারে")}
              </p>
            </div>
          </div>
          <button
            onClick={() => claimVoucher("v-1")}
            className="bg-white text-[#16a34a] font-bold text-[10px] px-2.5 py-1.5 rounded-lg shrink-0 active:scale-95 shadow-xs cursor-pointer"
          >
            {vouchers.find((v) => v.id === "v-1")?.isClaimed
              ? t("Claimed ✓", "সংগৃহীত ✓")
              : t("Collect", "সংগ্রহ")}
          </button>
        </div>
      </section>

      {/* 1.5 Trending Searches Shelf (Horizontal Swipeable Chips) */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-xs">
          <div className="flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full shrink-0 border border-amber-200/70 shadow-2xs">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>{t("Trending", "জনপ্রিয়")}:</span>
          </div>
          {trendingSearches.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate("search", { searchQuery: item.q })}
              className="bg-white hover:bg-emerald-50 text-gray-700 hover:text-[#16a34a] border border-gray-200/80 hover:border-[#16a34a] px-3 py-1 rounded-full whitespace-nowrap text-[11px] sm:text-xs font-medium transition-all shadow-2xs active:scale-95 cursor-pointer shrink-0"
            >
              {item.label}
            </button>
          ))}
        </div>
      </section>

      {/* 2. Promo Channels Navigation (Mobile 4-col App Shortcuts, Desktop 8-col) */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xs border border-gray-200/80 p-3 sm:p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-4">
            {PROMO_CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  if (ch.page === "search" && ch.filter) {
                    navigate("search", { filter: ch.filter });
                  } else {
                    navigate(ch.page);
                  }
                }}
                className="flex flex-col items-center text-center p-1 sm:p-1.5 rounded-xl active:scale-95 transition-transform group cursor-pointer"
              >
                <div
                  className={`w-11 h-11 sm:w-13 sm:h-13 rounded-2xl ${getChannelGradient(ch.id)} flex items-center justify-center shadow-2xs mb-1.5 group-hover:scale-105 transition-transform`}
                >
                  {getChannelIcon(ch.icon)}
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#212121] group-hover:text-[#16a34a] transition-colors leading-tight line-clamp-1">
                  {language === "BN" ? ch.titleBn : ch.title}
                </span>
                <span className="text-[9.5px] text-gray-400 font-medium hidden sm:block mt-0.5">
                  {ch.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2.5 Daily Coins Reward Strip & Value Proposition Badges */}
      <section className="hidden sm:block max-w-7xl mx-auto px-2.5 sm:px-6 space-y-2.5">
        {/* Daily Reward Notification */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-amber-950 p-2 sm:p-2.5 rounded-xl shadow-2xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/40 flex items-center justify-center shrink-0">
              <Coins className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-900" />
            </div>
            <p className="text-[11px] sm:text-xs font-bold leading-tight truncate">
              {showCoinSuccess
                ? t(
                    "🎉 +10 Ashaal Coins Claimed Successfully!",
                    "🎉 ১০ আশাল কয়েন সফলভাবে জমা হয়েছে!",
                  )
                : t(
                    "Daily Reward: Tap to claim your 10 Free Coins today!",
                    "ডেইলি রিওয়ার্ড: আজকের ১০ আশাল কয়েন পেতে ক্লেম করুন!",
                  )}
            </p>
          </div>
          <button
            onClick={handleClaimDailyCoins}
            disabled={claimedDailyCoins}
            className={`px-3 py-1 rounded-lg text-[10px] sm:text-xs font-black shrink-0 transition-all shadow-xs ${
              claimedDailyCoins
                ? "bg-amber-900/20 text-amber-950 cursor-default"
                : "bg-amber-900 text-white hover:bg-amber-950 active:scale-95 cursor-pointer"
            }`}
          >
            {claimedDailyCoins
              ? t("Claimed ✓", "সংগৃহীত ✓")
              : t("Claim Now", "ক্লেম")}
          </button>
        </div>

        {/* Value Proposition Badges (Mobile 2x2 Grid, Desktop 4-col) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-[#dcfce7]/80 p-2 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 border border-[#bbf7d0]">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
              1
            </span>
            <div className="min-w-0">
              <h4 className="font-bold text-[11px] sm:text-xs text-[#212121] truncate">
                {t("Free Shipping on ৳500+", "৳৫০০+ অর্ডারে ফ্রি শিপিং")}
              </h4>
              <p className="text-[9.5px] sm:text-[10px] text-gray-600 truncate">
                {t("Fast door delivery", "সারা দেশে হোম ডেলিভারি")}
              </p>
            </div>
          </div>
          <div className="bg-[#e1f5fe]/80 p-2 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 border border-[#b3e5fc]">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#039be5] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
              2
            </span>
            <div className="min-w-0">
              <h4 className="font-bold text-[11px] sm:text-xs text-[#212121] truncate">
                {t("Safe & Secure Payments", "নিরাপদ পেমেন্ট")}
              </h4>
              <p className="text-[9.5px] sm:text-[10px] text-gray-600 truncate">
                {t("bKash, Nagad, Cards", "বিকাশ, নগদ, কার্ড")}
              </p>
            </div>
          </div>
          <div className="bg-[#f1f8e9]/80 p-2 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 border border-[#dcedc8]">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#7cb342] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
              3
            </span>
            <div className="min-w-0">
              <h4 className="font-bold text-[11px] sm:text-xs text-[#212121] truncate">
                {t("Cash on Delivery", "ক্যাশ অন ডেলিভারি")}
              </h4>
              <p className="text-[9.5px] sm:text-[10px] text-gray-600 truncate">
                {t("Pay upon receiving", "পণ্য পেয়ে মূল্য পরিশোধ")}
              </p>
            </div>
          </div>
          <div className="bg-[#fff3e0]/80 p-2 sm:p-3 rounded-lg flex items-center gap-2 sm:gap-3 border border-[#ffe0b2]">
            <span className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#fb8c00] text-white flex items-center justify-center font-bold text-[10px] sm:text-xs shrink-0">
              4
            </span>
            <div className="min-w-0">
              <h4 className="font-bold text-[11px] sm:text-xs text-[#212121] truncate">
                {t("14 Days Easy Return", "১৪ দিনের সহজ রিটার্ন")}
              </h4>
              <p className="text-[9.5px] sm:text-[10px] text-gray-600 truncate">
                {t("100% money back guarantee", "সহজ রিফান্ড ও রিটার্ন")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Flash Sale Section with Shelf/Grid Mode Toggle on Mobile */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xs border border-gray-200/80 overflow-hidden">
          {/* Flash Sale Header Bar */}
          <div className="p-2.5 sm:p-4 border-b border-gray-200/80 flex items-center justify-between gap-2 bg-white">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[#16a34a] text-base sm:text-lg animate-pulse">
                  ⚡
                </span>
                <h2 className="text-xs sm:text-lg font-bold text-[#212121] tracking-tight whitespace-nowrap">
                  {t("Flash Sale", "ফ্ল্যাশ সেল")}
                </h2>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-semibold text-[#212121]">
                <div className="flex items-center gap-0.5 sm:gap-1 font-mono">
                  <span className="bg-[#16a34a] text-white px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span className="text-[#16a34a] font-bold">:</span>
                  <span className="bg-[#16a34a] text-white px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span className="text-[#16a34a] font-bold">:</span>
                  <span className="bg-[#16a34a] text-white px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {/* Mobile View Mode Switcher (Shelf vs Grid) */}
              <div className="sm:hidden flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
                <button
                  onClick={() => setFlashSaleMode("shelf")}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    flashSaleMode === "shelf"
                      ? "bg-white text-[#16a34a] shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  title="Horizontal Shelf"
                >
                  <Columns className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setFlashSaleMode("grid")}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                    flashSaleMode === "grid"
                      ? "bg-white text-[#16a34a] shadow-xs"
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                  title="2-Column Grid"
                >
                  <LayoutGrid className="w-3 h-3" />
                </button>
              </div>

              <button
                onClick={() => navigate("flash-sale")}
                className="text-[#16a34a] hover:text-white border border-[#16a34a] hover:bg-[#16a34a] font-semibold px-2.5 sm:px-4 py-1 rounded-lg text-[11px] sm:text-sm transition-colors shrink-0 flex items-center gap-0.5 active:scale-95"
              >
                <span>{t("See All", "সব দেখুন")}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Flash Sale Products (Shelf Swiper on Mobile when in 'shelf' mode, Grid otherwise) */}
          <div className="p-2 sm:p-4">
            {flashSaleMode === "shelf" ? (
              <div className="flex overflow-x-auto gap-2 sm:gap-3 pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 sm:overflow-visible">
                {flashSaleProducts.slice(0, 6).map((product) => (
                  <div
                    key={product.id}
                    className="w-[145px] sm:w-auto shrink-0 snap-start"
                  >
                    <ProductCard product={product} variant="flash" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                {flashSaleProducts.slice(0, 6).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="flash"
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3.5 Mid-Page Campaign / Mega Savings Banner */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div
          onClick={() => navigate("flash-sale")}
          className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-emerald-800 via-green-700 to-teal-800 text-white p-3.5 sm:p-5 shadow-xs cursor-pointer group active:scale-98 transition-all"
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/30 text-amber-300">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-gray-900 font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {t("Mega Weekend Deals", "মেগা উইকেন্ড অফার")}
                  </span>
                  <span className="text-white/80 text-[11px] hidden sm:inline">
                    •
                  </span>
                  <span className="text-emerald-100 text-[11px] hidden sm:inline">
                    {t("Limited Time Offer", "সীমিত সময়ের অফার")}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs sm:text-lg text-white leading-tight mt-0.5">
                  {t(
                    "Up to 70% Discount on 10,000+ Verified Products",
                    "১০,০০০+ ভেরিফাইড পণ্যে সর্বোচ্চ ৭০% পর্যন্ত অবিশ্বাস্য ছাড়!",
                  )}
                </h3>
                <p className="text-[10px] sm:text-xs text-emerald-100 mt-0.5">
                  {t(
                    "Free Nationwide Home Delivery on Orders over ৳499 with bKash Cashback",
                    "৳৪৯৯+ অর্ডারে ফ্রি ডেলিভারি ও বিকাশে ইনস্ট্যান্ট ক্যাশব্যাক সুবিধা",
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <span className="bg-white text-[#16a34a] font-bold text-xs px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-xs group-hover:bg-emerald-50 transition-colors flex items-center gap-1.5">
                <span>{t("Explore Deals", "অফার দেখুন")}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. AshaalMall Flagship Brands & Official Stores */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xs border border-gray-200/80 p-3 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-gray-200/80">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#0f136d] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm sm:text-xl font-bold text-[#0f136d] tracking-tight leading-tight">
                  AshaalMall
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                  {t(
                    "100% Authentic Brands | 14 Days Return",
                    "১০০% আসল ব্র্যান্ড পণ্য | ১৪ দিনের সহজ রিটার্ন",
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("daraz-mall")}
              className="text-[#0f136d] hover:text-[#16a34a] font-bold text-[11px] sm:text-xs flex items-center gap-0.5 shrink-0 active:scale-95"
            >
              <span>{t("View All", "সকল ব্র্যান্ড")}</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Official Brand Partners Quick Shelf */}
          <div className="mb-4">
            <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {topBrands.map((brand, idx) => (
                <div
                  key={idx}
                  onClick={() =>
                    navigate("search", { searchQuery: brand.query })
                  }
                  className="bg-gray-50 hover:bg-white rounded-xl border border-gray-200/80 p-2 shrink-0 w-24 sm:w-32 flex flex-col items-center text-center cursor-pointer hover:border-[#0f136d] hover:shadow-xs transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white flex items-center justify-center overflow-hidden mb-1 border border-gray-100 shadow-2xs">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  </div>
                  <span className="font-bold text-[11px] sm:text-xs text-gray-900 leading-tight truncate w-full">
                    {brand.name}
                  </span>
                  <span className="text-[8.5px] sm:text-[9.5px] text-[#0f136d] font-semibold bg-blue-50 px-1 py-0.2 rounded-full mt-0.5 truncate max-w-full">
                    {brand.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AshaalMall Products Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
            {darazMallProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Categories Visual Showcase */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xs border border-gray-200/80 p-3 sm:p-5">
          <div className="flex items-center justify-between mb-3 sm:mb-4 pb-2 border-b border-gray-200/80">
            <h2 className="text-sm sm:text-lg font-bold text-[#212121]">
              {t("Categories", "ক্যাটেগরি সমূহ")}
            </h2>
            <button
              onClick={() => navigate("search")}
              className="text-gray-500 hover:text-[#16a34a] font-semibold text-[11px] sm:text-xs flex items-center gap-0.5"
            >
              <span>{t("Explore All", "সবগুলো")}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3.5">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate("search", { categorySlug: cat.slug })}
                className="group flex flex-col items-center text-center p-1.5 sm:p-2 rounded-xl hover:shadow-2xs transition-all border border-transparent hover:border-gray-200 bg-[#eff0f5]/40 hover:bg-white active:scale-95 cursor-pointer"
              >
                <div className="w-13 h-13 sm:w-18 sm:h-18 rounded-full overflow-hidden mb-1.5 sm:mb-2 relative bg-white border border-gray-200/80 shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#212121] group-hover:text-[#16a34a] transition-colors line-clamp-2 leading-tight">
                  {language === "BN" ? cat.nameBn : cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Just For You Recommended Product Feed with Interactive Sorting */}
      <section className="max-w-7xl mx-auto px-2.5 sm:px-6">
        <div className="space-y-2.5 sm:space-y-3 mb-3 sm:mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#16a34a] fill-[#16a34a]" />
              <h2 className="text-base sm:text-xl font-bold text-[#212121] tracking-tight">
                {t("Just For You", "শুধুমাত্র আপনার জন্য")}
              </h2>
            </div>
            <span className="text-[11px] text-gray-500 font-medium">
              {sortedJustForYou.length} {t("Items", "টি পণ্য")}
            </span>
          </div>

          {/* Feed Filter Tabs with Horizontal Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {[
              { id: "all", labelEn: "All Items", labelBn: "সবগুলো" },
              {
                id: "electronics",
                labelEn: "Electronics",
                labelBn: "ইলেকট্রনিক্স",
              },
              { id: "fashion", labelEn: "Fashion", labelBn: "ফ্যাশন" },
              { id: "beauty", labelEn: "Beauty", labelBn: "রূপচর্চা" },
              { id: "groceries", labelEn: "Groceries", labelBn: "মুদি বাজার" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setJustForYouTab(tab.id as any);
                  setVisibleCount(8);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  justForYouTab === tab.id
                    ? "bg-[#16a34a] text-white shadow-xs scale-102"
                    : "bg-white text-[#212121] hover:bg-[#eff0f5] border border-gray-200"
                }`}
              >
                {language === "BN" ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>

          {/* Quick Sort Options Shelf */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-gray-400 font-medium shrink-0 flex items-center gap-0.5 mr-1">
              <SlidersHorizontal className="w-3 h-3" />
              {t("Sort", "বাছাই")}:
            </span>
            {[
              { id: "popular", label: t("Popular", "জনপ্রিয়") },
              { id: "price-low", label: t("Price: Low to High", "কম দাম") },
              { id: "price-high", label: t("Price: High to Low", "বেশি দাম") },
              { id: "rating", label: t("Top Rated", "সেরা রেটিং") },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSortBy(s.id as any)}
                className={`px-2.5 py-0.5 rounded-md font-medium whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  sortBy === s.id
                    ? "bg-gray-800 text-white font-bold"
                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-2 sm:gap-3">
          {sortedJustForYou.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < sortedJustForYou.length && (
          <div className="text-center mt-6 sm:mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="w-full sm:w-auto bg-white hover:bg-[#eff0f5] text-[#16a34a] border border-[#16a34a] font-bold px-8 sm:px-12 py-2.5 rounded-full text-xs sm:text-sm transition-all shadow-2xs active:scale-95 cursor-pointer"
            >
              {t("LOAD MORE PRODUCTS", "আরো পণ্য দেখুন")}
            </button>
          </div>
        )}
      </section>

      {/* Floating Scroll-to-Top Button (Mobile App Navigation Polish) */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-20 right-3.5 md:bottom-8 md:right-8 z-30 bg-[#16a34a] hover:bg-[#15803d] text-white p-2.5 sm:p-3 rounded-full shadow-lg border border-white/30 transition-all duration-300 animate-bounce active:scale-95 cursor-pointer flex items-center justify-center"
          aria-label="Scroll to top"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5 stroke-[2.5]" />
        </button>
      )}
    </div>
  );
};
