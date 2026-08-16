import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Truck, RotateCcw, Headphones, Smartphone, CreditCard } from 'lucide-react';

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
              <p className="text-[11px] text-gray-500">{t('DarazMall official brand warranty', 'অফিশিয়াল ব্র্যান্ড ওয়ারেন্টি')}</p>
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
                  {t('How to Buy on Daraz', 'দারাজে যেভাবে কিনবেন')}
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

          {/* Col 2: Daraz */}
          <div>
            <h4 className="font-bold text-xs text-[#212121] mb-3 uppercase tracking-wider">Daraz Bangladesh</h4>
            <ul className="space-y-2 text-[12px] text-gray-500">
              <li>
                <button onClick={() => navigate('daraz-mall')} className="hover:text-[#16a34a] transition-colors text-left">
                  About DarazMall
                </button>
              </li>
              <li>
                <button onClick={() => navigate('seller-center')} className="hover:text-[#16a34a] transition-colors text-[#16a34a] font-semibold text-left">
                  {t('Sell on Daraz (Earn Money)', 'দারাজে বিক্রি করুন')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate('coins-rewards')} className="hover:text-[#16a34a] transition-colors text-left">
                  {t('Daraz Coins & Rewards', 'দারাজ কয়েন ও ভাউচার')}
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

          {/* Col 3: Payment Methods & Daraz International */}
          <div>
            <h4 className="font-bold text-xs text-[#212121] mb-3 uppercase tracking-wider">{t('Payment Methods', 'পেমেন্ট মাধ্যমসমূহ')}</h4>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <span className="px-2 py-0.5 bg-pink-50 border border-pink-200 text-pink-600 font-bold rounded text-[10px]">
                bKash
              </span>
              <span className="px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-600 font-bold rounded text-[10px]">
                Nagad
              </span>
              <span className="px-2 py-0.5 bg-purple-50 border border-purple-200 text-purple-600 font-bold rounded text-[10px]">
                Rocket
              </span>
              <span className="px-2 py-0.5 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded text-[10px]">
                VISA
              </span>
              <span className="px-2 py-0.5 bg-red-50 border border-red-200 text-red-600 font-bold rounded text-[10px]">
                Mastercard
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold rounded text-[10px]">
                Cash On Delivery
              </span>
            </div>

            <h5 className="font-bold text-[11px] text-[#212121] mb-1.5 uppercase">{t('Daraz International', 'দারাজ আন্তর্জাতিক')}</h5>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="hover:text-[#16a34a] cursor-pointer">🇧🇩 Bangladesh</span>
              <span>•</span>
              <span className="hover:text-[#16a34a] cursor-pointer">🇵🇰 Pakistan</span>
              <span>•</span>
              <span className="hover:text-[#16a34a] cursor-pointer">🇱🇰 Sri Lanka</span>
              <span>•</span>
              <span className="hover:text-[#16a34a] cursor-pointer">🇳🇵 Nepal</span>
            </div>
          </div>

          {/* Col 4: Download App & Follow */}
          <div>
            <h4 className="font-bold text-xs text-[#212121] mb-3 uppercase tracking-wider">{t('Exclusive Mobile Deals', 'দারাজ অ্যাপ ডাউনলোড')}</h4>
            <p className="text-[11px] text-gray-500 mb-3">
              {t('Scan QR or download the app for extra ৳200 voucher discount on your first order!', 'প্রথম অর্ডারে অতিরিক্ত ২০০ টাকা ভাউচার পেতে অ্যাপ ডাউনলোড করুন!')}
            </p>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-[#eff0f5] rounded border border-[#e2e2e2] p-1 flex items-center justify-center">
                <div className="w-full h-full bg-[#212121] rounded flex flex-col items-center justify-center text-white text-[8px] font-mono">
                  <span>[QR]</span>
                  <span className="text-[7px]">DARAZ</span>
                </div>
              </div>
              <div className="space-y-1.5 flex-1">
                <button
                  onClick={() => alert('Download Daraz App on Google Play Store')}
                  className="w-full bg-[#212121] hover:bg-[#16a34a] text-white text-[10px] font-semibold py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>Google Play</span>
                </button>
                <button
                  onClick={() => alert('Download Daraz App on Apple App Store')}
                  className="w-full bg-[#212121] hover:bg-[#16a34a] text-white text-[10px] font-semibold py-1.5 px-2 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3 h-3" />
                  <span>App Store</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-[#e2e2e2] flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#16a34a]">daraz.com.bd</span>
            <span>© 2026 Daraz Bangladesh Ltd. An Alibaba Group Company. All Rights Reserved.</span>
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
