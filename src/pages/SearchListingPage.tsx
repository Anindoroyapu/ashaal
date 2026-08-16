import React, { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { PRODUCTS_DATA } from '../data/productsData';
import { CATEGORIES_DATA } from '../data/categoriesData';
import { ProductCard } from '../components/ProductCard';
import {
  Filter,
  Grid,
  List,
  Star,
  ShieldCheck,
  Truck,
  Check,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  X
} from 'lucide-react';

export const SearchListingPage: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategorySlug,
    searchFilter,
    setSearchFilter,
    navigate,
    language,
    t
  } = useApp();

  const { slug: routeCategorySlug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const effectiveCategorySlug = routeCategorySlug || selectedCategorySlug || searchParams.get('category');
  const effectiveSearchQuery = searchParams.get('q') || searchQuery;
  const effectiveFilter = searchParams.get('filter') || searchFilter;

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'match' | 'price-asc' | 'price-desc' | 'rating' | 'popular'>('match');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [onlyDarazMall, setOnlyDarazMall] = useState<boolean>(false);
  const [onlyFreeDelivery, setOnlyFreeDelivery] = useState<boolean>(effectiveFilter === 'free-delivery');
  const [onlyFlashSale, setOnlyFlashSale] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available brands
  const allBrands = useMemo(() => {
    const set = new Set<string>();
    PRODUCTS_DATA.forEach((p) => set.add(p.brand));
    return Array.from(set);
  }, []);

  const activeCategory = CATEGORIES_DATA.find((c) => c.slug === effectiveCategorySlug);

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATA.filter((p) => {
      // Search text query
      if (effectiveSearchQuery.trim()) {
        const q = effectiveSearchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q) || p.titleBn.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchCat = p.category.toLowerCase().includes(q);
        if (!matchTitle && !matchBrand && !matchCat) return false;
      }

      // Category slug filter
      if (effectiveCategorySlug && p.categorySlug !== effectiveCategorySlug) {
        return false;
      }

      // Under 499 special channel filter
      if (searchFilter === 'under-499' && p.price > 499) {
        return false;
      }

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Price range
      if (minPrice && p.price < Number(minPrice)) return false;
      if (maxPrice && p.price > Number(maxPrice)) return false;

      // Rating
      if (ratingFilter && p.rating < ratingFilter) return false;

      // Services
      if (onlyDarazMall && !p.isDarazMall) return false;
      if (onlyFreeDelivery && !p.isFreeDelivery) return false;
      if (onlyFlashSale && !p.isFlashSale) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popular') return b.soldCount - a.soldCount;
      return 0; // default best match
    });
  }, [
    searchQuery,
    selectedCategorySlug,
    searchFilter,
    selectedBrands,
    minPrice,
    maxPrice,
    ratingFilter,
    onlyDarazMall,
    onlyFreeDelivery,
    onlyFlashSale,
    sortBy
  ]);

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleResetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setSelectedBrands([]);
    setRatingFilter(null);
    setOnlyDarazMall(false);
    setOnlyFreeDelivery(false);
    setOnlyFlashSale(false);
    setSearchQuery('');
    setSearchFilter(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-4">
      {/* Breadcrumb & Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button onClick={() => navigate('home')} className="hover:text-[#16a34a] cursor-pointer">
            {t('Home', 'হোম')}
          </button>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          {activeCategory ? (
            <span className="font-bold text-gray-900">
              {language === 'BN' ? activeCategory.nameBn : activeCategory.name}
            </span>
          ) : (
            <span className="font-bold text-gray-900">
              {searchQuery ? `"${searchQuery}"` : t('All Products', 'সকল পণ্য')}
            </span>
          )}
        </div>

        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden flex items-center gap-1.5 bg-white border border-gray-300 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-800 cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5 text-[#16a34a]" />
          <span>{t('Filter Products', 'ফিল্টার')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Filter Sidebar */}
        <aside
          className={`lg:col-span-3 space-y-5 bg-white p-4 rounded-xl border border-gray-200 h-fit ${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#16a34a]" />
              <span>{t('Filters', 'ফিল্টার সমূহ')}</span>
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#16a34a] hover:underline font-semibold cursor-pointer"
            >
              {t('Reset All', 'সব মুছুন')}
            </button>
          </div>

          {/* Categories Tree */}
          <div>
            <h4 className="font-bold text-xs text-gray-800 mb-2 uppercase tracking-wider">
              {t('Category', 'ক্যাটেগরি')}
            </h4>
            <div className="space-y-1 text-xs">
              <button
                onClick={() => navigate('search', { categorySlug: undefined })}
                className={`w-full text-left py-1 px-2 rounded font-medium transition-colors cursor-pointer ${
                  !selectedCategorySlug ? 'bg-green-50 text-[#16a34a] font-bold' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t('All Categories', 'সব ক্যাটেগরি')}
              </button>
              {CATEGORIES_DATA.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => navigate('search', { categorySlug: cat.slug })}
                  className={`w-full text-left py-1 px-2 rounded transition-colors cursor-pointer ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-green-50 text-[#16a34a] font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {language === 'BN' ? cat.nameBn : cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Service & Promotion Checkboxes */}
          <div className="pt-3 border-t border-gray-150">
            <h4 className="font-bold text-xs text-gray-800 mb-2 uppercase tracking-wider">
              {t('Service & Promotion', 'সেবা ও প্রমোশন')}
            </h4>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={onlyDarazMall}
                  onChange={(e) => setOnlyDarazMall(e.target.checked)}
                  className="rounded text-[#16a34a] focus:ring-[#16a34a]"
                />
                <span className="flex items-center gap-1 font-semibold text-[#0f136d]">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> AshaalMall Flagship
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={onlyFreeDelivery}
                  onChange={(e) => setOnlyFreeDelivery(e.target.checked)}
                  className="rounded text-[#16a34a] focus:ring-[#16a34a]"
                />
                <span className="flex items-center gap-1 font-semibold text-emerald-700">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" /> {t('Free Delivery', 'ফ্রি ডেলিভারি')}
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                <input
                  type="checkbox"
                  checked={onlyFlashSale}
                  onChange={(e) => setOnlyFlashSale(e.target.checked)}
                  className="rounded text-[#16a34a] focus:ring-[#16a34a]"
                />
                <span className="font-semibold text-emerald-700">
                  ⚡ {t('Flash Sale Deals', 'ফ্ল্যাশ সেল অফার')}
                </span>
              </label>
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="pt-3 border-t border-gray-150">
            <h4 className="font-bold text-xs text-gray-800 mb-2 uppercase tracking-wider">
              {t('Price Range (৳)', 'মূল্য সীমা (টাকা)')}
            </h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min ৳"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#16a34a]"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max ৳"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-xs p-2 border border-gray-300 rounded focus:outline-none focus:border-[#16a34a]"
              />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="pt-3 border-t border-gray-150">
            <h4 className="font-bold text-xs text-gray-800 mb-2 uppercase tracking-wider">
              {t('Brand', 'ব্র্যান্ড')}
            </h4>
            <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs pr-1">
              {allBrands.map((brand) => (
                <label key={brand} className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-gray-900">
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                    className="rounded text-[#16a34a] focus:ring-[#16a34a]"
                  />
                  <span>{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="pt-3 border-t border-gray-150">
            <h4 className="font-bold text-xs text-gray-800 mb-2 uppercase tracking-wider">
              {t('Rating', 'রেটিং')}
            </h4>
            <div className="space-y-1 text-xs">
              {[4.8, 4.5, 4.0].map((stars) => (
                <button
                  key={stars}
                  onClick={() => setRatingFilter(ratingFilter === stars ? null : stars)}
                  className={`w-full text-left py-1 px-2 rounded flex items-center justify-between cursor-pointer ${
                    ratingFilter === stars ? 'bg-green-50 font-bold text-[#16a34a]' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-3 h-3 fill-amber-400" />
                      ))}
                    </div>
                    <span>{stars} {t('& Up', 'ও তার বেশি')}</span>
                  </div>
                  {ratingFilter === stars && <Check className="w-3.5 h-3.5 text-[#16a34a]" />}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Main Product Listing Area */}
        <main className="lg:col-span-9 space-y-4">
          {/* Top Sort Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:px-4 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="text-xs text-gray-600">
              {t('Showing', 'দেখানো হচ্ছে')}{' '}
              <strong className="text-gray-900">{filteredProducts.length}</strong>{' '}
              {t('products', 'টি পণ্য')}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              {/* Sort By Select */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500 font-medium">{t('Sort By:', 'ক্রমানুসার:')}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-gray-50 border border-gray-300 text-gray-800 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#16a34a] font-semibold cursor-pointer"
                >
                  <option value="match">{t('Best Match', 'সেরা মিল')}</option>
                  <option value="popular">{t('Most Popular / Top Sold', 'সবচেয়ে জনপ্রিয়')}</option>
                  <option value="price-asc">{t('Price: Low to High', 'দাম: কম থেকে বেশি')}</option>
                  <option value="price-desc">{t('Price: High to Low', 'দাম: বেশি থেকে কম')}</option>
                  <option value="rating">{t('Highest Customer Rating', 'সেরা রেটিং')}</option>
                </select>
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 cursor-pointer ${viewMode === 'grid' ? 'bg-[#16a34a] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 cursor-pointer ${viewMode === 'list' ? 'bg-[#16a34a] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {(selectedBrands.length > 0 || minPrice || maxPrice || ratingFilter || onlyDarazMall || onlyFreeDelivery || onlyFlashSale) && (
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-gray-500">{t('Active Filters:', 'সক্রিয় ফিল্টার:')}</span>
              {onlyDarazMall && (
                <span className="bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  AshaalMall <button onClick={() => setOnlyDarazMall(false)} className="cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {onlyFreeDelivery && (
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  Free Delivery <button onClick={() => setOnlyFreeDelivery(false)} className="cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedBrands.map((b) => (
                <span key={b} className="bg-green-50 text-[#16a34a] border border-green-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  {b} <button onClick={() => toggleBrand(b)} className="cursor-pointer"><X className="w-3 h-3" /></button>
                </span>
              ))}
              <button
                onClick={handleResetFilters}
                className="text-xs text-[#16a34a] hover:underline font-bold cursor-pointer"
              >
                {t('Clear All', 'সব মুছুন')}
              </button>
            </div>
          )}

          {/* Products Grid / List */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-[#16a34a] mx-auto text-2xl font-bold">
                ✕
              </div>
              <h3 className="text-base font-bold text-gray-800">
                {t('No Products Found', 'কোনো পণ্য খুঁজে পাওয়া যায়নি')}
              </h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                {t('Try adjusting your search terms, removing filters, or searching for other items.', 'অন্য কোনো কি-ওয়ার্ড দিয়ে খুঁজুন অথবা ফিল্টার পরিবর্তন করুন।')}
              </p>
              <button
                onClick={handleResetFilters}
                className="bg-[#16a34a] text-white font-bold px-4 py-2 rounded-lg text-xs hover:bg-[#15803d] transition-colors cursor-pointer"
              >
                {t('Reset Filters', 'ফিল্টার রিসেট করুন')}
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} variant="horizontal" />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
