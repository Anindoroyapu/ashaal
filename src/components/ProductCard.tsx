"use client";

import React, { useState } from "react";
import { Product } from "../types";
import { useApp } from "../context/AppContext";
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Zap,
  Truck,
  CheckCircle2,
} from "lucide-react";

interface ProductCardProps {
  product: Product;
  variant?: "standard" | "compact" | "flash" | "horizontal";
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  variant = "standard",
}) => {
  const { language, navigate, addToCart, toggleWishlist, isWishlisted, t } =
    useApp();
  const wishlisted = isWishlisted(product.id);
  const [isAdded, setIsAdded] = useState(false);

  const formatPrice = (price: number) => {
    return "৳" + price.toLocaleString("en-BD");
  };

  const handleCardClick = () => {
    navigate("product-details", { productId: product.id });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultVars: Record<string, string> = {};
    if (product.variations) {
      product.variations.forEach((v) => {
        defaultVars[v.name] = v.options[0];
      });
    }
    addToCart(product, 1, defaultVars);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  if (variant === "horizontal") {
    return (
      <div
        onClick={handleCardClick}
        className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 hover:shadow-md hover:border-[#16a34a] transition-all p-2.5 sm:p-3 flex gap-3 sm:gap-4 cursor-pointer group active:scale-[0.99] select-none"
      >
        <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 relative rounded-lg sm:rounded-xl overflow-hidden bg-[#f8f9fa] border border-gray-100">
          <img
            src={product.mainImage}
            alt={product.title}
            className="w-full h-full object-contain p-1.5 sm:p-2 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {product.discountPercentage > 0 && (
            <span className="absolute top-1 left-1 bg-gradient-to-r from-red-600 to-[#16a34a] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-xs">
              -{product.discountPercentage}%
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {product.isDarazMall && (
                <span className="bg-[#0f136d] text-white text-[8.5px] sm:text-[9px] font-extrabold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> Mall
                </span>
              )}
              {product.isFreeDelivery && (
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8.5px] sm:text-[9px] font-bold px-1 rounded flex items-center gap-0.5">
                  <Truck className="w-2.5 h-2.5 text-emerald-600" /> Free
                </span>
              )}
            </div>
            <h3 className="text-xs sm:text-[13px] font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#16a34a] transition-colors">
              {language === "BN" ? product.titleBn : product.title}
            </h3>
          </div>

          <div className="flex items-end justify-between mt-2 pt-1 border-t border-gray-100">
            <div>
              <div className="text-[#16a34a] font-black text-sm sm:text-base leading-none">
                {formatPrice(product.price)}
              </div>
              {product.discountPercentage > 0 && (
                <div className="text-[10px] sm:text-[11px] text-gray-400 line-through leading-none mt-0.5">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>
            <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-gray-500">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount})</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/80 hover:border-[#16a34a] hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer group relative active:scale-[0.98] select-none shadow-2xs"
    >
      {/* Product Image Container */}
      <div className="relative aspect-square w-full bg-[#f8f9fa] overflow-hidden">
        <img
          src={product.mainImage}
          alt={product.title}
          className="w-full h-full object-contain p-2 sm:p-2.5 group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col gap-1 z-10">
          {product.isDarazMall && (
            <span className="bg-[#0f136d] text-white text-[8.5px] sm:text-[9.5px] font-extrabold px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5 uppercase tracking-wider">
              <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-400" />{" "}
              Mall
            </span>
          )}
          {product.isFlashSale && (
            <span className="bg-gradient-to-r from-amber-500 to-red-500 text-white text-[8px] sm:text-[9px] font-black px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-0.5 animate-pulse">
              <Zap className="w-2.5 h-2.5 fill-white" /> FLASH
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-r from-red-600 to-[#16a34a] text-white font-extrabold text-[8.5px] sm:text-[10px] px-1.5 py-0.5 rounded shadow-xs">
            -{product.discountPercentage}%
          </div>
        )}

        {/* Floating Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-xs shadow-xs hover:bg-white flex items-center justify-center transition-all z-10 border border-gray-150 active:scale-90 ${
            wishlisted
              ? "text-red-500 fill-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
          title="Add to Wishlist"
          aria-label="Wishlist"
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
              wishlisted ? "fill-red-500 scale-110" : ""
            }`}
          />
        </button>
      </div>

      {/* Product Details Info */}
      <div className="p-2 sm:p-2.5 md:p-3 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Free Shipping / Tags */}
          <div className="flex items-center gap-1 mb-1 min-h-[16px] sm:min-h-[18px]">
            {product.isFreeDelivery && (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] sm:text-[9.5px] font-bold px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded flex items-center gap-0.5">
                <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600" />{" "}
                {t("Free Delivery", "ফ্রি ডেলিভারি")}
              </span>
            )}
            {product.coinsCashback && (
              <span className="text-[8px] sm:text-[9.5px] text-amber-700 bg-amber-50 font-bold px-1 py-0.2 sm:px-1.5 sm:py-0.5 rounded">
                +{product.coinsCashback} {t("Coins", "কয়েন")}
              </span>
            )}
          </div>

          {/* Title - Fixed height so all cards in a row have identical height! */}
          <h3 className="text-[11px] sm:text-[12.5px] font-medium sm:font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-[#16a34a] transition-colors h-[28px] sm:h-[34px]">
            {language === "BN" ? product.titleBn : product.title}
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="mt-1.5 sm:mt-2.5 pt-1.5 sm:pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1 sm:gap-1.5">
            <span className="text-[#16a34a] font-black text-sm sm:text-base md:text-[17px] leading-none">
              {formatPrice(product.price)}
            </span>
            {product.discountPercentage > 0 && (
              <span className="text-[9.5px] sm:text-[11px] text-gray-400 line-through leading-none">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Meter for Flash Sale */}
          {product.isFlashSale && variant === "flash" && (
            <div className="mt-1 sm:mt-1.5">
              <div className="w-full bg-orange-100 rounded-full h-1 sm:h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-red-500 h-full rounded-full transition-all"
                  style={{
                    width: `${Math.min(95, Math.max(25, (product.soldCount % 100) + 15))}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between text-[8.5px] sm:text-[10px] text-gray-500 mt-0.5 font-medium">
                <span>
                  {product.soldCount} {t("Sold", "বিক্রি")}
                </span>
                <span className="text-[#16a34a] font-semibold">
                  {product.inStock} {t("Left", "বাকি")}
                </span>
              </div>
            </div>
          )}

          {/* Rating & Sold count */}
          <div className="flex items-center justify-between mt-1 sm:mt-1.5 text-[9px] sm:text-[11px] text-gray-500">
            <div className="flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 fill-amber-400" />
              <span className="font-bold text-gray-800">{product.rating}</span>
              <span className="text-gray-400">({product.reviewsCount})</span>
            </div>
            <span className="text-gray-400 font-medium truncate ml-1">
              {product.soldCount > 1000
                ? `${(product.soldCount / 1000).toFixed(1)}k`
                : product.soldCount}{" "}
              {t("sold", "বিক্রিত")}
            </span>
          </div>

          {/* Quick Add to Cart Button with Instant Feedback */}
          <button
            onClick={handleAddToCart}
            className={`w-full mt-1.5 sm:mt-2.5 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all duration-150 active:scale-95 cursor-pointer shadow-2xs border ${
              isAdded
                ? "bg-[#16a34a] text-white border-[#16a34a]"
                : "bg-gray-50 hover:bg-[#16a34a] text-gray-800 hover:text-white border-gray-200/80 hover:border-[#16a34a]"
            }`}
          >
            {isAdded ? (
              <>
                <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white animate-bounce" />
                <span>{t("Added ✓", "যোগ হয়েছে ✓")}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{t("Add to Cart", "কার্টে নিন")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
