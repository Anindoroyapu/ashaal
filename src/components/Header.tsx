import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CATEGORIES_DATA } from '../data/categoriesData';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  MapPin,
  Globe,
  ChevronDown,
  Menu,
  ShieldCheck,
  Zap,
  HelpCircle,
  Truck,
  Store,
  Smartphone,
  LogOut,
  Package,
  Coins
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    navigate,
    currentPage,
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    user,
    isLoggedIn,
    logout,
    setIsLoginModalOpen,
    setIsLocationModalOpen,
    activeLocation,
    t
  } = useApp();

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [activeHoverCat, setActiveHoverCat] = useState<string | null>(CATEGORIES_DATA[0].id);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate('search', { searchQuery: searchInput.trim() });
    }
  };

  const currentHoveredCategory = CATEGORIES_DATA.find((c) => c.id === activeHoverCat) || CATEGORIES_DATA[0];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs border-b border-[#e2e2e2]">
      {/* Top Utility Bar - Editorial Style */}
      <div className="bg-[#f7f7f7] text-[#212121] text-[12px] py-1 border-b border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[12px]">
            <button
              onClick={() => navigate('seller-center')}
              className="text-[#16a34a] font-semibold uppercase hover:underline flex items-center gap-1 transition-colors"
            >
              <Store className="w-3.5 h-3.5" />
              <span>{t('SAVE MORE ON APP', 'অ্যাপে বেশি ছাড়')}</span>
            </button>
            <span className="text-gray-300 hidden md:inline">|</span>
            <button
              onClick={() => navigate('seller-center')}
              className="hover:text-[#16a34a] hidden sm:flex items-center gap-1 transition-colors"
            >
              <span>{t('Sell on Ashaal', 'আশালে বিক্রি করুন')}</span>
            </button>
            <span className="text-gray-300 hidden md:inline">|</span>
            <button
              onClick={() => navigate('customer-care')}
              className="hover:text-[#16a34a] hidden md:flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('Help & Support', 'সাহায্য ও সাপোর্ট')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[12px]">
            <button
              onClick={() => navigate('track-order')}
              className="hover:text-[#16a34a] flex items-center gap-1 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>{t('Track My Order', 'অর্ডার ট্র্যাক করুন')}</span>
            </button>
            <span className="text-gray-300">|</span>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'EN' ? 'BN' : 'EN')}
              className="flex items-center gap-1 hover:text-[#16a34a] transition-colors"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="font-semibold">{language === 'EN' ? 'বাংলা' : 'ENGLISH'}</span>
            </button>

            <span className="text-gray-300">|</span>

            {/* User Account / Login */}
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-1.5 hover:text-[#16a34a] font-semibold transition-colors"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-4 h-4 rounded-full object-cover border border-[#e2e2e2]"
                  />
                  <span className="max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {isUserDropdownOpen && (
                  <div
                    onMouseLeave={() => setIsUserDropdownOpen(false)}
                    className="absolute right-0 top-7 w-48 bg-white text-[#212121] rounded shadow-lg border border-[#e2e2e2] py-1.5 z-50 text-xs font-normal animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="px-3 py-2 border-b border-[#e2e2e2] bg-[#eff0f5]">
                      <p className="font-bold text-[#16a34a]">{user.name}</p>
                      <p className="text-[10px] text-gray-500">{user.memberTier}</p>
                      <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-600 font-semibold">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>{user.coins} {t('Coins', 'কয়েন')}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        navigate('my-account');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 text-[#212121]"
                    >
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      <span>{t('Manage My Account', 'আমার একাউন্ট')}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('my-account');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 text-[#212121]"
                    >
                      <Package className="w-3.5 h-3.5 text-gray-500" />
                      <span>{t('My Orders', 'আমার অর্ডারসমূহ')}</span>
                    </button>
                    <button
                      onClick={() => {
                        navigate('coins-rewards');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-green-50 flex items-center gap-2 text-[#212121]"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span>{t('Ashaal Coins & Rewards', 'আশাল কয়েন ও রিওয়ার্ড')}</span>
                    </button>
                    <div className="border-t border-[#e2e2e2] my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t('Logout', 'লগআউট')}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 font-medium">
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hover:text-[#16a34a] transition-colors"
                >
                  {t('LOGIN', 'লগইন')}
                </button>
                <span className="text-gray-300">/</span>
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="hover:text-[#16a34a] transition-colors"
                >
                  {t('SIGN UP', 'সাইন আপ')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-[#e2e2e2]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3.5 flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo & Category Button */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-1.5 focus:outline-none group text-left cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="text-3xl sm:text-[34px] font-black italic text-[#16a34a] tracking-tight leading-none">
                  ashaal
                </span>
                <span className="text-[9px] text-[#212121]/60 font-semibold tracking-wider uppercase">BANGLADESH</span>
              </div>
            </button>

            {/* Location selector */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 text-xs text-[#212121] bg-[#eff0f5] hover:bg-gray-200/80 border border-[#e2e2e2] px-2.5 py-1.5 rounded transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#16a34a]" />
              <div className="text-left leading-tight">
                <p className="text-[10px] text-gray-500">{t('Deliver to', 'ডেলিভারি ঠিকানা')}</p>
                <p className="font-semibold text-[#212121] text-[11px] truncate max-w-[110px]">{activeLocation.city}</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 ml-0.5" />
            </button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl relative">
            <div className="flex items-center rounded overflow-hidden">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={t('Search in Ashaal', 'আশালে খুঁজুন')}
                className="w-full py-2 sm:py-2.5 px-4 text-xs sm:text-sm bg-[#eff0f5] focus:bg-white border border-[#e2e2e2] border-r-0 rounded-l focus:outline-none focus:border-[#16a34a] text-[#212121] placeholder:text-gray-400 transition-all"
              />
              <button
                type="submit"
                className="bg-[#16a34a] hover:bg-[#15803d] text-white px-5 sm:px-6 py-2 sm:py-2.5 rounded-r flex items-center justify-center font-bold text-sm transition-colors cursor-pointer border border-[#16a34a]"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </button>
            </div>
          </form>

          {/* Right Action Icons: Wishlist, Cart */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Wishlist */}
            <button
              onClick={() => navigate('my-account')}
              className="relative p-2 text-[#212121] hover:text-[#16a34a] transition-colors rounded hover:bg-green-50 hidden sm:flex items-center justify-center"
              title="Wishlist"
            >
              <Heart className="w-6 h-6" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#16a34a] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate('cart')}
              className="relative flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-[#212121] hover:text-[#16a34a] bg-[#eff0f5] hover:bg-green-50 rounded transition-colors border border-[#e2e2e2]"
            >
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-[#212121]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#16a34a] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden md:inline font-bold text-xs text-[#212121]">{t('Cart', 'কার্ট')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-bar / Categories Bar */}
      <div className="bg-white border-b border-[#e2e2e2] hidden md:block">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between text-xs font-semibold text-[#212121]">
          <div className="flex items-center gap-1">
            {/* Categories Dropdown Trigger */}
            <div
              className="relative"
              onMouseEnter={() => setIsCategoryMenuOpen(true)}
              onMouseLeave={() => setIsCategoryMenuOpen(false)}
            >
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 hover:text-[#16a34a] transition-colors ${
                  isCategoryMenuOpen ? 'text-[#16a34a] bg-green-50' : ''
                }`}
              >
                <Menu className="w-4 h-4" />
                <span>{t('Categories', 'ক্যাটেগরি সমূহ')}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Category Menu Dropdown */}
              {isCategoryMenuOpen && (
                <div className="absolute left-0 top-full w-[780px] bg-white shadow-lg rounded-b border border-[#e2e2e2] z-50 flex overflow-hidden">
                  {/* Left Categories List */}
                  <div className="w-56 bg-[#eff0f5] border-r border-[#e2e2e2] py-2">
                    {CATEGORIES_DATA.map((cat) => (
                      <div
                        key={cat.id}
                        onMouseEnter={() => setActiveHoverCat(cat.id)}
                        onClick={() => {
                          navigate('search', { categorySlug: cat.slug });
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`px-3.5 py-2 text-xs cursor-pointer flex items-center justify-between transition-colors ${
                          activeHoverCat === cat.id
                            ? 'bg-white text-[#16a34a] font-bold border-l-4 border-[#16a34a]'
                            : 'text-[#212121] hover:text-[#16a34a] hover:bg-gray-200/50'
                        }`}
                      >
                        <span className="truncate">{language === 'BN' ? cat.nameBn : cat.name}</span>
                        <span className="text-gray-400 text-xs">›</span>
                      </div>
                    ))}
                  </div>

                  {/* Right Subcategories Flyout Grid */}
                  <div className="flex-1 p-5 bg-white max-h-[380px] overflow-y-auto">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e2e2e2] mb-4">
                      <h4 className="font-bold text-sm text-[#16a34a] flex items-center gap-2">
                        {language === 'BN' ? currentHoveredCategory.nameBn : currentHoveredCategory.name}
                      </h4>
                      <button
                        onClick={() => {
                          navigate('search', { categorySlug: currentHoveredCategory.slug });
                          setIsCategoryMenuOpen(false);
                        }}
                        className="text-xs text-[#0f136d] hover:underline font-semibold"
                      >
                        {t('View All', 'সবগুলো দেখুন')} →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {currentHoveredCategory.subCategories.map((sub) => (
                        <div key={sub.id} className="space-y-1.5">
                          <button
                            onClick={() => {
                              navigate('search', { categorySlug: currentHoveredCategory.slug, filter: sub.slug });
                              setIsCategoryMenuOpen(false);
                            }}
                            className="font-bold text-xs text-[#212121] hover:text-[#16a34a] text-left block"
                          >
                            {language === 'BN' ? sub.nameBn : sub.name}
                          </button>
                          {sub.items && (
                            <ul className="space-y-1 pl-1">
                              {sub.items.slice(0, 4).map((item, idx) => (
                                <li key={idx}>
                                  <button
                                    onClick={() => {
                                      navigate('search', { searchQuery: item });
                                      setIsCategoryMenuOpen(false);
                                    }}
                                    className="text-[11px] text-gray-500 hover:text-[#16a34a] text-left block hover:underline"
                                  >
                                    {item}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Links */}
            <button
              onClick={() => navigate('daraz-mall')}
              className={`flex items-center gap-1.5 px-3 py-2.5 hover:text-[#16a34a] transition-colors ${
                currentPage === 'daraz-mall' ? 'text-[#16a34a] font-bold' : ''
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>AshaalMall</span>
            </button>

            <button
              onClick={() => navigate('flash-sale')}
              className={`flex items-center gap-1.5 px-3 py-2.5 hover:text-[#16a34a] transition-colors ${
                currentPage === 'flash-sale' ? 'text-[#16a34a] font-bold' : ''
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{t('Flash Sale', 'ফ্ল্যাশ সেল')}</span>
            </button>

            <button
              onClick={() => navigate('search', { filter: 'free-delivery' })}
              className="flex items-center gap-1.5 px-3 py-2.5 hover:text-[#16a34a] transition-colors"
            >
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('Free Delivery', 'ফ্রি ডেলিভারি')}</span>
            </button>

            <button
              onClick={() => navigate('coins-rewards')}
              className={`flex items-center gap-1.5 px-3 py-2.5 hover:text-[#16a34a] transition-colors ${
                currentPage === 'coins-rewards' ? 'text-[#16a34a] font-bold' : ''
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('Ashaal Coins', 'আশাল কয়েন')}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-gray-500">
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('100% Authentic Guaranteed', '১০০% আসল পণ্য নিশ্চয়তা')}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
