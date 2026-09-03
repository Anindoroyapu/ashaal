import { Banner, Voucher } from '../types';

/**
 * Hero Banners are loaded directly from MySQL database (51.79.229.154:3306).
 * No hardcoded demo data in code.
 */
export const HERO_BANNERS: Banner[] = [];

export const PROMO_CHANNELS = [
  {
    id: 'ch-1',
    title: 'AshaalMall',
    titleBn: 'আশালমল',
    subtitle: '100% Authentic',
    icon: 'ShieldCheck',
    color: 'from-orange-500 to-red-600',
    page: 'daraz-mall' as const
  },
  {
    id: 'ch-2',
    title: 'Flash Sale',
    titleBn: 'ফ্ল্যাশ সেল',
    subtitle: 'Crazy Low Prices',
    icon: 'Zap',
    color: 'from-amber-500 to-orange-500',
    page: 'flash-sale' as const
  },
  {
    id: 'ch-3',
    title: 'Free Delivery',
    titleBn: 'ফ্রি ডেলিভারি',
    subtitle: 'Min. ৳499 Spend',
    icon: 'Truck',
    color: 'from-emerald-500 to-teal-600',
    page: 'search' as const,
    filter: 'free-delivery'
  },
  {
    id: 'ch-4',
    title: 'Ashaal Coins',
    titleBn: 'আশাল কয়েন',
    subtitle: 'Earn & Redeem',
    icon: 'Coins',
    color: 'from-yellow-400 to-amber-500',
    page: 'coins-rewards' as const
  },
  {
    id: 'ch-5',
    title: 'Voucher Max',
    titleBn: 'ভাউচার ম্যাক্স',
    subtitle: 'Up to ৳500 Off',
    icon: 'TicketPercent',
    color: 'from-purple-500 to-indigo-600',
    page: 'coins-rewards' as const
  },
  {
    id: 'ch-6',
    title: 'Global Collection',
    titleBn: 'গ্লোবাল কালেকশন',
    subtitle: 'Overseas Direct',
    icon: 'Globe',
    color: 'from-blue-500 to-cyan-600',
    page: 'search' as const,
    filter: 'overseas'
  },
  {
    id: 'ch-7',
    title: 'Everyday Low Price',
    titleBn: 'কম দামে সেরা',
    subtitle: 'Under ৳499',
    icon: 'Tag',
    color: 'from-pink-500 to-rose-600',
    page: 'search' as const,
    filter: 'under-499'
  },
  {
    id: 'ch-8',
    title: 'Sell on Ashaal',
    titleBn: 'আশালে বিক্রি করুন',
    subtitle: 'Open Online Shop',
    icon: 'Store',
    color: 'from-orange-600 to-amber-600',
    page: 'seller-center' as const
  }
];

export const VOUCHERS_DATA: Voucher[] = [
  {
    id: 'v-1',
    code: 'ASHAALBD100',
    title: '৳100 OFF Welcome Voucher',
    titleBn: '৳১০০ ছাড় স্বাগতম ভাউচার',
    discountAmount: 100,
    discountType: 'fixed',
    minSpend: 999,
    expiresAt: '2026-12-31',
    isClaimed: false,
    type: 'daraz'
  },
  {
    id: 'v-2',
    code: 'BKASH15',
    title: '15% Instant bKash Cashback Voucher',
    titleBn: '১৫% তাৎক্ষণিক বিকাশ ক্যাশব্যাক',
    discountAmount: 15,
    discountType: 'percentage',
    minSpend: 1500,
    expiresAt: '2026-12-31',
    isClaimed: true,
    type: 'bank',
    bankName: 'bKash'
  },
  {
    id: 'v-3',
    code: 'FREESHIPBD',
    title: 'Free Shipping Voucher on orders over ৳799',
    titleBn: '৳৭৯৯+ অর্ডারে ফ্রি শিপিং ভাউচার',
    discountAmount: 60,
    discountType: 'fixed',
    minSpend: 799,
    expiresAt: '2026-12-31',
    isClaimed: false,
    type: 'shipping'
  },
  {
    id: 'v-4',
    code: 'MEGABANG500',
    title: '৳500 Mega Discount on Tech & Home',
    titleBn: '৳৫০০ মেগা ডিসকাউন্ট ইলেকট্রনিক্স ও হোম',
    discountAmount: 500,
    discountType: 'fixed',
    minSpend: 4999,
    expiresAt: '2026-12-31',
    isClaimed: false,
    type: 'daraz'
  },
  {
    id: 'v-5',
    code: 'NAGAD10',
    title: '10% Nagad Payment Discount',
    titleBn: '১০% নগদ পেমেন্ট ডিসকাউন্ট',
    discountAmount: 10,
    discountType: 'percentage',
    minSpend: 2000,
    expiresAt: '2026-12-31',
    isClaimed: false,
    type: 'bank',
    bankName: 'Nagad'
  }
];
