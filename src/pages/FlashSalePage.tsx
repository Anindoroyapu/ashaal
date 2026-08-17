import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS_DATA } from '../data/productsData';
import { ProductCard } from '../components/ProductCard';
import { SEO } from '../components/SEO';
import { Zap, Clock, Flame, ChevronRight, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const FlashSalePage: React.FC = () => {
  const { language, t, products: dynamicProducts } = useApp();
  const productsList = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : PRODUCTS_DATA;

  const [activeSlot, setActiveSlot] = useState<'current' | 'next' | 'tomorrow'>('current');
  const [activeCategory, setActiveCategory] = useState<'all' | 'electronics' | 'fashion' | 'home' | 'groceries'>('all');
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const flashProducts = productsList.filter((p) => {
    if (activeCategory === 'electronics') return p.categorySlug.includes('electronic');
    if (activeCategory === 'fashion') return p.categorySlug.includes('fashion');
    if (activeCategory === 'home') return p.categorySlug.includes('home') || p.categorySlug.includes('tv');
    if (activeCategory === 'groceries') return p.categorySlug.includes('groceries');
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-6">
      <SEO
        title={t('Flash Sale - Limited Time Crazy Deals | Ashaal Bangladesh', 'ফ্ল্যাশ সেল - বিশেষ সময়ের সেরা অফার | আশাল')}
        description={t('Huge discounts up to 70% off on top electronics, smartphones, fashion & beauty brands with fast home delivery across Bangladesh on Ashaal.', 'আশাল ফ্ল্যাশ সেলে পান ৭০% পর্যন্ত অবিশ্বাস্য ছাড় সেরা ব্র্যান্ড পণ্যে!')}
        keywords="flash sale, limited deals, discount bangladesh, ashaal flash deals, low price bd"
      />
      {/* Hero Banner for Flash Sale */}
      <div className="bg-gradient-to-r from-[#16a34a] via-[#22c55e] to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-green-200">
            <Flame className="w-3.5 h-3.5 fill-amber-300" /> {t('LIMITED TIME CRAZY DEALS', 'সীমিত সময়ের মেগা অফার')}
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {t('Ashaal Flash Sale Hub', 'আশাল ফ্ল্যাশ সেল হাব')}
          </h1>
          <p className="text-xs sm:text-sm text-green-100">
            {t('Up to 70% Discount on top Bangladeshi brands + Free Delivery. Stocks replenish every few hours!', 'সেরা ব্র্যান্ড পণ্যে ৭০% পর্যন্ত বিশেষ ছাড় ও দ্রুত ফ্রি ডেলিভারি!')}
          </p>
        </div>

        {/* Live Countdown Box */}
        <div className="mt-4 sm:mt-6 inline-flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/20">
          <span className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-300 animate-spin-slow" />
            {t('Active Session Ending In:', 'চলতি রাউন্ড শেষ হতে বাকি:')}
          </span>
          <div className="flex items-center gap-1 font-mono font-black text-sm">
            <span className="bg-[#16a34a] px-2 py-1 rounded shadow">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-[#16a34a] px-2 py-1 rounded shadow">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-amber-400 text-black px-2 py-1 rounded shadow">{String(timeLeft.seconds).padStart(2, '0')}</span>
          </div>
        </div>
      </div>

      {/* Time Slots Selector */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveSlot('current')}
          className={`p-3 rounded-lg text-center transition-all cursor-pointer ${
            activeSlot === 'current'
              ? 'bg-[#16a34a] text-white shadow-md'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <p className="text-xs sm:text-sm font-black">12:00 PM</p>
          <p className={`text-[11px] font-semibold ${activeSlot === 'current' ? 'text-green-100' : 'text-emerald-600'}`}>
            ● {t('On Going Now', 'এখন চলছে')}
          </p>
        </button>

        <button
          onClick={() => setActiveSlot('next')}
          className={`p-3 rounded-lg text-center transition-all cursor-pointer ${
            activeSlot === 'next'
              ? 'bg-[#16a34a] text-white shadow-md'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <p className="text-xs sm:text-sm font-black">06:00 PM</p>
          <p className={`text-[11px] font-semibold ${activeSlot === 'next' ? 'text-green-100' : 'text-gray-500'}`}>
            {t('Upcoming Next', 'পরবর্তী রাউন্ড')}
          </p>
        </button>

        <button
          onClick={() => setActiveSlot('tomorrow')}
          className={`p-3 rounded-lg text-center transition-all cursor-pointer ${
            activeSlot === 'tomorrow'
              ? 'bg-[#16a34a] text-white shadow-md'
              : 'hover:bg-gray-50 text-gray-700'
          }`}
        >
          <p className="text-xs sm:text-sm font-black">12:00 AM</p>
          <p className={`text-[11px] font-semibold ${activeSlot === 'tomorrow' ? 'text-green-100' : 'text-gray-500'}`}>
            {t('Midnight Tomorrow', 'আগামীকাল')}
          </p>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', labelEn: 'All Flash Deals', labelBn: 'সবগুলো ডিল' },
          { id: 'electronics', labelEn: 'Electronics & Audio', labelBn: 'ইলেকট্রনিক্স' },
          { id: 'fashion', labelEn: 'Clothing & Footwear', labelBn: 'ফ্যাশন ও জুতো' },
          { id: 'home', labelEn: 'Home & Kitchen', labelBn: 'হোম ও কিচেন' },
          { id: 'groceries', labelEn: 'Grocery & Essentials', labelBn: 'নিত্যপ্রয়োজনীয় বাজার' }
        ].map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id as any)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === c.id
                ? 'bg-[#16a34a] text-white shadow-sm'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {language === 'BN' ? c.labelBn : c.labelEn}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {flashProducts.map((p) => (
          <ProductCard key={p.id} product={p} variant="flash" />
        ))}
      </div>
    </div>
  );
};

export const DarazMallPage: React.FC = () => {
  const { language, navigate, vouchers, claimVoucher, t, products: dynamicProducts } = useApp();
  const productsList = dynamicProducts && dynamicProducts.length > 0 ? dynamicProducts : PRODUCTS_DATA;

  const mallBrands = [
    { name: 'Xiaomi', logo: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=120&q=80', followers: '1.4M', banner: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&q=80' },
    { name: 'Walton', logo: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=120&q=80', followers: '890k', banner: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500&q=80' },
    { name: 'Apex', logo: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=120&q=80', followers: '620k', banner: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=500&q=80' },
    { name: 'Miyako', logo: 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=120&q=80', followers: '450k', banner: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&q=80' },
    { name: 'COSRX', logo: 'https://images.unsplash.com/photo-1608248597359-28c93eb84e4f?w=120&q=80', followers: '380k', banner: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80' },
    { name: 'ASUS', logo: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=120&q=80', followers: '740k', banner: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&q=80' }
  ];

  const mallProducts = productsList.filter((p) => p.isDarazMall);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-8">
      <SEO
        title={t('AshaalMall - 100% Authentic Brand Flagship Stores | Ashaal.com.bd', 'আশালমল - ১০০% আসল অফিশিয়াল ব্র্যান্ড স্টোর')}
        description={t('Discover 100% authentic products from flagship brand stores like Xiaomi, Walton, Apex, COSRX, and ASUS with 14 days easy return on AshaalMall.', 'আশালমল থেকে কিনুন ১০০% জেনুইন অফিশিয়াল ব্র্যান্ড প্রোডাক্ট ও পান ১৪ দিনের ইজি রিটার্ন পলিসি।')}
        keywords="AshaalMall, authentic brands, official store bangladesh, genuine products bd, original warranty"
      />
      {/* Mall Header Hero */}
      <div className="bg-[#0f136d] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3 py-1 rounded-full text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t('OFFICIAL BRAND STORES', 'অফিশিয়াল ব্র্যান্ড স্টোর')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            AshaalMall Bangladesh
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
            {t('Guaranteed 100% Authentic products sourced directly from official brand manufacturers. Enjoy 14 Days Free Return & Brand Service Warranty.', '১০০% আসল পণ্যের গ্যারান্টি, ১৪ দিনের সহজ রিটার্ন এবং অফিশিয়াল ব্র্যান্ড ওয়ারেন্টি।')}
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs font-bold text-emerald-200">
            <span className="flex items-center gap-1">✓ 100% Authentic</span>
            <span className="flex items-center gap-1">✓ 14 Days Return</span>
            <span className="flex items-center gap-1">✓ Fast Express Delivery</span>
          </div>
        </div>
      </div>

      {/* Featured Mall Brand Showcases */}
      <div className="space-y-4">
        <h2 className="text-xl font-black text-[#0f136d] tracking-tight">
          {t('Featured Flagship Stores', 'শীর্ষ ফ্ল্যাগশিপ ব্র্যান্ডসমূহ')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {mallBrands.map((b) => (
            <div
              key={b.name}
              onClick={() => navigate('search', { searchQuery: b.name })}
              className="bg-white rounded-xl border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all p-3 text-center cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-16 h-16 rounded-full overflow-hidden mx-auto bg-gray-100 border border-gray-200 p-1 mb-2 group-hover:scale-105 transition-transform">
                  <img src={b.logo} alt={b.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <h3 className="font-bold text-sm text-gray-900 group-hover:text-[#16a34a]">{b.name}</h3>
                <p className="text-[10px] text-gray-400">{b.followers} {t('Followers', 'অনুসারী')}</p>
              </div>
              <span className="mt-3 inline-block w-full bg-green-50 group-hover:bg-[#16a34a] text-[#16a34a] group-hover:text-white text-[11px] font-bold py-1 rounded transition-colors">
                {t('Visit Store', 'স্টোর দেখুন')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* AshaalMall Brand Products Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-gray-200">
          <h2 className="text-xl font-black text-gray-900">
            {t('All AshaalMall Products', 'সকল আশালমল পণ্য')}
          </h2>
          <span className="text-xs text-gray-500">{mallProducts.length} {t('Verified items', 'যাচাইকৃত পণ্য')}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {mallProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
};
