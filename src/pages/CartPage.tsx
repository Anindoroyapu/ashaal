import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CartItem } from '../types';
import { SEO } from '../components/SEO';
import { ShoppingCart, Trash2, ShieldCheck, Truck, ArrowRight, TicketPercent, Coins, Store, Plus, Minus } from 'lucide-react';

interface SellerCartGroup {
  seller: any;
  items: CartItem[];
}

export const CartPage: React.FC = () => {
  const {
    cart,
    cartCount,
    updateCartItemQuantity,
    removeFromCart,
    toggleSelectCartItem,
    selectAllCartItems,
    navigate,
    user,
    language,
    showToast,
    t
  } = useApp();

  const [voucherCode, setVoucherCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [useCoins, setUseCoins] = useState(false);

  const selectedItems = cart.filter((i) => i.selected);
  const isAllSelected = cart.length > 0 && cart.every((i) => i.selected);

  const subtotal = selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shippingFee = selectedItems.length > 0 ? (selectedItems.some((i) => !i.product.isFreeDelivery) ? 60 : 0) : 0;
  const coinsDiscount = useCoins ? Math.min(Math.floor(user.coins / 10), Math.floor(subtotal * 0.1)) : 0;
  const total = Math.max(0, subtotal + shippingFee - appliedDiscount - coinsDiscount);

  const formatPrice = (price: number) => {
    return '৳' + price.toLocaleString('en-BD');
  };

  const handleApplyVoucher = (e: React.FormEvent) => {
    e.preventDefault();
    const code = voucherCode.trim().toUpperCase();
    if (code === 'ASHAALBD100' || code === 'DARAZBD100' || code === 'ASHAAL100' || code === 'DARAZ100') {
      setAppliedDiscount(100);
      showToast(t('Voucher ASHAALBD100 applied! ৳100 discount', 'ASHAALBD100 ভাউচার সফল! ১০০ টাকা ছাড়'));
    } else if (code === 'BKASH15') {
      const disc = Math.round(subtotal * 0.15);
      setAppliedDiscount(disc);
      showToast(t(`bKash 15% voucher applied! ৳${disc} discount`, `বিকাশ ১৫% ভাউচার সফল! ৳${disc} ছাড়`));
    } else {
      showToast(t('Invalid or expired voucher code. Try ASHAALBD100 or BKASH15', 'ভাউচার কোডটি সঠিক নয়। ASHAALBD100 বা BKASH15 চেষ্টা করুন'));
    }
  };

  // Group cart items by seller
  const itemsBySeller = cart.reduce((acc, item) => {
    const sellerName = item.product.seller.name;
    if (!acc[sellerName]) {
      acc[sellerName] = {
        seller: item.product.seller,
        items: []
      };
    }
    acc[sellerName].items.push(item);
    return acc;
  }, {} as Record<string, SellerCartGroup>);

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-16 text-center">
        <SEO title={t('Shopping Cart | Ashaal.com.bd', 'শপিং কার্ট | আশাল')} noindex={true} />
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-[#16a34a] mx-auto">
            <ShoppingCart className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">
            {t('Your Cart is Empty', 'আপনার কার্টটি খালি')}
          </h2>
          <p className="text-xs text-gray-500">
            {t('Looks like you haven’t added anything to your cart yet. Explore Flash Sales, AshaalMall and best deals today!', 'আশালের হাজারো সেরা পণ্য ও ফ্ল্যাশ সেল অফার থেকে এখনই পছন্দের পণ্য যোগ করুন।')}
          </p>
          <button
            onClick={() => navigate('home')}
            className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow-md shadow-green-600/20 cursor-pointer"
          >
            {t('CONTINUE SHOPPING', 'শপিং চালিয়ে যান')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <SEO title={t(`Shopping Cart (${cartCount} items) | Ashaal Bangladesh`, `শপিং কার্ট (${cartCount} পণ্য) | আশাল`)} noindex={true} />
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
        {t('Shopping Cart', 'শপিং কার্ট')} ({cartCount} {t('items', 'পণ্য')})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {/* Select All Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-3.5 flex items-center justify-between shadow-xs">
            <label className="flex items-center gap-3 cursor-pointer text-xs font-bold text-gray-800">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => selectAllCartItems(e.target.checked)}
                className="w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
              />
              <span>{t('SELECT ALL', 'সবগুলো নির্বাচন করুন')} ({cart.length} {t('ITEMS', 'পণ্য')})</span>
            </label>

            <button
              onClick={() => {
                cart.forEach((i) => removeFromCart(i.id));
              }}
              className="text-xs text-red-600 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('Delete All', 'সব মুছুন')}</span>
            </button>
          </div>

          {/* Grouped by Seller */}
          {(Object.entries(itemsBySeller) as [string, SellerCartGroup][]).map(([sellerName, group]) => (
            <div key={sellerName} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
              {/* Seller Header */}
              <div className="bg-gray-50/80 px-4 py-2.5 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-800">
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-600" />
                  <span>{sellerName}</span>
                  {group.seller.isOfficial && (
                    <span className="bg-[#0f136d] text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                      Mall Flagship
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-gray-500 font-normal">{group.seller.location}</span>
              </div>

              {/* Items in this Store */}
              <div className="divide-y divide-gray-150 p-4 space-y-4">
                {group.items.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex gap-3 sm:gap-4 items-start">
                    {/* Item Checkbox */}
                    <input
                      type="checkbox"
                      checked={item.selected}
                      onChange={() => toggleSelectCartItem(item.id)}
                      className="mt-2 w-4 h-4 rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />

                    {/* Product Image */}
                    <div
                      onClick={() => navigate('product-details', { productId: item.product.id })}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gray-50 border border-gray-200 overflow-hidden shrink-0 cursor-pointer"
                    >
                      <img src={item.product.mainImage} alt={item.product.title} className="w-full h-full object-contain p-1" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3
                        onClick={() => navigate('product-details', { productId: item.product.id })}
                        className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 hover:text-[#16a34a] cursor-pointer"
                      >
                        {language === 'BN' ? item.product.titleBn : item.product.title}
                      </h3>

                      {/* Selected Variations */}
                      {Object.keys(item.selectedVariations).length > 0 && (
                        <div className="flex flex-wrap gap-1 text-[11px] text-gray-500">
                          {Object.entries(item.selectedVariations).map(([k, v]) => (
                            <span key={k} className="bg-gray-100 px-1.5 py-0.5 rounded">
                              {k}: <strong>{v}</strong>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-sm sm:text-base font-black text-[#16a34a]">
                          {formatPrice(item.product.price)}
                        </span>
                        {item.product.discountPercentage > 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            {formatPrice(item.product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Delete */}
                    <div className="flex flex-col items-end justify-between self-stretch">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white text-xs">
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-gray-100 text-gray-600 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4 shadow-sm">
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 pb-2 border-b border-gray-150">
              {t('Order Summary', 'অর্ডার সারাংশ')}
            </h3>

            {/* Voucher Input */}
            <form onSubmit={handleApplyVoucher} className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">
                {t('Have a Voucher / Promo Code?', 'ভাউচার কোড আছে?')}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. ASHAALBD100"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 uppercase focus:outline-none focus:border-[#16a34a]"
                />
                <button
                  type="submit"
                  className="bg-gray-900 hover:bg-black text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  {t('Apply', 'প্রয়োগ')}
                </button>
              </div>
            </form>

            {/* Coin Redemption Option */}
            <div className="bg-amber-50/70 p-3 rounded-lg border border-amber-200/60 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <p className="font-bold text-amber-900">{t('Redeem Ashaal Coins', 'আশাল কয়েন ব্যবহার করুন')}</p>
                  <p className="text-[11px] text-amber-700">{user.coins} {t('coins available (Save up to ৳48)', 'কয়েন আছে (৳৪৮ পর্যন্ত ছাড়)')}</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={useCoins}
                onChange={(e) => setUseCoins(e.target.checked)}
                className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
              />
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs pt-2 border-t border-gray-150">
              <div className="flex justify-between text-gray-600">
                <span>{t('Subtotal', 'উপমোট')} ({selectedItems.length} {t('items', 'পণ্য')})</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>{t('Shipping Fee', 'ডেলিভারি চার্জ')}</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">{t('FREE', 'ফ্রি')}</strong> : formatPrice(shippingFee)}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>{t('Voucher Discount', 'ভাউচার ডিসকাউন্ট')}</span>
                  <span>-{formatPrice(appliedDiscount)}</span>
                </div>
              )}

              {coinsDiscount > 0 && (
                <div className="flex justify-between text-amber-600 font-semibold">
                  <span>{t('Coins Discount', 'কয়েন ডিসকাউন্ট')}</span>
                  <span>-{formatPrice(coinsDiscount)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm sm:text-base font-black text-gray-900 pt-2 border-t border-gray-200">
                <span>{t('Total Amount', 'সর্বমোট মূল্য')}</span>
                <span className="text-[#16a34a] text-lg sm:text-xl font-black">{formatPrice(total)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => {
                if (selectedItems.length === 0) {
                  showToast(t('Please select at least one item to checkout.', 'চেকআউট করতে অনুগ্রহ করে অন্তত একটি পণ্য নির্বাচন করুন।'));
                  return;
                }
                navigate('checkout');
              }}
              disabled={selectedItems.length === 0}
              className={`w-full font-black py-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                selectedItems.length === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#16a34a] hover:bg-[#15803d] text-white shadow-green-600/20 cursor-pointer'
              }`}
            >
              <span>{t('PROCEED TO CHECKOUT', 'চেকআউটে যান')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-200 text-xs text-gray-500 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-gray-800">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Ashaal Buyer Protection Guarantee</span>
            </div>
            <p className="text-[11px]">
              Full refund if item is not as described, damaged, or not received within promised delivery date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
