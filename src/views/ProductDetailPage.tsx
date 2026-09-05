"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { SEO } from "../components/SEO";
import {
  Star,
  ShoppingCart,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  MapPin,
  MessageCircle,
  Store,
  Check,
  Share2,
  ThumbsUp,
  ChevronRight,
  ChevronLeft,
  Zap,
  Coins,
  TicketPercent,
  Plus,
  Minus,
  Maximize2,
  X,
  CheckCircle2,
  Copy,
  Send,
  MessageSquare,
  Video,
  Flame,
  Award,
  AlertTriangle,
  Package,
  Calendar,
  Globe,
} from "lucide-react";

export const ProductDetailPage: React.FC = () => {
  const {
    products: dynamicProducts,
    selectedProduct,
    language,
    navigate,
    addToCart,
    toggleWishlist,
    isWishlisted,
    activeLocation,
    setIsLocationModalOpen,
    vouchers,
    claimVoucher,
    showToast,
    t,
  } = useApp();

  const productsList = dynamicProducts || [];
  const params = useParams();
  const routeProductId = params?.id
    ? Array.isArray(params.id)
      ? params.id[0]
      : params.id
    : undefined;
  const product =
    (routeProductId
      ? productsList.find((p) => p.id === routeProductId)
      : null) ||
    selectedProduct ||
    productsList[0] ||
    null;

  const [selectedImage, setSelectedImage] = useState<string>(
    product?.mainImage || "",
  );
  const [selectedVariations, setSelectedVariations] = useState<
    Record<string, string>
  >(() => {
    const initial: Record<string, string> = {};
    if (product.variations) {
      product.variations.forEach((v) => {
        initial[v.name] = v.options[0];
      });
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<number | "all">("all");
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<
    { sender: "user" | "seller"; text: string; time: string }[]
  >([
    {
      sender: "seller",
      text: `Hello! Welcome to ${product.seller.name}. How can we help you today with ${product.title.slice(0, 30)}?`,
      time: "Just now",
    },
  ]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Sync state whenever the product changes so variation preview never gets stuck
  useEffect(() => {
    setSelectedImage(product.mainImage);
    const initial: Record<string, string> = {};
    if (product.variations) {
      product.variations.forEach((v) => {
        initial[v.name] = v.options[0];
      });
    }
    setSelectedVariations(initial);
    setQuantity(1);
    setLightboxImageIndex(0);
  }, [product.id]);

  const wishlisted = isWishlisted(product.id);

  const formatPrice = (price: number) => {
    return "৳" + price.toLocaleString("en-BD");
  };

  const getProductShareUrl = () => {
    if (typeof window !== "undefined") {
      const origin = window.location.origin;
      return `${origin}/product/${product.id}`;
    }
    return `https://ashaal.com.bd/product/${product.id}`;
  };

  const handleCopyLink = async () => {
    const shareUrl = getProductShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      showToast(
        t("Link copied to clipboard!", "প্রোডাক্টের লিংক কপি করা হয়েছে!"),
      );
      setTimeout(() => setIsCopied(false), 2500);
    } catch {
      showToast(
        t("Link copied to clipboard!", "প্রোডাক্টের লিংক কপি করা হয়েছে!"),
      );
    }
  };

  const handleShareClick = async () => {
    const shareUrl = getProductShareUrl();
    const shareTitle = language === "BN" ? product.titleBn : product.title;
    const shareText = `Check out ${product.title} on Ashaal for ${formatPrice(product.price)}!`;

    // Try native Web Share API if supported
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setIsShareModalOpen(true);
        }
        return;
      }
    }

    // Open custom share popup modal
    setIsShareModalOpen(true);
  };

  const handleSocialShare = (
    platform: "facebook" | "whatsapp" | "twitter" | "telegram",
  ) => {
    const shareUrl = encodeURIComponent(getProductShareUrl());
    const shareText = encodeURIComponent(
      `Check out ${product.title} on Ashaal (${formatPrice(product.price)}): `,
    );
    let targetUrl = "";

    if (platform === "whatsapp") {
      targetUrl = `https://api.whatsapp.com/send?text=${shareText}${shareUrl}`;
    } else if (platform === "facebook") {
      targetUrl = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    } else if (platform === "twitter") {
      targetUrl = `https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`;
    } else if (platform === "telegram") {
      targetUrl = `https://t.me/share/url?url=${shareUrl}&text=${shareText}`;
    }

    if (targetUrl) {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleVariationSelect = (
    varName: string,
    option: string,
    optIndex: number,
  ) => {
    setSelectedVariations((prev) => ({ ...prev, [varName]: option }));
    // If selecting a variation, update preview image if matching index exists
    if (product.images && product.images[optIndex]) {
      setSelectedImage(product.images[optIndex]);
    }
  };

  const handleAddToCart = (buyNow: boolean = false) => {
    addToCart(product, quantity, selectedVariations, buyNow);
  };

  const handleOpenLightbox = (imgSrc: string) => {
    const idx = product.images.indexOf(imgSrc);
    setLightboxImageIndex(idx >= 0 ? idx : 0);
    setIsLightboxOpen(true);
  };

  const handleHelpfulVote = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1,
    }));
    showToast(t("Thank you for your feedback!", "মতামতের জন্য ধন্যবাদ!"));
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage;
    setChatLog((prev) => [
      ...prev,
      { sender: "user", text: userText, time: "Just now" },
    ]);
    setChatMessage("");

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: "seller",
          text: `Thank you for asking about "${product.title.slice(0, 25)}". Yes, this item is 100% in stock with official warranty and ready to dispatch via Ashaal Express!`,
          time: "Just now",
        },
      ]);
    }, 1000);
  };

  const relatedProducts = productsList
    .filter(
      (p) => p.categorySlug === product.categorySlug && p.id !== product.id,
    )
    .slice(0, 6);

  const reviewsList = product.reviews || [];
  const filteredReviews = reviewsList.filter((r) => {
    if (reviewFilter === "all") return true;
    return r.rating === reviewFilter;
  });

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [product.mainImage, ...(product.images || [])],
    description: Array.isArray(product.description)
      ? product.description.join(" ")
      : product.description ||
        `Buy ${product.title} online at best price in Bangladesh on Ashaal.com.bd. Authentic ${product.brand} with warranty and fast delivery.`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Ashaal",
    },
    offers: {
      "@type": "Offer",
      url: getProductShareUrl(),
      priceCurrency: "BDT",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability:
        (product.inStock ?? 1) > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: product.seller?.name || "Ashaal Official Mall",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewsCount || 1,
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item:
          typeof window !== "undefined"
            ? window.location.origin
            : "https://ashaal.com.bd",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `${typeof window !== "undefined" ? window.location.origin : "https://ashaal.com.bd"}/category/${product.categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: getProductShareUrl(),
      },
    ],
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6 pb-20 sm:pb-6">
      <SEO
        title={`${product.title} - Price in Bangladesh | Ashaal.com.bd`}
        description={`Buy ${product.title} online at ৳${product.price.toLocaleString("en-BD")} in Bangladesh. Genuine ${product.brand} with fast home delivery and warranty.`}
        image={product.mainImage}
        type="product"
        keywords={`${product.title}, ${product.brand}, buy ${product.title} bangladesh, ${product.category}, Ashaal`}
        structuredData={[productJsonLd, breadcrumbJsonLd]}
      />
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto whitespace-nowrap py-1">
        <button
          onClick={() => navigate("home")}
          className="hover:text-[#16a34a] cursor-pointer"
        >
          {t("Home", "হোম")}
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <button
          onClick={() =>
            navigate("search", { categorySlug: product.categorySlug })
          }
          className="hover:text-[#16a34a] cursor-pointer"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-semibold truncate max-w-xs">
          {product.brand}
        </span>
      </div>

      {/* Main Product Presentation */}
      <div className="bg-white shadow-xs p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* 1. Left Gallery (Col 4) */}
          <div className="lg:col-span-4 space-y-3">
            <div
              onClick={() => handleOpenLightbox(selectedImage)}
              className="relative aspect-square w-full overflow-hidden bg-gray-50 cursor-zoom-in group"
            >
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-[#16a34a] text-white font-black text-xs px-2 py-1 shadow">
                  -{product.discountPercentage}% OFF
                </span>
              )}
              <div className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-[11px] font-medium px-2.5 py-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{t("Click to Zoom", "জুম করে দেখুন")}</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 overflow-hidden bg-gray-50 p-1 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img
                      ? "outline-2 outline-[#16a34a] shadow-xs"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Share & Wishlist quick actions */}
            <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-gray-100">
              <button
                onClick={handleShareClick}
                className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors cursor-pointer group"
              >
                <Share2 className="w-4 h-4 text-[#16a34a]" />
                <span className="font-semibold text-gray-700 group-hover:text-[#16a34a]">
                  {t("Share Product", "শেয়ার করুন")}
                </span>
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  wishlisted ? "text-red-500 font-bold" : "hover:text-red-500"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`}
                />
                <span>
                  {wishlisted
                    ? t("Added to Wishlist", "উইশলিস্টে যুক্ত")
                    : t("Add to Wishlist", "উইশলিস্টে যোগ করুন")}
                </span>
              </button>
            </div>
          </div>

          {/* 2. Middle Product Info & Options (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Title & Brand */}
            <div>
              <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
                {product.isDarazMall && (
                  <span className="inline-flex items-center gap-1 bg-[#0f136d] text-white text-[10px] font-bold px-2 py-0.5 align-middle">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />{" "}
                    AshaalMall Flagship
                  </span>
                )}
                {product.is_featured && (
                  <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wide">
                    ★ {t("FEATURED", "ফিচার্ড")}
                  </span>
                )}
                {product.is_trending && (
                  <span className="inline-flex items-center gap-1 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wide">
                    <Flame className="w-3 h-3" /> {t("TRENDING", "ট্রেন্ডিং")}
                  </span>
                )}
                {product.is_best_seller && (
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 uppercase tracking-wide">
                    <Award className="w-3 h-3" />{" "}
                    {t("BEST SELLER", "বেস্ট সেলার")}
                  </span>
                )}
                {product.sku && (
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 border border-gray-200">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug mt-1">
                {language === "BN" ? product.titleBn : product.title}
              </h1>

              {product.short_description && (
                <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
                  {product.short_description}
                </p>
              )}

              {/* Brand, Ratings & Total Sales */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#16a34a]">
                    {product.rating}
                  </span>
                  <span className="text-gray-400">
                    ({product.reviewsCount ?? product.total_reviews}{" "}
                    {t("Ratings", "রেটিং")})
                  </span>
                </div>
                <span>|</span>
                <span>
                  {product.total_sales || product.soldCount}{" "}
                  {t("Sold", "বিক্রি হয়েছে")}
                </span>
                <span>|</span>
                <span>
                  {product.questionsCount}{" "}
                  {t("Answered Questions", "প্রশ্নের উত্তর")}
                </span>
                <span>|</span>
                <span>
                  Brand:{" "}
                  <strong className="text-gray-800">{product.brand}</strong>
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="bg-green-50/60 p-3.5 space-y-2">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#16a34a]">
                  {formatPrice(product.final_price || product.price)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-[#16a34a] text-white text-[11px] font-bold px-1.5 py-0.5">
                      -{product.discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status & Low Stock Alert */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {product.stock_status === "out_of_stock" ||
                product.inStock <= 0 ? (
                  <span className="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5">
                    <X className="w-3.5 h-3.5" />{" "}
                    {t("Out of Stock", "স্টক শেষ")}
                  </span>
                ) : product.inStock <= (product.stock_alert_quantity || 5) ? (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {t("Low Stock: Only", "মজুত কমে এসেছে: মাত্র")}{" "}
                    {product.inStock} {product.unit || t("units", "টি")}{" "}
                    {t("left!", "বাকি আছে!")}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    {t("In Stock", "স্টকে আছে")} ({product.inStock}{" "}
                    {product.unit || t("units", "টি")})
                  </span>
                )}

                {product.coinsCashback && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-semibold px-2 py-0.5">
                    <Coins className="w-3 h-3 text-amber-600" />
                    <span>
                      {t("Earn", "আয় করুন")} {product.coinsCashback}{" "}
                      {t("Coins", "কয়েন")}
                    </span>
                  </span>
                )}
                {product.isFreeDelivery && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-xs font-semibold px-2 py-0.5">
                    <Truck className="w-3 h-3 text-emerald-600" />
                    <span>{t("Free Delivery", "ফ্রি ডেলিভারি")}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Claimable Promotions Box */}
            <div className="bg-white p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 flex items-center gap-1">
                  <TicketPercent className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>{t("Promotions & Vouchers", "প্রমোশন ও ভাউচার")}</span>
                </span>
                <span className="text-[11px] text-[#16a34a] font-semibold">
                  {t("Save up to ৳500", "সর্বোচ্চ ৫০০ টাকা ছাড়")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {vouchers.slice(0, 2).map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-2 bg-green-50 px-2.5 py-1 text-xs"
                  >
                    <span className="font-bold text-[#16a34a]">{v.title}</span>
                    <button
                      onClick={() => claimVoucher(v.id)}
                      disabled={v.isClaimed}
                      className={`text-[10px] font-bold px-2 py-0.5 cursor-pointer ${
                        v.isClaimed
                          ? "bg-gray-200 text-gray-500 cursor-default"
                          : "bg-[#16a34a] hover:bg-[#15803d] text-white"
                      }`}
                    >
                      {v.isClaimed
                        ? t("Claimed", "সংগৃহীত")
                        : t("Collect", "সংগ্রহ")}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Variations Selector */}
            {product.variations && product.variations.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-gray-100">
                {product.variations.map((v) => (
                  <div key={v.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-gray-600">
                        {v.name}:{" "}
                        <strong className="text-gray-900">
                          {selectedVariations[v.name] || v.options[0]}
                        </strong>
                      </span>
                      <span className="text-[11px] text-gray-400">
                        {v.options.length} {t("options", "অপশন")}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt, optIdx) => {
                        const isSelected =
                          (selectedVariations[v.name] || v.options[0]) === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() =>
                              handleVariationSelect(v.name, opt, optIdx)
                            }
                            className={`px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                              isSelected
                                ? "bg-[#16a34a] text-white"
                                : "text-gray-700 hover:bg-gray-100 bg-gray-100"
                            }`}
                          >
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                            )}
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Color Options */}
            {product.color_options &&
              product.color_options.length > 0 &&
              !product.variations?.some(
                (v) => v.name.toLowerCase() === "color",
              ) && (
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">
                      {t("Color", "কালার")}:{" "}
                      <strong className="text-gray-900">
                        {selectedVariations["Color"] ||
                          product.color_options[0]}
                      </strong>
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {product.color_options.length} {t("colors", "কালার")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.color_options.map((col) => {
                      const isSelected =
                        (selectedVariations["Color"] ||
                          product.color_options![0]) === col;
                      return (
                        <button
                          key={col}
                          type="button"
                          onClick={() =>
                            setSelectedVariations((prev) => ({
                              ...prev,
                              Color: col,
                            }))
                          }
                          className={`px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-[#16a34a] text-white"
                              : "text-gray-700 hover:bg-gray-100 bg-gray-100"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                          <span>{col}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Size Options */}
            {product.size_options &&
              product.size_options.length > 0 &&
              !product.variations?.some(
                (v) => v.name.toLowerCase() === "size",
              ) && (
                <div className="space-y-1.5 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-600">
                      {t("Size", "সাইজ")}:{" "}
                      <strong className="text-gray-900">
                        {selectedVariations["Size"] || product.size_options[0]}
                      </strong>
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {product.size_options.length} {t("sizes", "সাইজ")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.size_options.map((sz) => {
                      const isSelected =
                        (selectedVariations["Size"] ||
                          product.size_options![0]) === sz;
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() =>
                            setSelectedVariations((prev) => ({
                              ...prev,
                              Size: sz,
                            }))
                          }
                          className={`px-3 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                            isSelected
                              ? "bg-[#16a34a] text-white"
                              : "text-gray-700 hover:bg-gray-100 bg-gray-100"
                          }`}
                        >
                          {isSelected && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                          <span>{sz}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-gray-600">
                {t("Quantity", "পরিমাণ")}:
              </span>
              <div className="flex items-center bg-gray-100">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-200 text-gray-600 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-bold text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity((q) => Math.min(product.inStock, q + 1))
                  }
                  className="p-2 hover:bg-gray-200 text-gray-600 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-gray-400">
                {product.inStock} {t("items left in stock", "টি পণ্য মজুত আছে")}
              </span>
            </div>

            {/* Action Buttons: Buy Now & Add to Cart */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => handleAddToCart(true)}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold py-3 px-4 text-sm shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{t("Buy Now", "এখনই কিনুন")}</span>
              </button>

              <button
                onClick={() => handleAddToCart(false)}
                className="bg-green-50 hover:bg-green-100 text-[#16a34a] font-extrabold py-3 px-4 text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t("Add to Cart", "কার্টে যোগ করুন")}</span>
              </button>
            </div>
          </div>

          {/* 3. Right Sidebar: Delivery, Warranty & Seller Info (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Delivery Box */}
            <div className="bg-[#fafafa] p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">
                  {t("Delivery Options", "ডেলিভারি অপশন")}
                </span>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-xs text-[#0f136d] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-[#16a34a]" />
                  <span>{t("Change", "পরিবর্তন")}</span>
                </button>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {activeLocation.division}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {activeLocation.city}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs pt-2 border-t border-gray-200">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">
                      {t("Standard Delivery", "স্ট্যান্ডার্ড ডেলিভারি")}
                    </span>
                    <span className="font-bold text-gray-900">
                      {product.deliveryFee === 0
                        ? t("FREE", "ফ্রি")
                        : formatPrice(product.deliveryFee)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    {product.estimatedDeliveryDays}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-white p-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {t(
                    "Cash on Delivery Available",
                    "ক্যাশ অন ডেলিভারি প্রযোজ্য",
                  )}
                </span>
              </div>
            </div>

            {/* Return & Warranty Box */}
            <div className="bg-[#fafafa] p-4 space-y-2.5 text-xs">
              <span className="font-bold text-gray-700 block pb-1 border-b border-gray-200">
                {t("Return & Warranty", "রিটার্ন ও ওয়ারেন্টি")}
              </span>

              <div className="flex items-start gap-2">
                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {product.returnPolicy}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {t(
                      "Change of mind is not applicable",
                      "পণ্য অক্ষত থাকতে হবে",
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">
                    {product.warranty}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {t(
                      "100% Authentic product guarantee",
                      "আসল পণ্যের শতভাগ নিশ্চয়তা",
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="bg-white p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-semibold">
                  {t("Sold by", "বিক্রেতা:")}
                </span>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="text-xs font-bold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t("Chat Now", "সরাসরি চ্যাট")}</span>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-gray-600" />
                  <span>{product.seller.name}</span>
                </h4>
                <p className="text-[10px] text-gray-500">
                  {product.seller.location} • {product.seller.joinedYears}{" "}
                  {t("years on Ashaal", "বছর ধরে আশালে")}
                </p>
              </div>

              {/* Seller metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2 bg-gray-50 text-center text-xs">
                <div>
                  <p className="font-extrabold text-emerald-600">
                    {product.seller.rating}%
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    {t("Positive Rating", "পজিটিভ রেটিং")}
                  </p>
                </div>
                <div className="border-x border-gray-200">
                  <p className="font-extrabold text-blue-600">
                    {product.seller.shipOnTime}%
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    {t("Ship on Time", "সময়মতো ডেলিভারি")}
                  </p>
                </div>
                <div>
                  <p className="font-extrabold text-purple-600">
                    {product.seller.chatResponse}%
                  </p>
                  <p className="text-[9px] text-gray-500 leading-tight">
                    {t("Chat Response", "চ্যাট রেসপন্স")}
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate("search", { searchQuery: product.brand })
                }
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 text-xs transition-colors cursor-pointer"
              >
                {t("VISIT STORE", "দোকান ভিজিট করুন")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for Product Image Full Preview */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <h3 className="font-bold text-sm text-gray-900">
                {product.title} - {t("Image Preview", "ছবি প্রিভিউ")} (
                {lightboxImageIndex + 1}/{product.images.length})
              </h3>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-square max-h-[60vh] mx-auto flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
              <img
                src={product.images[lightboxImageIndex] || selectedImage}
                alt="lightbox-zoom"
                className="max-h-full max-w-full object-contain"
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setLightboxImageIndex((prev) =>
                        prev > 0 ? prev - 1 : product.images.length - 1,
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow hover:bg-white text-gray-800 cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setLightboxImageIndex((prev) =>
                        prev < product.images.length - 1 ? prev + 1 : 0,
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 shadow hover:bg-white text-gray-800 cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Lightbox thumbnails */}
            <div className="flex justify-center gap-2 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setLightboxImageIndex(idx)}
                  className={`w-14 h-14 rounded-lg overflow-hidden border-2 p-0.5 bg-gray-50 shrink-0 cursor-pointer ${
                    lightboxImageIndex === idx
                      ? "border-[#16a34a] ring-2 ring-green-200"
                      : "border-gray-200 opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt="thumb"
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-3 py-2 sm:hidden shadow-[0_-4px_16px_rgba(0,0,0,0.08)] flex items-center gap-2 pb-[max(env(safe-area-inset-bottom),0.5rem)]">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-[#16a34a] min-w-[50px]"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold">
            {t("Chat", "চ্যাট")}
          </span>
        </button>
        <button
          onClick={() => toggleWishlist(product.id)}
          className="flex flex-col items-center justify-center p-2 text-gray-600 hover:text-red-500 min-w-[50px]"
        >
          <Heart
            className={`w-5 h-5 ${wishlisted ? "fill-red-500 text-red-500" : ""}`}
          />
          <span className="text-[10px] font-semibold">{t("Wish", "উইশ")}</span>
        </button>
        <button
          onClick={() => handleAddToCart(false)}
          className="flex-1 bg-green-50 text-[#16a34a] border border-[#16a34a] font-bold py-2.5 rounded-lg text-xs flex items-center justify-center gap-1.5"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>{t("Add to Cart", "কার্ট")}</span>
        </button>
        <button
          onClick={() => handleAddToCart(true)}
          className="flex-1 bg-[#16a34a] text-white font-bold py-2.5 rounded-lg text-xs shadow flex items-center justify-center gap-1.5"
        >
          <Zap className="w-4 h-4 fill-white" />
          <span>{t("Buy Now", "কিনুন")}</span>
        </button>
      </div>

      {/* Product Specifications & Long Description */}
      <div className="bg-white shadow-xs p-4 sm:p-6 space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-900 pb-3 border-b border-gray-150">
            {t("Product Details & Highlights", "পণ্যের বিস্তারিত বিবরণ")}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
            {(language === "BN"
              ? product.descriptionBn
              : product.description
            ).map((desc, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-xs sm:text-sm text-gray-700"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-2 shrink-0"></span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Enterprise Key Features & Attributes Overview */}
        <div className="pt-4 border-t border-gray-150">
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#16a34a]" />
            <span>
              {t(
                "Product Attributes & Specifications",
                "পণ্যের বৈশিষ্ট্য ও স্পেসিফিকেশন",
              )}
            </span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs mb-4">
            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[11px] text-gray-400 block">
                {t("Origin Country", "উৎস দেশ")}
              </span>
              <strong className="text-gray-800 flex items-center gap-1 mt-0.5">
                <Globe className="w-3.5 h-3.5 text-blue-500" />
                <span>{product.origin_country || "Bangladesh"}</span>
              </strong>
            </div>

            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[11px] text-gray-400 block">
                {t("Unit Type", "ইউনিট")}
              </span>
              <strong className="text-gray-800 capitalize mt-0.5 block">
                {product.unit || "piece"}
              </strong>
            </div>

            {(product.weight || 0) > 0 && (
              <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                <span className="text-[11px] text-gray-400 block">
                  {t("Net Weight", "ওজন")}
                </span>
                <strong className="text-gray-800 mt-0.5 block">
                  {product.weight} kg
                </strong>
              </div>
            )}

            {product.length || product.width || product.height ? (
              <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                <span className="text-[11px] text-gray-400 block">
                  {t("Dimensions (L×W×H)", "পরিমাপ")}
                </span>
                <strong className="text-gray-800 mt-0.5 block">
                  {product.length || 0}×{product.width || 0}×
                  {product.height || 0} cm
                </strong>
              </div>
            ) : null}

            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[11px] text-gray-400 block">
                {t("Warranty Period", "ওয়ারেন্টি")}
              </span>
              <strong className="text-gray-800 flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {product.warranty_period ||
                    product.warranty ||
                    "1 Year Brand Warranty"}
                </span>
              </strong>
            </div>

            <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
              <span className="text-[11px] text-gray-400 block">
                {t("Return Policy", "রিটার্ন পলিসি")}
              </span>
              <strong className="text-gray-800 flex items-center gap-1 mt-0.5">
                <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {product.return_policy ||
                    product.returnPolicy ||
                    "14 Days Free Return"}
                </span>
              </strong>
            </div>

            {product.sku && (
              <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                <span className="text-[11px] text-gray-400 block">
                  SKU Code
                </span>
                <strong className="text-gray-800 font-mono text-[11px] mt-0.5 block truncate">
                  {product.sku}
                </strong>
              </div>
            )}

            {product.barcode && (
              <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                <span className="text-[11px] text-gray-400 block">Barcode</span>
                <strong className="text-gray-800 font-mono text-[11px] mt-0.5 block truncate">
                  {product.barcode}
                </strong>
              </div>
            )}

            {product.manufacturing_date && (
              <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                <span className="text-[11px] text-gray-400 block">
                  {t("Mfg Date", "উৎপাদন তারিখ")}
                </span>
                <strong className="text-gray-800 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>{product.manufacturing_date}</span>
                </strong>
              </div>
            )}

            {product.expiry_date && (
              <div className="bg-gray-50 p-2.5 rounded border border-gray-100">
                <span className="text-[11px] text-gray-400 block">
                  {t("Exp Date", "মেয়াদ উত্তীর্ণ")}
                </span>
                <strong className="text-gray-800 flex items-center gap-1 mt-0.5 text-rose-700">
                  <Calendar className="w-3.5 h-3.5 text-rose-500" />
                  <span>{product.expiry_date}</span>
                </strong>
              </div>
            )}
          </div>

          {/* Video Demonstration if video_url is present */}
          {product.video_url && (
            <div className="my-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-600" />
                  <span>
                    {t("Official Video Demonstration", "অফিসিয়াল ভিডিও রিভিউ")}
                  </span>
                </h4>
                <a
                  href={product.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-[#16a34a] hover:underline"
                >
                  {t("Open Video", "ভিডিও দেখুন ↗")}
                </a>
              </div>
              <div className="relative aspect-video max-w-2xl rounded-lg overflow-hidden bg-black shadow-md">
                {product.video_url.includes("youtube.com") ||
                product.video_url.includes("youtu.be") ? (
                  <iframe
                    src={
                      product.video_url.includes("embed")
                        ? product.video_url
                        : product.video_url.replace("watch?v=", "embed/")
                    }
                    title="Product Video"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video
                    src={product.video_url}
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
              </div>
            </div>
          )}

          {/* Specifications Table */}
          {product.specifications &&
            Object.keys(product.specifications).length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-700 mb-2">
                  {t("Additional Specifications", "অতিরিক্ত স্পেসিফিকেশন")}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex justify-between py-1.5 border-b border-gray-100"
                    >
                      <span className="text-gray-500 font-medium">{key}</span>
                      <span className="text-gray-900 font-semibold text-right">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Customer Ratings & Reviews */}
      <div className="bg-white shadow-xs p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-150">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900">
              {t("Ratings & Reviews", "গ্রাহকদের রেটিং ও রিভিউ")}
            </h2>
            <p className="text-xs text-gray-500">
              {product.reviewsCount}{" "}
              {t("verified buyer ratings", "যাচাইকৃত ক্রেতাদের রিভিউ")}
            </p>
          </div>

          {/* Rating filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setReviewFilter("all")}
              className={`px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                reviewFilter === "all"
                  ? "bg-[#16a34a] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t("All Reviews", "সকল রিভিউ")}
            </button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => setReviewFilter(stars)}
                className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  reviewFilter === stars
                    ? "bg-[#16a34a] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{stars}★</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rating Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 p-4">
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
            <span className="text-4xl font-black text-gray-900">
              {product.rating}
            </span>
            <div className="flex text-amber-400 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-4 h-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product.reviewsCount} {t("Total Ratings", "মোট রেটিং")}
            </span>
          </div>

          <div className="md:col-span-8 space-y-1.5">
            {[
              { stars: 5, pct: 82 },
              { stars: 4, pct: 13 },
              { stars: 3, pct: 3 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 1 },
            ].map((row) => (
              <div
                key={row.stars}
                className="flex items-center gap-3 text-xs text-gray-600"
              >
                <span className="w-8 font-semibold">{row.stars} ★</span>
                <div className="flex-1 bg-gray-200 h-2 overflow-hidden">
                  <div
                    className="bg-[#16a34a] h-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-8 text-right text-gray-400 text-[11px]">
                  {row.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 pt-2">
          {filteredReviews.length === 0 ? (
            <p className="text-center py-6 text-xs text-gray-500">
              {t(
                "No reviews found for this filter.",
                "এই ফিল্টারে কোনো রিভিউ পাওয়া যায়নি।",
              )}
            </p>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-gray-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        rev.userAvatar ||
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80"
                      }
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900">
                          {rev.userName}
                        </span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex text-amber-400 text-[10px]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>

                {rev.variantPurchased && (
                  <p className="text-[11px] text-gray-500">
                    Variation:{" "}
                    <span className="font-semibold text-gray-700">
                      {rev.variantPurchased}
                    </span>
                  </p>
                )}

                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                  {rev.comment}
                </p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.images.map((im, i) => (
                      <img
                        key={i}
                        src={im}
                        alt="review"
                        className="w-16 h-16 object-cover"
                      />
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => handleHelpfulVote(rev.id)}
                    className="text-xs text-gray-500 hover:text-[#16a34a] flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>
                      {t("Helpful", "সাহায্য করেছে")} (
                      {rev.helpfulCount + (helpfulVotes[rev.id] || 0)})
                    </span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-gray-900 tracking-tight">
            {t(
              "People Who Viewed This Also Bought",
              "অন্যান্য ক্রেতারা যা কিনেছেন",
            )}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Seller Live Chat Popup Modal */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-[#16a34a] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-emerald-200" />
              <div>
                <h4 className="font-bold text-xs truncate">
                  {product.seller.name}
                </h4>
                <p className="text-[10px] text-emerald-100">
                  ● Online - Instant Response
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/80 hover:text-white font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-2 bg-gray-50 text-xs">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-[#16a34a] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[9px] block mt-1 ${msg.sender === "user" ? "text-green-100" : "text-gray-400"}`}
                  >
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendChat}
            className="p-2 border-t border-gray-200 bg-white flex gap-2"
          >
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask seller a question..."
              className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#16a34a]"
            />
            <button
              type="submit"
              className="bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Share Product Dialog Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative max-w-md w-full bg-white p-6 shadow-2xl space-y-5 border border-gray-150 animate-in fade-in zoom-in duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-50 text-[#16a34a] flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900">
                    {t("Share this product", "পণ্যটি শেয়ার করুন")}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {t(
                      "Share with your friends and family",
                      "বন্ধুবান্ধব ও পরিবারের সাথে শেয়ার করুন",
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Mini Preview */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200">
              <img
                src={product.mainImage}
                alt={product.title}
                className="w-14 h-14 object-contain bg-white p-1 border border-gray-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                  {product.title}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-black text-[#16a34a]">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-[10px] text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Direct Social Share Channels */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {t(
                  "Share via social platforms",
                  "সোশ্যাল প্ল্যাটফর্মে শেয়ার করুন",
                )}
              </label>
              <div className="grid grid-cols-4 gap-2 text-center">
                <button
                  onClick={() => handleSocialShare("whatsapp")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 text-emerald-600" />
                  <span className="text-[10px] font-bold">WhatsApp</span>
                </button>

                <button
                  onClick={() => handleSocialShare("facebook")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                >
                  <span className="text-base font-black leading-none text-blue-600">
                    f
                  </span>
                  <span className="text-[10px] font-bold">Facebook</span>
                </button>

                <button
                  onClick={() => handleSocialShare("twitter")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-black text-sky-600">𝕏</span>
                  <span className="text-[10px] font-bold">X (Twitter)</span>
                </button>

                <button
                  onClick={() => handleSocialShare("telegram")}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border border-cyan-200 transition-colors cursor-pointer"
                >
                  <Send className="w-5 h-5 text-cyan-600" />
                  <span className="text-[10px] font-bold">Telegram</span>
                </button>
              </div>
            </div>

            {/* Copy Link Input Section */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {t("Or copy direct link", "অথবা ডিরেক্ট লিংক কপি করুন")}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={getProductShareUrl()}
                  className="flex-1 bg-gray-50 border border-gray-300 text-xs px-3 py-2 text-gray-600 select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isCopied
                      ? "bg-emerald-600 text-white"
                      : "bg-[#16a34a] hover:bg-[#15803d] text-white shadow-xs"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{t("Copied!", "কপি হয়েছে!")}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t("Copy", "কপি করুন")}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
