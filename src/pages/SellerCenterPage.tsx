import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Store,
  TrendingUp,
  Truck,
  DollarSign,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Coins,
  Sparkles,
  Gift,
  TicketPercent,
  CalendarCheck
} from 'lucide-react';

export const SellerCenterPage: React.FC = () => {
  const { language, t, showToast, navigate } = useApp();

  const [sellerName, setSellerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('Electronics & Gadgets');
  const [isRegistered, setIsRegistered] = useState(false);

  // Profit/Fee calculator state
  const [calcPrice, setCalcPrice] = useState('1500');
  const [calcCategory, setCalcCategory] = useState<'electronics' | 'fashion' | 'beauty' | 'groceries'>('electronics');

  const getCommissionRate = () => {
    switch (calcCategory) {
      case 'electronics': return 0.05;
      case 'fashion': return 0.08;
      case 'beauty': return 0.06;
      case 'groceries': return 0.04;
      default: return 0.05;
    }
  };

  const itemPrice = Number(calcPrice) || 0;
  const commission = Math.round(itemPrice * getCommissionRate());
  const paymentFee = Math.round(itemPrice * 0.015);
  const sellerPayout = itemPrice - commission - paymentFee;

  const handleRegisterSeller = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !shopName || !phone) {
      showToast('Please fill all fields.');
      return;
    }
    setIsRegistered(true);
    showToast('Congratulations! Your Daraz BD seller shop has been submitted for review.');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-8 space-y-10">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#16a34a] via-[#15803d] to-[#166534] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Store className="w-4 h-4 text-amber-300" />
            {t('DARAZ SELLER CENTER BANGLADESH', 'দারাজ সেলার সেন্টার বাংলাদেশ')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            {t('Reach Millions of Customers Across Bangladesh', 'আপনার ব্যবসা ছড়িয়ে দিন দেশজুড়ে লক্ষাধিক ক্রেতার কাছে')}
          </h1>
          <p className="text-sm sm:text-base text-green-100 leading-relaxed">
            {t('Join 50,000+ active sellers. Enjoy low commission rates, automated Daraz Express logistics, and weekly payments directly to your bank account.', 'সহজ রেজিস্ট্রেশন, দেশব্যাপী দ্রুত ডেলিভারি সুবিধা ও সরাসরি ব্যাংক অ্যাকাউন্টে সাপ্তাহিক পেমেন্ট।')}
          </p>
        </div>
      </div>

      {/* 4-Step How It Works Grid */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center">
          {t('How to Sell on Daraz in 4 Simple Steps', 'দারাজে বিক্রি করার সহজ ৪টি ধাপ')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Register Shop', desc: 'Sign up with NID, Trade License, and Bangladeshi Bank Account details.' },
            { step: '02', title: 'List Products', desc: 'Upload photos, descriptions, and pricing using the Daraz Seller Hub.' },
            { step: '03', title: 'Receive & Pack Orders', desc: 'Get order notifications, pack products, and drop off at nearby DEX Hub.' },
            { step: '04', title: 'Get Paid Weekly', desc: 'Receive secure payouts directly transferred to your bank every 7 days.' }
          ].map((s) => (
            <div key={s.step} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-2 relative">
              <span className="text-3xl font-black text-green-100 block">{s.step}</span>
              <h3 className="font-bold text-sm text-gray-900">{s.title}</h3>
              <p className="text-xs text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Seller Registration Form & Earnings Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Registration Form */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 pb-2 border-b border-gray-150">
            {t('Create Your Seller Account Today', 'সেলার অ্যাকাউন্ট নিবন্ধন ফরম')}
          </h2>

          {isRegistered ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-emerald-900">Application Submitted!</h3>
              <p className="text-xs text-emerald-700">
                Your shop "{shopName}" is now under review by Daraz Verification Team. You will receive an SMS within 24 hours.
              </p>
              <button
                onClick={() => navigate('home')}
                className="bg-[#16a34a] text-white font-bold px-4 py-2 rounded-lg text-xs mt-2 cursor-pointer"
              >
                Return to Homepage
              </button>
            </div>
          ) : (
            <form onSubmit={handleRegisterSeller} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Owner / Full Name</label>
                  <input
                    type="text"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. Mohammad Rahim"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Shop / Business Name</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Rahim Fashion & Mart"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Mobile Number (+880)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Primary Product Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#16a34a]"
                  >
                    <option>Electronics & Gadgets</option>
                    <option>Fashion & Apparel</option>
                    <option>Home & Kitchen</option>
                    <option>Groceries & Organic Food</option>
                    <option>Beauty & Health</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-extrabold py-3 rounded-lg text-sm transition-all shadow-md shadow-green-600/25 cursor-pointer"
              >
                SUBMIT SELLER APPLICATION
              </button>
            </form>
          )}
        </div>

        {/* Right: Commission & Payout Calculator */}
        <div className="lg:col-span-5 bg-gray-50 rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-4">
          <h3 className="font-extrabold text-sm sm:text-base text-gray-900 flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-600" />
            <span>{t('Seller Commission Calculator', 'সেলার আয় ও কমিশন ক্যালকুলেটর')}</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Product Sale Price (৳)</label>
              <input
                type="number"
                value={calcPrice}
                onChange={(e) => setCalcPrice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white font-bold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={calcCategory}
                onChange={(e) => setCalcCategory(e.target.value as any)}
                className="w-full p-2 border border-gray-300 rounded-lg bg-white font-semibold"
              >
                <option value="electronics">Electronics (5% commission)</option>
                <option value="fashion">Fashion (8% commission)</option>
                <option value="beauty">Beauty & Personal (6% commission)</option>
                <option value="groceries">Groceries (4% commission)</option>
              </select>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-2 pt-3">
              <div className="flex justify-between text-gray-600">
                <span>Product Price:</span>
                <span className="font-bold text-gray-900">৳{itemPrice}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Daraz Marketplace Fee:</span>
                <span className="text-red-500 font-semibold">-৳{commission}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Payment Gateway Fee (1.5%):</span>
                <span className="text-red-500 font-semibold">-৳{paymentFee}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-emerald-700 pt-2 border-t border-gray-200">
                <span>Your Net Weekly Payout:</span>
                <span className="text-base font-black text-emerald-600">৳{sellerPayout}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const CoinsRewardsPage: React.FC = () => {
  const { user, addCoins, claimVoucher, vouchers, language, t, showToast } = useApp();

  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);

  const streakDays = [
    { day: 1, reward: 20, done: true },
    { day: 2, reward: 30, done: true },
    { day: 3, reward: 40, done: hasCheckedInToday, active: !hasCheckedInToday },
    { day: 4, reward: 50, done: false },
    { day: 5, reward: 60, done: false },
    { day: 6, reward: 70, done: false },
    { day: 7, reward: 150, done: false, bonus: true }
  ];

  const handleDailyCheckIn = () => {
    if (hasCheckedInToday) {
      showToast(t('Already claimed today! Check back tomorrow.', 'আজকের কয়েন সংগ্রহ করা হয়েছে!'));
      return;
    }
    setHasCheckedInToday(true);
    addCoins(40);
    showToast(t('🎉 Claimed 40 Daraz Coins successfully!', '🎉 সফলভাবে ৪০ কয়েন সংগ্রহ করেছেন!'));
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Coins Hero Card */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-[#15803d] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-left">
          <span className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
            <Coins className="w-4 h-4 text-amber-200" />
            {t('DARAZ CLUB REWARDS', 'দারাজ ক্লাব রিওয়ার্ডস')}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black">
            {user.coins} {t('Daraz Coins', 'দারাজ কয়েন')}
          </h1>
          <p className="text-xs text-green-100 max-w-sm">
            {t('10 Coins = ৳1 discount. Use coins directly at checkout to save extra cash!', '১০ কয়েন = ১ টাকা ছাড়। চেকআউটে কয়েন রিডিম করে অতিরিক্ত ডিসকাউন্ট পান!')}
          </p>
        </div>

        <button
          onClick={handleDailyCheckIn}
          disabled={hasCheckedInToday}
          className={`px-6 py-3.5 rounded-xl font-black text-xs sm:text-sm shadow-lg transition-all flex items-center gap-2 ${
            hasCheckedInToday
              ? 'bg-white/30 text-white cursor-default'
              : 'bg-white text-[#16a34a] hover:bg-green-50 cursor-pointer animate-pulse'
          }`}
        >
          <CalendarCheck className="w-5 h-5" />
          <span>{hasCheckedInToday ? t('CHECKED IN TODAY ✓', 'আজ সংগ্রহ সম্পন্ন ✓') : t('CLAIM DAILY BONUS (+40)', 'দৈনিক বোনাস নিন (+৪০)')}</span>
        </button>
      </div>

      {/* 7-Day Daily Streak Board */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>{t('7-Day Daily Check-In Streak', '৭ দিনের ধারাবাহিক চেক-ইন')}</span>
        </h2>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
          {streakDays.map((d) => (
            <div
              key={d.day}
              className={`p-3 rounded-xl border text-center transition-all ${
                d.done
                  ? 'bg-amber-50 border-amber-300'
                  : d.active
                  ? 'bg-green-50 border-[#16a34a] shadow-xs'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <span className="text-[11px] font-bold text-gray-500 block">Day {d.day}</span>
              <Coins className="w-6 h-6 text-amber-500 mx-auto my-1" />
              <span className="text-xs font-black text-gray-900">+{d.reward}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Exchange Coins for Vouchers */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 shadow-sm space-y-4">
        <h2 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
          <TicketPercent className="w-5 h-5 text-[#16a34a]" />
          <span>{t('Exchange Coins for Special Vouchers', 'কয়েন এক্সচেঞ্জ করে ভাউচার সংগ্রহ করুন')}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { id: 'cv-1', cost: 150, title: '৳50 OFF Voucher', min: 400, desc: 'Valid on All Fashion items' },
            { id: 'cv-2', cost: 300, title: '৳120 OFF Voucher', min: 1000, desc: 'Valid on DarazMall Brands' },
            { id: 'cv-3', cost: 500, title: 'Free Delivery Voucher', min: 500, desc: 'Nationwide Free Delivery' }
          ].map((v) => (
            <div key={v.id} className="p-4 rounded-xl border border-dashed border-emerald-300 bg-emerald-50/40 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  Cost: {v.cost} Coins
                </span>
                <h3 className="font-extrabold text-sm text-gray-900 mt-2">{v.title}</h3>
                <p className="text-xs text-gray-600">{v.desc}</p>
                <p className="text-[10px] text-gray-400 mt-1">Min Spend: ৳{v.min}</p>
              </div>

              <button
                onClick={() => {
                  if (user.coins < v.cost) {
                    showToast('Not enough coins!');
                    return;
                  }
                  claimVoucher('v-1');
                  showToast('Voucher exchanged successfully!');
                }}
                className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer"
              >
                Exchange Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
