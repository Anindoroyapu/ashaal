import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { HERO_BANNERS, PROMO_CHANNELS } from '../data/bannersData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { PRODUCTS_DATA } from '../data/productsData';
import { ProductCard } from '../components/ProductCard';
import {
  Zap,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
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
  ArrowRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { language, navigate, vouchers, claimVoucher, t } = useApp();

  // Carousel slider state
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Flash sale countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 18 });

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

  // Tab filter for "Just For You"
  const [justForYouTab, setJustForYouTab] = useState<'all' | 'electronics' | 'fashion' | 'beauty' | 'groceries'>('all');
  const [visibleCount, setVisibleCount] = useState(8);

  const flashSaleProducts = PRODUCTS_DATA.filter((p) => p.isFlashSale);
  const darazMallProducts = PRODUCTS_DATA.filter((p) => p.isDarazMall);

  const filteredJustForYou = PRODUCTS_DATA.filter((p) => {
    if (justForYouTab === 'electronics') return p.categorySlug.includes('electronic');
    if (justForYouTab === 'fashion') return p.categorySlug.includes('fashion');
    if (justForYouTab === 'beauty') return p.categorySlug.includes('beauty');
    if (justForYouTab === 'groceries') return p.categorySlug.includes('groceries');
    return true;
  });

  const getChannelIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500 fill-amber-500" />;
      case 'Truck': return <Truck className="w-6 h-6 text-emerald-600" />;
      case 'Coins': return <Coins className="w-6 h-6 text-amber-500" />;
      case 'TicketPercent': return <TicketPercent className="w-6 h-6 text-purple-600" />;
      case 'Globe': return <Globe className="w-6 h-6 text-blue-600" />;
      case 'Tag': return <Tag className="w-6 h-6 text-pink-600" />;
      case 'Store': return <Store className="w-6 h-6 text-emerald-600" />;
      default: return <Sparkles className="w-6 h-6 text-emerald-600" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 pb-12">
      {/* 1. Hero Carousel & Promo Box */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Main Banner Slider */}
          <div className="lg:col-span-9 relative rounded-xl overflow-hidden shadow-lg h-[240px] sm:h-[340px] md:h-[380px] group bg-gray-900">
            {HERO_BANNERS.map((banner, index) => (
              <div
                key={banner.id}
                onClick={() => {
                  if (banner.linkType === 'flash-sale') navigate('flash-sale');
                  else if (banner.linkType === 'daraz-mall') navigate('daraz-mall');
                  else if (banner.linkType === 'category' && banner.targetId) {
                    navigate('search', { categorySlug: banner.targetId });
                  }
                }}
                className={`absolute inset-0 transition-opacity duration-700 cursor-pointer ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-5 sm:p-8">
                  {banner.badge && (
                    <span className="inline-block w-fit bg-[#16a34a] text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider mb-2 shadow-md">
                      {banner.badge}
                    </span>
                  )}
                  <h2 className="text-white text-lg sm:text-2xl md:text-3xl font-black max-w-xl leading-tight drop-shadow-md">
                    {banner.title}
                  </h2>
                  <p className="text-gray-200 text-xs sm:text-sm mt-1 max-w-lg drop-shadow">
                    {banner.subtitle}
                  </p>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev === 0 ? HERO_BANNERS.length - 1 : prev - 1));
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide((prev) => (prev === 0 ? HERO_BANNERS.length - 1 : prev - 1));
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {HERO_BANNERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentSlide ? 'w-6 bg-[#16a34a]' : 'w-2 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Download App / Special Voucher Card */}
          <div className="lg:col-span-3 flex flex-col justify-between gap-3">
            {/* Voucher Collection Quick Card */}
            <div className="bg-gradient-to-br from-emerald-600 to-[#15803d] text-white p-4 rounded-xl shadow-md relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-extrabold uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    {t('Special Offer', 'বিশেষ অফার')}
                  </span>
                  <TicketPercent className="w-5 h-5 text-emerald-200" />
                </div>
                <h3 className="font-extrabold text-base sm:text-lg leading-tight mt-2">
                  {t('Get ৳100 OFF First Order!', 'প্রথম অর্ডারে ১০০ টাকা ছাড়!')}
                </h3>
                <p className="text-[11px] text-emerald-100 mt-1">
                  {t('Use code: DARAZBD100 on checkout', 'কুপন কোড: DARAZBD100 ব্যবহার করুন')}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-white/20 relative z-10">
                <button
                  onClick={() => claimVoucher('v-1')}
                  className="w-full bg-white hover:bg-emerald-50 text-[#16a34a] font-bold py-2 rounded-lg text-xs shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <TicketPercent className="w-3.5 h-3.5" />
                  <span>{vouchers.find((v) => v.id === 'v-1')?.isClaimed ? t('Collected ✓', 'সংগ্রহ করা হয়েছে ✓') : t('Collect Voucher', 'ভাউচার সংগ্রহ করুন')}</span>
                </button>
              </div>
            </div>

            {/* App Promotion Box */}
            <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 text-[#16a34a] rounded-lg flex items-center justify-center font-black text-xl shrink-0">
                d
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xs text-gray-900 leading-tight">
                  {t('Try Daraz App', 'দারাজ অ্যাপ ব্যবহার করুন')}
                </h4>
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {t('Faster checkout & exclusive flash deals', 'দ্রুত কেনাকাটা ও এক্সক্লুসিভ অফার')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Value Proposition Badges - Editorial Aesthetic */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-[#dcfce7] p-3 rounded flex items-center gap-3 border border-[#bbf7d0]">
            <span className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
            <div>
              <h4 className="font-bold text-xs text-[#212121]">{t('Free Shipping on ৳500+', '৳৫০০+ অর্ডারে ফ্রি শিপিং')}</h4>
              <p className="text-[10px] text-gray-600">{t('Fast door-to-door delivery', 'সারা দেশে দ্রুত ডেলিভারি')}</p>
            </div>
          </div>
          <div className="bg-[#e1f5fe] p-3 rounded flex items-center gap-3 border border-[#b3e5fc]">
            <span className="w-8 h-8 rounded-full bg-[#039be5] text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
            <div>
              <h4 className="font-bold text-xs text-[#212121]">{t('Safe & Secure Payments', 'নিরাপদ পেমেন্ট')}</h4>
              <p className="text-[10px] text-gray-600">{t('bKash, Nagad, Cards & More', 'বিকাশ, নগদ, কার্ড ও ক্যাশ')}</p>
            </div>
          </div>
          <div className="bg-[#f1f8e9] p-3 rounded flex items-center gap-3 border border-[#dcedc8]">
            <span className="w-8 h-8 rounded-full bg-[#7cb342] text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
            <div>
              <h4 className="font-bold text-xs text-[#212121]">{t('Cash on Delivery Available', 'ক্যাশ অন ডেলিভারি সুবিধা')}</h4>
              <p className="text-[10px] text-gray-600">{t('Pay upon receiving your items', 'পণ্য বুঝে পেয়ে মূল্য পরিশোধ')}</p>
            </div>
          </div>
          <div className="bg-[#fff3e0] p-3 rounded flex items-center gap-3 border border-[#ffe0b2]">
            <span className="w-8 h-8 rounded-full bg-[#fb8c00] text-white flex items-center justify-center font-bold text-xs shrink-0">4</span>
            <div>
              <h4 className="font-bold text-xs text-[#212121]">{t('7 Days Easy Return Policy', '৭ দিনের সহজ রিটার্ন')}</h4>
              <p className="text-[10px] text-gray-600">{t('100% money back guarantee', 'সহজ রিফান্ড ও রিটার্ন')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Promo Channels Navigation */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded shadow-xs border border-[#e2e2e2] p-4">
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 sm:gap-4">
            {PROMO_CHANNELS.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  if (ch.page === 'search' && ch.filter) {
                    navigate('search', { filter: ch.filter });
                  } else {
                    navigate(ch.page);
                  }
                }}
                className="flex flex-col items-center text-center p-2 rounded hover:bg-green-50/50 group transition-all"
              >
                <div className="w-12 h-12 rounded bg-[#eff0f5] group-hover:bg-[#dcfce7] flex items-center justify-center shadow-xs border border-[#e2e2e2] group-hover:border-[#16a34a] transition-colors mb-2">
                  {getChannelIcon(ch.icon)}
                </div>
                <span className="text-xs font-bold text-[#212121] group-hover:text-[#16a34a] transition-colors leading-tight">
                  {language === 'BN' ? ch.titleBn : ch.title}
                </span>
                <span className="text-[10px] text-gray-400 font-medium hidden sm:block mt-0.5">
                  {ch.subtitle}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Flash Sale Section - Editorial Style */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded shadow-xs border border-[#e2e2e2] overflow-hidden">
          {/* Flash Sale Header Bar */}
          <div className="p-3 sm:p-4 border-b border-[#e2e2e2] flex flex-wrap items-center justify-between gap-4 bg-white">
            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-[#212121] tracking-tight flex items-center gap-2">
                  <span className="text-[#16a34a]">⚡</span>
                  {t('Flash Sale', 'ফ্ল্যাশ সেল')}
                </h2>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center gap-2 text-xs font-semibold text-[#212121]">
                <span className="text-gray-500 font-medium">{t('Ending in', 'সময় বাকি')}:</span>
                <div className="flex items-center gap-1 font-mono">
                  <span className="bg-[#16a34a] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    {String(timeLeft.hours).padStart(2, '0')}
                  </span>
                  <span className="text-[#16a34a] font-bold">:</span>
                  <span className="bg-[#16a34a] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    {String(timeLeft.minutes).padStart(2, '0')}
                  </span>
                  <span className="text-[#16a34a] font-bold">:</span>
                  <span className="bg-[#16a34a] text-white px-1.5 py-0.5 rounded text-xs font-bold">
                    {String(timeLeft.seconds).padStart(2, '0')}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('flash-sale')}
              className="text-[#16a34a] hover:text-white border border-[#16a34a] hover:bg-[#16a34a] font-semibold px-4 py-1 rounded text-xs sm:text-sm transition-colors"
            >
              {t('SHOP ALL PRODUCTS', 'সব পণ্য দেখুন')}
            </button>
          </div>

          {/* Flash Sale Product Grid */}
          <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {flashSaleProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} variant="flash" />
            ))}
          </div>
        </div>
      </section>

      {/* 4. DarazMall Flagship Brands */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded shadow-xs border border-[#e2e2e2] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#e2e2e2]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-[#0f136d] tracking-tight">
                  DarazMall
                </h2>
                <p className="text-xs text-gray-500">
                  {t('100% Authentic Brands | 14 Days Return Guarantee', '১০০% আসল ব্র্যান্ড পণ্য | ১৪ দিনের সহজ রিটার্ন')}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('daraz-mall')}
              className="text-[#0f136d] hover:text-[#16a34a] font-bold text-xs flex items-center gap-1"
            >
              <span>{t('View All Brands', 'সকল ব্র্যান্ড দেখুন')}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* DarazMall Products Showcase */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {darazMallProducts.slice(0, 6).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Featured Categories Visual Showcase */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="bg-white rounded shadow-xs border border-[#e2e2e2] p-4 sm:p-5">
          <h2 className="text-base sm:text-lg font-bold text-[#212121] mb-4 pb-2 border-b border-[#e2e2e2]">
            {t('Categories', 'ক্যাটেগরি সমূহ')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-3">
            {CATEGORIES_DATA.map((cat) => (
              <button
                key={cat.id}
                onClick={() => navigate('search', { categorySlug: cat.slug })}
                className="group flex flex-col items-center text-center p-2 rounded hover:shadow-xs transition-all border border-transparent hover:border-[#e2e2e2] bg-[#eff0f5]/50 hover:bg-white"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-2 relative bg-white border border-[#e2e2e2] group-hover:scale-105 transition-transform">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-[#212121] group-hover:text-[#16a34a] transition-colors line-clamp-2">
                  {language === 'BN' ? cat.nameBn : cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Just For You Recommended Product Feed */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#16a34a] fill-[#16a34a]" />
            <h2 className="text-lg sm:text-xl font-bold text-[#212121] tracking-tight">
              {t('Just For You', 'শুধুমাত্র আপনার জন্য')}
            </h2>
          </div>

          {/* Feed Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', labelEn: 'All Items', labelBn: 'সবগুলো' },
              { id: 'electronics', labelEn: 'Electronics', labelBn: 'ইলেকট্রনিক্স' },
              { id: 'fashion', labelEn: 'Fashion', labelBn: 'ফ্যাশন' },
              { id: 'beauty', labelEn: 'Beauty', labelBn: 'রূপচর্চা' },
              { id: 'groceries', labelEn: 'Groceries', labelBn: 'মুদি বাজার' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setJustForYouTab(tab.id as any);
                  setVisibleCount(8);
                }}
                className={`px-3 py-1 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  justForYouTab === tab.id
                    ? 'bg-[#16a34a] text-white shadow-xs'
                    : 'bg-white text-[#212121] hover:bg-[#eff0f5] border border-[#e2e2e2]'
                }`}
              >
                {language === 'BN' ? tab.labelBn : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3">
          {filteredJustForYou.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredJustForYou.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 4)}
              className="bg-white hover:bg-[#eff0f5] text-[#16a34a] border border-[#16a34a] font-bold px-10 py-2.5 rounded text-xs sm:text-sm transition-colors shadow-xs cursor-pointer"
            >
              {t('LOAD MORE PRODUCTS', 'আরো পণ্য দেখুন')}
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
