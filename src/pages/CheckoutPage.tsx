import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DeliveryAddress } from '../types';
import {
  MapPin,
  Truck,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  Plus,
  ArrowLeft,
  X,
  Lock,
  Smartphone,
  Info
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    addresses,
    addAddress,
    placeOrder,
    navigate,
    user,
    language,
    showToast,
    t
  } = useApp();

  const selectedItems = cart.filter((i) => i.selected);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || '');
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'rocket' | 'card' | 'cod'>('bkash');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);

  // bKash Modal Simulation State
  const [isBkashModalOpen, setIsBkashModalOpen] = useState(false);
  const [bkashNumber, setBkashNumber] = useState('01712345678');
  const [bkashOtp, setBkashOtp] = useState('482910');
  const [bkashPin, setBkashPin] = useState('12345');
  const [bkashStep, setBkashStep] = useState<'phone' | 'otp' | 'pin'>('phone');

  // Card form state
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');

  // New Address Form State
  const [newFullName, setNewFullName] = useState(user.name);
  const [newPhone, setNewPhone] = useState(user.phone);
  const [newDivision, setNewDivision] = useState('Dhaka');
  const [newDistrict, setNewDistrict] = useState('Dhaka North');
  const [newThana, setNewThana] = useState('Uttara');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newLabel, setNewLabel] = useState<'HOME' | 'OFFICE'>('HOME');

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const subtotal = selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shippingFee = selectedItems.some((i) => !i.product.isFreeDelivery) ? 60 : 0;
  const voucherDiscount = 100; // default welcome discount
  const coinDiscount = 20;
  const total = Math.max(0, subtotal + shippingFee - voucherDiscount - coinDiscount);

  const formatPrice = (price: number) => {
    return '৳' + price.toLocaleString('en-BD');
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim()) {
      showToast(t('Please enter detailed address line', 'অনুগ্রহ করে বিস্তারিত ঠিকানা লিখুন'));
      return;
    }
    addAddress({
      fullName: newFullName,
      phone: newPhone,
      division: newDivision,
      district: newDistrict,
      thana: newThana,
      addressLine: newAddressLine,
      landmark: newLandmark,
      label: newLabel,
      isDefault: false
    });
    setIsAddAddressOpen(false);
  };

  const handlePlaceOrderDirect = () => {
    if (!selectedAddress) {
      showToast(t('Please add and select a delivery address.', 'অনুগ্রহ করে একটি ডেলিভারি ঠিকানা নির্বাচন করুন।'));
      return;
    }

    if (paymentMethod === 'bkash') {
      setIsBkashModalOpen(true);
      setBkashStep('phone');
      return;
    }

    // Place order for other methods
    placeOrder(paymentMethod, selectedAddress, voucherDiscount, coinDiscount);
    navigate('order-confirmation');
  };

  const handleCompleteBkashPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (bkashStep === 'phone') {
      setBkashStep('otp');
    } else if (bkashStep === 'otp') {
      setBkashStep('pin');
    } else if (bkashStep === 'pin') {
      setIsBkashModalOpen(false);
      placeOrder('bkash', selectedAddress, voucherDiscount, coinDiscount);
      navigate('order-confirmation');
    }
  };

  if (selectedItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-xl font-bold mb-4">{t('No items selected for checkout.', 'চেকআউটের জন্য কোনো পণ্য নির্বাচিত নেই।')}</h2>
        <button
          onClick={() => navigate('cart')}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-2 rounded-lg font-bold text-xs cursor-pointer shadow-md shadow-green-600/20"
        >
          {t('Back to Cart', 'কার্টে ফিরে যান')}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 pb-2 border-b border-gray-200">
        <button onClick={() => navigate('cart')} className="p-1 hover:bg-gray-100 rounded-full cursor-pointer">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          {t('Checkout & Delivery Details', 'চেকআউট ও ডেলিভারি')}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Address, Items, Payment Method (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Delivery Address Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#16a34a]" />
                <h2 className="font-extrabold text-sm sm:text-base text-gray-900">
                  {t('Delivery Address in Bangladesh', 'ডেলিভারি ঠিকানা')}
                </h2>
              </div>
              <button
                onClick={() => setIsAddAddressOpen(true)}
                className="text-xs text-[#16a34a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('Add New Address', 'নতুন ঠিকানা যোগ করুন')}</span>
              </button>
            </div>

            {/* Address Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#16a34a] bg-green-50/40 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900 flex items-center gap-1.5">
                        {addr.fullName}
                        <span className="text-[9px] bg-gray-200 text-gray-700 font-bold px-1.5 py-0.2 rounded">
                          {addr.label}
                        </span>
                      </span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#16a34a]" />}
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{addr.phone}</p>
                    <p className="text-xs text-gray-700 mt-1 leading-snug">
                      {addr.addressLine}, {addr.thana}, {addr.district}, {addr.division}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Add Address Form Drawer Modal */}
            {isAddAddressOpen && (
              <form
                onSubmit={handleSaveNewAddress}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 mt-3 animate-in fade-in"
              >
                <div className="flex items-center justify-between pb-1 border-b border-gray-200">
                  <h4 className="font-bold text-xs text-gray-900">{t('Add Delivery Address', 'নতুন ঠিকানা ফরম')}</h4>
                  <button type="button" onClick={() => setIsAddAddressOpen(false)} className="cursor-pointer">
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">{t('Full Name', 'পুরো নাম')}</label>
                    <input
                      type="text"
                      value={newFullName}
                      onChange={(e) => setNewFullName(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16a34a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">{t('Phone Number (+880)', 'ফোন নম্বর')}</label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16a34a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">{t('Division', 'বিভাগ')}</label>
                    <select
                      value={newDivision}
                      onChange={(e) => setNewDivision(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16a34a]"
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chittagong">Chittagong</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Rangpur">Rangpur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">{t('Thana / Area', 'থানা / এলাকা')}</label>
                    <input
                      type="text"
                      value={newThana}
                      onChange={(e) => setNewThana(e.target.value)}
                      placeholder="e.g. Gulshan, Dhanmondi, Agrabad"
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16a34a]"
                      required
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">{t('Street Address & House / Flat #', 'ঠিকানা ও বাড়ির নম্বর')}</label>
                  <input
                    type="text"
                    value={newAddressLine}
                    onChange={(e) => setNewAddressLine(e.target.value)}
                    placeholder="e.g. House #12, Road #4, Sector 7"
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16a34a]"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(false)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-semibold cursor-pointer"
                  >
                    {t('Cancel', 'বাতিল')}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#16a34a] hover:bg-[#15803d] text-white px-4 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    {t('Save Address', 'সংরক্ষণ করুন')}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* 2. Package & Order Items Preview */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-gray-150">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                  {t('Delivery Package (Daraz Express DEX)', 'প্যাকেজ ও ডেলিভারি')}
                </h3>
              </div>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Guaranteed by 2-3 Days
              </span>
            </div>

            <div className="space-y-3">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={item.product.mainImage}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 object-contain p-1 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {language === 'BN' ? item.product.titleBn : item.product.title}
                    </p>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Payment Methods Selector */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-150">
              <CreditCard className="w-5 h-5 text-[#16a34a]" />
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900">
                {t('Select Payment Method', 'পেমেন্ট মাধ্যম নির্বাচন করুন')}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* bKash */}
              <button
                type="button"
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
                  paymentMethod === 'bkash'
                    ? 'border-pink-600 bg-pink-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-pink-600">bKash (বিকাশ)</span>
                  {paymentMethod === 'bkash' && <CheckCircle className="w-4 h-4 text-pink-600" />}
                </div>
                <p className="text-[10px] text-gray-500">15% Cashback Promo</p>
              </button>

              {/* Nagad */}
              <button
                type="button"
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
                  paymentMethod === 'nagad'
                    ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-amber-600">Nagad (নগদ)</span>
                  {paymentMethod === 'nagad' && <CheckCircle className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-[10px] text-gray-500">Direct wallet pay</p>
              </button>

              {/* Rocket */}
              <button
                type="button"
                onClick={() => setPaymentMethod('rocket')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
                  paymentMethod === 'rocket'
                    ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-purple-600">Rocket (DBBL)</span>
                  {paymentMethod === 'rocket' && <CheckCircle className="w-4 h-4 text-purple-600" />}
                </div>
                <p className="text-[10px] text-gray-500">Dutch-Bangla Bank</p>
              </button>

              {/* Card */}
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-blue-700">Visa / Card</span>
                  {paymentMethod === 'card' && <CheckCircle className="w-4 h-4 text-blue-700" />}
                </div>
                <p className="text-[10px] text-gray-500">Debit or Credit card</p>
              </button>

              {/* Cash On Delivery */}
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer relative ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs text-emerald-700">Cash on Delivery</span>
                  {paymentMethod === 'cod' && <CheckCircle className="w-4 h-4 text-emerald-700" />}
                </div>
                <p className="text-[10px] text-gray-500">Pay when receiving</p>
              </button>
            </div>

            {/* Card details form if Card selected */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 animate-in fade-in text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white font-mono focus:outline-none focus:border-[#16a34a]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">Expiry MM/YY</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">CVV / CVC</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#16a34a]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Final Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 space-y-4 shadow-sm sticky top-24">
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 pb-2 border-b border-gray-150">
              {t('Final Summary', 'চূড়ান্ত মূল্য বিবরণী')}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{t('Items Total', 'পণ্যের মূল্য')}</span>
                <span className="font-semibold text-gray-900">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('Delivery Fee', 'ডেলিভারি চার্জ')}</span>
                <span className="font-semibold text-gray-900">
                  {shippingFee === 0 ? <strong className="text-emerald-600">{t('FREE', 'ফ্রি')}</strong> : formatPrice(shippingFee)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>{t('Voucher Code Savings', 'ভাউচার ছাড়')}</span>
                <span>-{formatPrice(voucherDiscount)}</span>
              </div>
              <div className="flex justify-between text-amber-600 font-semibold">
                <span>{t('Coins Deduction', 'কয়েন ছাড়')}</span>
                <span>-{formatPrice(coinDiscount)}</span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-black text-gray-900 pt-3 border-t border-gray-200">
                <span>{t('Total Payment', 'মোট প্রদেয় বিল')}</span>
                <span className="text-[#16a34a] text-xl font-black">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrderDirect}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white font-black py-3.5 rounded-lg text-sm transition-all shadow-lg shadow-green-600/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{t('CONFIRM & PLACE ORDER', 'অর্ডার নিশ্চিত করুন')}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>256-Bit SSL Encrypted & Secured Checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* bKash Payment Simulation Gateway Modal */}
      {isBkashModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-pink-200 animate-in fade-in zoom-in-95 duration-200">
            {/* bKash Header */}
            <div className="bg-[#e2136e] text-white p-5 text-center relative">
              <button
                onClick={() => setIsBkashModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#e2136e] font-black text-xl mx-auto mb-2 shadow">
                ৳
              </div>
              <h3 className="font-black text-lg">bKash Payment Gateway</h3>
              <p className="text-xs text-pink-100 mt-0.5">Merchant: Daraz Bangladesh Limited</p>
              <p className="text-sm font-extrabold text-amber-300 mt-1">Amount: {formatPrice(total)}</p>
            </div>

            <form onSubmit={handleCompleteBkashPayment} className="p-6 space-y-4">
              {bkashStep === 'phone' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Your bKash Account Number
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={bkashNumber}
                        onChange={(e) => setBkashNumber(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-9 pr-3 py-2 text-sm border-2 border-pink-300 rounded-lg focus:outline-none focus:border-[#e2136e]"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    By clicking Confirm, you agree to terms & conditions of bKash direct charge.
                  </p>
                  <button
                    type="submit"
                    className="w-full bg-[#e2136e] hover:bg-[#c20f5e] text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow"
                  >
                    CONFIRM & SEND OTP
                  </button>
                </div>
              )}

              {bkashStep === 'otp' && (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Enter 6-digit Verification code sent to <strong>{bkashNumber}</strong>
                    </p>
                  </div>
                  <input
                    type="text"
                    value={bkashOtp}
                    onChange={(e) => setBkashOtp(e.target.value)}
                    maxLength={6}
                    className="w-full text-center tracking-widest text-xl font-bold py-2 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-[#e2136e]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#e2136e] hover:bg-[#c20f5e] text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow"
                  >
                    VERIFY CODE
                  </button>
                </div>
              )}

              {bkashStep === 'pin' && (
                <div className="space-y-3">
                  <div className="text-center">
                    <p className="text-xs text-gray-600">
                      Enter 5-digit bKash PIN to authorize payment of <strong>{formatPrice(total)}</strong>
                    </p>
                  </div>
                  <input
                    type="password"
                    value={bkashPin}
                    onChange={(e) => setBkashPin(e.target.value)}
                    maxLength={5}
                    placeholder="•••••"
                    className="w-full text-center tracking-widest text-2xl font-bold py-2 border-2 border-pink-300 rounded-lg focus:outline-none focus:border-[#e2136e]"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#e2136e] hover:bg-[#c20f5e] text-white font-bold py-2.5 rounded-lg text-sm transition-colors shadow flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>CONFIRM PAYMENT</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
