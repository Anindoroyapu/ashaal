"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Product,
  Order,
  Banner,
  UserProfile,
  ProductVariation,
} from "../types";
import { CATEGORIES_DATA } from "../data/categoriesData";
import {
  saveProductToFirestore,
  deleteProductFromFirestore,
  seedInitialProducts,
  updateOrderStatusInFirestore,
  updateOrderDetailsInFirestore,
  deleteOrderFromFirestore,
  saveBannerToFirestore,
  deleteBannerFromFirestore,
  saveUserToFirestore,
  seedInitialUsers,
  fetchVisitors,
} from "../services/firestoreService";
import { SEO } from "../components/SEO";
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
  Database,
  Copy,
  Code,
  Store,
  SlidersHorizontal,
  Percent,
  Truck,
  Info,
  ListPlus,
  FileText,
  CopyPlus,
  ArrowUpRight,
  Flame,
  CheckSquare,
  BarChart3,
  Layers3,
  PhoneCall,
  MessageSquare,
  CheckCircle2,
  Navigation,
  AlertTriangle,
} from "lucide-react";

const ADMIN_STORAGE_KEY = "ash_admin_auth";
const DEFAULT_PASSCODE = "123456";

// Sample presets for quick image testing
const SAMPLE_IMAGE_PRESETS = [
  {
    label: "Smart Phone",
    url: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=700&q=80",
  },
  {
    label: "Leather Shoes",
    url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=700&q=80",
  },
  {
    label: "Smart Watch",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80",
  },
  {
    label: "Headphones",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&q=80",
  },
  {
    label: "Backpack",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=700&q=80",
  },
  {
    label: "Laptop",
    url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=700&q=80",
  },
];

const POPULAR_BRANDS = [
  "Xiaomi",
  "Samsung",
  "Apple",
  "Apex",
  "Bata",
  "Casio",
  "Anker",
  "Baseus",
  "Sony",
  "Dell",
  "HP",
  "Ashaal Select",
];

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
  {
    id: 304,
    ip: "172.71.31.62",
    name: "—",
    phone: "—",
    location: "Dhaka, BD",
    page: "https://www.ashaa.xyz/",
    platform: "Linux x86_64",
    time: "1 min ago",
  },
  {
    id: 303,
    ip: "104.22.56.28",
    name: "—",
    phone: "—",
    location: "Chittagong, BD",
    page: "https://www.ashaa.xyz/",
    platform: "Linux x86_64",
    time: "3 mins ago",
  },
  {
    id: 302,
    ip: "172.71.102.14",
    name: "Tanvir Hasan",
    phone: "+8801712345678",
    location: "Sylhet, BD",
    page: "https://www.ashaa.xyz/cart",
    platform: "Mobile Android",
    time: "7 mins ago",
  },
  {
    id: 301,
    ip: "162.158.12.90",
    name: "—",
    phone: "—",
    location: "Rajshahi, BD",
    page: "https://www.ashaa.xyz/product/prod-1",
    platform: "Windows 11",
    time: "12 mins ago",
  },
  {
    id: 300,
    ip: "141.101.99.45",
    name: "Nusrat Jahan",
    phone: "+8801819876543",
    location: "Dhaka, BD",
    page: "https://www.ashaa.xyz/my-account",
    platform: "iPhone iOS 18",
    time: "15 mins ago",
  },
];

export const AdminManagePage: React.FC = () => {
  const {
    products,
    banners,
    orders,
    allUsers,
    showToast,
    t,
    language,
    deleteUserAccount,
  } = useApp();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [passcode, setPasscode] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Navigation route/tab (Default to dashboard)
  type NavRoute =
    | "dashboard"
    | "products"
    | "orders"
    | "users"
    | "banners"
    | "visitors"
    | "api-docs"
    | "projects"
    | "events"
    | "donations"
    | "volunteers"
    | "contact-messages"
    | "help-want";

  const [activeRoute, setActiveRoute] = useState<NavRoute>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Global Table Search query
  const [tableSearch, setTableSearch] = useState<string>("");

  // Products Filter & Management State
  const [productCategoryFilter, setProductCategoryFilter] =
    useState<string>("all");
  const [productStockFilter, setProductStockFilter] = useState<string>("all"); // 'all' | 'in_stock' | 'low_stock' | 'out_of_stock' | 'mall' | 'flash'
  const [productSortBy, setProductSortBy] = useState<string>("newest"); // 'newest' | 'price_low' | 'price_high' | 'stock'

  // Product Add / Edit Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null,
  );
  const [productModalTab, setProductModalTab] = useState<
    "general" | "pricing" | "images" | "specs" | "variations"
  >("general");
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);

  // New gallery image input in modal
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState<string>("");
  // Specifications input helper
  const [newSpecKey, setNewSpecKey] = useState<string>("");
  const [newSpecValue, setNewSpecValue] = useState<string>("");
  // Features bullet points text helper
  const [featuresText, setFeaturesText] = useState<string>("");

  // User Filter & Management State
  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(
    null,
  );
  const [isSavingUser, setIsSavingUser] = useState<boolean>(false);

  // Order Details Modal / Invoice
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>("all");
  const [isInvoiceOpen, setIsInvoiceOpen] = useState<boolean>(false);
  const [orderCourierInput, setOrderCourierInput] = useState<string>(
    "Ashaal Express (DEX)",
  );
  const [orderTrackingInput, setOrderTrackingInput] = useState<string>("");
  const [isUpdatingOrderWorkflow, setIsUpdatingOrderWorkflow] =
    useState<boolean>(false);

  useEffect(() => {
    if (selectedOrder) {
      setOrderCourierInput(selectedOrder.courier || "Ashaal Express (DEX)");
      setOrderTrackingInput(selectedOrder.trackingNumber || "");
    }
  }, [selectedOrder]);

  // Banner Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(
    null,
  );
  const [isSavingBanner, setIsSavingBanner] = useState<boolean>(false);

  // Live Visitors
  const [visitors, setVisitors] = useState<VisitorLog[]>(INITIAL_VISITORS);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Close modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsProductModalOpen(false);
        setIsUserModalOpen(false);
        setIsBannerModalOpen(false);
        setIsInvoiceOpen(false);
        setSelectedOrder(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch visitors
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchVisitors()
      .then((data) => {
        if (data && data.length > 0) setVisitors(data);
      })
      .catch((err) => console.log("Visitors fetch notice:", err));
  }, [isAuthenticated]);

  // Handle Admin Passcode Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      passcode.trim() === DEFAULT_PASSCODE ||
      passcode.trim() === "admin880"
    ) {
      setIsAuthenticated(true);
      sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      setAuthError("");
      showToast("Admin authenticated successfully");
    } else {
      setAuthError("Invalid Admin Passcode. Default passcode is 123456");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    showToast("Admin logged out");
  };

  // Seed MySQL Products & Users
  const handleSeedProducts = async () => {
    if (
      !window.confirm(
        "Sync & seed all authentic marketplace products, banners, and users into MySQL Database?",
      )
    )
      return;
    setIsSeeding(true);
    try {
      await Promise.all([seedInitialProducts(true), seedInitialUsers(true)]);
      showToast("Successfully synced MySQL Database with fresh catalog data!");
    } catch (err) {
      showToast("Failed to seed: " + String(err));
    } finally {
      setIsSeeding(false);
    }
  };

  // Open Product Modal for Add
  const handleOpenAddProduct = () => {
    const newId = `prod-${Date.now().toString(36)}`;
    setEditingProduct({
      id: newId,
      title: "",
      titleBn: "",
      slug: "",
      brand: "Ashaal Select",
      category: "Electronic Devices",
      categorySlug: "electronic-devices",
      price: 1200,
      originalPrice: 1600,
      discountPercentage: 25,
      rating: 4.8,
      reviewsCount: 12,
      soldCount: 30,
      inStock: 50,
      isDarazMall: true,
      isFreeDelivery: true,
      isFlashSale: false,
      coinsCashback: 50,
      mainImage:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80",
      ],
      description: [
        "100% Genuine and authentic product imported under Ashaal guarantee.",
        "Premium quality material with durable finish and high reliability.",
        "Comes with official manufacturer warranty and dedicated customer support.",
      ],
      specifications: {
        "Brand Warranty": "1 Year Official Brand Warranty",
        Authenticity: "100% Original Guarantee",
        "Return Policy": "14 Days Free Easy Returns",
      },
      warranty: "1 Year Official Warranty",
      returnPolicy: "14 Days Free Easy Return",
      estimatedDeliveryDays: "2-3 Days",
      seller: {
        id: "seller-official",
        name: "Ashaal Official Flagship Store",
        isOfficial: true,
        rating: 98,
        shipOnTime: 99,
        chatResponse: 95,
        joinedYears: 3,
        location: "Dhaka North",
      },
    });
    setFeaturesText(
      "100% Genuine and authentic product imported under Ashaal guarantee.\nPremium quality material with durable finish and high reliability.\nComes with official manufacturer warranty and dedicated customer support.",
    );
    setProductModalTab("general");
    setIsProductModalOpen(true);
  };

  // Open Product Modal for Edit
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setFeaturesText(
      Array.isArray(p.description)
        ? p.description.join("\n")
        : p.description || "",
    );
    setProductModalTab("general");
    setIsProductModalOpen(true);
  };

  // Duplicate Product for Quick Catalog Expansion
  const handleDuplicateProduct = (p: Product) => {
    const clonedId = `prod-${Date.now().toString(36)}`;
    const cloned: Product = {
      ...p,
      id: clonedId,
      title: `${p.title} (Copy)`,
      slug: `${p.slug || clonedId}-copy`,
      soldCount: 0,
      reviewsCount: 0,
    };
    setEditingProduct(cloned);
    setFeaturesText(
      Array.isArray(cloned.description)
        ? cloned.description.join("\n")
        : cloned.description || "",
    );
    setProductModalTab("general");
    setIsProductModalOpen(true);
    showToast(`Cloned "${p.title}" as new draft product`);
  };

  // Save Product to MySQL via REST API
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      alert("Please provide at least a Product Title and Selling Price.");
      return;
    }

    // Auto-calculate discount percentage if original price > price
    const price = Number(editingProduct.price) || 0;
    const originalPrice = Number(editingProduct.originalPrice) || price;
    const discountPercentage =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    // Parse features text into clean array of lines
    const parsedDesc = featuresText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    const payload: Partial<Product> = {
      ...editingProduct,
      price,
      originalPrice,
      discountPercentage,
      slug:
        editingProduct.slug ||
        editingProduct.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      description:
        parsedDesc.length > 0
          ? parsedDesc
          : ["100% Genuine authentic product."],
      descriptionBn: [editingProduct.titleBn || "আশাল এ সেরা মানের আসল পণ্য।"],
      images:
        editingProduct.images && editingProduct.images.length > 0
          ? editingProduct.images
          : [editingProduct.mainImage || ""],
      mainImage:
        editingProduct.mainImage ||
        (editingProduct.images && editingProduct.images[0]) ||
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80",
    };

    setIsSavingProduct(true);
    try {
      await saveProductToFirestore(payload);
      showToast(
        editingProduct.id
          ? "Product saved successfully to MySQL Database!"
          : "New product created in MySQL Database!",
      );
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert("Error saving product: " + String(err));
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (
      !window.confirm(`Are you sure you want to permanently delete "${title}"?`)
    )
      return;
    try {
      await deleteProductFromFirestore(productId);
      showToast("Product deleted successfully from MySQL");
    } catch (err) {
      alert("Error deleting product: " + String(err));
    }
  };

  // Gallery image helpers
  const handleAddGalleryImage = () => {
    if (!newGalleryImageUrl.trim()) return;
    const currentImages = editingProduct?.images || [];
    setEditingProduct({
      ...editingProduct,
      images: [...currentImages, newGalleryImageUrl.trim()],
    });
    setNewGalleryImageUrl("");
  };

  const handleRemoveGalleryImage = (idxToRemove: number) => {
    const currentImages = editingProduct?.images || [];
    setEditingProduct({
      ...editingProduct,
      images: currentImages.filter((_, idx) => idx !== idxToRemove),
    });
  };

  // Specification helpers
  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    const currentSpecs = editingProduct?.specifications || {};
    setEditingProduct({
      ...editingProduct,
      specifications: {
        ...currentSpecs,
        [newSpecKey.trim()]: newSpecValue.trim(),
      },
    });
    setNewSpecKey("");
    setNewSpecValue("");
  };

  const handleRemoveSpecification = (keyToRemove: string) => {
    const currentSpecs = { ...(editingProduct?.specifications || {}) };
    delete currentSpecs[keyToRemove];
    setEditingProduct({
      ...editingProduct,
      specifications: currentSpecs,
    });
  };

  // Save User
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.name || !editingUser?.email) {
      alert("Name and Email are required.");
      return;
    }
    setIsSavingUser(true);
    try {
      await saveUserToFirestore(editingUser);
      showToast("User profile updated in MySQL Database!");
      setIsUserModalOpen(false);
      setEditingUser(null);
    } catch (err) {
      alert("Error saving user: " + String(err));
    } finally {
      setIsSavingUser(false);
    }
  };

  // Delete User
  const handleDeleteUser = async (userId: string, name: string) => {
    if (!window.confirm(`Delete user account "${name}" (${userId})?`)) return;
    try {
      await deleteUserAccount(userId);
      showToast("User account deleted");
    } catch (err) {
      alert("Error deleting user: " + String(err));
    }
  };

  // Change Order Status with automatic timeline event and COD settlement
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order["orderStatus"],
    customCourier?: string,
    customTracking?: string,
  ) => {
    setIsUpdatingOrderWorkflow(true);
    try {
      const targetOrd = orders.find((o) => o.id === orderId) || selectedOrder;
      const currentTimeline = targetOrd?.timeline || [];
      const now = new Date();
      const formattedDate =
        now.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        ", " +
        now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

      let stepTitle = `Order Status: ${newStatus}`;
      let stepTitleBn = "অর্ডার আপডেট";
      let stepDesc = `Order status updated to ${newStatus}`;

      if (newStatus === "PROCESSING") {
        stepTitle = "Order Verified & Packed";
        stepTitleBn = "অর্ডার যাচাই ও প্যাকিং সম্পন্ন";
        stepDesc =
          "Merchant confirmed inventory, packed item with protective wrap.";
      } else if (newStatus === "SHIPPED") {
        const cName =
          customCourier || targetOrd?.courier || "Ashaal Express (DEX)";
        const tNo =
          customTracking ||
          targetOrd?.trackingNumber ||
          `DEX-BD-${Date.now().toString().slice(-6)}`;
        stepTitle = `Handed to Courier (${cName})`;
        stepTitleBn = `${cName}-এ পাঠানো হয়েছে`;
        stepDesc = `Package dispatched in transit. Tracking #${tNo}`;
      } else if (newStatus === "DELIVERED") {
        stepTitle = "Package Successfully Delivered";
        stepTitleBn = "ডেলিভারি সম্পন্ন হয়েছে";
        stepDesc =
          "Customer received package and completed payment verification.";
      } else if (newStatus === "CANCELLED") {
        stepTitle = "Order Cancelled";
        stepTitleBn = "অর্ডার বাতিল করা হয়েছে";
        stepDesc = "Order cancelled and closed by administrator.";
      }

      const updatedTimeline = [
        ...currentTimeline.map((s) => ({ ...s, current: false })),
        {
          title: stepTitle,
          titleBn: stepTitleBn,
          description: stepDesc,
          descriptionBn: stepTitleBn,
          timestamp: formattedDate,
          completed: true,
          current: true,
        },
      ];

      // Auto-settle payment to PAID if delivered on COD
      let newPaymentStatus = targetOrd?.paymentStatus;
      if (newStatus === "DELIVERED" && targetOrd?.paymentMethod === "cod") {
        newPaymentStatus = "PAID";
      }

      const payload: any = {
        orderStatus: newStatus,
        timeline: updatedTimeline,
        ...(newPaymentStatus ? { paymentStatus: newPaymentStatus } : {}),
        ...(customCourier ? { courier: customCourier } : {}),
        ...(customTracking ? { trackingNumber: customTracking } : {}),
      };

      await updateOrderDetailsInFirestore(orderId, payload);
      showToast(
        `Order #${targetOrd?.orderNumber || orderId} marked as ${newStatus}`,
      );

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...payload } : null));
      }
    } catch (err) {
      alert("Error updating order status: " + String(err));
    } finally {
      setIsUpdatingOrderWorkflow(false);
    }
  };

  // Update logistics & courier tracking
  const handleSaveOrderLogistics = async (orderId: string) => {
    setIsUpdatingOrderWorkflow(true);
    try {
      const payload = {
        courier: orderCourierInput,
        trackingNumber: orderTrackingInput,
      };
      await updateOrderDetailsInFirestore(orderId, payload);
      showToast("Courier & Tracking Number saved!");
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, ...payload } : null));
      }
    } catch (err) {
      alert("Error saving logistics: " + String(err));
    } finally {
      setIsUpdatingOrderWorkflow(false);
    }
  };

  // Toggle Payment Status
  const handleUpdatePaymentStatus = async (
    orderId: string,
    paymentStatus: Order["paymentStatus"],
  ) => {
    try {
      await updateOrderDetailsInFirestore(orderId, { paymentStatus });
      showToast(`Payment status updated to ${paymentStatus}`);
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, paymentStatus } : null));
      }
    } catch (err) {
      alert("Error updating payment status: " + String(err));
    }
  };

  // Delete Order
  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(`Delete order #${orderId}?`)) return;
    try {
      await deleteOrderFromFirestore(orderId);
      showToast("Order removed");
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    } catch (err) {
      alert("Error deleting order: " + String(err));
    }
  };

  // Save Banner
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner?.title || !editingBanner?.image) {
      alert("Title and Image URL are required");
      return;
    }
    setIsSavingBanner(true);
    try {
      await saveBannerToFirestore(editingBanner as Banner);
      showToast("Banner saved successfully");
      setIsBannerModalOpen(false);
      setEditingBanner(null);
    } catch (err) {
      alert("Error saving banner: " + String(err));
    } finally {
      setIsSavingBanner(false);
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (bannerId: string) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await deleteBannerFromFirestore(bannerId);
      showToast("Banner removed");
    } catch (err) {
      alert("Error deleting banner: " + String(err));
    }
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast(`Copied ${label} to clipboard!`);
    }
  };

  // Filtered Products with multi-criteria
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const q = tableSearch.toLowerCase().trim();
        const matchesSearch =
          !q ||
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q);

        const matchesCat =
          productCategoryFilter === "all" ||
          p.categorySlug === productCategoryFilter ||
          p.category.toLowerCase() === productCategoryFilter.toLowerCase();

        let matchesStock = true;
        if (productStockFilter === "in_stock") {
          matchesStock = (p.inStock || 0) > 10;
        } else if (productStockFilter === "low_stock") {
          matchesStock = (p.inStock || 0) > 0 && (p.inStock || 0) <= 10;
        } else if (productStockFilter === "out_of_stock") {
          matchesStock = (p.inStock || 0) <= 0;
        } else if (productStockFilter === "mall") {
          matchesStock = !!p.isDarazMall;
        } else if (productStockFilter === "flash") {
          matchesStock = !!p.isFlashSale;
        }

        return matchesSearch && matchesCat && matchesStock;
      })
      .sort((a, b) => {
        if (productSortBy === "price_low") return a.price - b.price;
        if (productSortBy === "price_high") return b.price - a.price;
        if (productSortBy === "stock")
          return (b.inStock || 0) - (a.inStock || 0);
        return 0; // Default order
      });
  }, [
    products,
    tableSearch,
    productCategoryFilter,
    productStockFilter,
    productSortBy,
  ]);

  // Filtered Orders with multi-criteria
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = tableSearch.toLowerCase().trim();
      const matchesStatus =
        orderStatusFilter === "all" || o.orderStatus === orderStatusFilter;
      const matchesPayment =
        orderPaymentFilter === "all" || o.paymentStatus === orderPaymentFilter;
      const matchesSearch =
        !q ||
        o.orderNumber.includes(q) ||
        o.shippingAddress?.fullName?.toLowerCase().includes(q) ||
        o.shippingAddress?.phone?.includes(q) ||
        o.shippingAddress?.division?.toLowerCase().includes(q) ||
        o.id.includes(q) ||
        o.paymentMethod.toLowerCase().includes(q) ||
        (o.courier && o.courier.toLowerCase().includes(q)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
      return matchesStatus && matchesPayment && matchesSearch;
    });
  }, [orders, tableSearch, orderStatusFilter, orderPaymentFilter]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return allUsers.filter((u) => {
      const q = tableSearch.toLowerCase().trim();
      const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.id.toLowerCase().includes(q);
      return matchesRole && matchesSearch;
    });
  }, [allUsers, tableSearch, userRoleFilter]);

  // Analytics Metrics
  const totalRevenue = orders.reduce(
    (sum, o) => (o.orderStatus !== "CANCELLED" ? sum + o.total : sum),
    0,
  );
  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === "PLACED" || o.orderStatus === "PROCESSING",
  ).length;
  const lowStockCount = products.filter((p) => (p.inStock || 0) <= 10).length;
  const outOfStockCount = products.filter((p) => (p.inStock || 0) <= 0).length;
  const flashSaleCount = products.filter((p) => p.isFlashSale).length;

  // Title getter for main card based on activeRoute
  const getCardTitle = () => {
    switch (activeRoute) {
      case "dashboard":
        return "Executive Overview — Live Analytics";
      case "products":
        return `Product Catalog Management (${products.length} Items)`;
      case "orders":
        return `Orders & Logistics Fulfillment (${orders.length} Orders)`;
      case "users":
        return `Customers & Account Directory (${allUsers.length} Users)`;
      case "banners":
        return `Hero Banners & Sales Promotions (${banners.length} Banners)`;
      case "visitors":
        return "Live Traffic & Real-Time Visitor Logs";
      case "api-docs":
        return "Developer REST API & MySQL Integration";
      default:
        return `${activeRoute.replace("-", " ")} Module`;
    }
  };

  // If Not Authenticated, Show Clean Passcode Entry Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-emerald-500 selection:text-white">
        <SEO title="Admin Login — Ashaal Management" />
        <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-md w-full p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-2xl mx-auto flex items-center justify-center border border-emerald-500/20 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[11px] font-bold tracking-wider uppercase border border-emerald-500/20">
              Admin Portal
            </span>
            <h1 className="text-2xl font-black text-white tracking-tight mt-3">
              Ashaal Management
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Direct MySQL Database & Store Operations Control
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-slate-300">
                Security Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter 6-digit passcode (Default: 123456)"
                className="w-full px-4 py-3 bg-slate-800/80 border border-slate-700 text-white rounded-xl text-center text-sm font-mono tracking-widest focus:outline-hidden focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Unlock Admin Workspace</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
            <span>MySQL Host: 51.79.229.154</span>
            <span className="text-emerald-400 font-semibold">
              Protected Session
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate live discount for product modal
  const modalPrice = Number(editingProduct?.price) || 0;
  const modalOriginalPrice =
    Number(editingProduct?.originalPrice) || modalPrice;
  const modalDiscountPct =
    modalOriginalPrice > modalPrice
      ? Math.round(
          ((modalOriginalPrice - modalPrice) / modalOriginalPrice) * 100,
        )
      : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SEO title="Admin Control Center — Ashaal Bangladesh" />

      {/* Top Header Bar */}
      <header className="h-16 bg-slate-900 border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-emerald-600/30">
              A
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-sm text-white tracking-tight">
                  Ashaal
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-mono font-semibold border border-emerald-500/20">
                  v2.0 Next.js
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                MySQL Database Active
              </p>
            </div>
          </div>
        </div>

        {/* Center Search */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search products, orders, customers, visitors..."
              className="w-full bg-slate-800/70 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-hidden focus:border-emerald-500 focus:bg-slate-800 transition-all"
            />
            {tableSearch && (
              <button
                onClick={() => setTableSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleOpenAddProduct}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Product</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-1 border border-slate-700 transition-colors"
            title="Open Storefront in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Store</span>
          </a>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors"
            title="Logout Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-20"
          } bg-slate-900 border-r border-slate-800/80 flex flex-col transition-all duration-300 shrink-0 select-none`}
        >
          {/* Navigation Links */}
          <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
            {/* Core Commerce Section */}
            <div>
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  E-Commerce Store
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveRoute("dashboard")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoute === "dashboard"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>Dashboard</span>}
                </button>

                <button
                  onClick={() => setActiveRoute("products")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoute === "products"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>Products</span>}
                  </div>
                  {sidebarOpen && (
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                      {products.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveRoute("orders")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoute === "orders"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>Orders</span>}
                  </div>
                  {sidebarOpen && pendingOrdersCount > 0 && (
                    <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] font-bold rounded border border-amber-500/30">
                      {pendingOrdersCount} new
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveRoute("users")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoute === "users"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>Customers</span>}
                  </div>
                  {sidebarOpen && (
                    <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 text-[10px] font-mono rounded">
                      {allUsers.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveRoute("banners")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoute === "banners"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>Hero Banners</span>}
                </button>
              </div>
            </div>

            {/* Growth & Traffic */}
            <div>
              {sidebarOpen && (
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Traffic & Analytics
                </p>
              )}
              <div className="space-y-1">
                <button
                  onClick={() => setActiveRoute("visitors")}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoute === "visitors"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 shrink-0" />
                    {sidebarOpen && <span>Live Visitors</span>}
                  </div>
                  {sidebarOpen && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>

                <button
                  onClick={() => setActiveRoute("api-docs")}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeRoute === "api-docs"
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Code className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>REST API Docs</span>}
                </button>
              </div>
            </div>

            {/* Quick Actions Card in Sidebar */}
            {sidebarOpen && (
              <div className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-300">
                  <Database className="w-3.5 h-3.5 text-emerald-400" />
                  <span>MySQL Database</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  51.79.229.154:3306 Connected
                </p>
                <button
                  onClick={handleSeedProducts}
                  disabled={isSeeding}
                  className="w-full py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3 h-3 ${isSeeding ? "animate-spin" : ""}`}
                  />
                  <span>Sync & Seed Data</span>
                </button>
              </div>
            )}
          </nav>

          {/* Sidebar Footer User Info */}
          <div className="p-3 border-t border-slate-800/80">
            <div className="flex items-center gap-3 px-2 py-1">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                AD
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    Administrator
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    admin@ashaal.com
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 bg-slate-950 p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {getCardTitle()}
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time synchronized data layer connected to remote MySQL
                Database
              </p>
            </div>

            {/* Contextual Action Button based on Active Route */}
            <div className="flex items-center gap-2">
              {activeRoute === "products" && (
                <button
                  onClick={handleOpenAddProduct}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Product</span>
                </button>
              )}
              {activeRoute === "banners" && (
                <button
                  onClick={() => {
                    setEditingBanner({
                      id: `b-${Date.now()}`,
                      title: "11.11 Mega Sale",
                      subtitle: "Up to 70% Off Today",
                      image:
                        "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80",
                      badge: "MEGA DEAL",
                      linkType: "flash-sale",
                    });
                    setIsBannerModalOpen(true);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Banner</span>
                </button>
              )}
              {activeRoute === "users" && (
                <button
                  onClick={() => {
                    setEditingUser({
                      id: `usr-${Date.now().toString(36)}`,
                      name: "",
                      email: "",
                      phone: "+8801",
                      role: "customer",
                      memberTier: "Silver Member",
                      coins: 100,
                      status: "active",
                    });
                    setIsUserModalOpen(true);
                  }}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-purple-600/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: EXECUTIVE DASHBOARD */}
          {/* ========================================================================= */}
          {activeRoute === "dashboard" && (
            <div className="space-y-6">
              {/* 4 Primary KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Revenue */}
                <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Total Gross Sales
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white mt-3 tracking-tight">
                    ৳{totalRevenue.toLocaleString("en-BD")}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Live from MySQL Orders</span>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Total Orders
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white mt-3 tracking-tight">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    <span className="text-amber-400 font-bold">
                      {pendingOrdersCount}
                    </span>{" "}
                    pending fulfillment
                  </p>
                </div>

                {/* Catalog Products */}
                <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Catalog Products
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                      <Box className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white mt-3 tracking-tight">
                    {products.length}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Across {CATEGORIES_DATA.length} categories
                  </p>
                </div>

                {/* Active Customers */}
                <div className="p-5 bg-slate-900 border border-slate-800/80 rounded-2xl relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">
                      Registered Customers
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl font-black text-white mt-3 tracking-tight">
                    {allUsers.length}
                  </p>
                  <p className="text-[11px] text-purple-400 mt-1">
                    Multi-user token sessions
                  </p>
                </div>
              </div>

              {/* Low Stock Warning Banner if any */}
              {lowStockCount > 0 && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-amber-300">
                        Inventory Alert: {lowStockCount} Product(s) Low on
                        Stock!
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Restock items soon to prevent lost sales across
                        marketplace channels.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setProductStockFilter("low_stock");
                      setActiveRoute("products");
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shrink-0 cursor-pointer"
                  >
                    View Low Stock
                  </button>
                </div>
              )}

              {/* Quick Shortcuts & Recent Orders Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders (2 cols) */}
                <div className="lg:col-span-2 bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-emerald-400" />
                      <span>Recent Store Orders</span>
                    </h3>
                    <button
                      onClick={() => setActiveRoute("orders")}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                    >
                      View All Orders →
                    </button>
                  </div>

                  <div className="overflow-x-auto -mx-5 px-5">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                          <th className="py-2.5 px-3">Order ID</th>
                          <th className="py-2.5 px-3">Customer</th>
                          <th className="py-2.5 px-3">Total</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {orders.slice(0, 5).map((ord) => (
                          <tr key={ord.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-3 font-mono font-bold text-white">
                              #{ord.orderNumber}
                            </td>
                            <td className="py-3 px-3 text-slate-300">
                              {ord.shippingAddress?.fullName ||
                                "Guest Customer"}
                            </td>
                            <td className="py-3 px-3 font-bold text-emerald-400">
                              ৳{ord.total.toLocaleString("en-BD")}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  ord.orderStatus === "DELIVERED"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : ord.orderStatus === "CANCELLED"
                                      ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                      : ord.orderStatus === "SHIPPED"
                                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                }`}
                              >
                                {ord.orderStatus}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setActiveRoute("orders");
                                }}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold cursor-pointer"
                              >
                                Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Quick Store Operations Shortcuts */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Quick Operations</span>
                  </h3>

                  <div className="space-y-2.5">
                    <button
                      onClick={handleOpenAddProduct}
                      className="w-full p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left flex items-center justify-between group transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <Plus className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                            Add New Product
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Create listing with gallery & specs
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => setActiveRoute("orders")}
                      className="w-full p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left flex items-center justify-between group transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                            Fulfill Pending Orders
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {pendingOrdersCount} orders waiting
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => setActiveRoute("banners")}
                      className="w-full p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left flex items-center justify-between group transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                            Manage Hero Carousel
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Configure homepage banners
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => setActiveRoute("visitors")}
                      className="w-full p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl text-left flex items-center justify-between group transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                            Inspect Live Visitors
                          </p>
                          <p className="text-[10px] text-slate-400">
                            View traffic, IP & devices
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: PRODUCT CATALOG MANAGEMENT TABLE */}
          {/* ========================================================================= */}
          {activeRoute === "products" && (
            <div className="space-y-4">
              {/* Product Catalog Summary Pill Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[11px] text-slate-400">Total Catalog</p>
                  <p className="text-lg font-black text-white">
                    {products.length} Products
                  </p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[11px] text-slate-400">Flash Sale Deals</p>
                  <p className="text-lg font-black text-amber-400">
                    {flashSaleCount} Active
                  </p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[11px] text-slate-400">Low Stock Alert</p>
                  <p className="text-lg font-black text-amber-400">
                    {lowStockCount} Items
                  </p>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl">
                  <p className="text-[11px] text-slate-400">Out of Stock</p>
                  <p className="text-lg font-black text-red-400">
                    {outOfStockCount} Items
                  </p>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                {/* Status Tabs */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "all", label: "All Items", count: products.length },
                    {
                      id: "in_stock",
                      label: "In Stock",
                      count: products.filter((p) => (p.inStock || 0) > 10)
                        .length,
                    },
                    {
                      id: "low_stock",
                      label: "Low Stock",
                      count: lowStockCount,
                    },
                    {
                      id: "out_of_stock",
                      label: "Out of Stock",
                      count: outOfStockCount,
                    },
                    {
                      id: "mall",
                      label: "AshaalMall",
                      count: products.filter((p) => p.isDarazMall).length,
                    },
                    {
                      id: "flash",
                      label: "⚡ Flash Sale",
                      count: flashSaleCount,
                    },
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => setProductStockFilter(filter.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                        productStockFilter === filter.id
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                      }`}
                    >
                      <span>{filter.label}</span>
                      <span className="text-[10px] opacity-80">
                        ({filter.count})
                      </span>
                    </button>
                  ))}
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-2">
                  <select
                    value={productCategoryFilter}
                    onChange={(e) => setProductCategoryFilter(e.target.value)}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES_DATA.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={productSortBy}
                    onChange={(e) => setProductSortBy(e.target.value)}
                    className="px-3 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="newest">Sort: Default</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="stock">Stock Level</option>
                  </select>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/90">
                        <th className="py-3 px-4 whitespace-nowrap">Product</th>
                        <th className="py-3 px-4 whitespace-nowrap">
                          Category
                        </th>
                        <th className="py-3 px-4 whitespace-nowrap">
                          Pricing (BDT)
                        </th>
                        <th className="py-3 px-4 whitespace-nowrap">Stock</th>
                        <th className="py-3 px-4 whitespace-nowrap">Badges</th>
                        <th className="py-3 px-4 whitespace-nowrap text-right">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredProducts.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-12 text-center text-slate-400"
                          >
                            <Box className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                            <p className="font-semibold text-sm">
                              No products match the selected filter
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                              Try clearing your search query or changing
                              category/stock filter.
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredProducts.map((prod) => (
                          <tr
                            key={prod.id}
                            className="hover:bg-slate-800/40 transition-colors group"
                          >
                            {/* Product Info */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 shrink-0">
                                  <img
                                    src={prod.mainImage}
                                    alt={prod.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                  />
                                </div>
                                <div className="max-w-xs sm:max-w-md min-w-0">
                                  <a
                                    href={`/product/${prod.id}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="font-bold text-slate-100 hover:text-emerald-400 line-clamp-1 transition-colors"
                                  >
                                    {prod.title}
                                  </a>
                                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                                    <span>
                                      Brand:{" "}
                                      <strong className="text-slate-300 font-semibold">
                                        {prod.brand || "Ashaal"}
                                      </strong>
                                    </span>
                                    <span>•</span>
                                    <span className="font-mono text-[10px]">
                                      ID: {prod.id}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4">
                              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-lg text-[11px] font-medium border border-slate-700/60">
                                {prod.category}
                              </span>
                            </td>

                            {/* Price */}
                            <td className="py-3.5 px-4">
                              <div>
                                <span className="font-bold text-sm text-emerald-400">
                                  ৳{prod.price.toLocaleString("en-BD")}
                                </span>
                                {prod.originalPrice > prod.price && (
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <span className="text-[11px] text-slate-400 line-through">
                                      ৳
                                      {prod.originalPrice.toLocaleString(
                                        "en-BD",
                                      )}
                                    </span>
                                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[9px] font-bold rounded">
                                      {prod.discountPercentage ||
                                        Math.round(
                                          ((prod.originalPrice - prod.price) /
                                            prod.originalPrice) *
                                            100,
                                        )}
                                      % OFF
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>

                            {/* Stock */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                                  (prod.inStock ?? 0) > 10
                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                    : (prod.inStock ?? 0) > 0
                                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                      : "bg-red-500/15 text-red-400 border border-red-500/30"
                                }`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    (prod.inStock ?? 0) > 10
                                      ? "bg-emerald-400"
                                      : (prod.inStock ?? 0) > 0
                                        ? "bg-amber-400 animate-pulse"
                                        : "bg-red-400"
                                  }`}
                                />
                                {(prod.inStock ?? 0) > 0
                                  ? `${prod.inStock} In Stock`
                                  : "Out of Stock"}
                              </span>
                            </td>

                            {/* Badges */}
                            <td className="py-3.5 px-4">
                              <div className="flex flex-wrap gap-1">
                                {prod.isDarazMall && (
                                  <span className="px-2 py-0.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[9px] font-bold">
                                    AshaalMall
                                  </span>
                                )}
                                {prod.isFlashSale && (
                                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-bold">
                                    ⚡ Flash Sale
                                  </span>
                                )}
                                {prod.isFreeDelivery && (
                                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-[9px] font-bold">
                                    Free Delivery
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Action Buttons */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <a
                                  href={`/product/${prod.id}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="View on Storefront"
                                >
                                  <Eye className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={() => handleDuplicateProduct(prod)}
                                  className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="Duplicate Product"
                                >
                                  <CopyPlus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleOpenEditProduct(prod)}
                                  className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(prod.id, prod.title)
                                  }
                                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
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
          {/* TAB 3: ORDERS MANAGEMENT TABLE */}
          {/* ========================================================================= */}
          {activeRoute === "orders" && (
            <div className="space-y-4">
              {/* Order KPIs & Filter Bar */}
              <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-3">
                {/* Metrics Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 border-b border-slate-800">
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Total Bookings
                    </p>
                    <p className="text-base font-extrabold text-white">
                      {orders.length}
                    </p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <p className="text-[10px] uppercase font-bold text-blue-400">
                      Pending Action
                    </p>
                    <p className="text-base font-extrabold text-blue-400">
                      {
                        orders.filter(
                          (o) =>
                            o.orderStatus === "PLACED" ||
                            o.orderStatus === "PROCESSING",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <p className="text-[10px] uppercase font-bold text-purple-400">
                      In Transit (Shipped)
                    </p>
                    <p className="text-base font-extrabold text-purple-400">
                      {orders.filter((o) => o.orderStatus === "SHIPPED").length}
                    </p>
                  </div>
                  <div className="bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
                    <p className="text-[10px] uppercase font-bold text-emerald-400">
                      Completed Orders
                    </p>
                    <p className="text-base font-extrabold text-emerald-400">
                      {
                        orders.filter((o) => o.orderStatus === "DELIVERED")
                          .length
                      }
                    </p>
                  </div>
                </div>

                {/* Status and Payment Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  {/* Status Filters */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {[
                      { id: "all", label: "All", count: orders.length },
                      {
                        id: "PLACED",
                        label: "Placed",
                        count: orders.filter((o) => o.orderStatus === "PLACED")
                          .length,
                      },
                      {
                        id: "PROCESSING",
                        label: "Processing",
                        count: orders.filter(
                          (o) => o.orderStatus === "PROCESSING",
                        ).length,
                      },
                      {
                        id: "SHIPPED",
                        label: "Shipped",
                        count: orders.filter((o) => o.orderStatus === "SHIPPED")
                          .length,
                      },
                      {
                        id: "DELIVERED",
                        label: "Delivered",
                        count: orders.filter(
                          (o) => o.orderStatus === "DELIVERED",
                        ).length,
                      },
                      {
                        id: "CANCELLED",
                        label: "Cancelled",
                        count: orders.filter(
                          (o) => o.orderStatus === "CANCELLED",
                        ).length,
                      },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setOrderStatusFilter(st.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                          orderStatusFilter === st.id
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <span>{st.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            orderStatusFilter === st.id
                              ? "bg-emerald-800 text-emerald-100"
                              : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {st.count}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Payment Status Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Payment:</span>
                    <select
                      value={orderPaymentFilter}
                      onChange={(e) => setOrderPaymentFilter(e.target.value)}
                      className="px-2.5 py-1.5 bg-slate-800 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden cursor-pointer"
                    >
                      <option value="all">All Payments</option>
                      <option value="PAID">PAID (Settled)</option>
                      <option value="PENDING">PENDING (Unpaid)</option>
                      <option value="REFUNDED">REFUNDED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/90">
                        <th className="py-3 px-4">Order Info</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Items</th>
                        <th className="py-3 px-4">Amount & Payment</th>
                        <th className="py-3 px-4">Courier & Tracking</th>
                        <th className="py-3 px-4">Stage & Next Action</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td
                            colSpan={7}
                            className="py-12 text-center text-slate-400"
                          >
                            No orders found matching this filter criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((ord) => (
                          <tr
                            key={ord.id}
                            className="hover:bg-slate-800/40 transition-colors"
                          >
                            {/* Order Info */}
                            <td className="py-3.5 px-4">
                              <p className="font-mono font-bold text-white text-xs">
                                #{ord.orderNumber}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {ord.createdAt}
                              </p>
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <p className="font-semibold text-slate-200">
                                {ord.shippingAddress?.fullName ||
                                  "Guest Customer"}
                              </p>
                              <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                <a
                                  href={`tel:${ord.shippingAddress?.phone}`}
                                  className="hover:text-emerald-400 flex items-center gap-0.5"
                                  title="Call phone"
                                >
                                  <PhoneCall className="w-3 h-3 text-slate-500" />
                                  <span>{ord.shippingAddress?.phone}</span>
                                </a>
                              </div>
                              <p className="text-[10px] text-slate-500 line-clamp-1">
                                {ord.shippingAddress?.district ||
                                  ord.shippingAddress?.division}
                              </p>
                            </td>

                            {/* Items */}
                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-300">
                                {ord.items?.length || 0} item(s)
                              </span>
                              {ord.items?.[0]?.product && (
                                <p className="text-[10px] text-slate-500 line-clamp-1 max-w-[140px]">
                                  {ord.items[0].product.title}
                                </p>
                              )}
                            </td>

                            {/* Amount & Payment */}
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-emerald-400 text-sm">
                                ৳{ord.total.toLocaleString("en-BD")}
                              </p>
                              <div className="flex items-center gap-1.5 pt-0.5">
                                <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 font-mono text-[9px] font-bold uppercase rounded border border-slate-700">
                                  {ord.paymentMethod}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                                    ord.paymentStatus === "PAID"
                                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  }`}
                                >
                                  {ord.paymentStatus || "PENDING"}
                                </span>
                              </div>
                            </td>

                            {/* Courier & Tracking */}
                            <td className="py-3.5 px-4">
                              <p className="text-slate-300 font-medium text-[11px]">
                                {ord.courier || "Ashaal Express"}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {ord.trackingNumber || "Pending"}
                                </span>
                                {ord.trackingNumber && (
                                  <button
                                    onClick={() =>
                                      copyToClipboard(
                                        ord.trackingNumber,
                                        "Tracking Number",
                                      )
                                    }
                                    className="text-slate-500 hover:text-slate-300 cursor-pointer"
                                    title="Copy Tracking #"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* Stage & Next Action */}
                            <td className="py-3.5 px-4">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                      ord.orderStatus === "DELIVERED"
                                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                        : ord.orderStatus === "CANCELLED"
                                          ? "bg-red-500/10 text-red-400 border-red-500/20"
                                          : ord.orderStatus === "SHIPPED"
                                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                            : ord.orderStatus === "PROCESSING"
                                              ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    }`}
                                  >
                                    {ord.orderStatus}
                                  </span>

                                  {/* Quick Next Stage Action Button */}
                                  {ord.orderStatus === "PLACED" && (
                                    <button
                                      onClick={() =>
                                        handleUpdateOrderStatus(
                                          ord.id,
                                          "PROCESSING",
                                        )
                                      }
                                      className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                                      title="Mark order verified & start packing"
                                    >
                                      Accept & Pack
                                    </button>
                                  )}
                                  {ord.orderStatus === "PROCESSING" && (
                                    <button
                                      onClick={() => {
                                        setSelectedOrder(ord);
                                      }}
                                      className="px-2 py-0.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                                      title="Dispatch package with courier"
                                    >
                                      Dispatch
                                    </button>
                                  )}
                                  {ord.orderStatus === "SHIPPED" && (
                                    <button
                                      onClick={() =>
                                        handleUpdateOrderStatus(
                                          ord.id,
                                          "DELIVERED",
                                        )
                                      }
                                      className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                                      title="Mark delivered and collect COD"
                                    >
                                      Delivered
                                    </button>
                                  )}
                                </div>

                                {/* Status Dropdown */}
                                <select
                                  value={ord.orderStatus}
                                  onChange={(e) =>
                                    handleUpdateOrderStatus(
                                      ord.id,
                                      e.target.value as Order["orderStatus"],
                                    )
                                  }
                                  className="w-28 px-1.5 py-0.5 bg-slate-800 border border-slate-700 text-slate-300 rounded text-[10px] font-semibold cursor-pointer"
                                >
                                  <option value="PLACED">PLACED</option>
                                  <option value="PROCESSING">PROCESSING</option>
                                  <option value="SHIPPED">SHIPPED</option>
                                  <option value="DELIVERED">DELIVERED</option>
                                  <option value="CANCELLED">CANCELLED</option>
                                </select>
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => {
                                    setSelectedOrder(ord);
                                    setIsInvoiceOpen(true);
                                  }}
                                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                                  title="Print Packing Slip / Tax Invoice"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setSelectedOrder(ord)}
                                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold text-[11px] cursor-pointer transition-colors"
                                >
                                  Manage
                                </button>
                                <button
                                  onClick={() => handleDeleteOrder(ord.id)}
                                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
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
          {/* TAB 4: USERS / CUSTOMER DIRECTORY */}
          {/* ========================================================================= */}
          {activeRoute === "users" && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  {["all", "customer", "admin", "seller"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider cursor-pointer ${
                        userRoleFilter === r
                          ? "bg-purple-600 text-white"
                          : "bg-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setEditingUser({
                      id: `usr-${Date.now().toString(36)}`,
                      name: "",
                      email: "",
                      phone: "+8801",
                      role: "customer",
                      memberTier: "Silver Member",
                      coins: 100,
                      status: "active",
                    });
                    setIsUserModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Customer</span>
                </button>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/90">
                        <th className="py-3 px-4">User</th>
                        <th className="py-3 px-4">Contact</th>
                        <th className="py-3 px-4">Role & Tier</th>
                        <th className="py-3 px-4">Coins</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredUsers.map((usr) => (
                        <tr
                          key={usr.id}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                                {usr.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <p className="font-bold text-slate-100">
                                  {usr.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono">
                                  {usr.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            <p>{usr.email}</p>
                            <p className="text-[11px] text-slate-400">
                              {usr.phone}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-800 text-purple-300 rounded text-[10px] font-bold uppercase border border-purple-500/30">
                              {usr.role || "customer"}
                            </span>
                            <p className="text-[10px] text-slate-400 mt-0.5">
                              {usr.memberTier || "Silver"}
                            </p>
                          </td>
                          <td className="py-3.5 px-4 font-bold text-amber-400">
                            {usr.coins || 0} 🪙
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded text-[10px] font-bold">
                              {usr.status || "active"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingUser(usr);
                                  setIsUserModalOpen(true);
                                }}
                                className="p-1.5 text-blue-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteUser(usr.id, usr.name)
                                }
                                className="p-1.5 text-red-400 hover:text-red-300 hover:bg-slate-800 rounded-lg cursor-pointer"
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: BANNERS MANAGEMENT */}
          {/* ========================================================================= */}
          {activeRoute === "banners" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {banners.map((b) => (
                <div
                  key={b.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
                >
                  <div className="h-44 relative overflow-hidden bg-slate-800">
                    <img
                      src={b.image}
                      alt={b.title}
                      className="w-full h-full object-cover"
                    />
                    {b.badge && (
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-md shadow-md">
                        {b.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-xs">
                        {b.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {b.subtitle}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="px-2.5 py-1 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: LIVE VISITORS */}
          {/* ========================================================================= */}
          {activeRoute === "visitors" && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/90">
                        <th className="py-3 px-4"># ID</th>
                        <th className="py-3 px-4">IP Address</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4">Platform & Device</th>
                        <th className="py-3 px-4">Last Visited Page</th>
                        <th className="py-3 px-4 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {visitors.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-800/40">
                          <td className="py-3 px-4 text-slate-400">#{v.id}</td>
                          <td className="py-3 px-4 font-bold text-emerald-400">
                            {v.ip}
                          </td>
                          <td className="py-3 px-4 font-sans text-slate-300">
                            {v.location}
                          </td>
                          <td className="py-3 px-4 font-sans text-slate-400">
                            {v.platform}
                          </td>
                          <td className="py-3 px-4 text-slate-300 truncate max-w-xs">
                            {v.page}
                          </td>
                          <td className="py-3 px-4 text-right font-sans text-slate-400">
                            {v.time}
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
          {/* TAB 7: REST API DOCS */}
          {/* ========================================================================= */}
          {activeRoute === "api-docs" && (
            <div className="space-y-4">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Code className="w-5 h-5" />
                  <span>Next.js App Router Native REST API Endpoints</span>
                </div>
                <p className="text-xs text-slate-300">
                  Every resource is directly connected to the remote MySQL
                  database (51.79.229.154).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2">
                    <p className="font-bold text-xs text-white">
                      Products Endpoints:
                    </p>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      GET /api/products
                    </code>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      GET /api/products/:id
                    </code>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      POST /api/products
                    </code>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      DELETE /api/products/:id
                    </code>
                  </div>
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 space-y-2">
                    <p className="font-bold text-xs text-white">
                      Orders Endpoints:
                    </p>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      GET /api/orders
                    </code>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      POST /api/orders
                    </code>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      PUT /api/orders/:id
                    </code>
                    <code className="block font-mono text-[11px] text-emerald-400">
                      DELETE /api/orders/:id
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* HIGH-END PRODUCT ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl max-w-4xl w-full shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {editingProduct.id &&
                    products.some((p) => p.id === editingProduct.id)
                      ? `Edit Product: ${editingProduct.title || "Untitled"}`
                      : "Create New Product Listing"}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Saves directly to MySQL Database with instant storefront
                    sync
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs Bar */}
            <div className="px-6 border-b border-slate-800 flex items-center gap-2 shrink-0 bg-slate-900/80 overflow-x-auto">
              {[
                { id: "general", label: "General Info", icon: Info },
                { id: "pricing", label: "Pricing & Stock", icon: DollarSign },
                { id: "images", label: "Images & Gallery", icon: ImageIcon },
                { id: "specs", label: "Highlights & Specs", icon: FileText },
                { id: "variations", label: "Seller & Logistics", icon: Store },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setProductModalTab(tab.id as any)}
                    className={`py-3 px-3.5 border-b-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      productModalTab === tab.id
                        ? "border-emerald-500 text-emerald-400"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Form Body */}
            <form
              onSubmit={handleSaveProduct}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* TAB 1: GENERAL INFO */}
              {productModalTab === "general" && (
                <div className="space-y-4">
                  {/* Product Title */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Product Title (English) *
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProduct.title || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          title: e.target.value,
                          slug: e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/(^-|-$)/g, ""),
                        })
                      }
                      placeholder="e.g. Xiaomi Redmi Note 13 Pro 8GB/256GB - Official Global"
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-slate-800"
                    />
                  </div>

                  {/* Title Bangla */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Product Title (Bangla / বাংলা)
                    </label>
                    <input
                      type="text"
                      value={editingProduct.titleBn || ""}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          titleBn: e.target.value,
                        })
                      }
                      placeholder="e.g. শাওমি রেডমি নোট ১৩ প্রো ৮জিবি/২৫৬জিবি"
                      className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-slate-800"
                    />
                  </div>

                  {/* Brand and Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Brand
                      </label>
                      <input
                        type="text"
                        value={editingProduct.brand || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            brand: e.target.value,
                          })
                        }
                        placeholder="e.g. Xiaomi, Samsung, Apex"
                        className="w-full px-3.5 py-2.5 bg-slate-800/80 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 focus:bg-slate-800"
                      />
                      {/* Popular Brand Chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {POPULAR_BRANDS.slice(0, 6).map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() =>
                              setEditingProduct({ ...editingProduct, brand: b })
                            }
                            className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] font-medium border border-slate-700"
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Category *
                      </label>
                      <select
                        value={
                          editingProduct.categorySlug || "electronic-devices"
                        }
                        onChange={(e) => {
                          const cat = CATEGORIES_DATA.find(
                            (c) => c.slug === e.target.value,
                          );
                          setEditingProduct({
                            ...editingProduct,
                            categorySlug: e.target.value,
                            category: cat?.name || "Electronic Devices",
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                      >
                        {CATEGORIES_DATA.map((c) => (
                          <option key={c.id} value={c.slug}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Slug */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      SEO URL Slug
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs font-mono">
                        /product/
                      </span>
                      <input
                        type="text"
                        value={editingProduct.slug || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            slug: e.target.value,
                          })
                        }
                        placeholder="redmi-note-13-pro"
                        className="flex-1 px-3.5 py-2 bg-slate-800/80 border border-slate-700 text-slate-300 rounded-xl text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRICING & STOCK */}
              {productModalTab === "pricing" && (
                <div className="space-y-5">
                  {/* Pricing Row with Live Calculator */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-slate-800/50 border border-slate-700/80 rounded-2xl">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Selling Price (৳ BDT) *
                      </label>
                      <input
                        type="number"
                        required
                        min={1}
                        value={editingProduct.price ?? ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-emerald-400 font-bold text-sm rounded-xl focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Original / Strike Price (৳ BDT)
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={editingProduct.originalPrice ?? ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-slate-300 font-bold text-sm rounded-xl focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Calculated Discount
                      </label>
                      <div className="h-10 px-3.5 bg-slate-900 rounded-xl flex items-center justify-between border border-slate-700/60">
                        <span className="text-xs text-slate-400">
                          Discount:
                        </span>
                        <span className="text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">
                          {modalDiscountPct}% OFF
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Stock Quantity Available *
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={editingProduct.inStock ?? 50}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            inStock: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Coins Cashback (Points)
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editingProduct.coinsCashback ?? 50}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            coinsCashback: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-amber-400 font-bold rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* Badges Toggles */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <label className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={editingProduct.isDarazMall ?? true}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            isDarazMall: e.target.checked,
                          })
                        }
                        className="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">
                          AshaalMall Brand
                        </p>
                        <p className="text-[10px] text-slate-400">
                          100% Authentic Flagship
                        </p>
                      </div>
                    </label>

                    <label className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFlashSale ?? false}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            isFlashSale: e.target.checked,
                          })
                        }
                        className="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">
                          ⚡ Flash Sale Deal
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Display on Mega Deals tab
                        </p>
                      </div>
                    </label>

                    <label className="p-3.5 bg-slate-800/60 border border-slate-700/80 rounded-2xl flex items-center gap-3 cursor-pointer hover:bg-slate-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={editingProduct.isFreeDelivery ?? true}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            isFreeDelivery: e.target.checked,
                          })
                        }
                        className="rounded w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">
                          🚚 Free Delivery
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Zero shipping fee at cart
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 3: IMAGES & GALLERY */}
              {productModalTab === "images" && (
                <div className="space-y-5">
                  {/* Main Image with Live Visual Preview */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-300">
                      Main Cover Image URL *
                    </label>
                    <div className="flex flex-col sm:flex-row gap-4 items-start">
                      <div className="flex-1 w-full space-y-2">
                        <input
                          type="url"
                          required
                          value={editingProduct.mainImage || ""}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              mainImage: e.target.value,
                            })
                          }
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                        />

                        {/* Quick Sample Presets */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400">
                            Quick Test Images:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {SAMPLE_IMAGE_PRESETS.map((p) => (
                              <button
                                key={p.label}
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    mainImage: p.url,
                                  })
                                }
                                className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[10px] border border-slate-700 cursor-pointer"
                              >
                                {p.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Live Image Preview Card */}
                      <div className="w-28 h-28 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 flex items-center justify-center relative shadow-md">
                        {editingProduct.mainImage ? (
                          <img
                            src={editingProduct.mainImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&q=80";
                            }}
                          />
                        ) : (
                          <div className="text-center p-2 text-slate-500">
                            <ImageIcon className="w-6 h-6 mx-auto mb-1" />
                            <span className="text-[10px]">No Image</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 text-white text-[8px] font-bold rounded">
                          Cover
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Multi-Image Gallery */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-slate-300">
                          Product Gallery Images (
                          {editingProduct.images?.length || 0})
                        </label>
                        <p className="text-[10px] text-slate-400">
                          Add multiple angles and showcase pictures for the
                          product detail page carousel
                        </p>
                      </div>
                    </div>

                    {/* Add Gallery Image Row */}
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={newGalleryImageUrl}
                        onChange={(e) => setNewGalleryImageUrl(e.target.value)}
                        placeholder="Paste image URL..."
                        className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-mono focus:outline-hidden focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddGalleryImage}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add to Gallery</span>
                      </button>
                    </div>

                    {/* Gallery Thumbnails List */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                      {(editingProduct.images || []).map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="group relative h-24 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shadow-xs"
                        >
                          <img
                            src={imgUrl}
                            alt={`Gallery ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-red-600/90 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            title="Remove Image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="absolute bottom-1 left-1 px-1 py-0.5 bg-black/60 text-white text-[8px] font-mono rounded">
                            #{idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: HIGHLIGHTS & SPECS */}
              {productModalTab === "specs" && (
                <div className="space-y-5">
                  {/* Highlights Bullet Points */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Key Highlights / Bullet Points (One per line)
                    </label>
                    <textarea
                      rows={4}
                      value={featuresText}
                      onChange={(e) => setFeaturesText(e.target.value)}
                      placeholder="e.g.&#10;100% Genuine and authentic product&#10;Flagship AMOLED 120Hz display&#10;67W Turbo Fast Charging with adapter"
                      className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                    />
                  </div>

                  {/* Specifications Key-Value Table */}
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <label className="block text-xs font-bold text-slate-300">
                      Technical Specifications & Parameters
                    </label>

                    {/* Add Spec Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Key (e.g. Battery, Warranty)"
                        className="sm:col-span-2 px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="Value (e.g. 5000 mAh, 1 Year)"
                        className="sm:col-span-2 px-3.5 py-2 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpecification}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Row</span>
                      </button>
                    </div>

                    {/* Current Specs Table */}
                    <div className="bg-slate-800/60 border border-slate-700/80 rounded-xl overflow-hidden divide-y divide-slate-700/50">
                      {Object.entries(editingProduct.specifications || {})
                        .length === 0 ? (
                        <p className="p-3 text-center text-xs text-slate-400">
                          No specifications added yet. Use the inputs above to
                          add specifications.
                        </p>
                      ) : (
                        Object.entries(editingProduct.specifications || {}).map(
                          ([k, v]) => (
                            <div
                              key={k}
                              className="p-2.5 px-3.5 flex items-center justify-between text-xs"
                            >
                              <span className="font-semibold text-slate-300">
                                {k}:
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-400">{v}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecification(k)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ),
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: SELLER & LOGISTICS */}
              {productModalTab === "variations" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Official Warranty Details
                      </label>
                      <input
                        type="text"
                        value={editingProduct.warranty || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            warranty: e.target.value,
                          })
                        }
                        placeholder="e.g. 1 Year Official Brand Warranty"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Return Policy
                      </label>
                      <input
                        type="text"
                        value={editingProduct.returnPolicy || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            returnPolicy: e.target.value,
                          })
                        }
                        placeholder="e.g. 14 Days Free Return"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Estimated Delivery Days
                      </label>
                      <input
                        type="text"
                        value={editingProduct.estimatedDeliveryDays || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            estimatedDeliveryDays: e.target.value,
                          })
                        }
                        placeholder="e.g. 2-3 Business Days"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-300">
                        Seller / Merchant Store Name
                      </label>
                      <input
                        type="text"
                        value={editingProduct.seller?.name || ""}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            seller: {
                              id:
                                editingProduct.seller?.id || "seller-official",
                              name: e.target.value,
                              isOfficial: true,
                              rating: 98,
                              shipOnTime: 99,
                              chatResponse: 95,
                              joinedYears: 3,
                              location: "Dhaka",
                            },
                          })
                        }
                        placeholder="e.g. Ashaal Official Flagship Store"
                        className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-800 shrink-0">
                <div className="text-[11px] text-slate-400">
                  {editingProduct.id && (
                    <span>
                      ID:{" "}
                      <code className="text-emerald-400 font-mono">
                        {editingProduct.id}
                      </code>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingProduct}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    {isSavingProduct ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Saving to MySQL...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Product</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* USER ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                {editingUser.id && allUsers.some((u) => u.id === editingUser.id)
                  ? "Edit Customer Profile"
                  : "Add New User Account"}
              </h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email || ""}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editingUser.phone || ""}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Coins
                  </label>
                  <input
                    type="number"
                    value={editingUser.coins ?? 100}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        coins: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-hidden focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Role
                  </label>
                  <select
                    value={editingUser.role || "customer"}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="seller">Seller</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    Status
                  </label>
                  <select
                    value={editingUser.status || "active"}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white"
                  >
                    <option value="active">Active</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingUser}
                  className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingUser ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BANNER ADD / EDIT MODAL */}
      {/* ========================================================================= */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white">
                Add / Edit Hero Banner
              </h3>
              <button
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingBanner.title || ""}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ""}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      subtitle: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={editingBanner.image || ""}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      image: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  Badge Tag
                </label>
                <input
                  type="text"
                  value={editingBanner.badge || ""}
                  onChange={(e) =>
                    setEditingBanner({
                      ...editingBanner,
                      badge: e.target.value,
                    })
                  }
                  placeholder="e.g. FLASH SALE, MEGA DEAL"
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingBanner}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  {isSavingBanner ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ORDER OPERATIONS & FULFILLMENT HUB MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && !isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-4xl w-full shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0 bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-base font-bold text-white">
                      Order #{selectedOrder.orderNumber}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide uppercase border ${
                        selectedOrder.orderStatus === "DELIVERED"
                          ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                          : selectedOrder.orderStatus === "CANCELLED"
                            ? "bg-red-500/15 text-red-400 border-red-500/30"
                            : selectedOrder.orderStatus === "SHIPPED"
                              ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                              : selectedOrder.orderStatus === "PROCESSING"
                                ? "bg-blue-500/15 text-blue-400 border-blue-500/30"
                                : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        selectedOrder.paymentStatus === "PAID"
                          ? "bg-emerald-600/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-amber-600/20 text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      Payment: {selectedOrder.paymentStatus || "PENDING"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Placed on {selectedOrder.createdAt} • ID: {selectedOrder.id}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice / Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Workflow Progress Stepper Bar */}
            <div className="px-6 py-4 bg-slate-950/60 border-b border-slate-800 shrink-0">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                Order Fulfillment Stage Progression:
              </p>
              <div className="grid grid-cols-4 gap-2">
                {[
                  {
                    stage: "PLACED",
                    label: "1. Placed",
                    desc: "Customer Placed",
                    active: [
                      "PLACED",
                      "PROCESSING",
                      "SHIPPED",
                      "DELIVERED",
                    ].includes(selectedOrder.orderStatus),
                    current: selectedOrder.orderStatus === "PLACED",
                  },
                  {
                    stage: "PROCESSING",
                    label: "2. Processing",
                    desc: "Verified & Packed",
                    active: ["PROCESSING", "SHIPPED", "DELIVERED"].includes(
                      selectedOrder.orderStatus,
                    ),
                    current: selectedOrder.orderStatus === "PROCESSING",
                  },
                  {
                    stage: "SHIPPED",
                    label: "3. Dispatched",
                    desc: "With Courier",
                    active: ["SHIPPED", "DELIVERED"].includes(
                      selectedOrder.orderStatus,
                    ),
                    current: selectedOrder.orderStatus === "SHIPPED",
                  },
                  {
                    stage: "DELIVERED",
                    label: "4. Delivered",
                    desc: "Handed to Buyer",
                    active: selectedOrder.orderStatus === "DELIVERED",
                    current: selectedOrder.orderStatus === "DELIVERED",
                  },
                ].map((st) => (
                  <div
                    key={st.stage}
                    className={`p-2.5 rounded-xl border transition-all text-center ${
                      st.current
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                        : st.active
                          ? "bg-slate-800/80 border-slate-700 text-slate-200"
                          : "bg-slate-900/40 border-slate-800/80 text-slate-500"
                    }`}
                  >
                    <p className="text-xs font-bold">{st.label}</p>
                    <p className="text-[10px] opacity-80">{st.desc}</p>
                  </div>
                ))}
              </div>

              {/* Quick Progression Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">
                    Quick Stage Action:
                  </span>
                  {selectedOrder.orderStatus === "PLACED" && (
                    <button
                      disabled={isUpdatingOrderWorkflow}
                      onClick={() =>
                        handleUpdateOrderStatus(selectedOrder.id, "PROCESSING")
                      }
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Confirm & Mark Processing</span>
                    </button>
                  )}
                  {selectedOrder.orderStatus === "PROCESSING" && (
                    <button
                      disabled={isUpdatingOrderWorkflow}
                      onClick={() =>
                        handleUpdateOrderStatus(
                          selectedOrder.id,
                          "SHIPPED",
                          orderCourierInput,
                          orderTrackingInput,
                        )
                      }
                      className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch with Courier</span>
                    </button>
                  )}
                  {selectedOrder.orderStatus === "SHIPPED" && (
                    <button
                      disabled={isUpdatingOrderWorkflow}
                      onClick={() =>
                        handleUpdateOrderStatus(selectedOrder.id, "DELIVERED")
                      }
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark as Delivered & Paid</span>
                    </button>
                  )}
                  {selectedOrder.orderStatus === "DELIVERED" && (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      Order Complete & Fully Fulfilled
                    </span>
                  )}
                </div>

                {selectedOrder.orderStatus !== "CANCELLED" &&
                  selectedOrder.orderStatus !== "DELIVERED" && (
                    <button
                      disabled={isUpdatingOrderWorkflow}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Cancel order #${selectedOrder.orderNumber}?`,
                          )
                        ) {
                          handleUpdateOrderStatus(
                            selectedOrder.id,
                            "CANCELLED",
                          );
                        }
                      }}
                      className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Cancel Order
                    </button>
                  )}
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT COLUMN: Customer & Items (7 Cols) */}
                <div className="lg:col-span-7 space-y-5">
                  {/* Customer Information Card with Call/WhatsApp */}
                  <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-400" />
                        <span>Customer & Shipping Address</span>
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 text-[10px] font-bold">
                        {selectedOrder.shippingAddress?.label || "HOME"}
                      </span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="font-bold text-white text-sm">
                        {selectedOrder.shippingAddress?.fullName}
                      </p>
                      <p className="text-slate-300 font-mono">
                        {selectedOrder.shippingAddress?.phone}
                      </p>
                      <p className="text-slate-400">
                        {selectedOrder.shippingAddress?.addressLine}
                        {selectedOrder.shippingAddress?.thana
                          ? `, ${selectedOrder.shippingAddress.thana}`
                          : ""}
                        {selectedOrder.shippingAddress?.district
                          ? `, ${selectedOrder.shippingAddress.district}`
                          : ""}
                        {selectedOrder.shippingAddress?.division
                          ? `, ${selectedOrder.shippingAddress.division}`
                          : ""}
                      </p>
                      {selectedOrder.shippingAddress?.landmark && (
                        <p className="text-[11px] text-amber-400/90 font-medium">
                          Landmark / Note:{" "}
                          {selectedOrder.shippingAddress.landmark}
                        </p>
                      )}
                    </div>

                    {/* Quick Call and WhatsApp Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                      {selectedOrder.shippingAddress?.phone && (
                        <>
                          <a
                            href={`tel:${selectedOrder.shippingAddress.phone}`}
                            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <PhoneCall className="w-3.5 h-3.5" />
                            <span>Call Customer</span>
                          </a>
                          <a
                            href={`https://wa.me/880${selectedOrder.shippingAddress.phone.replace(/[^0-9]/g, "").replace(/^880?/, "")}?text=${encodeURIComponent(
                              `Hello ${selectedOrder.shippingAddress.fullName}, your Ashaal Order #${selectedOrder.orderNumber} is being processed. Thank you for shopping with Ashaal!`,
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-emerald-700/40 hover:bg-emerald-700/60 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Ordered Items List */}
                  <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Package className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        Ordered Products ({selectedOrder.items?.length || 0})
                      </span>
                    </h4>

                    <div className="divide-y divide-slate-700/50">
                      {selectedOrder.items?.map((it, idx) => (
                        <div
                          key={idx}
                          className="py-3 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                it.product?.mainImage ||
                                it.product?.images?.[0] ||
                                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
                              }
                              alt={it.product?.title}
                              className="w-12 h-12 rounded-xl object-cover bg-slate-800 border border-slate-700"
                            />
                            <div>
                              <p className="font-semibold text-white line-clamp-1">
                                {it.product?.title}
                              </p>
                              {it.selectedVariations &&
                                Object.keys(it.selectedVariations).length >
                                  0 && (
                                  <p className="text-[11px] text-emerald-400 font-medium">
                                    Variation:{" "}
                                    {Object.entries(it.selectedVariations)
                                      .map(([k, v]) => `${k}: ${v}`)
                                      .join(", ")}
                                  </p>
                                )}
                              <p className="text-[11px] text-slate-400">
                                Unit Price: ৳{it.product?.price} × Qty:{" "}
                                <span className="text-white font-bold">
                                  {it.quantity}
                                </span>
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-emerald-400 text-sm whitespace-nowrap">
                            ৳
                            {(
                              (it.product?.price || 0) * it.quantity
                            ).toLocaleString("en-BD")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Breakdown & Cash On Delivery Callout */}
                  <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">
                        Financial Breakdown
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono text-[10px] font-bold uppercase">
                        Method: {selectedOrder.paymentMethod}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-slate-300 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Item Subtotal:</span>
                        <span>
                          ৳{selectedOrder.subtotal?.toLocaleString("en-BD")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">
                          Shipping Delivery Fee:
                        </span>
                        <span>৳{selectedOrder.shippingFee || 0}</span>
                      </div>
                      {selectedOrder.voucherDiscount > 0 && (
                        <div className="flex justify-between text-emerald-400">
                          <span>Voucher Discount:</span>
                          <span>-৳{selectedOrder.voucherDiscount}</span>
                        </div>
                      )}
                      {selectedOrder.coinDiscount > 0 && (
                        <div className="flex justify-between text-amber-400">
                          <span>Coin Reward Discount:</span>
                          <span>-৳{selectedOrder.coinDiscount}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-700">
                        <span>Total Bill:</span>
                        <span className="text-emerald-400 text-base">
                          ৳{selectedOrder.total.toLocaleString("en-BD")}
                        </span>
                      </div>
                    </div>

                    {selectedOrder.paymentMethod === "cod" && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between text-amber-300">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                          <span className="text-xs font-bold">
                            CASH ON DELIVERY (COD)
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-white bg-amber-600/40 px-2 py-1 rounded">
                          Collect ৳{selectedOrder.total.toLocaleString("en-BD")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* RIGHT COLUMN: Logistics Assignment, Payment Control & Timeline (5 Cols) */}
                <div className="lg:col-span-5 space-y-5">
                  {/* Courier & Logistics Assignment */}
                  <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-3.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Truck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Logistics & Courier Delivery</span>
                    </h4>

                    {/* Courier Name Selector */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400">
                        Courier Partner
                      </label>
                      <select
                        value={orderCourierInput}
                        onChange={(e) => setOrderCourierInput(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl text-xs focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="Ashaal Express (DEX)">
                          Ashaal Express (DEX)
                        </option>
                        <option value="Steadfast Courier">
                          Steadfast Courier
                        </option>
                        <option value="RedX Logistics">RedX Logistics</option>
                        <option value="Pathao Courier">Pathao Courier</option>
                        <option value="Paperfly">Paperfly</option>
                        <option value="Sundarban Courier">
                          Sundarban Courier
                        </option>
                      </select>
                    </div>

                    {/* Tracking Number */}
                    <div className="space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-400">
                        Tracking Number / Consignment ID
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={orderTrackingInput}
                          onChange={(e) =>
                            setOrderTrackingInput(e.target.value)
                          }
                          placeholder="e.g. DEX-BD-928172"
                          className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 text-white font-mono rounded-xl text-xs focus:outline-hidden focus:border-emerald-500"
                        />
                        {orderTrackingInput && (
                          <button
                            type="button"
                            onClick={() =>
                              copyToClipboard(
                                orderTrackingInput,
                                "Tracking Number",
                              )
                            }
                            className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl cursor-pointer"
                            title="Copy Tracking #"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={isUpdatingOrderWorkflow}
                      onClick={() => handleSaveOrderLogistics(selectedOrder.id)}
                      className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Save Logistics Info</span>
                    </button>
                  </div>

                  {/* Payment Status Control */}
                  <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Payment Status Control</span>
                    </h4>

                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          "PENDING",
                          "PAID",
                          "REFUNDED",
                        ] as Order["paymentStatus"][]
                      ).map((pStatus) => (
                        <button
                          key={pStatus}
                          type="button"
                          onClick={() =>
                            handleUpdatePaymentStatus(selectedOrder.id, pStatus)
                          }
                          className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                            selectedOrder.paymentStatus === pStatus
                              ? pStatus === "PAID"
                                ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                                : pStatus === "REFUNDED"
                                  ? "bg-purple-600 text-white border-purple-500"
                                  : "bg-amber-600 text-white border-amber-500"
                              : "bg-slate-900/60 border-slate-700 text-slate-400 hover:text-white"
                          }`}
                        >
                          {pStatus}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order Activity Timeline */}
                  <div className="p-4 bg-slate-800/60 border border-slate-700/70 rounded-2xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Fulfillment Milestones</span>
                    </h4>

                    <div className="relative pl-5 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                      {(selectedOrder.timeline &&
                      selectedOrder.timeline.length > 0
                        ? selectedOrder.timeline
                        : [
                            {
                              title: "Order Placed",
                              description:
                                "Customer successfully submitted checkout order.",
                              timestamp: selectedOrder.createdAt,
                              completed: true,
                              current: true,
                            },
                          ]
                      ).map((step, idx) => (
                        <div key={idx} className="relative text-xs">
                          <div
                            className={`absolute -left-5 top-1 w-2.5 h-2.5 rounded-full border-2 ${
                              step.current
                                ? "bg-emerald-400 border-slate-900 ring-2 ring-emerald-500/30"
                                : "bg-slate-600 border-slate-900"
                            }`}
                          />
                          <p className="font-bold text-white text-[11px]">
                            {step.title}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {step.description}
                          </p>
                          <span className="text-[9px] text-slate-500 font-mono">
                            {step.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
              <button
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-3.5 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Order</span>
              </button>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Packing Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DEDICATED PRINTABLE PACKING SLIP & TAX INVOICE MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-4 border border-slate-200 print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none">
            {/* Screen Controls Header (Hidden in Print) */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold">
                  Print Courier Dispatch Packing Slip
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Now</span>
                </button>
                <button
                  onClick={() => setIsInvoiceOpen(false)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* The Printable Invoice Sheet */}
            <div className="p-6 sm:p-8 space-y-5 text-slate-900 font-sans print:p-4">
              {/* Invoice Header */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-2xl font-black tracking-wider text-slate-950 uppercase">
                    ASHAAL BANGLADESH
                  </h1>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Official E-Commerce Marketplace • Dhaka, Bangladesh
                  </p>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Hotline: +880 9610-ASHAAL • Web: www.ashaal.com.bd
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-black uppercase rounded tracking-wider">
                    TAX INVOICE & SLIP
                  </span>
                  <p className="text-sm font-black font-mono mt-1 text-slate-950">
                    #{selectedOrder.orderNumber}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Date: {selectedOrder.createdAt}
                  </p>
                </div>
              </div>

              {/* Consignee & Dispatcher Info */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 rounded-xl p-3.5 bg-slate-50">
                <div>
                  <p className="font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                    DELIVER TO (RECIPIENT):
                  </p>
                  <p className="font-extrabold text-slate-900 text-sm">
                    {selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p className="font-mono font-bold text-slate-800 text-xs">
                    Phone: {selectedOrder.shippingAddress?.phone}
                  </p>
                  <p className="text-slate-700 text-[11px] mt-0.5">
                    {selectedOrder.shippingAddress?.addressLine}
                    {selectedOrder.shippingAddress?.thana
                      ? `, ${selectedOrder.shippingAddress.thana}`
                      : ""}
                    {selectedOrder.shippingAddress?.district
                      ? `, ${selectedOrder.shippingAddress.district}`
                      : ""}
                  </p>
                  {selectedOrder.shippingAddress?.landmark && (
                    <p className="text-[10px] text-slate-600 italic">
                      Landmark: {selectedOrder.shippingAddress.landmark}
                    </p>
                  )}
                </div>

                <div className="border-l border-slate-300 pl-4 space-y-1">
                  <p className="font-bold text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                    COURIER & DISPATCH:
                  </p>
                  <p className="text-slate-800 font-bold">
                    Courier:{" "}
                    <span className="font-normal">
                      {selectedOrder.courier || "Ashaal Express (DEX)"}
                    </span>
                  </p>
                  <p className="text-slate-800 font-bold font-mono">
                    Tracking #:{" "}
                    <span className="font-normal">
                      {selectedOrder.trackingNumber ||
                        "DEX-BD-" + selectedOrder.orderNumber}
                    </span>
                  </p>
                  <p className="text-slate-800 font-bold">
                    Payment Method:{" "}
                    <span className="font-black uppercase text-slate-950">
                      {selectedOrder.paymentMethod}
                    </span>
                  </p>
                  <p className="text-slate-800 font-bold">
                    Payment Status:{" "}
                    <span
                      className={`px-1.5 py-0.2 rounded font-mono text-[10px] ${
                        selectedOrder.paymentStatus === "PAID"
                          ? "bg-emerald-100 text-emerald-800 font-bold"
                          : "bg-amber-100 text-amber-800 font-bold"
                      }`}
                    >
                      {selectedOrder.paymentStatus || "PENDING"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-slate-100 text-slate-700 font-bold">
                      <th className="py-2 px-2 w-8">SL</th>
                      <th className="py-2 px-2">Item Description</th>
                      <th className="py-2 px-2 text-center w-14">Qty</th>
                      <th className="py-2 px-2 text-right w-24">Unit Price</th>
                      <th className="py-2 px-2 text-right w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedOrder.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-2 text-slate-500 font-mono">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-2">
                          <p className="font-bold text-slate-900">
                            {it.product?.title}
                          </p>
                          {it.selectedVariations &&
                            Object.keys(it.selectedVariations).length > 0 && (
                              <p className="text-[10px] text-slate-500">
                                {Object.entries(it.selectedVariations)
                                  .map(([k, v]) => `${k}: ${v}`)
                                  .join(", ")}
                              </p>
                            )}
                        </td>
                        <td className="py-2 px-2 text-center font-bold font-mono">
                          {it.quantity}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          ৳{it.product?.price?.toLocaleString("en-BD")}
                        </td>
                        <td className="py-2 px-2 text-right font-bold font-mono">
                          ৳
                          {(
                            (it.product?.price || 0) * it.quantity
                          ).toLocaleString("en-BD")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pricing Calculation & COD Callout */}
              <div className="flex justify-end pt-2">
                <div className="w-64 space-y-1 text-xs border-t-2 border-slate-900 pt-2">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">
                      ৳{selectedOrder.subtotal?.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery Charge:</span>
                    <span className="font-mono">
                      ৳{selectedOrder.shippingFee || 0}
                    </span>
                  </div>
                  {selectedOrder.voucherDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Voucher Discount:</span>
                      <span className="font-mono">
                        -৳{selectedOrder.voucherDiscount}
                      </span>
                    </div>
                  )}
                  {selectedOrder.coinDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coins Discount:</span>
                      <span className="font-mono">
                        -৳{selectedOrder.coinDiscount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-black text-sm text-slate-950 border-t border-slate-400 pt-1">
                    <span>TOTAL AMOUNT:</span>
                    <span className="font-mono">
                      ৳{selectedOrder.total.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </div>

              {/* COD Notice Box */}
              {selectedOrder.paymentMethod === "cod" && (
                <div className="p-3 border-2 border-dashed border-slate-900 bg-amber-50 rounded-xl flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black uppercase text-amber-900">
                      CASH ON DELIVERY (COD) BILL
                    </p>
                    <p className="text-[10px] text-amber-800">
                      Courier delivery agent must collect the full exact amount
                      before handing over goods.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-600 uppercase font-bold block">
                      Collect Exact
                    </span>
                    <span className="text-lg font-black font-mono text-slate-950">
                      ৳{selectedOrder.total.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              )}

              {/* Signatures Strip */}
              <div className="grid grid-cols-3 gap-6 pt-10 text-center text-[10px] text-slate-500">
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-800">
                    Prepared & Checked By
                  </p>
                  <p>Ashaal Fulfillment Hub</p>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-800">
                    Delivery Courier Agent
                  </p>
                  <p>Received with Seal</p>
                </div>
                <div className="border-t border-slate-400 pt-1">
                  <p className="font-bold text-slate-800">
                    Customer Receiver Signature
                  </p>
                  <p>Package Received in Good Condition</p>
                </div>
              </div>

              <p className="text-[9px] text-slate-400 text-center pt-2">
                Thank you for shopping at Ashaal Bangladesh! For any warranty
                claims or support, please keep this invoice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
