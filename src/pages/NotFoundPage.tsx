import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SEO } from '../components/SEO';
import { AlertCircle, Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { t, navigate } = useApp();
  const location = useLocation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <SEO title="404 - Page Not Found | Ashaal Bangladesh" noindex={true} />
      <div className="bg-white shadow-xs p-8 md:p-12 text-center max-w-2xl mx-auto space-y-6">
        <div className="w-20 h-20 bg-green-50 text-[#16a34a] rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <span className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t('Page Not Found', 'পৃষ্ঠাটি খুঁজে পাওয়া যায়নি')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            {t(
              `The page you are looking for "${location.pathname}" does not exist or may have been moved.`,
              `আপনি যে পেজটিতে যাওয়ার চেষ্টা করছেন "${location.pathname}" সেটি বিদ্যমান নেই অথবা সরিয়ে ফেলা হয়েছে।`
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('home')}
            className="inline-flex items-center gap-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-5 py-2.5 text-xs shadow-sm transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{t('Back to Homepage', 'হোমপেজে ফিরে যান')}</span>
          </button>

          <button
            onClick={() => navigate('search')}
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-5 py-2.5 text-xs transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>{t('Search Products', 'পণ্য সার্চ করুন')}</span>
          </button>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold px-4 py-2.5 text-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('Go Back', 'আগের পেজে যান')}</span>
          </button>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">
            {t(
              'Need help? Visit our Customer Care or chat with our live support.',
              'সহায়তার প্রয়োজন? আমাদের কাস্টমার কেয়ার ভিজিট করুন অথবা লাইভ চ্যাটে যোগাযোগ করুন।'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
