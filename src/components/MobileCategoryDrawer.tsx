"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { CATEGORIES_DATA } from "../data/categoriesData";
import {
  X,
  Search,
  ChevronRight,
  Sparkles,
  Smartphone,
  Headphones,
  Shirt,
  Sparkle,
  Home as HomeIcon,
  ShoppingBag,
  Dumbbell,
  Baby,
  Car,
  Layers,
  ArrowRight,
} from "lucide-react";

export const MobileCategoryDrawer: React.FC = () => {
  const {
    isMobileCategoryDrawerOpen,
    setIsMobileCategoryDrawerOpen,
    navigate,
    language,
    t,
  } = useApp();

  const [selectedCatId, setSelectedCatId] = useState<string>(
    CATEGORIES_DATA[0]?.id || "cat-1",
  );
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCategory = useMemo(() => {
    return (
      CATEGORIES_DATA.find((c) => c.id === selectedCatId) || CATEGORIES_DATA[0]
    );
  }, [selectedCatId]);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return CATEGORIES_DATA;
    const q = searchQuery.toLowerCase().trim();
    return CATEGORIES_DATA.filter((cat) => {
      const matchName =
        cat.name.toLowerCase().includes(q) ||
        cat.nameBn.toLowerCase().includes(q);
      const matchSubs = cat.subCategories.some(
        (sub) =>
          sub.name.toLowerCase().includes(q) ||
          sub.nameBn.toLowerCase().includes(q) ||
          sub.items?.some((item) => item.toLowerCase().includes(q)),
      );
      return matchName || matchSubs;
    });
  }, [searchQuery]);

  if (!isMobileCategoryDrawerOpen) return null;

  const handleSelectSubCategory = (catSlug: string, subSlug?: string) => {
    setIsMobileCategoryDrawerOpen(false);
    navigate("search", { categorySlug: catSlug });
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case "Smartphone":
        return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case "Headphones":
        return <Headphones className="w-4 h-4 text-blue-600" />;
      case "Shirt":
        return <Shirt className="w-4 h-4 text-purple-600" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 text-pink-600" />;
      case "Home":
        return <HomeIcon className="w-4 h-4 text-amber-600" />;
      case "ShoppingBag":
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case "Dumbbell":
        return <Dumbbell className="w-4 h-4 text-orange-600" />;
      case "Baby":
        return <Baby className="w-4 h-4 text-cyan-600" />;
      case "Car":
        return <Car className="w-4 h-4 text-red-600" />;
      default:
        return <Layers className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end md:hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-t-3xl shadow-2xl flex flex-col h-[88vh] max-h-[88vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Drawer Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-emerald-600 to-[#16a34a] text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                {t("Explore Categories", "ক্যাটেগরি সমূহ")}
              </h3>
              <p className="text-[11px] text-green-100">
                {t(
                  "Browse all products & departments",
                  "সকল ক্যাটাগরি ও পণ্যের তালিকা",
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileCategoryDrawerOpen(false)}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Search inside Categories */}
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t(
                "Filter categories or products...",
                "ক্যাটাগরি খুঁজুন...",
              )}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded-full focus:outline-none focus:border-[#16a34a]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Drawer Body: Two-Pane App Navigation */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Pane: Categories List */}
          <div className="w-32 sm:w-36 bg-gray-50 border-r border-gray-200 overflow-y-auto divide-y divide-gray-100 select-none">
            {filteredCategories.map((cat) => {
              const isSelected = cat.id === selectedCategory?.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCatId(cat.id)}
                  className={`w-full p-2.5 text-left flex flex-col items-center gap-1.5 transition-colors relative ${
                    isSelected
                      ? "bg-white text-[#16a34a] font-bold border-l-4 border-[#16a34a] shadow-xs"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isSelected
                        ? "bg-green-100"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    {getCategoryIcon(cat.icon)}
                  </div>
                  <span className="text-[11px] text-center leading-tight line-clamp-2">
                    {language === "BN" ? cat.nameBn : cat.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Pane: Sub-categories Grid */}
          <div className="flex-1 bg-white overflow-y-auto p-4 space-y-4">
            {selectedCategory && (
              <div>
                {/* Active Category Header Banner */}
                <div
                  onClick={() => handleSelectSubCategory(selectedCategory.slug)}
                  className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-colors mb-4"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0 border border-emerald-100">
                      <img
                        src={selectedCategory.image}
                        alt={selectedCategory.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs sm:text-sm text-emerald-950">
                        {language === "BN"
                          ? selectedCategory.nameBn
                          : selectedCategory.name}
                      </h4>
                      <p className="text-[10px] text-emerald-700">
                        {t("View All Products", "সব পণ্য দেখুন")} →
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-600" />
                </div>

                {/* Sub-categories List */}
                <div className="space-y-4">
                  {selectedCategory.subCategories.map((sub) => (
                    <div key={sub.id} className="space-y-2">
                      <div
                        onClick={() =>
                          handleSelectSubCategory(
                            selectedCategory.slug,
                            sub.slug,
                          )
                        }
                        className="flex items-center justify-between font-bold text-xs text-gray-800 border-b border-gray-100 pb-1 cursor-pointer hover:text-[#16a34a]"
                      >
                        <span>{language === "BN" ? sub.nameBn : sub.name}</span>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                      </div>

                      {/* Items Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {(sub.items || []).map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setIsMobileCategoryDrawerOpen(false);
                              navigate("search", { searchQuery: item });
                            }}
                            className="text-[11px] bg-gray-100 hover:bg-green-50 hover:text-[#16a34a] hover:border-[#16a34a] text-gray-700 px-2.5 py-1 rounded-full border border-gray-200 transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
