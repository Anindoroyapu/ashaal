import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS_DATA } from '../data/productsData';
import { ProductCard } from '../components/ProductCard';
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
  Zap,
  Coins,
  TicketPercent,
  Plus,
  Minus
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
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
    t
  } = useApp();

  const product = selectedProduct || PRODUCTS_DATA[0];

  const [selectedImage, setSelectedImage] = useState<string>(product.mainImage);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (product.variations) {
      product.variations.forEach((v) => {
        initial[v.name] = v.options[0];
      });
    }
    return initial;
  });
  const [quantity, setQuantity] = useState(1);
  const [reviewFilter, setReviewFilter] = useState<number | 'all'>('all');
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'user' | 'seller'; text: string; time: string }[]>([
    { sender: 'seller', text: `Hello! Welcome to ${product.seller.name}. How can we help you today with ${product.title.slice(0, 30)}?`, time: 'Just now' }
  ]);

  const wishlisted = isWishlisted(product.id);

  const formatPrice = (price: number) => {
    return '৳' + price.toLocaleString('en-BD');
  };

  const handleVariationSelect = (varName: string, option: string) => {
    setSelectedVariations((prev) => ({ ...prev, [varName]: option }));
  };

  const handleAddToCart = (buyNow: boolean = false) => {
    addToCart(product, quantity, selectedVariations, buyNow);
  };

  const handleHelpfulVote = (reviewId: string) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] || 0) + 1
    }));
    showToast(t('Thank you for your feedback!', 'মতামতের জন্য ধন্যবাদ!'));
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userText = chatMessage;
    setChatLog((prev) => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setChatMessage('');

    setTimeout(() => {
      setChatLog((prev) => [
        ...prev,
        {
          sender: 'seller',
          text: `Thank you for asking about "${product.title.slice(0, 25)}". Yes, this item is 100% in stock with official warranty and ready to dispatch via Daraz Express!`,
          time: 'Just now'
        }
      ]);
    }, 1000);
  };

  const relatedProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 6);

  const reviewsList = product.reviews || [];
  const filteredReviews = reviewsList.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.rating === reviewFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-500 overflow-x-auto whitespace-nowrap py-1">
        <button onClick={() => navigate('home')} className="hover:text-[#16a34a] cursor-pointer">
          {t('Home', 'হোম')}
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <button
          onClick={() => navigate('search', { categorySlug: product.categorySlug })}
          className="hover:text-[#16a34a] cursor-pointer"
        >
          {product.category}
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="text-gray-800 font-semibold truncate max-w-xs">{product.brand}</span>
      </div>

      {/* Main Product Presentation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* 1. Left Gallery (Col 4) */}
          <div className="lg:col-span-4 space-y-3">
            <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
              <img
                src={selectedImage}
                alt={product.title}
                className="w-full h-full object-contain p-4 transition-all duration-300"
              />
              {product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 bg-[#16a34a] text-white font-black text-xs px-2 py-1 rounded shadow">
                  -{product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 bg-gray-50 p-1 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-[#16a34a] shadow-sm' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Share & Wishlist quick actions */}
            <div className="flex items-center justify-between pt-2 text-xs text-gray-500 border-t border-gray-100">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  showToast(t('Product link copied to clipboard!', 'প্রোডাক্টের লিংক কপি করা হয়েছে!'));
                }}
                className="flex items-center gap-1.5 hover:text-[#16a34a] transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{t('Share Product', 'শেয়ার করুন')}</span>
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                  wishlisted ? 'text-red-500 font-bold' : 'hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-red-500' : ''}`} />
                <span>{wishlisted ? t('Added to Wishlist', 'উইশলিস্টে যুক্ত') : t('Add to Wishlist', 'উইশলিস্টে যোগ করুন')}</span>
              </button>
            </div>
          </div>

          {/* 2. Middle Product Info & Options (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Title & Brand */}
            <div>
              {product.isDarazMall && (
                <span className="inline-flex items-center gap-1 bg-[#0f136d] text-white text-[10px] font-bold px-2 py-0.5 rounded mr-2 align-middle">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> DarazMall Flagship
                </span>
              )}
              <h1 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 leading-snug mt-1">
                {language === 'BN' ? product.titleBn : product.title}
              </h1>

              {/* Brand & Ratings */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= Math.round(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-bold text-[#16a34a]">{product.rating}</span>
                  <span className="text-gray-400">({product.reviewsCount} {t('Ratings', 'রেটিং')})</span>
                </div>
                <span>|</span>
                <span>{product.questionsCount} {t('Answered Questions', 'প্রশ্নের উত্তর')}</span>
                <span>|</span>
                <span>Brand: <strong className="text-gray-800">{product.brand}</strong></span>
              </div>
            </div>

            {/* Price Block */}
            <div className="bg-green-50/60 p-3.5 rounded-xl border border-green-200/60 space-y-1.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-2xl sm:text-3xl font-black text-[#16a34a]">
                  {formatPrice(product.price)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-[#16a34a] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                      -{product.discountPercentage}%
                    </span>
                  </>
                )}
              </div>

              {/* Coins & Promo notes */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {product.coinsCashback && (
                  <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-md">
                    <Coins className="w-3 h-3 text-amber-600" />
                    <span>{t('Earn', 'আয় করুন')} {product.coinsCashback} {t('Coins on purchase', 'কয়েন')}</span>
                  </span>
                )}
                {product.isFreeDelivery && (
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-900 text-xs font-semibold px-2 py-0.5 rounded-md">
                    <Truck className="w-3 h-3 text-emerald-600" />
                    <span>{t('Free Delivery Available', 'ফ্রি ডেলিভারি প্রযোজ্য')}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Claimable Promotions Box */}
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-gray-700 flex items-center gap-1">
                  <TicketPercent className="w-3.5 h-3.5 text-[#16a34a]" />
                  <span>{t('Promotions & Vouchers', 'প্রমোশন ও ভাউচার')}</span>
                </span>
                <span className="text-[11px] text-[#16a34a] font-semibold">{t('Save up to ৳500', 'সর্বোচ্চ ৫০০ টাকা ছাড়')}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {vouchers.slice(0, 2).map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-2 bg-green-50 border border-dashed border-[#16a34a] px-2.5 py-1 rounded text-xs"
                  >
                    <span className="font-bold text-[#16a34a]">{v.title}</span>
                    <button
                      onClick={() => claimVoucher(v.id)}
                      disabled={v.isClaimed}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        v.isClaimed
                          ? 'bg-gray-200 text-gray-500 cursor-default'
                          : 'bg-[#16a34a] hover:bg-[#15803d] text-white'
                      }`}
                    >
                      {v.isClaimed ? t('Claimed', 'সংগৃহীত') : t('Collect', 'সংগ্রহ')}
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
                    <span className="text-xs font-semibold text-gray-600">
                      {v.name}: <strong className="text-gray-900">{selectedVariations[v.name] || v.options[0]}</strong>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {v.options.map((opt) => {
                        const isSelected = selectedVariations[v.name] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => handleVariationSelect(v.name, opt)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#16a34a] bg-green-50 text-[#16a34a] font-bold shadow-xs'
                                : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-2">
              <span className="text-xs font-semibold text-gray-600">{t('Quantity', 'পরিমাণ')}:</span>
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-100 text-gray-600 cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-12 text-center text-xs font-bold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.inStock, q + 1))}
                  className="p-2 hover:bg-gray-100 text-gray-600 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[11px] text-gray-400">
                {product.inStock} {t('items left in stock', 'টি পণ্য মজুত আছে')}
              </span>
            </div>

            {/* Action Buttons: Buy Now & Add to Cart */}
            <div className="grid grid-cols-2 gap-3 pt-3">
              <button
                onClick={() => handleAddToCart(true)}
                className="bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold py-3 px-4 rounded-lg text-sm shadow-md shadow-green-600/20 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{t('Buy Now', 'এখনই কিনুন')}</span>
              </button>

              <button
                onClick={() => handleAddToCart(false)}
                className="bg-green-50 hover:bg-green-100 text-[#16a34a] border-2 border-[#16a34a] font-extrabold py-3 px-4 rounded-lg text-sm transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{t('Add to Cart', 'কার্টে যোগ করুন')}</span>
              </button>
            </div>
          </div>

          {/* 3. Right Sidebar: Delivery, Warranty & Seller Info (Col 3) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Delivery Box */}
            <div className="bg-[#fafafa] rounded-xl p-4 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-bold text-gray-700">{t('Delivery Options', 'ডেলিভারি অপশন')}</span>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="text-xs text-[#0f136d] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MapPin className="w-3 h-3 text-[#16a34a]" />
                  <span>{t('Change', 'পরিবর্তন')}</span>
                </button>
              </div>

              <div className="flex items-start gap-2.5 text-xs">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">{activeLocation.division}</p>
                  <p className="text-[11px] text-gray-500">{activeLocation.city}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs pt-2 border-t border-gray-200">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800">{t('Standard Delivery', 'স্ট্যান্ডার্ড ডেলিভারি')}</span>
                    <span className="font-bold text-gray-900">
                      {product.deliveryFee === 0 ? t('FREE', 'ফ্রি') : formatPrice(product.deliveryFee)}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500">{product.estimatedDeliveryDays}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-gray-600 bg-white p-2 rounded border border-gray-150">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t('Cash on Delivery Available', 'ক্যাশ অন ডেলিভারি প্রযোজ্য')}</span>
              </div>
            </div>

            {/* Return & Warranty Box */}
            <div className="bg-[#fafafa] rounded-xl p-4 border border-gray-200 space-y-2.5 text-xs">
              <span className="font-bold text-gray-700 block pb-1 border-b border-gray-200">
                {t('Return & Warranty', 'রিটার্ন ও ওয়ারেন্টি')}
              </span>

              <div className="flex items-start gap-2">
                <RotateCcw className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">{product.returnPolicy}</p>
                  <p className="text-[11px] text-gray-500">{t('Change of mind is not applicable', 'পণ্য অক্ষত থাকতে হবে')}</p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800">{product.warranty}</p>
                  <p className="text-[11px] text-gray-500">{t('100% Authentic product guarantee', 'আসল পণ্যের শতভাগ নিশ্চয়তা')}</p>
                </div>
              </div>
            </div>

            {/* Seller Information Card */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-semibold">{t('Sold by', 'বিক্রেতা:')}</span>
                <button
                  onClick={() => setIsChatOpen(true)}
                  className="text-xs font-bold text-[#16a34a] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{t('Chat Now', 'সরাসরি চ্যাট')}</span>
                </button>
              </div>

              <div>
                <h4 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-gray-600" />
                  <span>{product.seller.name}</span>
                </h4>
                <p className="text-[10px] text-gray-500">{product.seller.location} • {product.seller.joinedYears} {t('years on Daraz', 'বছর ধরে দারাজে')}</p>
              </div>

              {/* Seller metrics */}
              <div className="grid grid-cols-3 gap-2 py-2 px-2 bg-gray-50 rounded-lg text-center text-xs">
                <div>
                  <p className="font-extrabold text-emerald-600">{product.seller.rating}%</p>
                  <p className="text-[9px] text-gray-500 leading-tight">{t('Positive Rating', 'পজিটিভ রেটিং')}</p>
                </div>
                <div className="border-x border-gray-200">
                  <p className="font-extrabold text-blue-600">{product.seller.shipOnTime}%</p>
                  <p className="text-[9px] text-gray-500 leading-tight">{t('Ship on Time', 'সময়মতো ডেলিভারি')}</p>
                </div>
                <div>
                  <p className="font-extrabold text-purple-600">{product.seller.chatResponse}%</p>
                  <p className="text-[9px] text-gray-500 leading-tight">{t('Chat Response', 'চ্যাট রেসপন্স')}</p>
                </div>
              </div>

              <button
                onClick={() => navigate('search', { searchQuery: product.brand })}
                className="w-full bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
              >
                {t('VISIT STORE', 'দোকান ভিজিট করুন')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Specifications & Long Description */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4 sm:p-6 space-y-6">
        <div>
          <h2 className="text-base sm:text-lg font-black text-gray-900 pb-3 border-b border-gray-150">
            {t('Product Details & Highlights', 'পণ্যের বিস্তারিত বিবরণ')}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-4">
            {(language === 'BN' ? product.descriptionBn : product.description).map((desc, i) => (
              <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16a34a] mt-2 shrink-0"></span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Specifications Table */}
        <div className="pt-4 border-t border-gray-150">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            {t('Specifications', 'টেকনিক্যাল স্পেসিফিকেশন')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-xs">
            {Object.entries(product.specifications).map(([key, val]) => (
              <div key={key} className="flex justify-between py-1.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">{key}</span>
                <span className="text-gray-900 font-semibold text-right">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Ratings & Reviews */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-150 p-4 sm:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-150">
          <div>
            <h2 className="text-base sm:text-lg font-black text-gray-900">
              {t('Ratings & Reviews', 'গ্রাহকদের রেটিং ও রিভিউ')}
            </h2>
            <p className="text-xs text-gray-500">{product.reviewsCount} {t('verified buyer ratings', 'যাচাইকৃত ক্রেতাদের রিভিউ')}</p>
          </div>

          {/* Rating filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setReviewFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                reviewFilter === 'all' ? 'bg-[#16a34a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t('All Reviews', 'সকল রিভিউ')}
            </button>
            {[5, 4, 3, 2, 1].map((stars) => (
              <button
                key={stars}
                onClick={() => setReviewFilter(stars)}
                className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                  reviewFilter === stars ? 'bg-[#16a34a] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{stars}★</span>
              </button>
            ))}
          </div>
        </div>

        {/* Rating Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div className="md:col-span-4 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0">
            <span className="text-4xl font-black text-gray-900">{product.rating}</span>
            <div className="flex text-amber-400 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs text-gray-500">{product.reviewsCount} {t('Total Ratings', 'মোট রেটিং')}</span>
          </div>

          <div className="md:col-span-8 space-y-1.5">
            {[
              { stars: 5, pct: 82 },
              { stars: 4, pct: 13 },
              { stars: 3, pct: 3 },
              { stars: 2, pct: 1 },
              { stars: 1, pct: 1 }
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-3 text-xs text-gray-600">
                <span className="w-8 font-semibold">{row.stars} ★</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="bg-[#16a34a] h-full rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="w-8 text-right text-gray-400 text-[11px]">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4 pt-2">
          {filteredReviews.length === 0 ? (
            <p className="text-center py-6 text-xs text-gray-500">
              {t('No reviews found for this filter.', 'এই ফিল্টারে কোনো রিভিউ পাওয়া যায়নি।')}
            </p>
          ) : (
            filteredReviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-gray-900">{rev.userName}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5">
                            <Check className="w-2.5 h-2.5" /> Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex text-amber-400 text-[10px]">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400">{rev.date}</span>
                </div>

                {rev.variantPurchased && (
                  <p className="text-[11px] text-gray-500">Variation: <span className="font-semibold text-gray-700">{rev.variantPurchased}</span></p>
                )}

                <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{rev.comment}</p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-2 pt-1">
                    {rev.images.map((im, i) => (
                      <img key={i} src={im} alt="review" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    ))}
                  </div>
                )}

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={() => handleHelpfulVote(rev.id)}
                    className="text-xs text-gray-500 hover:text-[#16a34a] flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>{t('Helpful', 'সাহায্য করেছে')} ({rev.helpfulCount + (helpfulVotes[rev.id] || 0)})</span>
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
            {t('People Who Viewed This Also Bought', 'অন্যান্য ক্রেতারা যা কিনেছেন')}
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
                <h4 className="font-bold text-xs truncate">{product.seller.name}</h4>
                <p className="text-[10px] text-emerald-100">● Online - Instant Response</p>
              </div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-white/80 hover:text-white font-bold text-sm cursor-pointer">
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="p-3 h-64 overflow-y-auto space-y-2 bg-gray-50 text-xs">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] p-2.5 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-[#16a34a] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-[9px] block mt-1 ${msg.sender === 'user' ? 'text-green-100' : 'text-gray-400'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChat} className="p-2 border-t border-gray-200 bg-white flex gap-2">
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
    </div>
  );
};
