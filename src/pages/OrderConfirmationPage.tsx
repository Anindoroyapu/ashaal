import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckCircle, Package, Truck, Printer, ArrowRight, ShieldCheck, ShoppingBag } from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { currentOrder, orders, navigate, language, t } = useApp();
  const [searchParams] = useSearchParams();
  const routeOrderId = searchParams.get('orderId');

  const order = (routeOrderId ? orders.find((o) => o.id === routeOrderId) : null) || currentOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-4">{t('No active order found.', 'কোনো সক্রিয় অর্ডার পাওয়া যায়নি।')}</h2>
        <button
          onClick={() => navigate('home')}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-2 rounded-lg font-bold text-xs cursor-pointer"
        >
          {t('Go Home', 'হোমে যান')}
        </button>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return '৳' + price.toLocaleString('en-BD');
  };

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-8 space-y-6">
      {/* Success Badge Banner */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center space-y-3 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 animate-bounce">
          <CheckCircle className="w-10 h-10" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {t('Order Placed Successfully!', 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
          {t('Thank You for Your Order,', 'আপনার অর্ডারের জন্য ধন্যবাদ,')} {order.shippingAddress.fullName}!
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          {t('We have sent an order confirmation SMS and email with invoice details.', 'আমরা আপনার ফোনে এবং ইমেইলে কনফার্মেশন মেসেজ ও ইনভয়েস পাঠিয়েছি।')}
        </p>

        {/* Quick ID Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs">
          <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="text-gray-500">Order ID: </span>
            <strong className="text-gray-900 font-mono">{order.id}</strong>
          </div>
          <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="text-gray-500">Tracking Code: </span>
            <strong className="text-[#16a34a] font-mono">{order.trackingNumber}</strong>
          </div>
          <div className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
            <span className="text-gray-500">Payment: </span>
            <strong className="text-gray-900 uppercase font-bold">{order.paymentMethod} ({order.paymentStatus})</strong>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => navigate('track-order')}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white font-bold px-6 py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-md shadow-green-600/20 flex items-center gap-2 cursor-pointer"
          >
            <Truck className="w-4 h-4" />
            <span>{t('TRACK THIS ORDER LIVE', 'লাইভ ট্র্যাক করুন')}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold px-4 py-2.5 rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{t('Print Invoice', 'ইনভয়েস প্রিন্ট')}</span>
          </button>

          <button
            onClick={() => navigate('home')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2.5 rounded-lg text-xs transition-colors cursor-pointer"
          >
            {t('Continue Shopping', 'শপিং চালিয়ে যান')}
          </button>
        </div>
      </div>

      {/* Order Details & Summary Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <h2 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-200 flex items-center gap-2">
          <Package className="w-5 h-5 text-[#16a34a]" />
          <span>{t('Package Items & Delivery Address', 'অর্ডারকৃত পণ্য ও ডেলিভারি বিবরণ')}</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-1.5">
            <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px] block text-[#16a34a]">
              {t('Delivery Address', 'ডেলিভারি ঠিকানা')}
            </span>
            <p className="font-bold text-gray-900 text-sm">{order.shippingAddress.fullName}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-gray-700">
              {order.shippingAddress.addressLine}, {order.shippingAddress.thana}, {order.shippingAddress.district}, {order.shippingAddress.division}
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-emerald-700 font-semibold">
              <Truck className="w-3.5 h-3.5" />
              <span>Estimated Delivery: {order.items[0]?.product?.estimatedDeliveryDays || '2-3 Business Days'}</span>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
            <span className="font-bold text-gray-800 uppercase tracking-wider text-[11px] block text-[#16a34a]">
              {t('Payment Breakdown', 'পেমেন্ট বিবরণ')}
            </span>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee:</span>
              <span className="font-semibold text-gray-900">{formatPrice(order.shippingFee)}</span>
            </div>
            {order.voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Voucher Discount:</span>
                <span>-{formatPrice(order.voucherDiscount)}</span>
              </div>
            )}
            {order.coinDiscount > 0 && (
              <div className="flex justify-between text-amber-600">
                <span>Coin Discount:</span>
                <span>-{formatPrice(order.coinDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-black text-gray-900 pt-2 border-t border-gray-200">
              <span>Total Paid:</span>
              <span className="text-[#16a34a]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Ordered items list */}
        <div className="space-y-3 pt-2">
          <h3 className="font-bold text-xs text-gray-800 uppercase">{t('Ordered Products', 'পণ্যসমূহ')}</h3>
          <div className="divide-y divide-gray-150">
            {order.items.map((item) => (
              <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.mainImage}
                    alt={item.product.title}
                    className="w-12 h-12 rounded-lg bg-gray-50 border border-gray-200 object-contain p-1"
                  />
                  <div>
                    <p className="font-bold text-gray-900 line-clamp-1">{item.product.title}</p>
                    <p className="text-[11px] text-gray-500">Qty: {item.quantity} × {formatPrice(item.product.price)}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-900">{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const TrackOrderPage: React.FC = () => {
  const { currentOrder, orders, navigate, t } = useApp();
  const [searchParams] = useSearchParams();
  const routeOrderId = searchParams.get('orderId');
  const order = (routeOrderId ? orders.find((o) => o.id === routeOrderId) : null) || currentOrder || orders[0];

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold mb-4">{t('No active order to track.', 'ট্র্যাক করার মতো কোনো অর্ডার নেই।')}</h2>
        <button
          onClick={() => navigate('home')}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white px-6 py-2 rounded-lg font-bold text-xs cursor-pointer"
        >
          {t('Go Home', 'হোমে যান')}
        </button>
      </div>
    );
  }

  const steps = [
    { titleEn: 'Order Placed', titleBn: 'অর্ডার গ্রহণ', desc: 'Order verified and sent to seller', time: 'Aug 16, 09:30 AM', done: true },
    { titleEn: 'Packed & Dispatched', titleBn: 'প্যাকিং সম্পন্ন', desc: 'Seller packed the item with protective bubble wrap', time: 'Aug 16, 02:15 PM', done: true },
    { titleEn: 'In Transit (DEX Sorting Hub)', titleBn: 'ট্রানজিটে আছে', desc: 'Arrived at Ashaal Tejgaon Sorting Hub', time: 'Aug 17, 08:40 AM', done: true },
    { titleEn: 'Out for Delivery', titleBn: 'ডেলিভারির জন্য বের হয়েছে', desc: 'Rider Md. Tanvir is on the way to your address', time: 'Today, 11:20 AM', done: true, current: true },
    { titleEn: 'Delivered', titleBn: 'ডেলিভারি সম্পন্ন', desc: 'Package handed over to recipient', time: 'Expected by 05:00 PM', done: false }
  ];

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between pb-2 border-b border-gray-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            {t('Real-Time Order Tracking', 'লাইভ অর্ডার ট্র্যাকিং')}
          </h1>
          <p className="text-xs text-gray-500">
            Tracking Number: <strong className="text-[#16a34a] font-mono">{order.trackingNumber}</strong>
          </p>
        </div>
        <button
          onClick={() => navigate('my-account')}
          className="text-xs font-bold text-[#16a34a] hover:underline cursor-pointer"
        >
          {t('View All Orders', 'সকল অর্ডার')}
        </button>
      </div>

      {/* Live Status Banner */}
      <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
            ● Current Status: Out for Delivery
          </span>
          <h2 className="text-lg sm:text-xl font-bold">
            Expected Delivery: {order.items[0]?.product?.estimatedDeliveryDays || '2-3 Business Days'}
          </h2>
          <p className="text-xs text-green-100">Carrier: Ashaal Express DEX Bangladesh</p>
        </div>

        {/* Courier Rider Call Card */}
        <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/20 text-xs space-y-1">
          <p className="text-green-100 font-semibold">Delivery Rider:</p>
          <p className="font-bold text-white text-sm">Md. Tanvir Hossain</p>
          <p className="text-green-200 font-mono">+880 1812 345678</p>
        </div>
      </div>

      {/* Step Timeline */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-sm text-gray-900">{t('Delivery Progress Timeline', 'ডেলিভারি টাইমলাইন')}</h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {steps.map((s, idx) => (
            <div key={idx} className="relative flex items-start gap-4">
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                  s.current
                    ? 'bg-[#16a34a] border-white ring-4 ring-green-100 text-white animate-pulse'
                    : s.done
                    ? 'bg-emerald-500 border-white text-white'
                    : 'bg-white border-gray-300'
                }`}
              >
                {s.done && <CheckCircle className="w-3 h-3" />}
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className={`font-bold ${s.current ? 'text-[#16a34a] text-sm' : s.done ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.titleEn}
                  </h4>
                  <span className="text-[11px] text-gray-400 font-mono">{s.time}</span>
                </div>
                <p className="text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Items */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 shadow-sm space-y-3">
        <h3 className="font-bold text-xs text-gray-800 uppercase">{t('Package Contents', 'প্যাকেজের পণ্যসমূহ')}</h3>
        <div className="space-y-2 text-xs">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
              <div className="flex items-center gap-3">
                <img src={item.product.mainImage} alt={item.product.title} className="w-10 h-10 object-contain rounded bg-white p-1 border border-gray-200" />
                <span className="font-semibold text-gray-900">{item.product.title}</span>
              </div>
              <span className="text-gray-500 font-medium">Qty: {item.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
