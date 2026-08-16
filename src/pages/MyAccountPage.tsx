import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS_DATA } from '../data/productsData';
import { ProductCard } from '../components/ProductCard';
import {
  User,
  Package,
  Heart,
  TicketPercent,
  Coins,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  LogOut,
  ChevronRight,
  Star,
  CheckCircle,
  HelpCircle,
  Plus
} from 'lucide-react';

export const MyAccountPage: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    vouchers,
    addresses,
    navigate,
    language,
    logout,
    setIsLoginModalOpen,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'vouchers' | 'addresses'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'delivered'>('all');

  const wishlistedProducts = PRODUCTS_DATA.filter((p) => wishlist.includes(p.id));

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const formatPrice = (price: number) => {
    return '৳' + price.toLocaleString('en-BD');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 space-y-4">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-xs flex items-center gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#16a34a]"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-gray-900 truncate">{user.name}</h3>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#16a34a] font-bold">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                <span>{user.coins} Coins</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs divide-y divide-gray-100 text-xs">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between p-3.5 font-semibold transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-green-50 text-[#16a34a] font-bold border-l-4 border-[#16a34a]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                {t('My Orders', 'আমার অর্ডার সমূহ')}
              </span>
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full flex items-center justify-between p-3.5 font-semibold transition-colors cursor-pointer ${
                activeTab === 'wishlist' ? 'bg-green-50 text-[#16a34a] font-bold border-l-4 border-[#16a34a]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                {t('My Wishlist', 'আমার উইশলিস্ট')}
              </span>
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vouchers')}
              className={`w-full flex items-center justify-between p-3.5 font-semibold transition-colors cursor-pointer ${
                activeTab === 'vouchers' ? 'bg-green-50 text-[#16a34a] font-bold border-l-4 border-[#16a34a]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <TicketPercent className="w-4 h-4" />
                {t('My Vouchers', 'আমার ভাউচার')}
              </span>
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                {vouchers.filter((v) => v.isClaimed).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center justify-between p-3.5 font-semibold transition-colors cursor-pointer ${
                activeTab === 'addresses' ? 'bg-green-50 text-[#16a34a] font-bold border-l-4 border-[#16a34a]' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                {t('Address Book', 'ঠিকানা বই')}
              </span>
              <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold">
                {addresses.length}
              </span>
            </button>

            <button
              onClick={() => navigate('coins-rewards')}
              className="w-full flex items-center justify-between p-3.5 text-gray-700 hover:bg-gray-50 font-semibold cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Coins className="w-4 h-4 text-amber-500" />
                {t('Daraz Coins & Rewards', 'দারাজ কয়েন ও রিওয়ার্ড')}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-2.5 p-3.5 text-red-600 hover:bg-red-50 font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('Logout', 'লগআউট')}</span>
            </button>
          </div>
        </div>

        {/* Right Content View */}
        <div className="lg:col-span-9 space-y-6">
          {/* TAB 1: ORDERS */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  {t('My Orders', 'আমার অর্ডার')}
                </h2>
                <div className="flex items-center gap-1 overflow-x-auto text-xs">
                  {(['all', 'processing', 'shipped', 'delivered'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1 rounded-full font-semibold capitalize transition-colors cursor-pointer ${
                        orderStatusFilter === st
                          ? 'bg-[#16a34a] text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-600">{t('No orders found in this status.', 'কোনো অর্ডার পাওয়া যায়নি।')}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => (
                    <div key={ord.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200 flex flex-wrap items-center justify-between text-xs gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-gray-900 font-mono">#{ord.id}</span>
                          <span className="text-gray-400">|</span>
                          <span className="text-gray-500">{ord.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-[#16a34a] font-bold px-2 py-0.5 rounded uppercase text-[10px]">
                            {ord.status}
                          </span>
                          <span className="font-bold text-gray-900">{formatPrice(ord.totalAmount)}</span>
                        </div>
                      </div>

                      <div className="p-4 divide-y divide-gray-100">
                        {ord.items.map((item) => (
                          <div key={item.id} className="py-2.5 first:pt-0 flex items-center justify-between gap-4 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.product.mainImage}
                                alt={item.product.title}
                                className="w-12 h-12 rounded object-contain bg-gray-50 border p-1"
                              />
                              <div>
                                <p className="font-semibold text-gray-900 line-clamp-1">{item.product.title}</p>
                                <p className="text-[11px] text-gray-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => navigate('track-order')}
                              className="text-xs text-[#16a34a] hover:underline font-bold whitespace-nowrap cursor-pointer"
                            >
                              {t('Track', 'ট্র্যাক করুন')} →
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-3 border-b border-gray-200">
                {t('My Wishlist Products', 'উইশলিস্টে সংরক্ষিত পণ্য')} ({wishlist.length})
              </h2>

              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-semibold text-gray-600">{t('Your wishlist is currently empty.', 'আপনার উইশলিস্টে কোনো পণ্য নেই।')}</p>
                  <button
                    onClick={() => navigate('home')}
                    className="bg-[#16a34a] text-white font-bold px-4 py-2 rounded-lg text-xs cursor-pointer"
                  >
                    {t('Discover Products', 'পণ্য দেখুন')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {wishlistedProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: VOUCHERS */}
          {activeTab === 'vouchers' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 pb-3 border-b border-gray-200">
                {t('My Collected Vouchers', 'সংগৃহীত ভাউচার সমূহ')}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="p-4 rounded-xl border border-dashed border-[#16a34a] bg-green-50/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-black text-sm text-[#16a34a]">{v.title}</span>
                        <span className="text-[10px] font-bold bg-white text-gray-700 px-2 py-0.5 rounded border">
                          Code: {v.code}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{v.description}</p>
                      <p className="text-[11px] text-gray-400 mt-2">Min. Spend: ৳{v.minSpend} • Valid till {v.expiryDate}</p>
                    </div>
                    <button
                      onClick={() => navigate('home')}
                      className="mt-3 bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold py-1.5 rounded-lg text-center cursor-pointer"
                    >
                      {t('USE NOW', 'এখনই ব্যবহার করুন')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADDRESS BOOK */}
          {activeTab === 'addresses' && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  {t('Saved Address Book', 'সংরক্ষিত ঠিকানা সমূহ')}
                </h2>
                <button
                  onClick={() => navigate('checkout')}
                  className="bg-[#16a34a] text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('Add New', 'নতুন ঠিকানা')}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50 text-xs space-y-1 relative">
                    <div className="flex items-center justify-between font-bold text-gray-900">
                      <span>{addr.fullName}</span>
                      <span className="bg-white text-gray-700 px-2 py-0.5 rounded border text-[10px]">{addr.label}</span>
                    </div>
                    <p className="text-gray-600">{addr.phone}</p>
                    <p className="text-gray-700">{addr.addressLine}, {addr.thana}, {addr.district}, {addr.division}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CustomerCarePage: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [aiMessage, setAiMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: 'Hello! I am Daraz Virtual Customer Assistant (CLEO). How can I assist you with orders, returns, refunds, or vouchers today?'
    }
  ]);

  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    const msg = aiMessage;
    setChatLog((prev) => [...prev, { sender: 'user', text: msg }]);
    setAiMessage('');

    setTimeout(() => {
      let reply = 'Thank you for reaching out! You can easily manage your orders or request a refund in the "My Orders" tab within 14 days of delivery.';
      if (msg.toLowerCase().includes('refund') || msg.toLowerCase().includes('return')) {
        reply = 'For refunds, Daraz processes bKash refunds within 24 hours and card refunds within 5-7 business days after item pickup.';
      } else if (msg.toLowerCase().includes('delivery') || msg.toLowerCase().includes('track')) {
        reply = 'You can track real-time Daraz Express packages using the "Track My Order" page with your 9-digit DEX code!';
      } else if (msg.toLowerCase().includes('voucher') || msg.toLowerCase().includes('coupon')) {
        reply = 'Use code DARAZBD100 to get ৳100 OFF on your next order above ৳500!';
      }

      setChatLog((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 800);
  };

  const faqs = [
    { q: 'How do I return an item on Daraz?', a: 'Go to My Account > My Orders > Select Order > Click "Initiate Return". Choose your reason and handover package to Daraz Drop-off point or request home pickup.' },
    { q: 'What payment methods are supported in Bangladesh?', a: 'Daraz supports bKash, Nagad, Rocket, Visa/Mastercard debit and credit cards, and Cash on Delivery (COD).' },
    { q: 'How long does Daraz Express (DEX) take to deliver?', a: 'Within Dhaka: 1 to 2 business days. Outside Dhaka (Chittagong, Sylhet, etc.): 2 to 4 business days.' },
    { q: 'What is DarazMall 100% Authentic Guarantee?', a: 'DarazMall products are supplied directly by authorized brand owners. If proven fake, you get 2x money back.' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-2xl p-6 sm:p-8 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black">{t('Daraz Bangladesh Help Center', 'দারাজ কাস্টমার কেয়ার ও সাপোর্ট')}</h1>
        <p className="text-xs sm:text-sm text-green-100">
          {t('24/7 Live Support, FAQs, and instant self-service assistance', '২৪/৭ সহায়তা, রিটার্ন ও রিফান্ড নীতি')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive CLEO Virtual Assistant */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm flex flex-col h-[500px]">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-xs">
              CLEO
            </div>
            <div>
              <h3 className="font-bold text-xs sm:text-sm text-gray-900">Daraz Smart AI Assistant</h3>
              <p className="text-[10px] text-emerald-600">● Online & Ready to Help</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 rounded-lg my-3 text-xs">
            {chatLog.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] p-3 rounded-xl ${
                    msg.sender === 'user'
                      ? 'bg-[#16a34a] text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-2xs'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendAi} className="flex gap-2">
            <input
              type="text"
              value={aiMessage}
              onChange={(e) => setAiMessage(e.target.value)}
              placeholder="Ask about refunds, vouchers, order status..."
              className="flex-1 text-xs border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-[#16a34a]"
            />
            <button
              type="submit"
              className="bg-[#16a34a] hover:bg-[#15803d] text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer"
            >
              Ask
            </button>
          </form>
        </div>

        {/* Right: FAQs & Direct Contact Channels */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-gray-900 pb-2 border-b border-gray-200">
              {t('Frequently Asked Questions', 'প্রয়োজনীয় প্রশ্নোত্তর')}
            </h3>
            <div className="space-y-3 text-xs">
              {faqs.map((f, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1">
                  <h4 className="font-bold text-gray-900 flex items-start gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-[#16a34a] shrink-0 mt-0.5" />
                    <span>{f.q}</span>
                  </h4>
                  <p className="text-gray-600 pl-5 leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-xl border border-green-200 text-xs space-y-2">
            <h4 className="font-bold text-[#16a34a]">{t('Need Official Telephone Support?', 'সরাসরি কথা বলুন')}</h4>
            <p className="text-gray-700">Customer Helpline: <strong>16492</strong> (9:00 AM - 9:00 PM)</p>
            <p className="text-gray-700">Email: <strong>customer.support@daraz.com.bd</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};
