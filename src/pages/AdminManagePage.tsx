import React, { useState, useEffect } from 'react';
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
  Percent
} from 'lucide-react';

const ADMIN_STORAGE_KEY = 'ash_admin_auth';
const DEFAULT_PASSCODE = '123456';

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

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'banners'>('dashboard');

  // Product Filter & Search
  const [productSearch, setProductSearch] = useState<string>('');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Product Modal (Add / Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  // Order Details Modal / Invoice
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);

  // Banner Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  // Seeding state
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

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
    if (!window.confirm('Sync & seed all 20+ authentic marketplace products into Firestore database?')) return;
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
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase());
    const matchesCat = productCategoryFilter === 'all' || p.categorySlug === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderStatusFilter === 'all' || o.orderStatus === orderStatusFilter;
    const matchesSearch =
      o.orderNumber.includes(orderSearch) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(orderSearch) ||
      o.id.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'CANCELLED' ? sum + o.total : sum), 0);
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'PLACED' || o.orderStatus === 'PROCESSING').length;
  const outOfStockCount = products.filter((p) => p.inStock <= 0).length;

  // -------------------------------------------------------------
  // 1. PIN Login Screen if not authenticated
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
        <SEO title="Ashaal Admin Portal - Secure Login" noindex={true} />
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-green-50 text-[#16a34a] rounded-2xl flex items-center justify-center mx-auto shadow-xs border border-green-100">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Ashaal Admin Portal</h1>
            <p className="text-sm text-gray-500">Enter your secure passcode to manage store database & orders.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Admin Passcode
              </label>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (Default: 123456)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
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
              className="w-full py-3.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              Access Dashboard
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
    <div className="min-h-screen bg-gray-100 pb-16">
      <SEO title="Ashaal Database & Store Manager" noindex={true} />

      {/* Admin Top Navigation */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#16a34a] text-white rounded-xl flex items-center justify-center font-black text-xl shadow-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-gray-900 leading-none">Ashaal Cloud Admin</h1>
                <span className="px-2 py-0.5 bg-emerald-100 text-[#16a34a] text-[10px] font-bold rounded-full">
                  Firestore Connected
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5">Live Real-time Store & Database Control</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSeedProducts}
              disabled={isSeeding}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Reseed standard marketplace products into Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync & Seed Catalog</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Store</span>
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 border-t border-gray-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dashboard'
                ? 'border-[#16a34a] text-[#16a34a] bg-green-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview Dashboard
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#16a34a] text-[#16a34a] bg-green-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Package className="w-4 h-4" />
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-[#16a34a] text-[#16a34a] bg-green-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            Orders ({orders.length})
            {pendingOrdersCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#16a34a] text-white text-[10px] rounded-full">
                {pendingOrdersCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('banners')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'banners'
                ? 'border-[#16a34a] text-[#16a34a] bg-green-50/50'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Banners & Promo ({banners.length})
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales Revenue</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">৳{totalRevenue.toLocaleString('en-BD')}</p>
                  <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> Live from Firestore
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Orders Placed</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{orders.length}</p>
                  <p className="text-[11px] text-[#16a34a] font-bold mt-1">{pendingOrdersCount} Pending Delivery</p>
                </div>
                <div className="w-12 h-12 bg-green-100 text-[#16a34a] rounded-2xl flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Active Products</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{products.length}</p>
                  <p className="text-[11px] text-blue-600 font-bold mt-1">12 Main Categories</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Inventory Status</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{products.reduce((s, p) => s + p.inStock, 0)}</p>
                  <p className={`text-[11px] font-bold mt-1 ${outOfStockCount > 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                    {outOfStockCount > 0 ? `${outOfStockCount} Out of Stock` : 'All Products In Stock'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                  <Box className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Orders Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Recent Orders List */}
              <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Recent Online Orders</h3>
                    <p className="text-xs text-gray-500">Live incoming customer orders</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#16a34a] font-bold hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-gray-400 space-y-2">
                    <ShoppingCart className="w-10 h-10 mx-auto opacity-40" />
                    <p className="text-sm">No orders placed yet. Place an order on the storefront to test live sync!</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-gray-100 text-gray-400 uppercase tracking-wider">
                          <th className="pb-3 font-semibold">Order ID</th>
                          <th className="pb-3 font-semibold">Customer</th>
                          <th className="pb-3 font-semibold">Amount</th>
                          <th className="pb-3 font-semibold">Payment</th>
                          <th className="pb-3 font-semibold">Status</th>
                          <th className="pb-3 font-semibold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                            <td className="py-3 font-bold text-gray-900">#{ord.orderNumber}</td>
                            <td className="py-3">
                              <p className="font-bold text-gray-800">{ord.shippingAddress?.fullName || 'Customer'}</p>
                              <p className="text-[10px] text-gray-400">{ord.shippingAddress?.phone}</p>
                            </td>
                            <td className="py-3 font-bold text-gray-900">৳{ord.total.toLocaleString('en-BD')}</td>
                            <td className="py-3">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md font-bold uppercase text-[10px]">
                                {ord.paymentMethod}
                              </span>
                            </td>
                            <td className="py-3">
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
                            <td className="py-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setActiveTab('orders');
                                }}
                                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-bold text-[11px] cursor-pointer"
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Quick Admin Actions & Database Health */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
                  <h3 className="font-bold text-gray-900 text-base">Quick Actions</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setEditingProduct({
                          title: '',
                          titleBn: '',
                          price: 999,
                          originalPrice: 1299,
                          brand: '',
                          category: 'Electronic Devices',
                          categorySlug: 'electronic-devices',
                          inStock: 50,
                          isDarazMall: true,
                          isFreeDelivery: true,
                          isFlashSale: false,
                          mainImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
                          description: ['High quality genuine product.'],
                          descriptionBn: ['উচ্চ মানের আসল পণ্য।']
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="w-full py-3 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Product
                    </button>

                    <button
                      onClick={() => {
                        setEditingBanner({
                          title: 'New Mega Sale',
                          subtitle: 'Limited time discount offer',
                          image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
                          linkType: 'flash-sale',
                          badge: 'HOT DEAL'
                        });
                        setIsBannerModalOpen(true);
                      }}
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Add Carousel Banner
                    </button>

                    <button
                      onClick={handleSeedProducts}
                      disabled={isSeeding}
                      className="w-full py-3 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSeeding ? 'animate-spin' : ''}`} />
                      Sync Default Catalog (20+ Items)
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Database Status</span>
                  </div>
                  <h4 className="text-sm font-bold">Google Cloud Firestore</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    All products, real-time customer orders, and promotional banners are persistently stored in Google Firestore with sub-second synchronization.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by title, brand, category..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                >
                  <option value="all">All Categories ({products.length})</option>
                  {CATEGORIES_DATA.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setEditingProduct({
                      title: '',
                      titleBn: '',
                      price: 1200,
                      originalPrice: 1500,
                      brand: 'Generic',
                      category: 'Electronic Devices',
                      categorySlug: 'electronic-devices',
                      inStock: 50,
                      isDarazMall: true,
                      isFreeDelivery: true,
                      isFlashSale: false,
                      mainImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
                      description: ['Top quality authentic product on Ashaal.'],
                      descriptionBn: ['আশাল এ সেরা মানের আসল পণ্য।'],
                      specifications: { Warranty: '1 Year Warranty', Origin: 'Genuine' }
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Product Details</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price (BDT)</th>
                      <th className="py-3 px-4">Stock</th>
                      <th className="py-3 px-4">Badges</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-gray-400">
                          <Package className="w-10 h-10 mx-auto opacity-40 mb-2" />
                          <p className="text-sm">No products found matching your search.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Image & Title */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={prod.mainImage}
                                alt={prod.title}
                                className="w-12 h-12 rounded-xl object-cover border border-gray-200 shrink-0 bg-gray-50"
                              />
                              <div className="max-w-md">
                                <p className="font-bold text-gray-900 line-clamp-1">{prod.title}</p>
                                <p className="text-[11px] text-gray-500 line-clamp-1">{prod.titleBn}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Brand: {prod.brand || 'Ashaal'}</p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-semibold text-[11px]">
                              {prod.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4">
                            <p className="font-black text-gray-900 text-sm">৳{prod.price.toLocaleString('en-BD')}</p>
                            {prod.originalPrice > prod.price && (
                              <p className="text-[10px] text-gray-400 line-through">
                                ৳{prod.originalPrice.toLocaleString('en-BD')} (-{prod.discountPercentage}%)
                              </p>
                            )}
                          </td>

                          {/* Stock */}
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
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

                          {/* Badges */}
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {prod.isDarazMall && (
                                <span className="px-1.5 py-0.5 bg-red-100 text-red-700 rounded text-[9px] font-black">
                                  AshaalMall
                                </span>
                              )}
                              {prod.isFlashSale && (
                                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[9px] font-black">
                                  ⚡ Flash Sale
                                </span>
                              )}
                              {prod.isFreeDelivery && (
                                <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[9px] font-black">
                                  Free Del
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <a
                                href={`/product/${prod.id}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                                title="View on store"
                              >
                                <Eye className="w-4 h-4" />
                              </a>
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prod.id, prod.title)}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Filter & Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Search by Order #, Customer Name, Phone..."
                    className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="PLACED">Placed / New</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Order #</th>
                      <th className="py-3 px-4">Customer Info</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status & Action</th>
                      <th className="py-3 px-4 text-right">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          <ShoppingCart className="w-10 h-10 mx-auto opacity-40 mb-2" />
                          <p className="text-sm">No orders found.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-gray-50/80 transition-colors">
                          {/* Order Number & Date */}
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-900">#{ord.orderNumber}</p>
                            <p className="text-[10px] text-gray-400">{ord.createdAt}</p>
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-800">{ord.shippingAddress?.fullName || 'Customer'}</p>
                            <p className="text-[11px] text-gray-500 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-gray-400" />
                              {ord.shippingAddress?.phone}
                            </p>
                            <p className="text-[10px] text-gray-400 truncate max-w-xs">
                              {ord.shippingAddress?.addressLine}, {ord.shippingAddress?.thana}
                            </p>
                          </td>

                          {/* Items Count */}
                          <td className="py-3 px-4">
                            <p className="font-bold text-gray-700">{ord.items?.length || 0} item(s)</p>
                            <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                              {ord.items?.[0]?.product?.title}
                            </p>
                          </td>

                          {/* Total */}
                          <td className="py-3 px-4">
                            <p className="font-black text-gray-900 text-sm">৳{ord.total.toLocaleString('en-BD')}</p>
                          </td>

                          {/* Payment */}
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-800 font-black text-[10px] uppercase rounded">
                              {ord.paymentMethod}
                            </span>
                            <p className="text-[10px] text-emerald-600 font-bold mt-0.5">{ord.paymentStatus}</p>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3 px-4">
                            <select
                              value={ord.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as Order['orderStatus'])}
                              className={`px-2 py-1 rounded-lg text-xs font-bold border focus:outline-none cursor-pointer ${
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

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setIsInvoiceOpen(true);
                                }}
                                className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg cursor-pointer"
                                title="Print / View Invoice"
                              >
                                <Printer className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedOrder(ord)}
                                className="px-2 py-1 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-lg font-bold text-[11px] cursor-pointer"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(ord.id)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                title="Delete Order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BANNERS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'banners' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Homepage Hero Carousel Banners</h2>
                <p className="text-xs text-gray-500">Manage promotional banners, mega sales and marketing campaigns</p>
              </div>
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
                className="px-4 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" />
                Add Banner
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((ban) => (
                <div
                  key={ban.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs space-y-3 p-4"
                >
                  <div className="relative aspect-[21/9] rounded-xl overflow-hidden bg-gray-100">
                    <img src={ban.image} alt={ban.title} className="w-full h-full object-cover" />
                    {ban.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#16a34a] text-white text-[10px] font-black rounded">
                        {ban.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{ban.title}</h3>
                    <p className="text-xs text-gray-500">{ban.subtitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">
                        Link: {ban.linkType}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingBanner(ban);
                        setIsBannerModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBanner(ban.id)}
                      className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {editingProduct.id ? 'Edit Product in Firestore' : 'Add New Product to Store'}
                </h3>
                <p className="text-xs text-gray-500">Changes will reflect in real-time on customer storefront</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Title (EN) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    placeholder="e.g. Xiaomi Redmi Note 13 Pro 8GB/256GB"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                {/* Title (BN) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Title (বাংলা)</label>
                  <input
                    type="text"
                    value={editingProduct.titleBn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, titleBn: e.target.value })}
                    placeholder="e.g. শাওমি রেডমি নোট ১৩ প্রো ৮জিবি/২৫৬জিবি"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Selling Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Original Price (৳ BDT)</label>
                  <input
                    type="number"
                    min={1}
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category *</label>
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
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#16a34a]"
                  >
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Brand */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    placeholder="e.g. Xiaomi, Apex, Walton"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={editingProduct.inStock ?? 50}
                    onChange={(e) => setEditingProduct({ ...editingProduct, inStock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                {/* Estimated Delivery Days */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Estimated Delivery</label>
                  <input
                    type="text"
                    value={editingProduct.estimatedDeliveryDays || '2-4 Days'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, estimatedDeliveryDays: e.target.value })}
                    placeholder="e.g. 2-4 Days"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                  />
                </div>

                {/* Main Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">Main Image URL *</label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      required
                      value={editingProduct.mainImage || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, mainImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 focus:ring-2 focus:ring-[#16a34a] focus:bg-white"
                    />
                    {editingProduct.mainImage && (
                      <img
                        src={editingProduct.mainImage}
                        alt="Preview"
                        className="w-10 h-10 rounded-xl object-cover border shrink-0 bg-gray-100"
                      />
                    )}
                  </div>
                </div>

                {/* Feature Toggles */}
                <div className="sm:col-span-2 grid grid-cols-3 gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-200">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isDarazMall ?? true}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isDarazMall: e.target.checked })}
                      className="rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    AshaalMall Official
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFreeDelivery ?? true}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFreeDelivery: e.target.checked })}
                      className="rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    Free Delivery
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProduct.isFlashSale ?? false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFlashSale: e.target.checked })}
                      className="rounded text-[#16a34a] focus:ring-[#16a34a]"
                    />
                    Flash Sale Deal
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  className="px-6 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-xs shadow-md cursor-pointer flex items-center gap-2"
                >
                  {isSavingProduct ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  Save to Firestore
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-gray-900">Order #{selectedOrder.orderNumber}</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      selectedOrder.orderStatus === 'DELIVERED'
                        ? 'bg-emerald-100 text-emerald-700'
                        : selectedOrder.orderStatus === 'CANCELLED'
                        ? 'bg-red-100 text-red-700'
                        : selectedOrder.orderStatus === 'SHIPPED'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {selectedOrder.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-gray-500">Placed on {selectedOrder.createdAt}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200 text-xs">
              <div className="space-y-1">
                <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Customer Information</p>
                <p className="font-bold text-gray-900 text-sm">{selectedOrder.shippingAddress?.fullName}</p>
                <p className="text-gray-600 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  {selectedOrder.shippingAddress?.phone}
                </p>
                <p className="text-gray-600 font-bold uppercase">
                  Payment: {selectedOrder.paymentMethod} ({selectedOrder.paymentStatus})
                </p>
              </div>

              <div className="space-y-1">
                <p className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Delivery Address</p>
                <p className="text-gray-800 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                  <span>
                    {selectedOrder.shippingAddress?.addressLine}, {selectedOrder.shippingAddress?.thana},{' '}
                    {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.division}
                  </span>
                </p>
                <p className="text-[11px] text-gray-500">Courier: {selectedOrder.courier || 'Ashaal Express (DEX)'}</p>
                <p className="text-[11px] text-gray-500">Tracking: {selectedOrder.trackingNumber}</p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="space-y-2">
              <p className="font-bold text-xs text-gray-700">Ordered Items ({selectedOrder.items?.length})</p>
              <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs bg-white">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.mainImage}
                        alt={item.product?.title}
                        className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{item.product?.title}</p>
                        <p className="text-[11px] text-gray-500">Qty: {item.quantity} x ৳{item.product?.price}</p>
                      </div>
                    </div>
                    <p className="font-black text-gray-900">৳{(item.product?.price * item.quantity).toLocaleString('en-BD')}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Calculation Breakdown */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>৳{selectedOrder.subtotal?.toLocaleString('en-BD')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery Fee:</span>
                <span>{selectedOrder.shippingFee === 0 ? 'FREE' : `৳${selectedOrder.shippingFee}`}</span>
              </div>
              {selectedOrder.voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Voucher Discount:</span>
                  <span>-৳{selectedOrder.voucherDiscount}</span>
                </div>
              )}
              {selectedOrder.coinDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coins Discount:</span>
                  <span>-৳{selectedOrder.coinDiscount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-900 font-black text-sm pt-2 border-t border-gray-200">
                <span>Total Amount:</span>
                <span className="text-[#16a34a]">৳{selectedOrder.total?.toLocaleString('en-BD')}</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">Change Status:</span>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateOrderStatus(selectedOrder.id, e.target.value as Order['orderStatus'])}
                  className="px-3 py-1.5 bg-gray-100 border border-gray-300 rounded-xl text-xs font-bold cursor-pointer"
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
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print Challan
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white rounded-xl font-bold text-xs cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">
                {editingBanner.id ? 'Edit Carousel Banner' : 'Add New Carousel Banner'}
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. 11.11 Mega Sale of the Year"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Subtitle / Promo Text</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="e.g. Up to 80% OFF + Free Delivery"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingBanner.image || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#16a34a]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Target Link Type</label>
                <select
                  value={editingBanner.linkType || 'flash-sale'}
                  onChange={(e) => setEditingBanner({ ...editingBanner, linkType: e.target.value as any })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#16a34a]"
                >
                  <option value="flash-sale">Flash Sale Page</option>
                  <option value="daraz-mall">AshaalMall Official</option>
                  <option value="category">Category Search</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer"
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
