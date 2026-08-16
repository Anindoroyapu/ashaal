import { Banner, Voucher } from '../types';

export const HERO_BANNERS: Banner[] = [
  {
    id: 'b-1',
    title: '11.11 Biggest Mega Sale of the Year',
    subtitle: 'Up to 80% OFF + Free Delivery + ৳1500 Voucher Code',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
    linkType: 'flash-sale',
    badge: 'MEGA SALE'
  },
  {
    id: 'b-2',
    title: 'DarazMall Brand Festival 2025',
    subtitle: '100% Authentic Brands | 14 Days Free Return Guarantee',
    image: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?w=1200&q=80',
    linkType: 'daraz-mall',
    badge: 'DARAZMALL'
  },
  {
    id: 'b-3',
    title: 'Electronics Super Fair: Smartphones & Laptops',
    subtitle: 'Extra 10% bKash & Nagad Cashback Instant Discount',
    image: 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&q=80',
    linkType: 'category',
    targetId: 'electronic-devices',
    badge: 'TECH GALA'
  },
  {
    id: 'b-4',
    title: 'Bangladeshi Traditional & Festive Fashion Collection',
    subtitle: 'Exclusive Eid & Puja Sarees, Premium Panjabis & Kurtis',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=1200&q=80',
    linkType: 'category',
    targetId: 'womens-fashion',
    badge: 'FASHION WEEK'
  },
  {
    id: 'b-5',
    title: 'Daraz Mart: Grocery Express Delivery in 2 Hours',
    subtitle: 'Fresh Food, Cooking Essentials & Household Care at Best Prices',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80',
    linkType: 'category',
    targetId: 'groceries-pets',
    badge: 'DARAZ MART'
  }
];

export const PROMO_CHANNELS = [
  {
    id: 'ch-1',
    title: 'DarazMall',
    titleBn: 'দারাজমল',
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
    title: 'Daraz Coins',
    titleBn: 'দারাজ কয়েন',
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
    title: 'Sell on Daraz',
    titleBn: 'দারাজে বিক্রি করুন',
    subtitle: 'Open Online Shop',
    icon: 'Store',
    color: 'from-orange-600 to-amber-600',
    page: 'seller-center' as const
  }
];

export const VOUCHERS_DATA: Voucher[] = [
  {
    id: 'v-1',
    code: 'DARAZBD100',
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
