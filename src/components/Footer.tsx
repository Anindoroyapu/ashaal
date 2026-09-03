'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, RotateCcw, Headphones, Smartphone, CreditCard } from 'lucide-react';

// Import user-uploaded payment method images from /assets/paymentmethods
import pmImg1 from '../../assets/paymentmethods/download.png';
import pmImg2 from '../../assets/paymentmethods/download (1).png';
import pmImg3 from '../../assets/paymentmethods/download (2).png';
import pmImg4 from '../../assets/paymentmethods/download.jpeg';
import pmImg5 from '../../assets/paymentmethods/download (1).jpeg';
import pmImg6 from '../../assets/paymentmethods/download (2).jpeg';

export const Footer: React.FC = () => {
  const { navigate, t } = useApp();

  return (
    <footer className="bg-white border-t border-[#e2e2e2] mt-12 text-gray-500 text-xs">
      {/* Features Bar - Editorial Style */}
      <div className="border-b border-[#e2e2e2] bg-[#eff0f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#dcfce7] flex items-center justify-center text-[#16a34a] shrink-0 border border-[#bbf7d0]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#212121] text-xs sm:text-sm">{t('Nationwide Delivery', 'সারাদেশে দ্রুত ডেলিভারি')}</h4>
              <p className="text-[11px] text-gray-500">{t('Direct to your doorstep in 64 districts', '৬৪ জেলায় হোম ডেলিভারি সুবিধা')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#e1f5fe] flex items-center justify-center text-[#039be5] shrink-0 border border-[#b3e5fc]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#212121] text-xs sm:text-sm">{t('100% Authentic Products', '১০০% আসল পণ্যের নিশ্চয়তা')}</h4>
              <p className="text-[11px] text-gray-500">{t('AshaalMall official brand warranty', 'অফিশিয়াল ব্র্যান্ড ওয়ারেন্টি')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#f1f8e9] flex items-center justify-center text-[#7cb342] shrink-0 border border-[#dcedc8]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#212121] text-xs sm:text-sm">{t('14 Days Easy Return', '১৪ দিনের সহজ রিটার্ন')}</h4>
              <p className="text-[11px] text-gray-500">{t('Hassle-free refund guarantee', 'দ্রুত রিফান্ড ও রিটার্ন পলিসি')}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#fff3e0] flex items-center justify-center text-[#fb8c00] shrink-0 border border-[#ffe0b2]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#212121] text-xs sm:text-sm">{t('24/7 Customer Support', '২৪/৭ গ্রাহক সেবা')}</h4>
              <p className="text-[11px] text-gray-500">{t('Live chat & instant assistance', 'যেকোনো প্রশ্নে সরাসরি সাপোর্ট')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Customer Care */}
          <div>
            <h4 className="font-bold text-xs text-[#212121] mb-3 uppercase tracking-wider">{t('Customer Care', 'গ্রাহক সেবা')}</h4>
            <ul className="space-y-2 text-[12px] text-gray-500">
              <li>
                <button onClick={() => navigate('customer-care')} className="hover:text-[#16a34a] transition-colors text-left">
                  {t('Help Center & FAQs', 'সাহায্য কেন্দ্র ও সাধারণ প্রশ্ন')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customer-care')} className="hover:text-[#16a34a] transition-colors text-left">
                  {t('How to Buy on Ashaal', 'আশালে যেভাবে কিনবেন')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customer-care')} className="hover:text-[#16a34a] transition-colors text-left">
                  {t('Returns & Refunds', 'রিটার্ন ও রিফান্ড নীতি')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customer-care')} className="hover:text-[#16a34a] transition-colors text-left">
                  {t('Contact Us (Live Chat)', 'যোগাযোগ ও লাইভ চ্যাট')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('track-order')} className="hover:text-[#16a34a] transition-colors text-left">
                  {t('Track Your Order', 'অর্ডার ট্র্যাকিং')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Ashaal */}
          <div>
            <h4 className="font-bold text-xs text-[#212121] mb-3 uppercase tracking-wider">Ashaal Bangladesh</h4>
            <ul className="space-y-2 text-[12px] text-gray-500">
              <li>
                <button onClick={() => navigate('daraz-mall')} className="hover:text-[#16a34a] transition-colors text-left">
                  About AshaalMall
                </button>
              </li>
              <li>
                <button onClick={() => navigate('seller-center')} className="hover:text-[#16a34a] transition-colors text-[#16a34a] font-semibold text-left">
                  {t('Sell on Ashaal (Earn Money)', 'আশালে বিক্রি করুন')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('coins-rewards')} className="hover:text-[#16a34a] transition-colors text-left">
                  {t('Ashaal Coins & Rewards', 'আশাল কয়েন ও ভাউচার')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customer-care')} className="hover:text-[#16a34a] transition-colors text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => navigate('customer-care')} className="hover:text-[#16a34a] transition-colors text-left">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Payment Methods */}
          <div>
            <h4 className="font-bold text-xs text-[#212121] mb-3 uppercase tracking-wider">{t('Payment Methods', 'পেমেন্ট মাধ্যমসমূহ')}</h4>
            <div className="flex flex-wrap items-center gap-2">
              {[pmImg1, pmImg2, pmImg3, pmImg4, pmImg5, pmImg6].map((imgSrc, idx) => (
                <div
                  key={idx}
                  className="h-10 px-2 bg-white flex items-center justify-center hover:border-gray-300 transition-colors  "
                >
                  <img
                    src={typeof imgSrc === 'string' ? imgSrc : (imgSrc as any)?.src}
                    alt={`Payment Method ${idx + 1}`}
                    className="h-10 w-auto max-w-[120px] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Col 4: Download App & Follow */}
          <div>
            <h4 className="font-bold text-xs text-[#212121] mb-2 uppercase tracking-wider">{t('Exclusive Mobile Deals', 'আশাল মোবাইল ডিল')}</h4>
            <p className="text-[11px] text-gray-500 mb-3">
              {t('Scan QR or download the app for extra ৳200 voucher discount on your first order!', 'প্রথম অর্ডারে অতিরিক্ত ২০০ টাকা ভাউচার পেতে অ্যাপ ডাউনলোড করুন!')}
            </p>
            <div className="flex items-start gap-3">
              {/* Real dynamic scannable QR Code that redirects to this website */}
              <div
                title="Scan to open Ashaal on Mobile"
                className="w-20 h-20 bg-white border border-[#e2e2e2] p-1 shrink-0 flex flex-col items-center justify-center shadow-xs group cursor-pointer"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    window.open(window.location.origin, '_blank');
                  }
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&margin=0&color=16-163-74&data=${encodeURIComponent(
                    typeof window !== 'undefined' ? window.location.origin : 'https://ashall.com'
                  )}`}
                  alt="Ashaal Website QR Code"
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Badges: App Store, Google Play, AppGallery */}
              <div className="space-y-1.5 flex-1 min-w-[130px]">
                {/* App Store Badge */}
                <a
                  href="#download-appstore"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://www.apple.com/app-store/', '_blank', 'noopener,noreferrer');
                  }}
                  className="bg-black hover:bg-neutral-800 text-white px-2.5 py-1 rounded-[5px] flex items-center gap-2 border border-neutral-700 transition-all shadow-xs cursor-pointer select-none"
                >
                  <svg className="w-4 h-4 fill-current shrink-0 text-white" viewBox="0 0 170 170">
                    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.77-7.94-12.24-14.58-6.19-9.17-11.13-19.86-14.83-32.07-3.7-12.21-5.55-23.75-5.55-34.62 0-14.07 3.51-26.04 10.53-35.91 7.02-9.87 16.03-14.89 27.03-15.06 4.79 0 10.37 1.34 16.73 4.02 6.36 2.68 10.15 4.09 11.38 4.23 1.01-.14 4.96-1.58 11.85-4.32 6.89-2.74 12.51-3.95 16.85-3.63 12.63.78 22.84 5.37 30.64 13.78-11.05 6.69-16.46 15.9-16.23 27.63.22 9.27 3.79 17.06 10.71 23.36 6.92 6.31 15.22 9.94 24.9 10.9-2.45 7.47-5.46 14.73-9.03 21.78zM119.22 33.04c0-7.36 2.68-14.28 8.04-20.76 5.36-6.47 11.94-10.57 19.74-12.28.23 1.34.34 2.68.34 4.02 0 7.36-2.85 14.54-8.55 21.53-5.7 6.99-12.44 11.02-20.22 12.09-.23-1.56-.35-3.09-.35-4.6z" />
                  </svg>
                  <div className="leading-none text-left">
                    <span className="block text-[7.5px] text-gray-300 font-medium tracking-wide">Available on the</span>
                    <span className="block text-[11px] font-bold text-white tracking-tight">App Store</span>
                  </div>
                </a>

                {/* Google Play Badge */}
                <a
                  href="#download-googleplay"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://play.google.com/store', '_blank', 'noopener,noreferrer');
                  }}
                  className="bg-black hover:bg-neutral-800 text-white px-2.5 py-1 rounded-[5px] flex items-center gap-2 border border-neutral-700 transition-all shadow-xs cursor-pointer select-none"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 512 512">
                    <path fill="#00C1A6" d="M32.5 28.5L256 252 32.5 475.5c-4.2-4.2-6.5-10.2-6.5-16.5V53c0-9.2 4.4-17.7 11.5-24.5h-5z" />
                    <path fill="#0083D6" d="M32.5 28.5c2.3-2.2 5-3.9 8-5 9.8-3.6 20.9-.3 27.5 5.9L348 200.5 256 252 32.5 28.5z" />
                    <path fill="#FF334B" d="M32.5 475.5L256 252l92 51.5-280 171.1c-6.6 6.2-17.7 9.5-27.5 5.9-3-1.1-5.7-2.8-8-5z" />
                    <path fill="#FFD400" d="M479.5 238.5l-131.5-87-92 100.5 92 51.5 131.5-87c6.6-4.4 10.5-11.8 10.5-19s-3.9-14.6-10.5-19z" />
                  </svg>
                  <div className="leading-none text-left">
                    <span className="block text-[7px] text-gray-300 font-bold uppercase tracking-wider">ANDROID APP ON</span>
                    <span className="block text-[11px] font-bold text-white tracking-tight">Google play</span>
                  </div>
                </a>

                {/* Huawei AppGallery Badge */}
                <a
                  href="#download-appgallery"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open('https://appgallery.huawei.com/', '_blank', 'noopener,noreferrer');
                  }}
                  className="bg-black hover:bg-neutral-800 text-white px-2.5 py-1 rounded-[5px] flex items-center gap-2 border border-neutral-700 transition-all shadow-xs cursor-pointer select-none"
                >
                  <div className="w-4 h-4 bg-[#cf0a2c] rounded-[3px] flex flex-col items-center justify-center p-0.5 shrink-0">
                    <svg className="w-2.5 h-2.5 text-white fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                    <span className="text-[4px] font-extrabold text-white leading-none">HUAWEI</span>
                  </div>
                  <div className="leading-none text-left">
                    <span className="block text-[7px] text-gray-300 font-bold uppercase tracking-wider">EXPLORE IT ON</span>
                    <span className="block text-[11px] font-bold text-white tracking-tight">AppGallery</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#e2e2e2] flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#16a34a]">ashaal.com.bd</span>
            <span>© 2026 Ashaal Bangladesh Ltd. All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:underline cursor-pointer">DBID: 749204821</span>
            <span className="hover:underline cursor-pointer">Trade License: TRAD/DNCC/098421</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
