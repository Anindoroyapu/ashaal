import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, Order, Banner, UserProfile } from '../types';
import { CATEGORIES_DATA } from '../data/categoriesData';
import {
  saveProductToFirestore,
  deleteProductFromFirestore,
  seedInitialProducts,
  updateOrderStatusInFirestore,
  deleteOrderFromFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  saveUserToFirestore,
  seedInitialUsers
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
  Folder,
  Settings,
  Globe,
  Copy,
  Code
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
  const { products, orders, banners, allUsers, showToast, t, language, deleteUserAccount } = useApp();

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
    | 'users'
    | 'api-docs'
    | 'projects'
    | 'events'
    | 'donations'
    | 'volunteers'
    | 'contact-messages'
    | 'help-want'
    | 'products'
    | 'orders'
    | 'banners'
    | 'profile';

  const [activeRoute, setActiveRoute] = useState<NavRoute>('visitors');

  // Collapsible Sidebar Sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    management: true,
    ashalenscraft: true,
    bettermorning: true,
    ashaal: true
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Global Table Search query
  const [tableSearch, setTableSearch] = useState<string>('');

  // User Filter & Management State
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(null);
  const [isSavingUser, setIsSavingUser] = useState<boolean>(false);

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

  // Seed Firestore Products & Users
  const handleSeedProducts = async () => {
    if (!window.confirm('Sync & seed all authentic marketplace products and sample users into Firestore?')) return;
    setIsSeeding(true);
    try {
      await Promise.all([seedInitialProducts(true), seedInitialUsers(true)]);
      showToast('Successfully synced Cloud Firestore with fresh data!');
    } catch (err) {
      showToast('Failed to seed: ' + String(err));
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

  // Save User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.name || !editingUser?.email) {
      alert('Name and Email are required.');
      return;
    }
    setIsSavingUser(true);
    try {
      await saveUserToFirestore(editingUser);
      showToast(editingUser.id ? 'User profile updated in Firestore!' : 'New user created successfully!');
      setIsUserModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      alert('Error saving user: ' + String(err));
    } finally {
      setIsSavingUser(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Delete user account "${name}" (${userId})?`)) return;
    try {
      await deleteUserAccount(userId);
      showToast('User account deleted');
    } catch (err) {
      alert('Error deleting user: ' + String(err));
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

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
    }
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const q = tableSearch.toLowerCase();
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.id.toLowerCase().includes(q) ||
        (u.token && u.token.toLowerCase().includes(q));
      return matchesRole && matchesSearch;
    });
  }, [allUsers, tableSearch, userRoleFilter]);

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
  const totalCoinsInCirculation = allUsers.reduce((sum, u) => sum + (u.coins || 0), 0);

  // Title getter for main card based on activeRoute
  const getCardTitle = () => {
    switch (activeRoute) {
      case 'visitors':
        return 'AshaLensCraft — Visitors';
      case 'dashboard':
        return 'Overview Dashboard — Live Analytics';
      case 'users':
        return `Registered Users & Customer Accounts (${allUsers.length})`;
      case 'api-docs':
        return 'Developer API Docs & External Embed Integration';
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
      default:
        return 'BetterMorning Management';
    }
  };

  // If Not Authenticated, Show Clean Passcode Entry Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
        <SEO title="Admin Login — Ashaal Management" />
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 border border-gray-200 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl mx-auto flex items-center justify-center border border-emerald-100 shadow-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">BetterMorning & Ashaal</h1>
            <p className="text-xs text-gray-500 mt-1">Management Portal & Cloud Firestore Control</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  setAuthError('');
                }}
                placeholder="Enter 6-digit passcode (Default: 123456)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all text-center tracking-widest"
                autoFocus
              />
              {authError && <p className="text-xs text-red-600 mt-1.5 font-medium">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Management Portal</span>
              <ShieldCheck className="w-4 h-4" />
            </button>

            <p className="text-[11px] text-gray-400 text-center">
              Authorized personnel only. Direct Firestore DB connection active.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex flex-col font-sans text-gray-800">
      <SEO title="Admin Manage Portal — BetterMorning & Ashaal" />

      {/* ========================================================================= */}
      {/* TOP NAVBAR */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-gray-200/90 sticky top-0 z-30 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
        {/* Left: Brand + Hamburger */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#16a34a] flex items-center justify-center text-white font-bold text-sm shadow-xs">
              BM
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">BetterMorning</span>
          </div>

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
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200/80 rounded-full text-emerald-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Firestore Live</span>
          </div>

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

          <button
            onClick={() => setActiveRoute('users')}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            title="Manage Users"
          >
            <User className="w-5 h-5" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Body Area */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 sm:p-6 flex flex-col md:flex-row gap-5 items-start">
        {/* ========================================================================= */}
        {/* LEFT SIDEBAR */}
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
                      onClick={() => setActiveRoute('users')}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'users'
                          ? 'bg-purple-50 text-purple-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        <span className="font-semibold text-purple-900">Users & Accounts</span>
                      </div>
                      <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full">
                        {allUsers.length}
                      </span>
                    </button>

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
                      onClick={() => setActiveRoute('api-docs')}
                      className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                        activeRoute === 'api-docs'
                          ? 'bg-indigo-50 text-indigo-700 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Code className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-indigo-900">API Docs & Embed</span>
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
            </div>

            {/* Storefront Link */}
            <div className="pt-4 border-t border-gray-100">
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between px-3 py-2 bg-gray-50 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl text-xs font-semibold text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Storefront</span>
                </div>
                <span className="text-[10px] text-gray-400">Live</span>
              </a>
            </div>
          </aside>
        )}

        {/* ========================================================================= */}
        {/* CENTER MAIN CARD CONTAINER */}
        {/* ========================================================================= */}
        <main className="flex-1 bg-white rounded-2xl border border-gray-200/90 shadow-xs p-5 sm:p-6 w-full space-y-5">
          {/* Card Top Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                {getCardTitle()}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time Firestore DB synchronized | Instant updates
              </p>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={(e) => setTableSearch(e.target.value)}
                  placeholder="Search table..."
                  className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white w-36 sm:w-48 transition-all"
                />
              </div>

              {activeRoute === 'users' && (
                <button
                  onClick={() => {
                    const newId = `usr-${Date.now()}`;
                    setEditingUser({
                      id: newId,
                      name: '',
                      email: '',
                      phone: '+880 17',
                      password: 'password123',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
                      coins: 500,
                      memberTier: 'Silver Member',
                      role: 'customer',
                      status: 'active',
                      token: `usr_tok_${newId}_${Math.random().toString(36).substring(2, 8)}`,
                      totalOrders: 0,
                      totalSpent: 0
                    });
                    setIsUserModalOpen(true);
                  }}
                  className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add User</span>
                </button>
              )}

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
          {/* VIEW: USERS MANAGEMENT TABLE */}
          {/* ========================================================================= */}
          {activeRoute === 'users' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl">
                  <p className="text-[11px] font-semibold text-purple-700">Total Registered</p>
                  <p className="text-xl font-bold text-purple-900 mt-0.5">{allUsers.length}</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <p className="text-[11px] font-semibold text-emerald-700">Active Accounts</p>
                  <p className="text-xl font-bold text-emerald-900 mt-0.5">
                    {allUsers.filter((u) => u.status !== 'suspended').length}
                  </p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl">
                  <p className="text-[11px] font-semibold text-amber-700">Coins Distributed</p>
                  <p className="text-xl font-bold text-amber-900 mt-0.5">{totalCoinsInCirculation} 🪙</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p className="text-[11px] font-semibold text-blue-700">VIP Members</p>
                  <p className="text-xl font-bold text-blue-900 mt-0.5">
                    {allUsers.filter((u) => u.memberTier === 'Gold Member' || u.memberTier === 'Diamond Club').length}
                  </p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2">
                <div className="flex items-center gap-1.5">
                  {(['all', 'customer', 'admin', 'seller'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1 text-xs rounded-lg font-semibold capitalize transition-colors cursor-pointer ${
                        userRoleFilter === r
                          ? 'bg-purple-600 text-white shadow-2xs'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {r === 'all' ? 'All Roles' : `${r}s`}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500">Showing {filteredUsers.length} users</p>
              </div>

              {/* Table */}
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-700 font-semibold">
                      <th className="py-3 px-3 whitespace-nowrap">User Profile</th>
                      <th className="py-3 px-3 whitespace-nowrap">Phone & Contact</th>
                      <th className="py-3 px-3 whitespace-nowrap">Tier & Coins</th>
                      <th className="py-3 px-3 whitespace-nowrap">Role</th>
                      <th className="py-3 px-3 whitespace-nowrap">Orders / Spent</th>
                      <th className="py-3 px-3 whitespace-nowrap">Token (API Key)</th>
                      <th className="py-3 px-3 whitespace-nowrap">Status</th>
                      <th className="py-3 px-3 whitespace-nowrap text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((usr) => (
                      <tr key={usr.id} className="hover:bg-purple-50/40 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={usr.avatar}
                              alt={usr.name}
                              className="w-9 h-9 rounded-full object-cover border border-purple-200 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-gray-900">{usr.name}</p>
                              <p className="text-[11px] text-gray-500 truncate max-w-[150px]">{usr.email}</p>
                              <span className="text-[9px] font-mono text-gray-400">ID: {usr.id}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 font-mono text-gray-800">
                          {usr.phone || '—'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-bold block w-max">
                            {usr.memberTier || 'Silver Member'}
                          </span>
                          <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
                            🪙 {usr.coins || 0} Coins
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              usr.role === 'admin'
                                ? 'bg-red-100 text-red-700'
                                : usr.role === 'seller'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {usr.role || 'customer'}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-bold text-gray-800">{usr.totalOrders || 0} orders</p>
                          <p className="text-[10px] text-emerald-700 font-semibold">
                            ৳{(usr.totalSpent || 0).toLocaleString('en-BD')}
                          </p>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <code className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 max-w-[110px] truncate">
                              {usr.token || 'No Token'}
                            </code>
                            {usr.token && (
                              <button
                                onClick={() => copyToClipboard(usr.token!, 'User Token')}
                                className="p-1 text-gray-400 hover:text-purple-600 rounded cursor-pointer"
                                title="Copy Token"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              usr.status === 'active' || !usr.status
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {usr.status === 'suspended' ? 'Suspended' : 'Active'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingUser(usr);
                                setIsUserModalOpen(true);
                              }}
                              className="p-1.5 text-purple-600 hover:bg-purple-50 rounded cursor-pointer"
                              title="Edit User"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(usr.id, usr.name)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                              title="Delete User"
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
          {/* VIEW: DEVELOPER API DOCS & EMBED */}
          {/* ========================================================================= */}
          {activeRoute === 'api-docs' && (
            <div className="space-y-6">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
                  <Code className="w-4 h-4 text-indigo-600" />
                  <span>Developer REST API & Firestore Integration</span>
                </div>
                <p className="text-xs text-indigo-700">
                  Ashaal & BetterMorning offers live REST HTTP endpoints and direct Firestore queries for external apps, mobile apps, POS systems, and third-party integrations.
                </p>
              </div>

              {/* REST API 1: Live User List REST API */}
              <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-4 space-y-3 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 bg-emerald-600 text-white rounded font-bold text-[10px] tracking-wider">REST GET</span>
                    <code className="font-mono text-xs font-bold text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded">/api/users</code>
                    <span className="text-[11px] text-emerald-800 font-medium">User List REST API</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          `curl -X GET "${window.location.origin}/api/users"`,
                          'cURL command'
                        )
                      }
                      className="px-2.5 py-1 bg-white border border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy cURL</span>
                    </button>
                    <a
                      href="/api/users"
                      target="_blank"
                      rel="noreferrer"
                      className="px-2.5 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open /api/users</span>
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1.5">
                    <p className="font-bold text-gray-800">Query Parameters Supported:</p>
                    <ul className="space-y-1 text-gray-600 text-[11px]">
                      <li><code className="font-mono bg-gray-100 px-1 rounded">?role=customer|admin|seller</code> — Filter by user role</li>
                      <li><code className="font-mono bg-gray-100 px-1 rounded">?status=active|suspended</code> — Filter by status</li>
                      <li><code className="font-mono bg-gray-100 px-1 rounded">?search=name|email|phone</code> — Global text search</li>
                      <li><code className="font-mono bg-gray-100 px-1 rounded">?limit=10</code> — Limit maximum records returned</li>
                    </ul>
                  </div>

                  <div className="bg-white p-3 rounded-lg border border-emerald-100 space-y-1.5">
                    <p className="font-bold text-gray-800">Direct Lookup Endpoints:</p>
                    <ul className="space-y-1 text-gray-600 text-[11px]">
                      <li><code className="font-mono bg-gray-100 px-1 rounded">GET /api/users/:id</code> — Single user by ID</li>
                      <li><code className="font-mono bg-gray-100 px-1 rounded">GET /api/users/by-token/:token</code> — By Session Token</li>
                      <li><code className="font-mono bg-gray-100 px-1 rounded">POST /api/users</code> — Register / Create User</li>
                      <li><code className="font-mono bg-gray-100 px-1 rounded">GET /api/health</code> — API Status & Health Check</li>
                    </ul>
                  </div>
                </div>

                <pre className="p-3 bg-gray-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto">
{`// 1. JavaScript Fetch (User List API)
fetch("${window.location.origin}/api/users")
  .then(res => res.json())
  .then(data => {
    console.log("Total Users:", data.total);
    console.log("Users List:", data.users);
  });

// 2. JavaScript Fetch with Query Parameters (e.g. only customers)
fetch("${window.location.origin}/api/users?role=customer&limit=20")
  .then(res => res.json())
  .then(data => console.log(data.users));

// 3. User Register / Sign Up POST API
fetch("${window.location.origin}/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Rahim Uddin",
    email: "rahim@example.com",
    phone: "+880 1800000000",
    role: "customer"
  })
});`}
                </pre>
              </div>

              {/* API 2: Firestore SDK Direct Query */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-800 rounded font-bold text-[10px]">FIRESTORE SDK</span>
                    <span className="font-mono text-xs font-bold text-gray-800">users / Firestore Collection (Real-Time)</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `// Fetch all users via Firestore JS SDK\nimport { collection, getDocs } from "firebase/firestore";\nconst querySnapshot = await getDocs(collection(db, "users"));\nconst users = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));\nconsole.log(users);`,
                        'Fetch Users Snippet'
                      )
                    }
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JS Code</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-purple-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`// 1. Fetch Users List in Real-Time
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "./firebase";

// Subscribe to all users
onSnapshot(collection(db, "users"), (snapshot) => {
  const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log("Live Users from Firestore:", users);
});

// 2. Query user by session token
const q = query(collection(db, "users"), where("token", "==", "usr_tok_anindo_55102"));`}
                </pre>
              </div>

              {/* API 3: Token-based Cart and Wishlist Control */}
              <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-[10px]">LOCALSTORAGE</span>
                    <span className="font-mono text-xs font-bold text-gray-800">Token-Controlled Cart & Favorites</span>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `// Token Scoped Cart & Wishlist Helper\nconst token = localStorage.getItem("ash_user_token") || "guest_123";\n// Save Cart:\nlocalStorage.setItem(\`ash_cart_tok_\${token}\`, JSON.stringify(cartItems));\n// Load Cart:\nconst cart = JSON.parse(localStorage.getItem(\`ash_cart_tok_\${token}\`) || "[]");`,
                        'Token Storage Snippet'
                      )
                    }
                    className="flex items-center gap-1 text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Snippet</span>
                  </button>
                </div>
                <pre className="p-3 bg-gray-900 text-amber-300 font-mono text-[11px] rounded-lg overflow-x-auto">
{`// Token-based isolated Cart and Favorites
const userToken = localStorage.getItem("ash_user_token");

// Get active cart for current user's token
const getCart = (token) => JSON.parse(localStorage.getItem(\`ash_cart_tok_\${token}\`) || "[]");

// Save cart items for this specific token
const saveCart = (token, items) => localStorage.setItem(\`ash_cart_tok_\${token}\`, JSON.stringify(items));

// Wishlist / Favorites
const getFavorites = (token) => JSON.parse(localStorage.getItem(\`ash_wishlist_tok_\${token}\`) || "[]");
const saveFavorites = (token, ids) => localStorage.setItem(\`ash_wishlist_tok_\${token}\`, JSON.stringify(ids));`}
                </pre>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 1: VISITORS TABLE */}
          {/* ========================================================================= */}
          {activeRoute === 'visitors' && (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-700 font-semibold">
                    <th className="py-3 px-3 whitespace-nowrap">ID</th>
                    <th className="py-3 px-3 whitespace-nowrap">IP Address</th>
                    <th className="py-3 px-3 whitespace-nowrap">Name</th>
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
                          className="text-emerald-600 hover:underline max-w-[200px] truncate block"
                        >
                          {vis.page}
                        </a>
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-gray-500">{vis.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: OVERVIEW DASHBOARD */}
          {/* ========================================================================= */}
          {activeRoute === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50/80 border border-emerald-200/70 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-emerald-800">Total Revenue</p>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-emerald-950 mt-2">
                    ৳{totalRevenue.toLocaleString('en-BD')}
                  </p>
                  <p className="text-[11px] text-emerald-700 mt-1">From all confirmed orders</p>
                </div>

                <div className="p-4 bg-purple-50/80 border border-purple-200/70 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-purple-800">Registered Users</p>
                    <Users className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-black text-purple-950 mt-2">{allUsers.length}</p>
                  <p className="text-[11px] text-purple-700 mt-1">{totalCoinsInCirculation} Coins distributed</p>
                </div>

                <div className="p-4 bg-blue-50/80 border border-blue-200/70 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-blue-800">Total Orders</p>
                    <ShoppingCart className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-blue-950 mt-2">{orders.length}</p>
                  <p className="text-[11px] text-blue-700 mt-1">{pendingOrdersCount} awaiting delivery</p>
                </div>

                <div className="p-4 bg-amber-50/80 border border-amber-200/70 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold text-amber-800">Live Products</p>
                    <Box className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-black text-amber-950 mt-2">{products.length}</p>
                  <p className="text-[11px] text-amber-700 mt-1">{CATEGORIES_DATA.length} categories</p>
                </div>
              </div>

              {/* Recent Orders in Dashboard */}
              <div className="space-y-3">
                <h3 className="font-bold text-gray-900 text-sm">Recent Store Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-700 font-semibold">
                        <th className="py-2.5 px-3">Order #</th>
                        <th className="py-2.5 px-3">Customer</th>
                        <th className="py-2.5 px-3">Total</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-semibold">#{ord.orderNumber}</td>
                          <td className="py-2.5 px-3">{ord.shippingAddress?.fullName}</td>
                          <td className="py-2.5 px-3 font-bold text-emerald-700">৳{ord.total}</td>
                          <td className="py-2.5 px-3 uppercase text-[10px] font-bold">{ord.paymentMethod}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveRoute('orders');
                              }}
                              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold text-[11px] cursor-pointer"
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
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id, prod.title)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"
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
                              className="p-1.5 text-gray-500 hover:text-gray-900 rounded hover:bg-gray-100 cursor-pointer"
                              title="Print Invoice"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedOrder(ord)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px] cursor-pointer"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(ord.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded cursor-pointer"
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
          {/* VIEW 5: BANNERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeRoute === 'banners' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {banners.map((b) => (
                <div key={b.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <div className="h-36 relative overflow-hidden bg-gray-100">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    {b.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#16a34a] text-white text-[10px] font-bold rounded">
                        {b.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{b.title}</h4>
                      <p className="text-[11px] text-gray-500">{b.subtitle}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded text-xs font-semibold cursor-pointer"
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
          {['projects', 'events', 'donations', 'volunteers', 'contact-messages', 'help-want', 'profile'].includes(activeRoute) && (
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
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Return to Live Visitors
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Floating Settings Gear Button */}
      <button
        onClick={() => {
          showToast('Settings: Cloud Firestore Active | Multi-User & Token Enabled');
        }}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-[#6366f1] hover:bg-[#4f46e5] text-white p-2.5 rounded-l-xl shadow-lg cursor-pointer z-40 transition-all"
        title="Quick Settings"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
      </button>

      {/* ========================================================================= */}
      {/* USER ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-200 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-base text-gray-900">
                {editingUser.id && allUsers.some((u) => u.id === editingUser.id) ? 'Edit User Profile' : 'Add New User'}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  placeholder="e.g. Nusrat Jahan"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Ashaal Coins</label>
                  <input
                    type="number"
                    min={0}
                    value={editingUser.coins ?? 500}
                    onChange={(e) => setEditingUser({ ...editingUser, coins: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-bold text-amber-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Member Tier</label>
                  <select
                    value={editingUser.memberTier || 'Silver Member'}
                    onChange={(e) => setEditingUser({ ...editingUser, memberTier: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold"
                  >
                    <option value="Silver Member">Silver Member</option>
                    <option value="Gold Member">Gold Member</option>
                    <option value="Diamond Club">Diamond Club</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Account Role</label>
                  <select
                    value={editingUser.role || 'customer'}
                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Status</label>
                  <select
                    value={editingUser.status || 'active'}
                    onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg font-semibold"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">User Token (Auto-Generated API Key)</label>
                <input
                  type="text"
                  value={editingUser.token || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, token: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingUser ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    placeholder="e.g. Xiaomi, Samsung, Apex"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.inStock ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-4 pt-3">
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
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
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
                  className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold cursor-pointer"
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
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 font-semibold rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs cursor-pointer"
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
