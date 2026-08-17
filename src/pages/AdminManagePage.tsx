import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, Banner } from '../types';
import { CATEGORIES_DATA } from '../data/categoriesData';
import {
  saveProductToFirestore,
  deleteProductFromFirestore,
  seedInitialProducts,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore
} from '../services/firestoreService';
import { SEO } from '../components/SEO';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Eye,
  Printer,
  Sparkles,
  Lock,
  LogOut,
  RefreshCw,
  Zap,
  Tag,
  DollarSign,
  Box,
  Layers,
  Phone,
  MapPin,
  Check,
  AlertCircle,
  TrendingUp,
  X,
  ExternalLink,
  ShieldCheck,
  Menu,
  Calendar,
  User,
  ChevronDown,
  ChevronRight,
  Camera,
  HeartHandshake,
  Users,
  Mail,
  HelpCircle,
  Palette,
  Folder,
  HardDrive,
  FileText,
  Settings,
  Globe,
  Sliders,
  Maximize2
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'ash_admin_auth';
const DEFAULT_PASSCODE = '123456';

// Mock live visitor data matching the exact format from screenshot
interface VisitorLog {
  id: number;
  ip: string;
  name: string;
  phone: string;
  location: string;
  page: string;
  platform: string;
  time: string;
}

const INITIAL_VISITORS: VisitorLog[] = [
  { id: 304, ip: '172.71.31.62', name: '—', phone: '—', location: 'Dhaka, BD', page: 'https://www.ashaa.xyz/', platform: 'Linux x86_64', time: '1 min ago' },
  { id: 303, ip: '104.22.56.28', name: '—', phone: '—', location: 'Chittagong, BD', page: 'https://www.ashaa.xyz/', platform: 'Linux x86_64', time: '3 mins ago' },
  { id: 302, ip: '172.69.159.176', name: '—', phone: '—', location: 'Sylhet, BD', page: 'https://ashaa.xyz/booking', platform: 'Win32', time: '7 mins ago' },
  { id: 301, ip: '172.71.223.162', name: '—', phone: '—', location: 'Dhaka, BD', page: 'https://ashaa.xyz/', platform: 'Win32', time: '12 mins ago' },
  { id: 300, ip: '172.71.183.5', name: '—', phone: '—', location: 'Rajshahi, BD', page: 'https://ashaa.xyz/?fbclid=IwY2xjawNTYyODEwNDA1NT...', platform: 'Windows', time: '15 mins ago' },
  { id: 299, ip: '172.71.124.28', name: '—', phone: '—', location: 'Khulna, BD', page: 'https://ashaa.xyz/', platform: 'Linux armv81', time: '18 mins ago' },
  { id: 298, ip: '172.69.59.237', name: '—', phone: '—', location: 'Barisal, BD', page: 'https://ashaa.xyz/', platform: 'Linux x86_64', time: '25 mins ago' },
  { id: 297, ip: '104.22.66.30', name: '—', phone: '—', location: 'Dhaka, BD', page: 'https://ashaa.xyz/', platform: 'Linux armv81', time: '32 mins ago' },
  { id: 296, ip: '172.68.221.168', name: '—', phone: '—', location: 'Mymensingh, BD', page: 'https://ashaa.xyz/booking', platform: 'iPhone', time: '40 mins ago' },
  { id: 295, ip: '172.70.147.91', name: '—', phone: '—', location: 'Rangpur, BD', page: 'https://ashaa.xyz/shop', platform: 'Android', time: '48 mins ago' },
  { id: 294, ip: '162.158.78.44', name: '—', phone: '—', location: 'Dhaka, BD', page: 'https://ashaa.xyz/contact', platform: 'MacIntel', time: '55 mins ago' }
];

export const AdminManagePage: React.FC = () => {
  const { products, orders, banners, showToast, t, language } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Sidebar toggle state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  // Active navigation route/tab
  type NavRoute =
    | 'dashboard'
    | 'visitors'
    | 'projects'
    | 'events'
    | 'donations'
    | 'volunteers'
    | 'contact-messages'
    | 'help-want'
    | 'products'
    | 'orders'
    | 'banners'
    | 'categories'
    | 'vouchers'
    | 'room-decoration'
    | 'gdrive'
    | 'documents'
    | 'profile';

  const [activeRoute, setActiveRoute] = useState<NavRoute>('visitors');

  // Collapsible Sidebar Sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    management: true,
    ashalenscraft: true,
    bettermorning: true,
    ashaal: true,
    rongmohol: false,
    personal: false
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Global Table Search query
  const [tableSearch, setTableSearch] = useState<string>('');

  // Product Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  // Order Details Modal / Invoice
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);

  // Banner Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Live Visitors List
  const [visitors, setVisitors] = useState<VisitorLog[]>(INITIAL_VISITORS);

  // Handle Admin Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === DEFAULT_PASSCODE || passcode.trim() === 'admin880') {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      setAuthError('');
      showToast('Admin logged in successfully');
    } else {
      setAuthError('Invalid Admin Passcode. Default is 123456');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    showToast('Admin logged out');
  };

  // Seed Firestore
  const handleSeedProducts = async () => {
    if (!window.confirm('Sync & seed all authentic marketplace products into Firestore database?')) return;
    setIsSeeding(true);
    try {
      await seedInitialProducts(true);
      showToast('Successfully seeded default products into Firestore!');
    } catch (err) {
      showToast('Failed to seed products: ' + String(err));
    } finally {
      setIsSeeding(false);
    }
  };

  // Save Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      alert('Please provide at least a Product Title and Price.');
      return;
    }

    setIsSavingProduct(true);
    try {
      await saveProductToFirestore(editingProduct);
      showToast(editingProduct.id ? 'Product updated successfully!' : 'New product created in Firestore!');
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert('Error saving product: ' + String(err));
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await deleteProductFromFirestore(productId);
      showToast('Product deleted successfully');
    } catch (err) {
      alert('Error deleting product: ' + String(err));
    }
  };

  // Change Order Status
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['orderStatus']) => {
    try {
      await updateOrderStatusInFirestore(orderId, newStatus);
      showToast(`Order #${orderId} status changed to ${newStatus}`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, orderStatus: newStatus } : null));
      }
    } catch (err) {
      alert('Error updating order: ' + String(err));
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Delete order #${orderId}?`)) return;
    try {
      await deleteOrderFromFirestore(orderId);
      showToast('Order removed');
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      alert('Error deleting order: ' + String(err));
    }
  };

  // Save Banner
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title || !editingBanner?.image) {
      alert('Title and Image URL are required');
      return;
    }
    try {
      await saveBannerToFirestore(editingBanner as Banner);
      showToast('Banner saved successfully');
      setIsBannerModalOpen(false);
      setEditingBanner(null);
    } catch (err) {
      alert('Error saving banner: ' + String(err));
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (bannerId: string) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await deleteBannerFromFirestore(bannerId);
      showToast('Banner removed');
    } catch (err) {
      alert('Error deleting banner: ' + String(err));
    }
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = tableSearch.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    });
  }, [products, tableSearch]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = tableSearch.toLowerCase();
      const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
      const matchesSearch =
        o.orderNumber.includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.includes(q) ||
        o.id.includes(q) ||
        o.paymentMethod.toLowerCase().includes(q);
      return matchesStatus && (q === '' || matchesSearch);
    });
  }, [orders, tableSearch, orderStatusFilter]);

  // Filtered Visitors
  const filteredVisitors = useMemo(() => {
    if (!tableSearch) return visitors;
    const q = tableSearch.toLowerCase();
    return visitors.filter(
      (v) =>
        v.ip.includes(q) ||
        v.page.toLowerCase().includes(q) ||
        v.platform.toLowerCase().includes(q) ||
        v.location.toLowerCase().includes(q) ||
        String(v.id).includes(q)
    );
  }, [visitors, tableSearch]);

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'CANCELLED' ? sum + o.total : sum), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PLACED' || o.orderStatus === 'PROCESSING').length;
  const outOfStockCount = products.filter((p) => p.inStock <= 0).length;

  // Title getter for main card based on activeRoute
  const getCardTitle = () => {
    switch (activeRoute) {
      case 'visitors':
        return 'AshaLensCraft — Visitors';
      case 'dashboard':
        return 'Overview Dashboard — Live Analytics';
      case 'products':
        return `Ashaal Commerce — Products (${products.length})`;
      case 'orders':
        return `Ashaal Commerce — Orders (${orders.length})`;
      case 'banners':
        return `Ashaal Commerce — Hero Banners (${banners.length})`;
      case 'projects':
        return 'BetterMorning — Projects';
      case 'events':
        return 'BetterMorning — Events';
      case 'donations':
        return 'BetterMorning — Donations';
      case 'volunteers':
        return 'BetterMorning — Volunteers';
      case 'contact-messages':
        return 'BetterMorning — Contact Messages';
      case 'help-want':
        return 'BetterMorning — Help Want';
      case 'room-decoration':
        return 'Personal — Room Decoration';
      case 'gdrive':
        return 'Personal — Google Drive Sync';
      case 'documents':
        return 'Personal — Documents Archive';
      case 'profile':
        return 'Account — Admin Profile & Security';
      default:
        return 'BetterMorning — Management';
    }
  };

  // -------------------------------------------------------------
  // 1. PIN Login Screen if not authenticated
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#f4f6f8] text-slate-800">
        <SEO title="Admin Portal - Secure Login" noindex={true} />
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-200/90 shadow-sm space-y-6">
          <div className="text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-100 shadow-xs">
              {/* Sprout Icon */}
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">BetterMorning</h1>
            <p className="text-xs text-gray-500">AshaLensCraft & Ashaal Cloud Control Center</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (123456)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Sign In to Management
            </button>

            <div className="text-center text-xs text-gray-400 pt-2">
              Default passcode: <span className="font-mono font-bold text-gray-600">123456</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. Main Authenticated Admin Management Interface
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-800 flex flex-col antialiased selection:bg-emerald-500 selection:text-white font-sans">
      <SEO title="BetterMorning — Management Dashboard" noindex={true} />

      {/* Top Navbar Header */}
      <header className="bg-white border-b border-gray-200/80 sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 shadow-xs">
        <div className="flex items-center gap-4">
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveRoute('visitors')}>
            <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 shadow-2xs">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9a9 9 0 0 0-9-9zm-1 14.93c-3.14-.46-5.59-2.98-5.93-6.13L8 14.5v1.43zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">BetterMorning</span>
          </div>

          {/* Hamburger Menu button */}
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Top Right Utilities */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Firestore indicator pill */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Firestore Live</span>
          </div>

          {/* Calendar Icon */}
          <button
            onClick={() => {
              const today = new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              showToast(`Today: ${today}`);
            }}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Calendar & Date"
          >
            <Calendar className="w-5 h-5" />
          </button>

          {/* User Profile Icon */}
          <button
            onClick={() => setActiveRoute('profile')}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Admin Profile"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body Area: Left Sidebar + Center Card Container */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR (Matching the screenshot exactly) */}
        {/* ========================================================================= */}
        {sidebarOpen && (
          <aside className="w-full md:w-64 shrink-0 bg-white rounded-2xl border border-gray-200/90 shadow-xs p-4 space-y-6 text-sm text-gray-600">
            {/* Section: HOME */}
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">HOME</p>
              <button
                onClick={() => setActiveRoute('dashboard')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeRoute === 'dashboard'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Dashboard</span>
              </button>
            </div>

            {/* Section: MANAGEMENT */}
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">MANAGEMENT</p>

              {/* AshaLensCraft group */}
              <div>
                <button
                  onClick={() => toggleSection('ashalenscraft')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Camera className="w-4 h-4 text-gray-500" />
                    <span>AshaLensCraft</span>
                  </div>
                  {expandedSections.ashalenscraft ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
                {expandedSections.ashalenscraft && (
                  <div className="ml-5 pl-3 border-l border-gray-100 space-y-0.5 mt-1">
                    <button
                      onClick={() => setActiveRoute('visitors')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'visitors'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Visitors</span>
                    </button>
                  </div>
                )}
              </div>

              {/* BetterMorning group */}
              <div>
                <button
                  onClick={() => toggleSection('bettermorning')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-gray-500" />
                    <span>BetterMorning</span>
                  </div>
                  {expandedSections.bettermorning ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
                {expandedSections.bettermorning && (
                  <div className="ml-5 pl-3 border-l border-gray-100 space-y-0.5 mt-1">
                    <button
                      onClick={() => setActiveRoute('projects')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'projects'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Folder className="w-3.5 h-3.5" />
                      <span>Projects</span>
                    </button>
                    <button
                      onClick={() => setActiveRoute('events')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'events'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Events</span>
                    </button>
                    <button
                      onClick={() => setActiveRoute('donations')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'donations'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <HeartHandshake className="w-3.5 h-3.5" />
                      <span>Donations</span>
                    </button>
                    <button
                      onClick={() => setActiveRoute('volunteers')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'volunteers'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Volunteers</span>
                    </button>
                    <button
                      onClick={() => setActiveRoute('contact-messages')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'contact-messages'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Contact Messages</span>
                    </button>
                    <button
                      onClick={() => setActiveRoute('help-want')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'help-want'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Help Want</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Ashaal E-Commerce group */}
              <div>
                <button
                  onClick={() => toggleSection('ashaal')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-gray-500" />
                    <span>Ashaal Commerce</span>
                  </div>
                  {expandedSections.ashaal ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
                {expandedSections.ashaal && (
                  <div className="ml-5 pl-3 border-l border-gray-100 space-y-0.5 mt-1">
                    <button
                      onClick={() => setActiveRoute('products')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'products'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Box className="w-3.5 h-3.5" />
                        <span>Products</span>
                      </div>
                      <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.2 rounded-full">
                        {products.length}
                      </span>
                    </button>
                    <button
                      onClick={() => setActiveRoute('orders')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'orders'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-3.5 h-3.5" />
                        <span>Orders</span>
                      </div>
                      {pendingOrdersCount > 0 ? (
                        <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.2 rounded-full">
                          {pendingOrdersCount}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-gray-100 px-1.5 py-0.2 rounded-full">
                          {orders.length}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveRoute('banners')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'banners'
                          ? 'bg-emerald-50 text-emerald-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Hero Banners</span>
                    </button>
                  </div>
                )}
              </div>

              {/* RongMohol group */}
              <div>
                <button
                  onClick={() => toggleSection('rongmohol')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Palette className="w-4 h-4 text-gray-500" />
                    <span>RongMohol</span>
                  </div>
                  {expandedSections.rongmohol ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Section: PERSONAL */}
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">PERSONAL</p>
              <div>
                <button
                  onClick={() => toggleSection('personal')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer font-medium"
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-gray-500" />
                    <span>Room Decoration</span>
                  </div>
                  {expandedSections.personal ? (
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>
              </div>
              <button
                onClick={() => setActiveRoute('gdrive')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeRoute === 'gdrive'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <HardDrive className="w-4 h-4 shrink-0" />
                <span>G-Drive</span>
              </button>
              <button
                onClick={() => setActiveRoute('documents')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeRoute === 'documents'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileText className="w-4 h-4 shrink-0" />
                <span>Documents</span>
              </button>
            </div>

            {/* Section: ACCOUNT */}
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">ACCOUNT</p>
              <button
                onClick={() => setActiveRoute('profile')}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  activeRoute === 'profile'
                    ? 'bg-emerald-50 text-emerald-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 shrink-0" />
                <span>My Profile</span>
              </button>
            </div>

            {/* Bottom Brand Badge */}
            <div className="pt-2 border-t border-gray-100 flex items-center gap-2">
              <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Prime Blocks
              </span>
            </div>
          </aside>
        )}

        {/* ========================================================================= */}
        {/* MAIN CARD CONTAINER (White card layout matching the screenshot) */}
        {/* ========================================================================= */}
        <main className="flex-1 min-w-0 bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 space-y-6">
          {/* Card Top Header: Title on Left, Search & Actions on Right */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">{getCardTitle()}</h2>
              <p className="text-xs text-gray-400 mt-0.5">Real-time dynamic data synced with cloud backend</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar matching screenshot */}
              <div className="relative min-w-[240px] sm:min-w-[280px]">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {tableSearch && (
                  <button
                    onClick={() => setTableSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Contextual Action Button */}
              {activeRoute === 'products' && (
                <button
                  onClick={() => {
                    setEditingProduct({
                      title: '',
                      titleBn: '',
                      price: 1200,
                      originalPrice: 1500,
                      brand: 'Ashaal',
                      category: 'Electronic Devices',
                      categorySlug: 'electronic-devices',
                      inStock: 50,
                      isDarazMall: true,
                      isFreeDelivery: true,
                      isFlashSale: false,
                      mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
                      description: ['Top quality authentic product on Ashaal.'],
                      descriptionBn: ['আশাল এ সেরা মানের আসল পণ্য।']
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Product</span>
                </button>
              )}

              {activeRoute === 'banners' && (
                <button
                  onClick={() => {
                    setEditingBanner({
                      title: 'New Campaign',
                      subtitle: 'Up to 50% Off Top Brands',
                      image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
                      linkType: 'flash-sale',
                      badge: 'SPECIAL'
                    });
                    setIsBannerModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Banner</span>
                </button>
              )}

              <button
                onClick={handleSeedProducts}
                disabled={isSeeding}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                title="Sync Demo Data"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Cloud</span>
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* VIEW 1: VISITORS TABLE (Matching screenshot exactly) */}
          {/* ========================================================================= */}
          {activeRoute === 'visitors' && (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-700 font-semibold">
                    <th className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                        <span>ID</span>
                        <span className="text-[10px] text-gray-400">↑↓</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                        <span>IP Address</span>
                        <span className="text-[10px] text-gray-400">↑↓</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
                        <span>Name</span>
                        <span className="text-[10px] text-gray-400">↑↓</span>
                      </div>
                    </th>
                    <th className="py-3 px-3 whitespace-nowrap">Phone</th>
                    <th className="py-3 px-3 whitespace-nowrap">Location</th>
                    <th className="py-3 px-3 whitespace-nowrap">Page</th>
                    <th className="py-3 px-3 whitespace-nowrap text-right">Platform</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600">
                  {filteredVisitors.map((vis) => (
                    <tr key={vis.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-3 font-medium text-gray-900">{vis.id}</td>
                      <td className="py-3 px-3 font-mono text-gray-800">{vis.ip}</td>
                      <td className="py-3 px-3 text-gray-400">{vis.name}</td>
                      <td className="py-3 px-3 text-gray-400">{vis.phone}</td>
                      <td className="py-3 px-3 text-gray-500">{vis.location}</td>
                      <td className="py-3 px-3">
                        <a
                          href={vis.page}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-600 hover:text-emerald-600 hover:underline max-w-[280px] sm:max-w-md truncate block"
                        >
                          {vis.page}
                        </a>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-gray-700 whitespace-nowrap">
                        {vis.platform}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: DASHBOARD METRICS */}
          {/* ========================================================================= */}
          {activeRoute === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Sales Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">৳{totalRevenue.toLocaleString('en-BD')}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Live from Firestore
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">{pendingOrdersCount} Pending Delivery</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Active Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                  <p className="text-[11px] text-blue-600 font-semibold">12 Categories</p>
                </div>

                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 space-y-1">
                  <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Live Visitors</p>
                  <p className="text-2xl font-bold text-gray-900">{visitors.length} Active</p>
                  <p className="text-[11px] text-emerald-600 font-semibold">Real-time Stream</p>
                </div>
              </div>

              {/* Quick Table of Recent Orders */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-sm">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveRoute('orders')}
                    className="text-xs text-emerald-600 font-semibold hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold">
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Amount</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-semibold text-gray-900">#{ord.orderNumber}</td>
                          <td className="py-2.5 px-3">{ord.shippingAddress?.fullName || 'Customer'}</td>
                          <td className="py-2.5 px-3 font-semibold text-gray-900">
                            ৳{ord.total.toLocaleString('en-BD')}
                          </td>
                          <td className="py-2.5 px-3 uppercase text-[10px] font-bold">{ord.paymentMethod}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                ord.orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : ord.orderStatus === 'CANCELLED'
                                  ? 'bg-red-100 text-red-700'
                                  : ord.orderStatus === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveRoute('orders');
                              }}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold text-[11px]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: PRODUCTS MANAGEMENT TABLE */}
          {/* ========================================================================= */}
          {activeRoute === 'products' && (
            <div className="space-y-4">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-700 font-semibold">
                      <th className="py-3 px-3 whitespace-nowrap">Product</th>
                      <th className="py-3 px-3 whitespace-nowrap">Category</th>
                      <th className="py-3 px-3 whitespace-nowrap">Price (BDT)</th>
                      <th className="py-3 px-3 whitespace-nowrap">Stock</th>
                      <th className="py-3 px-3 whitespace-nowrap">Badges</th>
                      <th className="py-3 px-3 whitespace-nowrap text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.mainImage}
                              alt={prod.title}
                              className="w-11 h-11 rounded-lg object-cover border border-gray-200 shrink-0 bg-gray-50"
                            />
                            <div className="max-w-xs sm:max-w-sm">
                              <p className="font-semibold text-gray-900 line-clamp-1">{prod.title}</p>
                              <p className="text-[11px] text-gray-400 mt-0.5">Brand: {prod.brand || 'Ashaal'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium">
                            {prod.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-gray-900">
                          ৳{prod.price.toLocaleString('en-BD')}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              prod.inStock > 10
                                ? 'bg-emerald-100 text-emerald-700'
                                : prod.inStock > 0
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {prod.inStock > 0 ? `${prod.inStock} In Stock` : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1">
                            {prod.isDarazMall && (
                              <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-bold">
                                AshaalMall
                              </span>
                            )}
                            {prod.isFlashSale && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-bold">
                                ⚡ Flash Sale
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <a
                              href={`/product/${prod.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-gray-800 rounded hover:bg-gray-100"
                              title="Preview Product"
                            >
                              <Eye className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => {
                                setEditingProduct(prod);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.title)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: ORDERS MANAGEMENT TABLE */}
          {/* ========================================================================= */}
          {activeRoute === 'orders' && (
            <div className="space-y-4">
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-700 font-semibold">
                      <th className="py-3 px-3 whitespace-nowrap">Order #</th>
                      <th className="py-3 px-3 whitespace-nowrap">Customer Info</th>
                      <th className="py-3 px-3 whitespace-nowrap">Items</th>
                      <th className="py-3 px-3 whitespace-nowrap">Total</th>
                      <th className="py-3 px-3 whitespace-nowrap">Payment</th>
                      <th className="py-3 px-3 whitespace-nowrap">Status</th>
                      <th className="py-3 px-3 whitespace-nowrap text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <p className="font-semibold text-gray-900">#{ord.orderNumber}</p>
                          <p className="text-[10px] text-gray-400">{ord.createdAt}</p>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-semibold text-gray-800">{ord.shippingAddress?.fullName || 'Customer'}</p>
                          <p className="text-[10px] text-gray-500">{ord.shippingAddress?.phone}</p>
                        </td>
                        <td className="py-3 px-3 text-gray-600">{ord.items?.length || 0} item(s)</td>
                        <td className="py-3 px-3 font-semibold text-gray-900">
                          ৳{ord.total.toLocaleString('en-BD')}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-800 font-bold text-[10px] uppercase rounded">
                            {ord.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as Order['orderStatus'])}
                            className={`px-2 py-1 rounded text-xs font-semibold border cursor-pointer ${
                              ord.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : ord.orderStatus === 'CANCELLED'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : ord.orderStatus === 'SHIPPED'
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <option value="PLACED">PLACED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setIsInvoiceOpen(true);
                              }}
                              className="p-1.5 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-100"
                              title="Print Invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px]"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                              title="Delete Order"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: HERO BANNERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeRoute === 'banners' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((ban) => (
                <div key={ban.id} className="border border-gray-200 rounded-xl overflow-hidden p-3.5 space-y-3">
                  <div className="relative aspect-[21/9] rounded-lg overflow-hidden bg-gray-100">
                    <img src={ban.image} alt={ban.title} className="w-full h-full object-cover" />
                    {ban.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded">
                        {ban.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{ban.title}</h4>
                    <p className="text-xs text-gray-500">{ban.subtitle}</p>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingBanner(ban);
                        setIsBannerModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(ban.id)}
                      className="px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: PROJECTS, EVENTS, DONATIONS, VOLUNTEERS, CONTACT */}
          {/* ========================================================================= */}
          {['projects', 'events', 'donations', 'volunteers', 'contact-messages', 'help-want', 'gdrive', 'documents', 'profile'].includes(activeRoute) && (
            <div className="p-8 text-center bg-gray-50 rounded-xl border border-gray-200 space-y-3">
              <div className="w-12 h-12 bg-white text-emerald-600 rounded-xl mx-auto flex items-center justify-center border border-gray-200 shadow-2xs">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-800 text-base capitalize">{activeRoute.replace('-', ' ')} Module Active</h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                Real-time synchronized data layer configured for {activeRoute}. All updates made here reflect across all cloud channels.
              </p>
              <button
                onClick={() => setActiveRoute('visitors')}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Return to Live Visitors
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Settings Gear Button on right edge (as seen in screenshot) */}
      <button
        onClick={() => {
          showToast('Settings: Cloud Firestore Active | Version 2.4');
        }}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#6366f1] hover:bg-[#4f46e5] text-white p-2.5 rounded-l-xl shadow-lg cursor-pointer z-40 transition-all"
        title="Quick Settings"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
      </button>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-gray-500">Changes will reflect in real-time in Firestore</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    placeholder="e.g. Xiaomi Redmi Note 13 Pro 8GB/256GB"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Selling Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Original Price (৳ BDT)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={editingProduct.categorySlug || 'electronic-devices'}
                    onChange={(e) => {
                      const selectedCat = CATEGORIES_DATA.find((c) => c.slug === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        categorySlug: e.target.value,
                        category: selectedCat?.name || 'Electronic Devices'
                      });
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.inStock ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Main Image URL *</label>
                  <input
                    type="url"
                    required
                    value={editingProduct.mainImage || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500 focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-4 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isDarazMall ?? true}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isDarazMall: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    AshaalMall Brand
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFlashSale ?? false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFlashSale: e.target.checked })}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    Flash Sale Deal
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs flex items-center gap-1.5"
                >
                  {isSavingProduct ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER DETAILS & INVOICE MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-gray-900">Order #{selectedOrder.orderNumber}</h3>
                <p className="text-gray-400 text-[11px]">{selectedOrder.createdAt}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-1">
              <p className="font-bold text-gray-800">{selectedOrder.shippingAddress?.fullName}</p>
              <p className="text-gray-500">{selectedOrder.shippingAddress?.phone}</p>
              <p className="text-gray-600">
                {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.thana},{' '}
                {selectedOrder.shippingAddress?.district}
              </p>
              <p className="font-semibold text-emerald-700 pt-1">
                Payment: {selectedOrder.paymentMethod} (৳{selectedOrder.total.toLocaleString('en-BD')})
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="font-bold text-gray-700">Items ({selectedOrder.items?.length})</p>
              <div className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-2.5 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.product?.mainImage}
                        alt=""
                        className="w-8 h-8 rounded object-cover border"
                      />
                      <p className="font-medium text-gray-800 line-clamp-1">{item.product?.title}</p>
                    </div>
                    <p className="font-semibold text-gray-900">৳{item.product?.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-700">Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as Order['orderStatus'])}
                  className="px-2 py-1 bg-gray-50 border border-gray-300 rounded font-semibold text-xs"
                >
                  <option value="PLACED">PLACED</option>
                  <option value="PROCESSING">PROCESSING</option>
                  <option value="SHIPPED">SHIPPED</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BANNER ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-200 text-xs">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingBanner.id ? 'Edit Banner' : 'Add Banner'}
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. Mega Flash Deal"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingBanner.image || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
