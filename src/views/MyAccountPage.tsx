"use client";

import React, { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { SEO } from "../components/SEO";
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
  Plus,
  Edit3,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  Key,
  Clock,
  AlertCircle,
  ShoppingBag,
  Eye,
  Lock,
  Camera,
  CheckCheck,
  Sparkles,
  ArrowRight,
  X,
  CreditCard,
  Building,
  Home,
  Briefcase,
  Layers,
} from "lucide-react";
import { DeliveryAddress } from "../types";

export const MyAccountPage: React.FC = () => {
  const {
    user,
    products,
    orders,
    wishlist,
    vouchers,
    addresses,
    navigate,
    language,
    logout,
    setIsLoginModalOpen,
    isLoggedIn,
    updateUserProfile,
    addAddress,
    addToCart,
    showToast,
    t,
  } = useApp();

  type TabType =
    | "orders"
    | "wishlist"
    | "vouchers"
    | "addresses"
    | "profile"
    | "security";
  const [activeTab, setActiveTab] = useState<TabType>("orders");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    avatar: user?.avatar || "",
  });
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState<Omit<DeliveryAddress, "id">>({
    fullName: user?.name || "",
    phone: user?.phone || "",
    division: "Dhaka",
    district: "Dhaka North",
    thana: "Gulshan-2",
    addressLine: "",
    landmark: "",
    label: "HOME",
    isDefault: false,
  });

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedCode(id);
      showToast(t("Copied to clipboard!", "ক্লিপবোর্ডে কপি করা হয়েছে!"));
      setTimeout(() => setCopiedCode(null), 2000);
    } catch {
      showToast(text);
    }
  };

  // Format currency
  const formatPrice = (price: number) => "৳" + price.toLocaleString("en-BD");

  // Wishlisted products
  const wishlistedProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus =
        orderStatusFilter === "all" ||
        o.orderStatus?.toLowerCase() === orderStatusFilter.toLowerCase();

      const matchesSearch =
        !orderSearchQuery.trim() ||
        o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.orderNumber?.toLowerCase().includes(orderSearchQuery.toLowerCase()) ||
        o.items.some((item) =>
          item.product?.title
            ?.toLowerCase()
            .includes(orderSearchQuery.toLowerCase()),
        );

      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Save profile changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await updateUserProfile(user.id, {
        name: profileForm.name,
        phone: profileForm.phone,
        email: profileForm.email,
        avatar: profileForm.avatar,
      });
      setIsEditingProfile(false);
      showToast(
        t("Profile updated successfully!", "প্রোফাইল সফলভাবে আপডেট হয়েছে!"),
      );
    } catch (err: any) {
      showToast(t("Failed to update profile", "প্রোফাইল আপডেট করা যায়নি"));
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Add Address submit
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.addressLine.trim()) {
      showToast(
        t("Please enter a street address", "অনুগ্রহ করে পূর্ণ ঠিকানা লিখুন"),
      );
      return;
    }
    addAddress(newAddress);
    setIsAddressModalOpen(false);
    setNewAddress({
      fullName: user?.name || "",
      phone: user?.phone || "",
      division: "Dhaka",
      district: "Dhaka North",
      thana: "Gulshan-2",
      addressLine: "",
      landmark: "",
      label: "HOME",
      isDefault: false,
    });
    showToast(t("New address saved!", "নতুন ঠিকানা সংরক্ষিত হয়েছে!"));
  };

  // =========================================================================
  // GUEST / UNAUTHENTICATED STATE
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <SEO
          title={t("My Account | Ashaal Bangladesh", "আমার অ্যাকাউন্ট | আশাল")}
          description="Sign in to your Ashaal account to view orders, track shipments, and claim rewards."
          noindex={true}
        />

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-700/50 relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ashaal Member Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              {t(
                "Welcome to Your Personal Shopping Hub",
                "আপনার আশাল কাস্টমার অ্যাকাউন্টে স্বাগতম",
              )}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              {t(
                "Sign in to track real-time deliveries, view your past orders, manage delivery addresses, and redeem Ashaal Coins & exclusive vouchers.",
                "আপনার অর্ডার ট্র্যাক করতে, পূর্ববর্তী ক্রয়ের তালিকা দেখতে, ঠিকানা সংরক্ষণ এবং এক্সক্লুসিভ ভাউচার ব্যবহার করতে লগইন করুন।",
              )}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <Package className="w-5 h-5 text-emerald-400 mb-1.5" />
                <p className="font-bold text-xs">
                  {t("Live Tracking", "লাইভ ট্র্যাকিং")}
                </p>
                <p className="text-[10px] text-slate-400">
                  DEX Express delivery
                </p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <Coins className="w-5 h-5 text-amber-400 mb-1.5" />
                <p className="font-bold text-xs">
                  {t("Ashaal Coins", "আশাল কয়েন")}
                </p>
                <p className="text-[10px] text-slate-400">Cashback on orders</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <TicketPercent className="w-5 h-5 text-purple-400 mb-1.5" />
                <p className="font-bold text-xs">
                  {t("Promo Vouchers", "ডিসকাউন্ট ভাউচার")}
                </p>
                <p className="text-[10px] text-slate-400">Save up to ৳1500</p>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-teal-400 mb-1.5" />
                <p className="font-bold text-xs">
                  {t("100% Authentic", "আসল পণ্য")}
                </p>
                <p className="text-[10px] text-slate-400">
                  Official BD warranty
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-500/25 transition-all cursor-pointer flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>
                  {t("Sign In / Register Now", "লগইন / সাইন আপ করুন")}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate("home")}
                className="px-6 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer"
              >
                {t("Continue Browsing Store", "স্টোরে পণ্য দেখুন")}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED USER DASHBOARD
  // =========================================================================
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6 antialiased font-sans text-slate-800">
      <SEO
        title={`${user.name} | Ashaal Customer Portal`}
        description="Manage your orders, profile, vouchers, and wishlist on Ashaal."
        noindex={true}
      />

      {/* ===================================================================== */}
      {/* 1. HERO PROFILE & KPI STRIP */}
      {/* ===================================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Top Gradient Banner */}
        <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 p-6 sm:p-8 text-white relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Left: Avatar & User Identity */}
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="relative group">
                <img
                  src={
                    user.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80"
                  }
                  alt={user.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-4 border-white/20 shadow-lg"
                />
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setIsEditingProfile(true);
                  }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white text-emerald-800 rounded-lg shadow-md flex items-center justify-center hover:bg-emerald-50 transition-colors cursor-pointer"
                  title="Edit Avatar"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                    {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-900 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-slate-900" />
                    <span>{user.memberTier || "Silver Member"}</span>
                  </span>
                  {user.role === "admin" && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-200 text-purple-900 border border-purple-300">
                      ADMIN
                    </span>
                  )}
                </div>

                <p className="text-xs text-emerald-100/90 font-mono flex items-center gap-1.5">
                  <span>{user.email || "No email registered"}</span>
                  {user.phone && (
                    <>
                      <span>•</span>
                      <span>{user.phone}</span>
                    </>
                  )}
                </p>

                <p className="text-[11px] text-emerald-200/70 font-medium">
                  {t("Member since", "সদস্য হয়েছেন")}: {user.joinDate || "2024"}
                </p>
              </div>
            </div>

            {/* Right: Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setActiveTab("profile");
                  setIsEditingProfile(true);
                }}
                className="px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/20 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{t("Edit Profile", "প্রোফাইল এডিট")}</span>
              </button>

              {user.role === "admin" && (
                <a
                  href="/manage"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Hub (/manage)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}

              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 text-red-200 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{t("Logout", "লগআউট")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom 4-Metric KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 bg-slate-50/50 p-4 sm:p-5 text-center text-xs">
          <button
            onClick={() => setActiveTab("orders")}
            className="p-2 hover:bg-slate-100/60 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-0.5">
              <Package className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold">
                {t("Total Orders", "মোট অর্ডার")}
              </span>
            </div>
            <p className="text-xl font-black text-slate-900">{orders.length}</p>
          </button>

          <div className="p-2">
            <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-0.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="font-semibold">
                {t("Ashaal Coins", "আশাল কয়েন")}
              </span>
            </div>
            <p className="text-xl font-black text-amber-600">
              {user.coins || 0}
              <span className="text-[11px] font-normal text-slate-400 ml-1">
                (≈ ৳{Math.floor((user.coins || 0) / 10)})
              </span>
            </p>
          </div>

          <button
            onClick={() => setActiveTab("vouchers")}
            className="p-2 hover:bg-slate-100/60 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-0.5">
              <TicketPercent className="w-4 h-4 text-purple-600" />
              <span className="font-semibold">{t("Vouchers", "ভাউচার")}</span>
            </div>
            <p className="text-xl font-black text-purple-700">
              {vouchers.length}
            </p>
          </button>

          <button
            onClick={() => setActiveTab("wishlist")}
            className="p-2 hover:bg-slate-100/60 rounded-xl transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1.5 text-slate-500 mb-0.5">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="font-semibold">{t("Wishlist", "উইশলিস্ট")}</span>
            </div>
            <p className="text-xl font-black text-rose-600">
              {wishlist.length}
            </p>
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. MAIN 2-COLUMN LAYOUT: SIDEBAR TABS + CONTENT PANELS */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-3 lg:sticky lg:top-20">
          <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs space-y-1 text-xs">
            <p className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t("Shopping & Orders", "অর্ডার ও কেনাকাটা")}
            </p>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>{t("My Orders", "আমার অর্ডার সমূহ")}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "wishlist"
                  ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>{t("Saved Wishlist", "উইশলিস্ট")}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                {wishlist.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("vouchers")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "vouchers"
                  ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <TicketPercent className="w-4 h-4" />
                <span>{t("My Vouchers", "ভাউচার ও কুপন")}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                {vouchers.length}
              </span>
            </button>

            <div className="pt-2 border-t border-slate-100"></div>

            <p className="px-3 pt-1 pb-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {t("Account & Preferences", "অ্যাকাউন্ট ও সেটিংস")}
            </p>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "addresses"
                  ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4" />
                <span>{t("Address Book", "ঠিকানা বই")}</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-700">
                {addresses.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <User className="w-4 h-4" />
                <span>{t("Profile Settings", "প্রোফাইল সেটিংস")}</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>

            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer ${
                activeTab === "security"
                  ? "bg-emerald-50 text-emerald-700 font-bold shadow-xs border border-emerald-200/60"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4" />
                <span>{t("Account Security", "নিরাপত্তা সেটিংস")}</span>
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          {/* Quick Help Box */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/60 rounded-2xl text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>{t("Need Assistance?", "সাহায্য প্রয়োজন?")}</span>
            </div>
            <p className="text-[11px] text-emerald-700 leading-relaxed">
              24/7 dedicated customer care hotline: <strong>16492</strong> or
              chat with our automated CLEO assistant.
            </p>
            <button
              onClick={() => navigate("customer-care")}
              className="w-full py-1.5 bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
            >
              {t("Open Customer Care", "কাস্টমার কেয়ার খুলুন")}
            </button>
          </div>
        </div>

        {/* Right Main Content Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* ================================================================= */}
          {/* TAB 1: ORDERS HUB */}
          {/* ================================================================= */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
              {/* Header with Title & Filter Tabs */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {t("My Orders & Purchases", "আমার অর্ডার সমূহ")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t(
                      "Manage your past transactions and track live packages",
                      "আপনার সব অর্ডারের তথ্য ও প্যাকেজ ট্র্যাকিং",
                    )}
                  </p>
                </div>

                {/* Status Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                  {[
                    {
                      key: "all",
                      label: t("All", "সবগুলো"),
                      count: orders.length,
                    },
                    {
                      key: "placed",
                      label: t("Placed", "প্লেসড"),
                      count: orders.filter((o) => o.orderStatus === "PLACED")
                        .length,
                    },
                    {
                      key: "processing",
                      label: t("Processing", "প্রসেসিং"),
                      count: orders.filter(
                        (o) => o.orderStatus === "PROCESSING",
                      ).length,
                    },
                    {
                      key: "shipped",
                      label: t("Shipped", "শিপড"),
                      count: orders.filter((o) => o.orderStatus === "SHIPPED")
                        .length,
                    },
                    {
                      key: "delivered",
                      label: t("Delivered", "ডেলিভার্ড"),
                      count: orders.filter((o) => o.orderStatus === "DELIVERED")
                        .length,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setOrderStatusFilter(tab.key)}
                      className={`px-3 py-1.5 rounded-full font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 text-[11px] ${
                        orderStatusFilter === tab.key
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.count > 0 && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                            orderStatusFilter === tab.key
                              ? "bg-emerald-800 text-white"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Search Input */}
              <div className="relative">
                <input
                  type="text"
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  placeholder={t(
                    "Search by Order ID (e.g. ord-bd-xxx) or item name...",
                    "অর্ডার নম্বর অথবা পণ্যের নাম দিয়ে খুঁজুন...",
                  )}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                {orderSearchQuery && (
                  <button
                    onClick={() => setOrderSearchQuery("")}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">
                    {orderSearchQuery
                      ? t("No matching orders found", "কোনো অর্ডার পাওয়া যায়নি")
                      : t(
                          "No orders recorded in this stage",
                          "এই স্ট্যাটাসে কোনো অর্ডার নেই",
                        )}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {t(
                      "When you place orders on Ashaal, your items and tracking codes will appear here in real time.",
                      "অর্ডার প্লেস করার পর সমস্ত তথ্য এবং ট্র্যাকিং কোড এখানে দৃশ্যমান হবে।",
                    )}
                  </p>
                  <button
                    onClick={() => navigate("home")}
                    className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {t("Start Shopping Now", "শপিং শুরু করুন")}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((ord) => {
                    const statusColors: Record<
                      string,
                      { bg: string; text: string; dot: string }
                    > = {
                      PLACED: {
                        bg: "bg-amber-50 border-amber-200",
                        text: "text-amber-800",
                        dot: "bg-amber-500",
                      },
                      PROCESSING: {
                        bg: "bg-blue-50 border-blue-200",
                        text: "text-blue-800",
                        dot: "bg-blue-500",
                      },
                      SHIPPED: {
                        bg: "bg-purple-50 border-purple-200",
                        text: "text-purple-800",
                        dot: "bg-purple-500",
                      },
                      DELIVERED: {
                        bg: "bg-emerald-50 border-emerald-200",
                        text: "text-emerald-800",
                        dot: "bg-emerald-500",
                      },
                      CANCELLED: {
                        bg: "bg-red-50 border-red-200",
                        text: "text-red-800",
                        dot: "bg-red-500",
                      },
                    };
                    const color =
                      statusColors[ord.orderStatus] || statusColors.PLACED;

                    return (
                      <div
                        key={ord.id}
                        className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs hover:border-slate-300 transition-all bg-white"
                      >
                        {/* Order Header Bar */}
                        <div className="bg-slate-50/80 px-4 sm:px-5 py-3 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <span className="font-mono font-black text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                              #{ord.id}
                            </span>
                            <button
                              onClick={() => handleCopy(ord.id, ord.id)}
                              className="text-slate-400 hover:text-slate-700 cursor-pointer"
                              title="Copy Order ID"
                            >
                              {copiedCode === ord.id ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="text-slate-300">|</span>
                            <span className="text-slate-500 text-[11px] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {ord.createdAt}
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${color.bg} ${color.text}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${color.dot}`}
                              />
                              <span>{ord.orderStatus}</span>
                            </span>
                            <span className="font-black text-slate-900 text-sm">
                              {formatPrice(ord.total)}
                            </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 sm:p-5 divide-y divide-slate-100">
                          {ord.items.map((item) => (
                            <div
                              key={item.id}
                              className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4 text-xs"
                            >
                              <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                <img
                                  src={
                                    item.product?.mainImage ||
                                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
                                  }
                                  alt={item.product?.title || "Product"}
                                  className="w-14 h-14 rounded-xl object-contain bg-slate-50 border border-slate-100 p-1 shrink-0"
                                />
                                <div className="min-w-0">
                                  <p
                                    className="font-bold text-slate-800 line-clamp-1 hover:text-emerald-700 cursor-pointer"
                                    onClick={() =>
                                      navigate("product-details", {
                                        productId: item.product?.id,
                                      })
                                    }
                                  >
                                    {item.product?.title || "Purchased Product"}
                                  </p>
                                  {item.selectedVariations &&
                                    Object.keys(item.selectedVariations)
                                      .length > 0 && (
                                      <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                                        {Object.entries(item.selectedVariations)
                                          .map(([k, v]) => `${k}: ${v}`)
                                          .join(" | ")}
                                      </p>
                                    )}
                                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                                    Qty: {item.quantity} ×{" "}
                                    {formatPrice(item.product?.price || 0)}
                                  </p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="font-bold text-slate-900 text-xs">
                                  {formatPrice(
                                    (item.product?.price || 0) * item.quantity,
                                  )}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Order Footer & Actions */}
                        <div className="bg-slate-50/50 px-4 sm:px-5 py-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                            <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                            <span>
                              Payment:{" "}
                              <strong className="text-slate-700 uppercase font-mono">
                                {ord.paymentMethod}
                              </strong>{" "}
                              ({ord.paymentStatus})
                            </span>
                            {ord.trackingNumber && (
                              <>
                                <span className="text-slate-300">•</span>
                                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                                <span>
                                  Courier:{" "}
                                  <strong className="text-slate-800 font-mono">
                                    {ord.trackingNumber}
                                  </strong>
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate("track-order", { orderId: ord.id })
                              }
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                            >
                              <Truck className="w-3.5 h-3.5" />
                              <span>
                                {t("Track Package", "প্যাকেজ ট্র্যাক করুন")}
                              </span>
                            </button>

                            {ord.items[0]?.product && (
                              <button
                                onClick={() => {
                                  addToCart(
                                    ord.items[0].product,
                                    1,
                                    ord.items[0].selectedVariations || {},
                                  );
                                  showToast(
                                    t(
                                      "Added item to cart!",
                                      "কার্টে যোগ করা হয়েছে!",
                                    ),
                                  );
                                }}
                                className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>{t("Buy Again", "আবার কিনুন")}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 2: WISHLIST HUB */}
          {/* ================================================================= */}
          {activeTab === "wishlist" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {t("My Wishlist & Saved Products", "সংরক্ষিত উইশলিস্ট")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t(
                      "Products you marked to buy later or monitor for price drops",
                      "পরবর্তীতে কেনার জন্য সংরক্ষিত পণ্য",
                    )}
                  </p>
                </div>
                <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full font-bold text-xs">
                  {wishlist.length} {t("items", "টি পণ্য")}
                </span>
              </div>

              {wishlistedProducts.length === 0 ? (
                <div className="text-center py-16 space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-14 h-14 bg-rose-50 text-rose-400 rounded-2xl flex items-center justify-center mx-auto">
                    <Heart className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-800">
                    {t(
                      "Your wishlist is empty",
                      "আপনার উইশলিস্টে কোনো পণ্য নেই",
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    {t(
                      "Tap the heart icon on any product card across Ashaal to save it to your personalized wishlist.",
                      "পছন্দের যেকোনো পণ্যের হার্ট আইকনে ক্লিক করে এখানে জমা রাখুন।",
                    )}
                  </p>
                  <button
                    onClick={() => navigate("home")}
                    className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {t("Explore Trending Products", "জনপ্রিয় পণ্য দেখুন")}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {wishlistedProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 3: VOUCHERS HUB */}
          {/* ================================================================= */}
          {activeTab === "vouchers" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {t("My Promo Vouchers & Coupons", "ভাউচার ও ডিসকাউন্ট কোড")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t(
                      "Apply these coupons at checkout to unlock instant discounts and free shipping",
                      "চেকআউটে ডিসকাউন্ট পেতে এই কুপন কোডগুলো ব্যবহার করুন",
                    )}
                  </p>
                </div>
                <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full font-bold text-xs">
                  {vouchers.length} {t("Active Coupons", "সক্রিয় কুপন")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-2xl border-2 border-dashed border-emerald-500/50 bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 p-5 flex flex-col justify-between shadow-xs hover:border-emerald-500 transition-all relative overflow-hidden"
                  >
                    {/* Badge */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-black uppercase tracking-wider">
                        {v.discountType === "percentage"
                          ? `${v.discountAmount}% OFF`
                          : `৳${v.discountAmount} OFF`}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">
                        Valid till {v.expiresAt}
                      </span>
                    </div>

                    <div className="space-y-1 my-2">
                      <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                        {v.title}
                      </h3>
                      {v.titleBn && (
                        <p className="text-xs text-slate-500">{v.titleBn}</p>
                      )}
                      <p className="text-[11px] text-emerald-800 font-semibold pt-1">
                        Min. Spend: ৳{v.minSpend} •{" "}
                        {v.type === "shipping"
                          ? "Free Delivery"
                          : "Instant Discount"}
                      </p>
                    </div>

                    {/* Code Strip */}
                    <div className="mt-3 pt-3 border-t border-dashed border-slate-200 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 font-mono font-black text-xs text-slate-800 select-all">
                        <span>{v.code}</span>
                      </div>

                      <button
                        onClick={() => handleCopy(v.code, v.id)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        {copiedCode === v.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t("Copied!", "কপি হয়েছে!")}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t("Copy Code", "কোড কপি")}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 4: ADDRESS BOOK HUB */}
          {/* ================================================================= */}
          {activeTab === "addresses" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    {t("Saved Delivery Addresses", "সংরক্ষিত ডেলিভারি ঠিকানা")}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {t(
                      "Manage delivery locations for lightning-fast checkout",
                      "দ্রুত চেকআউটের জন্য আপনার ডেলিভারি লোকেশন সংরক্ষণ করুন",
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t("Add New Address", "নতুন ঠিকানা যোগ করুন")}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all text-xs space-y-2 relative shadow-2xs"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="text-sm font-black flex items-center gap-1.5">
                        {addr.label === "HOME" ? (
                          <Home className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                        )}
                        <span>{addr.fullName}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold uppercase text-slate-700">
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-[10px] font-black uppercase">
                            DEFAULT
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-slate-600 font-mono text-[11px]">
                      {addr.phone}
                    </p>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {addr.addressLine}, {addr.thana}, {addr.district},{" "}
                      {addr.division}
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-slate-400 italic">
                        Landmark: {addr.landmark}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 5: PROFILE SETTINGS */}
          {/* ================================================================= */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {t("Personal Profile Settings", "ব্যক্তিগত তথ্য ও সেটিংস")}
                </h2>
                <p className="text-xs text-slate-500">
                  {t(
                    "Update your name, phone, email, and avatar stored in the database",
                    "আপনার নাম, ফোন নম্বর ও ছবি আপডেট করুন",
                  )}
                </p>
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="space-y-4 max-w-xl text-xs"
              >
                {/* Avatar Preview */}
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <img
                    src={profileForm.avatar || user.avatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                  />
                  <div className="flex-1">
                    <label className="block font-bold text-slate-700 mb-1">
                      {t("Avatar Image URL", "প্রোফাইল ছবি লিংক")}
                    </label>
                    <input
                      type="url"
                      value={profileForm.avatar}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          avatar: e.target.value,
                        })
                      }
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t("Full Name", "পূর্ণ নাম")}
                  </label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, name: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t("Email Address", "ইমেইল এড্রেস")}
                    </label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          email: e.target.value,
                        })
                      }
                      required
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {t("Phone Number", "মোবাইল নম্বর")}
                    </label>
                    <input
                      type="tel"
                      value={profileForm.phone}
                      onChange={(e) =>
                        setProfileForm({
                          ...profileForm,
                          phone: e.target.value,
                        })
                      }
                      placeholder="+880 1700-000000"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingProfile ? (
                      <span>{t("Saving Changes...", "সংরক্ষণ হচ্ছে...")}</span>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{t("Save Changes", "তথ্য সংরক্ষণ করুন")}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================================================================= */}
          {/* TAB 6: SECURITY HUB */}
          {/* ================================================================= */}
          {activeTab === "security" && (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
              <div className="pb-4 border-b border-slate-100">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  {t(
                    "Account Security & Authorization",
                    "অ্যাকাউন্ট নিরাপত্তা",
                  )}
                </h2>
                <p className="text-xs text-slate-500">
                  {t(
                    "Security credentials, session tokens, and access verification",
                    "আপনার অ্যাকাউন্টের রোল ও সিকিউরিটি স্ট্যাটাস",
                  )}
                </p>
              </div>

              <div className="space-y-4 max-w-xl text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">
                      Assigned Account Role:
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase font-mono ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      }`}
                    >
                      {user.role || "customer"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">
                      Account ID:
                    </span>
                    <span className="font-mono text-slate-700">{user.id}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-600">
                      Authentication State:
                    </span>
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Active Verified Session</span>
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-2xl space-y-2">
                  <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span>Role-Based Portal Access</span>
                  </h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {user.role === "admin"
                      ? "Your account is verified with administrator credentials. You have full access to /manage, database inventory, and orders."
                      : "Your account is registered as a customer. Administrative portal (/manage) access is restricted to accounts with role='admin'."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. ADD NEW ADDRESS MODAL DIALOG */}
      {/* ===================================================================== */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">
                {t("Add Delivery Address", "নতুন ঠিকানা যোগ করুন")}
              </h3>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("Full Name", "প্রাপকের নাম")}
                </label>
                <input
                  type="text"
                  value={newAddress.fullName}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, fullName: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("Phone Number", "মোবাইল নম্বর")}
                </label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, phone: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t("Division", "বিভাগ")}
                  </label>
                  <input
                    type="text"
                    value={newAddress.division}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, division: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    {t("District / Area", "জেলা / এলাকা")}
                  </label>
                  <input
                    type="text"
                    value={newAddress.district}
                    onChange={(e) =>
                      setNewAddress({ ...newAddress, district: e.target.value })
                    }
                    required
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("Detailed Street Address", "পূর্ণ ঠিকানা")}
                </label>
                <textarea
                  rows={2}
                  value={newAddress.addressLine}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      addressLine: e.target.value,
                    })
                  }
                  placeholder="House #, Road #, Block / Sector..."
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {t("Address Label", "ঠিকানার ধরন")}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setNewAddress({ ...newAddress, label: "HOME" })
                    }
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      newAddress.label === "HOME"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>HOME</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNewAddress({ ...newAddress, label: "OFFICE" })
                    }
                    className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                      newAddress.label === "OFFICE"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>OFFICE</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer"
                >
                  {t("Cancel", "বাতিল")}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                >
                  {t("Save Address", "সংরক্ষণ করুন")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const CustomerCarePage: React.FC = () => {
  const { language, t, showToast } = useApp();

  const [aiMessage, setAiMessage] = useState("");
  const [chatLog, setChatLog] = useState<
    { sender: "bot" | "user"; text: string }[]
  >([
    {
      sender: "bot",
      text: "Hello! I am Ashaal Virtual Customer Assistant (CLEO). How can I assist you with orders, returns, refunds, or vouchers today?",
    },
  ]);

  const handleSendAi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;
    const msg = aiMessage;
    setChatLog((prev) => [...prev, { sender: "user", text: msg }]);
    setAiMessage("");

    setTimeout(() => {
      let reply =
        'Thank you for reaching out! You can easily manage your orders or request a refund in the "My Orders" tab within 14 days of delivery.';
      if (
        msg.toLowerCase().includes("refund") ||
        msg.toLowerCase().includes("return")
      ) {
        reply =
          "For refunds, Ashaal processes bKash refunds within 24 hours and card refunds within 5-7 business days after item pickup.";
      } else if (
        msg.toLowerCase().includes("delivery") ||
        msg.toLowerCase().includes("track")
      ) {
        reply =
          'You can track real-time Ashaal Express packages using the "Track My Order" page with your 9-digit DEX code!';
      } else if (
        msg.toLowerCase().includes("voucher") ||
        msg.toLowerCase().includes("coupon")
      ) {
        reply =
          "Use code ASHAALBD100 to get ৳100 OFF on your next order above ৳500!";
      }

      setChatLog((prev) => [...prev, { sender: "bot", text: reply }]);
    }, 800);
  };

  const faqs = [
    {
      q: "How do I return an item on Ashaal?",
      a: 'Go to My Account > My Orders > Select Order > Click "Initiate Return". Choose your reason and handover package to Ashaal Drop-off point or request home pickup.',
    },
    {
      q: "What payment methods are supported in Bangladesh?",
      a: "Ashaal supports bKash, Nagad, Rocket, Visa/Mastercard debit and credit cards, and Cash on Delivery (COD).",
    },
    {
      q: "How long does Ashaal Express (DEX) take to deliver?",
      a: "Within Dhaka: 1 to 2 business days. Outside Dhaka (Chittagong, Sylhet, etc.): 2 to 4 business days.",
    },
    {
      q: "What is AshaalMall 100% Authentic Guarantee?",
      a: "AshaalMall products are supplied directly by authorized brand owners. If proven fake, you get 2x money back.",
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-8 space-y-8">
      <SEO
        title={t(
          "Customer Care & Help Center | Ashaal Bangladesh",
          "কাস্টমার কেয়ার ও সাপোর্ট হাব | আশাল",
        )}
        description={t(
          "Get 24/7 help on Ashaal orders, returns, bKash refunds, tracking delivery, and voucher discounts.",
          "আশাল কাস্টমার কেয়ার - ২৪/৭ লাইভ চ্যাট, রিটার্ন এবং রিফান্ড পলিসি।",
        )}
        keywords="Ashaal customer care, helpline 16492, returns, refund policy bangladesh, order help"
        structuredData={faqJsonLd}
      />
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#16a34a] to-[#15803d] text-white rounded-2xl p-6 sm:p-8 text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black">
          {t("Ashaal Bangladesh Help Center", "আশাল কাস্টমার কেয়ার ও সাপোর্ট")}
        </h1>
        <p className="text-xs sm:text-sm text-green-100">
          {t(
            "24/7 Live Support, FAQs, and instant self-service assistance",
            "২৪/৭ সহায়তা, রিটার্ন ও রিফান্ড নীতি",
          )}
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
              <h3 className="font-bold text-xs sm:text-sm text-gray-900">
                Ashaal Smart AI Assistant
              </h3>
              <p className="text-[10px] text-emerald-600">
                ● Online & Ready to Help
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 rounded-lg my-3 text-xs">
            {chatLog.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl ${
                    msg.sender === "user"
                      ? "bg-[#16a34a] text-white rounded-br-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-2xs"
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
              {t("Frequently Asked Questions", "প্রয়োজনীয় প্রশ্নোত্তর")}
            </h3>
            <div className="space-y-3 text-xs">
              {faqs.map((f, i) => (
                <div
                  key={i}
                  className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-1"
                >
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
            <h4 className="font-bold text-[#16a34a]">
              {t("Need Official Telephone Support?", "সরাসরি কথা বলুন")}
            </h4>
            <p className="text-gray-700">
              Customer Helpline: <strong>16492</strong> (9:00 AM - 9:00 PM)
            </p>
            <p className="text-gray-700">
              Email: <strong>customer.support@ashaal.com.bd</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
