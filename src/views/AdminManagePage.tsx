"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Product,
  Order,
  Banner,
  UserProfile,
  ProductVariation,
  Seller,
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
  ShieldAlert,
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
  ChevronLeft,
  Filter,
  Download,
  Bell,
  ArrowUpDown,
  ArrowLeft,
  Save,
  Undo2,
  CheckCheck,
  PackageCheck,
  Send,
  XCircle,
} from "lucide-react";

const ADMIN_STORAGE_KEY = "ash_admin_auth";
const DEFAULT_PASSCODE = "123456";

// PrimeNG Sample Image Presets
const SAMPLE_IMAGE_PRESETS = [
  {
    name: "Smartphone",
    url: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600",
  },
  {
    name: "Smartwatch",
    url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
  },
  {
    name: "Headphones",
    url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600",
  },
  {
    name: "Sneakers",
    url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
  },
  {
    name: "Backpack",
    url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
  },
  {
    name: "Perfume",
    url: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600",
  },
];

const POPULAR_BRANDS = [
  "Xiaomi",
  "Samsung",
  "Apple",
  "Realme",
  "Apex",
  "Bata",
  "Casio",
  "Fastrack",
  "Lotto",
  "Focallure",
  "Ashaal Select",
];

const COMMON_SPEC_SUGGESTIONS = [
  "Battery",
  "RAM & Storage",
  "Display",
  "Processor",
  "Camera",
  "Connectivity",
  "Material",
  "Weight",
];

interface VisitorLog {
  id: string;
  ip: string;
  page: string;
  device: string;
  country: string;
  city: string;
  timestamp: string;
  referrer: string;
}

const INITIAL_VISITORS: VisitorLog[] = [
  {
    id: "v-1",
    ip: "103.205.71.12",
    page: "/product/prod-1",
    device: "Chrome (Android 14)",
    country: "Bangladesh",
    city: "Dhaka",
    timestamp: "2 mins ago",
    referrer: "Google Search",
  },
  {
    id: "v-2",
    ip: "103.145.118.89",
    page: "/flash-sale",
    device: "Safari (iPhone 15)",
    country: "Bangladesh",
    city: "Chittagong",
    timestamp: "5 mins ago",
    referrer: "Facebook Ads",
  },
  {
    id: "v-3",
    ip: "182.160.112.44",
    page: "/checkout",
    device: "Edge (Windows 11)",
    country: "Bangladesh",
    city: "Sylhet",
    timestamp: "12 mins ago",
    referrer: "Direct Link",
  },
  {
    id: "v-4",
    ip: "103.230.106.18",
    page: "/",
    device: "Chrome (Windows 10)",
    country: "Bangladesh",
    city: "Rajshahi",
    timestamp: "18 mins ago",
    referrer: "Direct Link",
  },
];

export type NavRoute =
  | "dashboard"
  | "products"
  | "orders"
  | "orders-placed"
  | "orders-processing"
  | "orders-shipped"
  | "orders-delivered"
  | "orders-cancelled"
  | "users"
  | "banners"
  | "visitors"
  | "api-docs"
  | "product-new"
  | "product-edit";

export interface AdminManagePageProps {
  initialRoute?: NavRoute;
  productId?: string;
}

export const AdminManagePage: React.FC<AdminManagePageProps> = ({
  initialRoute = "dashboard",
  productId,
}) => {
  const {
    user,
    isLoggedIn,
    setIsLoginModalOpen,
    logout,
    products,
    orders,
    banners,
    allUsers,
    showToast,
    t,
    language,
    deleteUserAccount,
  } = useApp();

  // Strict Administrator Role Check: profile data must have role === "admin"
  const isAuthorizedAdmin = Boolean(isLoggedIn && user && user.role === "admin");

  const [userRoleFilter, setUserRoleFilter] = useState<string>("all");

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

  // Navigation route/tab
  const [activeRoute, setActiveRoute] = useState<NavRoute>(initialRoute);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [ordersSubmenuOpen, setOrdersSubmenuOpen] = useState<boolean>(true);

  // Global Table Search query
  const [tableSearch, setTableSearch] = useState<string>("");

  // Products Filter & Management State
  const [productCategoryFilter, setProductCategoryFilter] =
    useState<string>("all");
  const [productStockFilter, setProductStockFilter] = useState<string>("all");
  const [productSortBy, setProductSortBy] = useState<string>("newest");
  const [productPage, setProductPage] = useState<number>(1);
  const [productRowsPerPage, setProductRowsPerPage] = useState<number>(10);

  // Product Dedicated Page Editor State (No Modal!)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(
    null,
  );
  const [isSavingProduct, setIsSavingProduct] = useState<boolean>(false);
  const [newGalleryImageUrl, setNewGalleryImageUrl] = useState<string>("");
  const [featuresText, setFeaturesText] = useState<string>("");
  const [newSpecKey, setNewSpecKey] = useState<string>("");
  const [newSpecValue, setNewSpecValue] = useState<string>("");

  // User Modal
  const [isUserModalOpen, setIsUserModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Partial<UserProfile> | null>(
    null,
  );
  const [isSavingUser, setIsSavingUser] = useState<boolean>(false);

  // Order Details Modal / Invoice / Logistics
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderPaymentFilter, setOrderPaymentFilter] = useState<string>("all");
  const [orderPage, setOrderPage] = useState<number>(1);
  const [orderRowsPerPage, setOrderRowsPerPage] = useState<number>(10);
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

  // Sync initial product if productId prop provided
  useEffect(() => {
    if (productId && products.length > 0) {
      const match = products.find((p) => p.id === productId);
      if (match) {
        handleOpenEditProduct(match);
      }
    } else if (initialRoute === "product-new" && !editingProduct) {
      handleOpenAddProduct();
    }
  }, [productId, products, initialRoute]);

  // Banner Modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(
    null,
  );
  const [isSavingBanner, setIsSavingBanner] = useState<boolean>(false);

  // Live Visitors
  const [visitors, setVisitors] = useState<VisitorLog[]>(INITIAL_VISITORS);

  // Close modals on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsUserModalOpen(false);
        setIsBannerModalOpen(false);
        setIsInvoiceOpen(false);
        setSelectedOrder(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Fetch live visitors
  useEffect(() => {
    if (isAuthenticated) {
      fetchVisitors()
        .then((data) => {
          if (data && data.length > 0) {
            setVisitors(data as any);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  // Auth Handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === DEFAULT_PASSCODE) {
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      } catch {}
      setIsAuthenticated(true);
      setAuthError("");
      showToast("Signed into PrimeNG Admin Dashboard");
    } else {
      setAuthError("Incorrect Security Passcode. Default: 123456");
    }
  };

  const handleLogout = () => {
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {}
    setIsAuthenticated(false);
    setPasscode("");
    logout();
  };

  // Open Full-Page Product Creator
  const handleOpenAddProduct = () => {
    const newId = `prod-${Date.now().toString(36)}`;
    setEditingProduct({
      id: newId,
      title: "",
      titleBn: "",
      slug: `product-${Date.now().toString(36)}`,
      brand: "Ashaal Select",
      category: CATEGORIES_DATA[0]?.name || "Electronics",
      categorySlug: CATEGORIES_DATA[0]?.slug || "electronics",
      price: 1200,
      originalPrice: 1500,
      discountPercentage: 20,
      rating: 4.8,
      reviewsCount: 12,
      questionsCount: 4,
      soldCount: 45,
      inStock: 50,
      isDarazMall: true,
      isFlashSale: false,
      isFreeDelivery: true,
      coinsCashback: 50,
      mainImage: SAMPLE_IMAGE_PRESETS[0].url,
      images: [SAMPLE_IMAGE_PRESETS[0].url],
      description: [
        "100% Genuine and authentic product guaranteed by Ashaal.",
        "Crafted with durable premium material for lasting reliability.",
        "Official manufacturer warranty with dedicated 24/7 care.",
      ],
      descriptionBn: [
        "১০০% আসল ও খাঁটি পণ্য আশাল গ্যারান্টি সহ।",
      ],
      specifications: {
        Warranty: "1 Year Official Warranty",
        Delivery: "2-4 Business Days Nationwide",
        Authenticity: "100% Brand Original",
      },
      warranty: "1 Year Official Brand Warranty",
      returnPolicy: "14 Days Free Return & Refund Guarantee",
      deliveryFee: 0,
      estimatedDeliveryDays: "2-4 Days",
      seller: {
        id: "sel-official",
        name: "Ashaal Flagship Store",
        isOfficial: true,
        rating: 98,
        shipOnTime: 99,
        chatResponse: 95,
        joinedYears: 3,
        location: "Dhaka North",
        badge: "MALL",
      },
    });
    setFeaturesText(
      "100% Genuine and authentic product imported under Ashaal guarantee.\nPremium quality material with durable finish and high reliability.\nComes with official manufacturer warranty and dedicated customer support.",
    );
    setActiveRoute("product-new");
  };

  // Open Full-Page Product Editor
  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct({ ...p });
    setFeaturesText(
      Array.isArray(p.description)
        ? p.description.join("\n")
        : p.description || "",
    );
    setActiveRoute("product-edit");
  };

  // Duplicate Product
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
    setActiveRoute("product-new");
    showToast(`Cloned "${p.title}" as new product draft`);
  };

  // Save Product (from dedicated page)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.title || !editingProduct?.price) {
      alert("Product Title and Price are required.");
      return;
    }
    setIsSavingProduct(true);
    try {
      const descriptionLines = featuresText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      const calculatedDiscount =
        editingProduct.originalPrice &&
        editingProduct.originalPrice > (editingProduct.price || 0)
          ? Math.round(
              ((editingProduct.originalPrice - (editingProduct.price || 0)) /
                editingProduct.originalPrice) *
                100,
            )
          : editingProduct.discountPercentage || 0;

      const fallbackSeller: Seller = {
        id: "sel-official",
        name: "Ashaal Flagship Store",
        isOfficial: true,
        rating: 98,
        shipOnTime: 99,
        chatResponse: 95,
        joinedYears: 3,
        location: "Dhaka North",
        badge: "MALL",
      };

      const productToSave: Product = {
        id: editingProduct.id || `prod-${Date.now()}`,
        title: editingProduct.title,
        titleBn: editingProduct.titleBn || editingProduct.title,
        slug:
          editingProduct.slug ||
          editingProduct.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
        brand: editingProduct.brand || "Ashaal Select",
        category: editingProduct.category || "Electronics",
        categorySlug:
          editingProduct.categorySlug ||
          editingProduct.category?.toLowerCase() ||
          "electronics",
        price: Number(editingProduct.price),
        originalPrice: Number(
          editingProduct.originalPrice || editingProduct.price,
        ),
        discountPercentage: calculatedDiscount,
        rating: Number(editingProduct.rating || 4.8),
        reviewsCount: Number(editingProduct.reviewsCount || 0),
        questionsCount: Number(editingProduct.questionsCount || 0),
        soldCount: Number(editingProduct.soldCount || 0),
        inStock: Number(editingProduct.inStock || 50),
        isDarazMall: Boolean(editingProduct.isDarazMall),
        isFlashSale: Boolean(editingProduct.isFlashSale),
        isFreeDelivery: Boolean(editingProduct.isFreeDelivery),
        coinsCashback: Number(editingProduct.coinsCashback || 20),
        mainImage:
          editingProduct.mainImage ||
          editingProduct.images?.[0] ||
          SAMPLE_IMAGE_PRESETS[0].url,
        images:
          editingProduct.images && editingProduct.images.length > 0
            ? editingProduct.images
            : [editingProduct.mainImage || SAMPLE_IMAGE_PRESETS[0].url],
        description:
          descriptionLines.length > 0
            ? descriptionLines
            : [editingProduct.title],
        descriptionBn: editingProduct.descriptionBn || [editingProduct.title],
        specifications: editingProduct.specifications || {},
        warranty: editingProduct.warranty || "1 Year Official Warranty",
        returnPolicy: editingProduct.returnPolicy || "14 Days Free Return",
        deliveryFee: editingProduct.isFreeDelivery
          ? 0
          : Number(editingProduct.deliveryFee || 60),
        estimatedDeliveryDays:
          editingProduct.estimatedDeliveryDays || "2-4 Days",
        seller: (editingProduct.seller as Seller) || fallbackSeller,
      };

      await saveProductToFirestore(productToSave);
      showToast(`Product "${productToSave.title}" saved successfully to MySQL!`);
      // Return to products table view
      setActiveRoute("products");
      setEditingProduct(null);
    } catch (err) {
      alert("Error saving product: " + String(err));
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (productId: string, title: string) => {
    if (!window.confirm(`Delete product "${title}" permanently?`)) return;
    try {
      await deleteProductFromFirestore(productId);
      showToast(`Product "${title}" removed from catalog`);
    } catch (err) {
      alert("Error deleting product: " + String(err));
    }
  };

  // Add Gallery Image URL
  const handleAddGalleryImage = () => {
    if (!newGalleryImageUrl.trim()) return;
    const currentImages = editingProduct?.images || [];
    setEditingProduct({
      ...editingProduct,
      images: [...currentImages, newGalleryImageUrl.trim()],
    });
    setNewGalleryImageUrl("");
  };

  // Remove Gallery Image
  const handleRemoveGalleryImage = (idxToRemove: number) => {
    const currentImages = editingProduct?.images || [];
    setEditingProduct({
      ...editingProduct,
      images: currentImages.filter((_, idx) => idx !== idxToRemove),
    });
  };

  // Add Key-Value Spec
  const handleAddSpecification = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    const currentSpecs = { ...(editingProduct?.specifications || {}) };
    currentSpecs[newSpecKey.trim()] = newSpecValue.trim();
    setEditingProduct({
      ...editingProduct,
      specifications: currentSpecs,
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
        `Order #${targetOrd?.orderNumber || orderId} moved to ${newStatus} (Table: orders_${newStatus.toLowerCase()})`,
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
      showToast("Order removed from MySQL Database & status table");
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

  // Filtered Products
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
          p.category === productCategoryFilter;

        let matchesStock = true;
        if (productStockFilter === "in_stock")
          matchesStock = (p.inStock || 0) > 10;
        else if (productStockFilter === "low_stock")
          matchesStock = (p.inStock || 0) > 0 && (p.inStock || 0) <= 10;
        else if (productStockFilter === "out_of_stock")
          matchesStock = (p.inStock || 0) <= 0;
        else if (productStockFilter === "mall")
          matchesStock = Boolean(p.isDarazMall);
        else if (productStockFilter === "flash")
          matchesStock = Boolean(p.isFlashSale);

        return matchesSearch && matchesCat && matchesStock;
      })
      .sort((a, b) => {
        if (productSortBy === "price_low") return a.price - b.price;
        if (productSortBy === "price_high") return b.price - a.price;
        if (productSortBy === "stock")
          return (b.inStock || 0) - (a.inStock || 0);
        return 0;
      });
  }, [
    products,
    tableSearch,
    productCategoryFilter,
    productStockFilter,
    productSortBy,
  ]);

  // Paginated Products
  const paginatedProducts = useMemo(() => {
    const start = (productPage - 1) * productRowsPerPage;
    return filteredProducts.slice(start, start + productRowsPerPage);
  }, [filteredProducts, productPage, productRowsPerPage]);

  // Counts by status
  const placedOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "PLACED").length,
    [orders],
  );
  const processingOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "PROCESSING").length,
    [orders],
  );
  const shippedOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "SHIPPED").length,
    [orders],
  );
  const deliveredOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "DELIVERED").length,
    [orders],
  );
  const cancelledOrdersCount = useMemo(
    () => orders.filter((o) => o.orderStatus === "CANCELLED").length,
    [orders],
  );

  // Active status criteria based on activeRoute
  const currentOrderStatusFilter = useMemo(() => {
    if (activeRoute === "orders-placed") return "PLACED";
    if (activeRoute === "orders-processing") return "PROCESSING";
    if (activeRoute === "orders-shipped") return "SHIPPED";
    if (activeRoute === "orders-delivered") return "DELIVERED";
    if (activeRoute === "orders-cancelled") return "CANCELLED";
    return "all";
  }, [activeRoute]);

  // Associated MySQL Table Name
  const currentMysqlTableName = useMemo(() => {
    if (activeRoute === "orders-placed") return "orders_placed";
    if (activeRoute === "orders-processing") return "orders_processing";
    if (activeRoute === "orders-shipped") return "orders_shipped";
    if (activeRoute === "orders-delivered") return "orders_delivered";
    if (activeRoute === "orders-cancelled") return "orders_cancelled";
    return "orders (Master)";
  }, [activeRoute]);

  // Filtered Orders for Current View
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const q = tableSearch.toLowerCase().trim();
      const matchesStatus =
        currentOrderStatusFilter === "all" ||
        o.orderStatus === currentOrderStatusFilter;
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
  }, [orders, tableSearch, currentOrderStatusFilter, orderPaymentFilter]);

  // Paginated Orders
  const paginatedOrders = useMemo(() => {
    const start = (orderPage - 1) * orderRowsPerPage;
    return filteredOrders.slice(start, start + orderRowsPerPage);
  }, [filteredOrders, orderPage, orderRowsPerPage]);

  // Current view total amount
  const currentViewTotalAmount = useMemo(() => {
    return filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
  }, [filteredOrders]);

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

  // Live calculated discount for form
  const computedDiscountPercentage = useMemo(() => {
    if (!editingProduct?.price || !editingProduct?.originalPrice) return 0;
    if (editingProduct.originalPrice <= editingProduct.price) return 0;
    return Math.round(
      ((editingProduct.originalPrice - editingProduct.price) /
        editingProduct.originalPrice) *
        100,
    );
  }, [editingProduct?.price, editingProduct?.originalPrice]);

  const isOrderRoute =
    activeRoute === "orders" ||
    activeRoute === "orders-placed" ||
    activeRoute === "orders-processing" ||
    activeRoute === "orders-shipped" ||
    activeRoute === "orders-delivered" ||
    activeRoute === "orders-cancelled";

  // =========================================================================
  // 1. STRICT SECURITY GATEKEEPER: ROLE MUST BE ADMIN
  // =========================================================================
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col justify-center items-center p-4 font-sans antialiased text-white selection:bg-red-500 selection:text-white">
        <SEO
          title="403 Access Denied | Ashaal Management"
          description="Ashaal Management Portal - Administrator clearance required"
        />

        <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Security Header */}
          <div className="text-center space-y-3 relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-lg shadow-red-500/10 mb-1">
              <ShieldAlert className="w-9 h-9" />
            </div>
            <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-mono font-bold text-red-400 tracking-wider uppercase">
              SECURITY CLEARANCE REQUIRED • 403 FORBIDDEN
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase">
              Administrative Portal
            </h1>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Access to <span className="font-mono text-emerald-400 font-bold">/manage</span> and MySQL management operations is strictly restricted to accounts verified with the{" "}
              <span className="font-mono text-red-400 font-bold">admin</span> role.
            </p>
          </div>

          {/* Current Account Card */}
          <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-2.5 relative z-10 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Authentication State:</span>
              {isLoggedIn && user ? (
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Signed In</span>
                </span>
              ) : (
                <span className="text-slate-500 italic">Guest (Not Signed In)</span>
              )}
            </div>

            {isLoggedIn && user && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Current Account:</span>
                  <span className="font-bold text-white truncate max-w-[180px]">{user.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-medium">Account Email:</span>
                  <span className="font-mono text-slate-300 truncate max-w-[180px]">{user.email}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/60">
                  <span className="text-slate-400 font-medium">Assigned Role:</span>
                  <span className="px-2 py-0.5 bg-red-500/20 border border-red-500/30 text-red-400 font-mono font-bold rounded uppercase text-[10px]">
                    {user.role || "customer"} (NO ADMIN ACCESS)
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 relative z-10">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isLoggedIn ? "Switch to Administrator Account" : "Sign In with Admin Account"}
              </span>
            </button>

            {isLoggedIn && (
              <button
                type="button"
                onClick={() => logout()}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out Current Account</span>
              </button>
            )}

            <a
              href="/"
              className="w-full py-2.5 bg-transparent hover:bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </a>
          </div>

          {/* Security Footer Notice */}
          <div className="pt-3 border-t border-slate-800/80 text-center relative z-10">
            <p className="text-[11px] text-slate-500">
              Authorized admin accounts:{" "}
              <span className="text-emerald-400 font-mono">admin@ashaal.com</span> or{" "}
              <span className="text-emerald-400 font-mono">anindo.roy@gmail.com</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. PASSCODE 2FA SCREEN (FOR VERIFIED ADMINS)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-center items-center p-4 font-sans antialiased text-slate-800">
        <SEO
          title="Admin Access | Ashaal Management"
          description="Ashaal Management Portal login"
        />

        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-8 space-y-6">
          {/* Logo Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/20 mb-2">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              Ashaal Portal
            </h1>
            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest">
              PrimeNG Sakai Layout System
            </p>
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>Verified Admin:</span>
                <span className="px-1.5 py-0.2 bg-emerald-200 text-emerald-900 rounded text-[9px] uppercase font-mono">ROLE: ADMIN</span>
              </div>
              <p className="font-semibold text-slate-900">{user?.name} ({user?.email})</p>
            </div>
            <p className="text-xs text-slate-500">
              Enter authorized administrator passcode to unlock the management dashboard.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Passcode (Default: 123456)"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
              </div>
              {authError && (
                <p className="text-xs text-red-600 mt-1.5 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Admin Panel</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-[11px] font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Production MySQL 51.79.229.154:3306 Connected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN DASHBOARD LAYOUT (Sakai / PrimeNG Layout)
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans antialiased text-slate-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      <SEO
        title="Admin Dashboard | Ashaal Management"
        description="Ashaal Management Portal"
      />

      {/* ========================================================================= */}
      {/* PRIMENG TOPBAR (layout-topbar) */}
      {/* ========================================================================= */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        {/* Left: Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-sm shadow-xs">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                  ASHAAL
                </span>
                <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 font-mono text-[9px] font-bold rounded">
                  PRIME
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Management System
              </p>
            </div>
          </div>
        </div>

        {/* Center: Global Search Input */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
          <div className="relative w-full">
            <input
              type="text"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              placeholder="Search products, orders, customers..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            {tableSearch && (
              <button
                onClick={() => setTableSearch("")}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions, Database Indicator & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Storefront Link */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Storefront</span>
            <ArrowUpRight className="w-3 h-3 opacity-60" />
          </a>

          {/* Database Online Badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-full text-[10px] font-bold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>MySQL 3306</span>
          </div>

          {/* User Profile Chip */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
              AD
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-none">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold leading-none mt-0.5">
                ROLE: {user?.role?.toUpperCase() || "ADMIN"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-full hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTAINER (Sidebar + Content) */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* ========================================================================= */}
        {/* PRIMENG SIDEBAR (layout-sidebar) */}
        {/* ========================================================================= */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-0 lg:w-20"
          } bg-white border-r border-slate-200/80 shrink-0 transition-all duration-300 flex flex-col z-20 overflow-y-auto`}
        >
          <div className="p-3 space-y-5">
            {/* GROUP 1: HOME */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Home
              </p>
              <button
                onClick={() => setActiveRoute("dashboard")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeRoute === "dashboard"
                    ? "bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0 text-emerald-600" />
                <span className={!sidebarOpen ? "lg:hidden" : ""}>Dashboard</span>
              </button>
            </div>

            {/* GROUP 2: E-COMMERCE */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                E-Commerce
              </p>
              <button
                onClick={() => setActiveRoute("products")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeRoute === "products" || activeRoute === "product-new" || activeRoute === "product-edit"
                    ? "bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 shrink-0 text-blue-600" />
                  <span className={!sidebarOpen ? "lg:hidden" : ""}>Products</span>
                </div>
                <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                  {products.length}
                </span>
              </button>

              {/* DEDICATED ORDER STATUS SUBMENU */}
              <div className="space-y-0.5 pt-1">
                <button
                  onClick={() => setOrdersSubmenuOpen(!ordersSubmenuOpen)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isOrderRoute
                      ? "bg-slate-100/80 text-slate-900 font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 shrink-0 text-purple-600" />
                    <span className={!sidebarOpen ? "lg:hidden" : ""}>Orders Pages</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded-full text-[10px] font-bold">
                      {orders.length}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${
                        ordersSubmenuOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {ordersSubmenuOpen && (
                  <div className={`pl-4 pr-1 py-1 space-y-0.5 border-l-2 border-slate-200 ml-4.5 ${!sidebarOpen ? "lg:hidden" : ""}`}>
                    <button
                      onClick={() => setActiveRoute("orders")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeRoute === "orders"
                          ? "bg-emerald-50 text-emerald-700 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <span>All Orders</span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {orders.length}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveRoute("orders-placed")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeRoute === "orders-placed"
                          ? "bg-amber-50 text-amber-800 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Placed (New)</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full font-mono text-[9px] font-bold">
                        {placedOrdersCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveRoute("orders-processing")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeRoute === "orders-processing"
                          ? "bg-blue-50 text-blue-700 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                        <span>Processing</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-full font-mono text-[9px] font-bold">
                        {processingOrdersCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveRoute("orders-shipped")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeRoute === "orders-shipped"
                          ? "bg-purple-50 text-purple-700 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Shipped / Transit</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded-full font-mono text-[9px] font-bold">
                        {shippedOrdersCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveRoute("orders-delivered")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeRoute === "orders-delivered"
                          ? "bg-emerald-50 text-emerald-700 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span>Delivered</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-mono text-[9px] font-bold">
                        {deliveredOrdersCount}
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveRoute("orders-cancelled")}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        activeRoute === "orders-cancelled"
                          ? "bg-red-50 text-red-700 font-bold"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Cancelled</span>
                      </div>
                      <span className="px-1.5 py-0.2 bg-red-100 text-red-800 rounded-full font-mono text-[9px] font-bold">
                        {cancelledOrdersCount}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setActiveRoute("banners")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeRoute === "banners"
                    ? "bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <ImageIcon className="w-4 h-4 shrink-0 text-pink-600" />
                <span className={!sidebarOpen ? "lg:hidden" : ""}>Banners & Hero</span>
              </button>
            </div>

            {/* GROUP 3: CUSTOMERS & TRAFFIC */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                Audience & Users
              </p>
              <button
                onClick={() => setActiveRoute("users")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeRoute === "users"
                    ? "bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 shrink-0 text-teal-600" />
                  <span className={!sidebarOpen ? "lg:hidden" : ""}>Customers</span>
                </div>
                <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                  {allUsers.length}
                </span>
              </button>

              <button
                onClick={() => setActiveRoute("visitors")}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeRoute === "visitors"
                    ? "bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 shrink-0 text-cyan-600" />
                  <span className={!sidebarOpen ? "lg:hidden" : ""}>Live Visitors</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </button>
            </div>

            {/* GROUP 4: SYSTEM */}
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-1">
                System
              </p>
              <button
                onClick={() => setActiveRoute("api-docs")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeRoute === "api-docs"
                    ? "bg-emerald-50 text-emerald-700 font-bold border-l-4 border-emerald-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <Code className="w-4 h-4 shrink-0 text-slate-600" />
                <span className={!sidebarOpen ? "lg:hidden" : ""}>API Endpoints</span>
              </button>
            </div>
          </div>
        </aside>

        {/* ========================================================================= */}
        {/* PRIMENG MAIN CONTENT AREA (layout-main) */}
        {/* ========================================================================= */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          {/* ========================================================================= */}
          {/* DEDICATED FULL-PAGE PRODUCT EDITOR (PRODUCT-NEW / PRODUCT-EDIT) */}
          {/* ========================================================================= */}
          {(activeRoute === "product-new" || activeRoute === "product-edit") && editingProduct ? (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Top Navigation & Action Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveRoute("products")}
                    className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                    title="Back to Products"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <span>Products</span>
                      <span>/</span>
                      <span className="text-slate-800 font-semibold uppercase tracking-wider">
                        {activeRoute === "product-new" ? "New Product" : "Edit Listing"}
                      </span>
                    </div>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                      {activeRoute === "product-new"
                        ? "Create New Product Listing"
                        : `Edit: ${editingProduct.title || "Untitled Product"}`}
                    </h1>
                  </div>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setActiveRoute("products")}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>

                  {activeRoute === "product-edit" && editingProduct.id && (
                    <a
                      href={`/product/${editingProduct.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview in Store</span>
                    </a>
                  )}

                  <button
                    type="button"
                    disabled={isSavingProduct}
                    onClick={handleSaveProduct}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center gap-2"
                  >
                    {isSavingProduct ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Save to MySQL</span>
                  </button>
                </div>
              </div>

              {/* Full-Page Product Form (2-Column Responsive Layout) */}
              <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* LEFT / CENTER (8 COLS): Title, Media, Specs */}
                <div className="lg:col-span-8 space-y-6">
                  {/* CARD 1: Basic Information */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        General Product Details
                      </h3>
                      <p className="text-xs text-slate-400">
                        Title, localized Bangla name, and web address slug
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
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
                        placeholder="e.g. Xiaomi Redmi Note 13 Pro 8GB/256GB"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
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
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        URL Slug
                      </label>
                      <div className="flex items-center">
                        <span className="px-3 py-2.5 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-xs text-slate-500 font-mono">
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
                          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-r-xl text-xs font-mono focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Highlights & Features (One bullet per line)
                      </label>
                      <textarea
                        rows={4}
                        value={featuresText}
                        onChange={(e) => setFeaturesText(e.target.value)}
                        placeholder="100% Genuine and authentic product imported under Ashaal guarantee.&#10;Premium quality material with durable finish.&#10;Comes with official manufacturer warranty."
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* CARD 2: Visual Media & Gallery */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Visual Media & Photo Gallery
                      </h3>
                      <p className="text-xs text-slate-400">
                        Cover image and multi-angle photo gallery
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                      {/* Live Image Preview */}
                      <div className="md:col-span-4">
                        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-2 bg-slate-50 text-center">
                          <img
                            src={
                              editingProduct.mainImage ||
                              SAMPLE_IMAGE_PRESETS[0].url
                            }
                            alt="Cover Preview"
                            className="w-full h-44 object-cover rounded-xl border border-slate-200 shadow-xs bg-white"
                          />
                          <span className="inline-block mt-2 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                            Primary Cover Image
                          </span>
                        </div>
                      </div>

                      {/* URL input and Presets */}
                      <div className="md:col-span-8 space-y-3">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Primary Cover Image URL *
                          </label>
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
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                          />
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                            Quick Demo Presets:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {SAMPLE_IMAGE_PRESETS.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    mainImage: preset.url,
                                  })
                                }
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Gallery Images Strip */}
                    <div className="pt-4 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Gallery Images ({editingProduct.images?.length || 0})
                        </label>
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={newGalleryImageUrl}
                          onChange={(e) =>
                            setNewGalleryImageUrl(e.target.value)
                          }
                          placeholder="Paste additional gallery image URL..."
                          className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddGalleryImage}
                          className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                        >
                          Add Image
                        </button>
                      </div>

                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 pt-2">
                        {editingProduct.images?.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative h-24 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100 shadow-xs"
                          >
                            <img
                              src={url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="absolute top-1.5 right-1.5 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                              title="Delete this image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CARD 3: Specifications & Features */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Technical Specifications
                      </h3>
                      <p className="text-xs text-slate-400">
                        Hardware specs, warranty, battery, materials, and display details
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[11px] font-bold text-slate-500">
                        Suggested Attribute Names:
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {COMMON_SPEC_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewSpecKey(s)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-600 rounded-lg text-xs font-medium cursor-pointer"
                          >
                            +{s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 pt-1">
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Key (e.g. Battery)"
                        className="col-span-2 px-3.5 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs"
                      />
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="Value (e.g. 5000 mAh)"
                        className="col-span-2 px-3.5 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddSpecification}
                        className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Add Spec
                      </button>
                    </div>

                    <div className="bg-slate-50 rounded-xl border border-slate-200 divide-y divide-slate-200 overflow-hidden">
                      {Object.keys(editingProduct.specifications || {}).length ===
                      0 ? (
                        <p className="p-4 text-center text-xs text-slate-400">
                          No specifications added yet. Use the inputs above to add technical parameters.
                        </p>
                      ) : (
                        Object.entries(editingProduct.specifications || {}).map(
                          ([k, v]) => (
                            <div
                              key={k}
                              className="p-3 px-4 flex items-center justify-between text-xs"
                            >
                              <span className="font-bold text-slate-700">
                                {k}:
                              </span>
                              <div className="flex items-center gap-3">
                                <span className="text-slate-600 font-medium">
                                  {v}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveSpecification(k)}
                                  className="text-red-500 hover:text-red-700 cursor-pointer p-1"
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

                {/* RIGHT SIDEBAR (4 COLS): Pricing, Inventory, Categorization, Badges */}
                <div className="lg:col-span-4 space-y-6">
                  {/* CARD 4: Pricing & Discount */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Pricing & Profitability
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Selling Offer Price (৳) *
                      </label>
                      <input
                        type="number"
                        required
                        value={editingProduct.price || 0}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            price: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 font-mono font-black rounded-xl text-base focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Original Regular Price (৳)
                      </label>
                      <input
                        type="number"
                        value={editingProduct.originalPrice || 0}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            originalPrice: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 font-mono rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    {computedDiscountPercentage > 0 && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs">
                        <span className="text-emerald-800 font-semibold">
                          Calculated Customer Discount:
                        </span>
                        <span className="font-mono font-bold text-emerald-700 text-sm">
                          -{computedDiscountPercentage}% OFF
                        </span>
                      </div>
                    )}
                  </div>

                  {/* CARD 5: Inventory & Warehouse */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Inventory & Stock
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Stock Quantity (Units) *
                      </label>
                      <input
                        type="number"
                        value={editingProduct.inStock || 0}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            inStock: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-slate-500">
                        Stock Status:
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          (editingProduct.inStock || 0) <= 0
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : (editingProduct.inStock || 0) <= 10
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {(editingProduct.inStock || 0) <= 0
                          ? "Out of Stock"
                          : (editingProduct.inStock || 0) <= 10
                            ? "Low Stock Warning"
                            : "Healthy Stock"}
                      </span>
                    </div>
                  </div>

                  {/* CARD 6: Organization & Brand */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-4 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Classification & Brand
                      </h3>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Category *
                      </label>
                      <select
                        value={
                          editingProduct.categorySlug ||
                          editingProduct.category ||
                          "electronics"
                        }
                        onChange={(e) => {
                          const matched = CATEGORIES_DATA.find(
                            (c) => c.slug === e.target.value,
                          );
                          setEditingProduct({
                            ...editingProduct,
                            category: matched?.name || e.target.value,
                            categorySlug: e.target.value,
                          });
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white cursor-pointer"
                      >
                        {CATEGORIES_DATA.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.name} ({cat.nameBn})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
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
                        placeholder="e.g. Xiaomi, Samsung"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white"
                      />
                      <div className="flex flex-wrap gap-1 pt-1">
                        {POPULAR_BRANDS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() =>
                              setEditingProduct({
                                ...editingProduct,
                                brand: b,
                              })
                            }
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[10px] font-semibold cursor-pointer"
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CARD 7: Badges & Promotions */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Promotional Badges
                      </h3>
                    </div>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isDarazMall)}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            isDarazMall: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          AshaalMall Official
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Shows official flagship badge
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isFlashSale)}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            isFlashSale: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          ⚡ Flash Sale Promotion
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Appears on /flash-sale page
                        </p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={Boolean(editingProduct.isFreeDelivery)}
                        onChange={(e) =>
                          setEditingProduct({
                            ...editingProduct,
                            isFreeDelivery: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 rounded"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">
                          Free Nationwide Delivery
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Delivery fee will be set to ৳0
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* CARD 8: Warranty & Policy */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-3 shadow-xs">
                    <div className="border-b border-slate-100 pb-3">
                      <h3 className="text-sm font-bold text-slate-900">
                        Warranty & Return Policy
                      </h3>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-600">
                        Warranty Terms
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
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-semibold text-slate-600">
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
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 text-slate-900 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  {/* Sticky Save Bar for Sidebar */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveRoute("products")}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer text-center"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSavingProduct}
                      className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {isSavingProduct && (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      )}
                      <span>Save Product</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <>
              {/* Breadcrumb & Section Header */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                    <span>Dashboard</span>
                    <span>/</span>
                    {isOrderRoute ? (
                      <>
                        <span
                          onClick={() => setActiveRoute("orders")}
                          className="hover:text-slate-600 cursor-pointer"
                        >
                          Orders
                        </span>
                        <span>/</span>
                        <span className="text-slate-800 font-semibold uppercase tracking-wider">
                          {activeRoute.replace("orders-", "")}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-mono font-bold rounded-md ml-1">
                          MySQL: {currentMysqlTableName}
                        </span>
                      </>
                    ) : (
                      <span className="text-slate-800 font-semibold uppercase tracking-wider">
                        {activeRoute}
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight capitalize mt-0.5">
                    {activeRoute === "dashboard" && "Executive Store Dashboard"}
                    {activeRoute === "products" && "Product Catalog Management"}
                    {activeRoute === "orders" && "All Orders (Master Registry)"}
                    {activeRoute === "orders-placed" && "Placed Orders (Pending Verification)"}
                    {activeRoute === "orders-processing" && "Processing & Packing Orders"}
                    {activeRoute === "orders-shipped" && "Shipped & In-Transit Orders"}
                    {activeRoute === "orders-delivered" && "Delivered & Completed Orders"}
                    {activeRoute === "orders-cancelled" && "Cancelled & Voided Orders"}
                    {activeRoute === "banners" && "Hero Carousel & Banners"}
                    {activeRoute === "users" && "Customer & Accounts Directory"}
                    {activeRoute === "visitors" && "Live Visitor Traffic Analytics"}
                    {activeRoute === "api-docs" && "REST API Documentation"}
                  </h2>
                </div>

                {/* Top Action Buttons based on route */}
                <div className="flex items-center gap-2">
                  {activeRoute === "products" && (
                    <button
                      onClick={handleOpenAddProduct}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create New Product</span>
                    </button>
                  )}
                  {activeRoute === "banners" && (
                    <button
                      onClick={() => {
                        setEditingBanner({
                          id: `banner-${Date.now()}`,
                          title: "Summer Mega Sale",
                          subtitle: "Up to 50% off on premium electronics",
                          image: SAMPLE_IMAGE_PRESETS[0].url,
                          linkType: "flash-sale",
                          badge: "FLASH SALE",
                        });
                        setIsBannerModalOpen(true);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Banner</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ========================================================================= */}
              {/* TAB 1: EXECUTIVE DASHBOARD (PrimeNG Sakai Widget Grid) */}
              {/* ========================================================================= */}
              {activeRoute === "dashboard" && (
                <div className="space-y-6">
                  {/* PrimeNG Sakai 4-Card Metrics Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* 1. Orders Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block text-slate-500 font-medium text-xs mb-1">
                            Total Orders
                          </span>
                          <span className="text-2xl font-bold text-slate-900 font-mono">
                            {orders.length}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
                        <span className="text-emerald-600 font-bold">
                          +{pendingOrdersCount} pending
                        </span>
                        <span className="text-slate-400">to fulfill today</span>
                      </div>
                    </div>

                    {/* 2. Revenue Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block text-slate-500 font-medium text-xs mb-1">
                            Gross Sales
                          </span>
                          <span className="text-2xl font-bold text-slate-900 font-mono">
                            ৳{totalRevenue.toLocaleString("en-BD")}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
                        <span className="text-emerald-600 font-bold">
                          +15.2%
                        </span>
                        <span className="text-slate-400">vs last period</span>
                      </div>
                    </div>

                    {/* 3. Customers Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block text-slate-500 font-medium text-xs mb-1">
                            Registered Customers
                          </span>
                          <span className="text-2xl font-bold text-slate-900 font-mono">
                            {allUsers.length}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
                        <span className="text-cyan-600 font-bold">
                          {visitors.length} live
                        </span>
                        <span className="text-slate-400">browsing store</span>
                      </div>
                    </div>

                    {/* 4. Products Inventory Card */}
                    <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="block text-slate-500 font-medium text-xs mb-1">
                            Catalog Items
                          </span>
                          <span className="text-2xl font-bold text-slate-900 font-mono">
                            {products.length}
                          </span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                          <Package className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs">
                        {lowStockCount > 0 ? (
                          <span className="text-amber-600 font-bold">
                            {lowStockCount} low stock
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold">
                            Healthy stock
                          </span>
                        )}
                        <span className="text-slate-400">in warehouse</span>
                      </div>
                    </div>
                  </div>

                  {/* Dashboard 2-Column: Recent Orders Table + Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Recent Orders (8 Cols) */}
                    <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                      <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">
                            Recent Transactions
                          </h3>
                          <p className="text-xs text-slate-400">
                            Latest incoming customer orders
                          </p>
                        </div>
                        <button
                          onClick={() => setActiveRoute("orders")}
                          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                        >
                          View All Orders →
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                            <tr>
                              <th className="py-3 px-4">Order #</th>
                              <th className="py-3 px-4">Customer</th>
                              <th className="py-3 px-4">Amount</th>
                              <th className="py-3 px-4">Status</th>
                              <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {orders.slice(0, 5).map((ord) => (
                              <tr
                                key={ord.id}
                                className="hover:bg-slate-50 transition-colors"
                              >
                                <td className="py-3 px-4 font-mono font-bold text-slate-900">
                                  #{ord.orderNumber}
                                </td>
                                <td className="py-3 px-4 text-slate-700">
                                  {ord.shippingAddress?.fullName || "Guest Customer"}
                                </td>
                                <td className="py-3 px-4 font-bold text-slate-900 font-mono">
                                  ৳{ord.total.toLocaleString("en-BD")}
                                </td>
                                <td className="py-3 px-4">
                                  <span
                                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                      ord.orderStatus === "DELIVERED"
                                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                        : ord.orderStatus === "CANCELLED"
                                          ? "bg-red-50 text-red-700 border border-red-200"
                                          : ord.orderStatus === "SHIPPED"
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "bg-amber-50 text-amber-800 border border-amber-200"
                                    }`}
                                  >
                                    {ord.orderStatus}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    onClick={() => {
                                      setSelectedOrder(ord);
                                      setActiveRoute("orders");
                                    }}
                                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
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

                    {/* Quick Shortcuts & Storage Info (4 Cols) */}
                    <div className="lg:col-span-4 space-y-4">
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
                        <h3 className="text-sm font-bold text-slate-900">
                          Quick Operations
                        </h3>

                        <button
                          onClick={handleOpenAddProduct}
                          className="w-full p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                              <Plus className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-700">
                                Create New Product
                              </p>
                              <p className="text-[10px] text-slate-400">
                                Dedicated full-page editor
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
                        </button>

                        <button
                          onClick={() => setActiveRoute("orders-placed")}
                          className="w-full p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                              <Clock className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                                Verify Placed Orders
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {placedOrdersCount} waiting in orders_placed
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600" />
                        </button>

                        <button
                          onClick={() => setActiveRoute("orders-processing")}
                          className="w-full p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-xl flex items-center justify-between transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                              <PackageCheck className="w-4 h-4" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                                Dispatch Courier
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {processingOrdersCount} packing in orders_processing
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                        </button>
                      </div>

                      {/* MySQL Status Info */}
                      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Database className="w-4 h-4 text-emerald-600" />
                          <span>MySQL Status Tables Active</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">
                          orders, orders_placed, orders_processing, orders_shipped, orders_delivered, orders_cancelled
                        </p>
                        <p className="text-[11px] text-emerald-600 font-semibold">
                          Dedicated Status Database Synchronization Active
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 2: PRODUCTS DATATABLE (PrimeNG p-datatable) */}
              {/* ========================================================================= */}
              {activeRoute === "products" && (
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                  {/* PrimeNG DataTable Header */}
                  <div className="p-4 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3 bg-white">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-slate-900">
                        Products Catalog
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-full">
                        {filteredProducts.length} Items
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Stock Filter Dropdown */}
                      <select
                        value={productStockFilter}
                        onChange={(e) => setProductStockFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="all">All Inventory</option>
                        <option value="in_stock">In Stock (&gt;10)</option>
                        <option value="low_stock">Low Stock (≤10)</option>
                        <option value="out_of_stock">Out of Stock (0)</option>
                        <option value="mall">AshaalMall Only</option>
                        <option value="flash">Flash Sale Deals</option>
                      </select>

                      {/* Category Dropdown */}
                      <select
                        value={productCategoryFilter}
                        onChange={(e) => setProductCategoryFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="all">All Categories</option>
                        {CATEGORIES_DATA.map((cat) => (
                          <option key={cat.slug} value={cat.slug}>
                            {cat.name} ({cat.nameBn})
                          </option>
                        ))}
                      </select>

                      {/* Search */}
                      <div className="relative">
                        <input
                          type="text"
                          value={tableSearch}
                          onChange={(e) => setTableSearch(e.target.value)}
                          placeholder="Search title/brand..."
                          className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 w-44"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                      </div>

                      <button
                        onClick={handleOpenAddProduct}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Create New Product</span>
                      </button>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                        <tr>
                          <th className="py-3.5 px-4 w-12 text-center">Image</th>
                          <th className="py-3.5 px-4">Name</th>
                          <th className="py-3.5 px-4">Category</th>
                          <th className="py-3.5 px-4">Price</th>
                          <th className="py-3.5 px-4">Inventory</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {paginatedProducts.length === 0 ? (
                          <tr>
                            <td
                              colSpan={7}
                              className="py-12 text-center text-slate-400"
                            >
                              No products found matching filters.
                            </td>
                          </tr>
                        ) : (
                          paginatedProducts.map((p) => (
                            <tr
                              key={p.id}
                              className="hover:bg-slate-50/70 transition-colors"
                            >
                              <td className="py-3 px-4 text-center">
                                <img
                                  src={p.mainImage || p.images?.[0]}
                                  alt={p.title}
                                  className="w-10 h-10 rounded-xl object-cover border border-slate-200 mx-auto bg-slate-100"
                                />
                              </td>
                              <td className="py-3 px-4 max-w-xs">
                                <p className="font-bold text-slate-900 line-clamp-1">
                                  {p.title}
                                </p>
                                <p className="text-[11px] text-slate-400">
                                  Brand: {p.brand} • ID: {p.id}
                                </p>
                              </td>
                              <td className="py-3 px-4 font-semibold text-slate-600 capitalize">
                                {p.category}
                              </td>
                              <td className="py-3 px-4 font-mono">
                                <span className="font-bold text-slate-900 text-sm">
                                  ৳{p.price?.toLocaleString("en-BD")}
                                </span>
                                {p.originalPrice && p.originalPrice > p.price && (
                                  <span className="text-[10px] text-slate-400 line-through ml-1.5">
                                    ৳{p.originalPrice}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                                    (p.inStock || 0) <= 0
                                      ? "bg-red-50 text-red-700 border border-red-200"
                                      : (p.inStock || 0) <= 10
                                        ? "bg-amber-50 text-amber-800 border border-amber-200"
                                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  }`}
                                >
                                  {(p.inStock || 0) <= 0
                                    ? "Out of Stock"
                                    : `${p.inStock} In Stock`}
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  {p.isDarazMall && (
                                    <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-bold text-[9px]">
                                      MALL
                                    </span>
                                  )}
                                  {p.isFlashSale && (
                                    <span className="px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-bold text-[9px]">
                                      FLASH
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <a
                                    href={`/product/${p.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
                                    title="View in Store"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </a>
                                  <button
                                    onClick={() => handleDuplicateProduct(p)}
                                    className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <CopyPlus className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleOpenEditProduct(p)}
                                    className="w-8 h-8 rounded-full hover:bg-blue-50 text-blue-600 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Edit Product"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(p.id, p.title)}
                                    className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center transition-colors cursor-pointer"
                                    title="Delete Product"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* PrimeNG Paginator Footer */}
                  <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white">
                    <span>
                      Showing {filteredProducts.length === 0 ? 0 : (productPage - 1) * productRowsPerPage + 1} to{" "}
                      {Math.min(productPage * productRowsPerPage, filteredProducts.length)} of {filteredProducts.length} entries
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        disabled={productPage <= 1}
                        onClick={() => setProductPage(productPage - 1)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      {Array.from(
                        { length: Math.ceil(filteredProducts.length / productRowsPerPage) || 1 },
                        (_, i) => i + 1,
                      )
                        .slice(0, 5)
                        .map((pageNo) => (
                          <button
                            key={pageNo}
                            onClick={() => setProductPage(pageNo)}
                            className={`px-3 py-1 rounded-lg font-semibold cursor-pointer ${
                              productPage === pageNo
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "border border-slate-200 hover:bg-slate-100 text-slate-700"
                            }`}
                          >
                            {pageNo}
                          </button>
                        ))}
                      <button
                        disabled={
                          productPage >=
                          Math.ceil(filteredProducts.length / productRowsPerPage)
                        }
                        onClick={() => setProductPage(productPage + 1)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 3: DEDICATED ORDERS PAGES (PrimeNG p-datatable) */}
              {/* ========================================================================= */}
              {isOrderRoute && (
                <div className="space-y-4">
                  {/* Status Page KPI Banner */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                          {currentOrderStatusFilter === "all" ? "Total Orders" : `${currentOrderStatusFilter} Orders`}
                        </span>
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          {filteredOrders.length}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                        {currentOrderStatusFilter === "PLACED" && <Clock className="w-5 h-5 text-amber-600" />}
                        {currentOrderStatusFilter === "PROCESSING" && <Box className="w-5 h-5 text-blue-600" />}
                        {currentOrderStatusFilter === "SHIPPED" && <Truck className="w-5 h-5 text-purple-600" />}
                        {currentOrderStatusFilter === "DELIVERED" && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                        {currentOrderStatusFilter === "CANCELLED" && <XCircle className="w-5 h-5 text-red-600" />}
                        {currentOrderStatusFilter === "all" && <ShoppingCart className="w-5 h-5 text-slate-700" />}
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                          Order Value in Stage
                        </span>
                        <span className="text-2xl font-black text-slate-900 font-mono">
                          ৳{currentViewTotalAmount.toLocaleString("en-BD")}
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                        <DollarSign className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-0.5">
                          Database Origin
                        </span>
                        <span className="text-sm font-bold text-slate-800 font-mono block">
                          {currentMysqlTableName}
                        </span>
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          Synced Live with MySQL
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                        <Database className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Strip */}
                  <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-3">
                    {/* Navigation Pills to other dedicated order pages */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {[
                        { id: "orders", label: "All Orders", count: orders.length },
                        { id: "orders-placed", label: "Placed", count: placedOrdersCount },
                        { id: "orders-processing", label: "Processing", count: processingOrdersCount },
                        { id: "orders-shipped", label: "Shipped", count: shippedOrdersCount },
                        { id: "orders-delivered", label: "Delivered", count: deliveredOrdersCount },
                        { id: "orders-cancelled", label: "Cancelled", count: cancelledOrdersCount },
                      ].map((pg) => (
                        <button
                          key={pg.id}
                          onClick={() => setActiveRoute(pg.id as NavRoute)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                            activeRoute === pg.id
                              ? "bg-emerald-600 text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          <span>{pg.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              activeRoute === pg.id
                                ? "bg-emerald-800 text-emerald-100"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {pg.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Search & Payment Filter */}
                    <div className="flex items-center gap-2">
                      <select
                        value={orderPaymentFilter}
                        onChange={(e) => setOrderPaymentFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-emerald-500 cursor-pointer"
                      >
                        <option value="all">All Payments</option>
                        <option value="PAID">PAID</option>
                        <option value="PENDING">PENDING</option>
                        <option value="REFUNDED">REFUNDED</option>
                      </select>

                      <div className="relative">
                        <input
                          type="text"
                          value={tableSearch}
                          onChange={(e) => setTableSearch(e.target.value)}
                          placeholder="Search order #, name, phone..."
                          className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 w-48"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Orders Table */}
                  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                          <tr>
                            <th className="py-3.5 px-4">Order #</th>
                            <th className="py-3.5 px-4">Customer</th>
                            <th className="py-3.5 px-4">Items</th>
                            <th className="py-3.5 px-4">Amount & Payment</th>
                            <th className="py-3.5 px-4">Logistics</th>
                            <th className="py-3.5 px-4">Stage Status</th>
                            <th className="py-3.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {paginatedOrders.length === 0 ? (
                            <tr>
                              <td
                                colSpan={7}
                                className="py-12 text-center text-slate-400"
                              >
                                No orders currently in {currentOrderStatusFilter === "all" ? "the system" : `"${currentOrderStatusFilter}" status`}.
                              </td>
                            </tr>
                          ) : (
                            paginatedOrders.map((ord) => (
                              <tr
                                key={ord.id}
                                className="hover:bg-slate-50/70 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <p className="font-mono font-bold text-slate-900">
                                    #{ord.orderNumber}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    {ord.createdAt}
                                  </p>
                                </td>

                                <td className="py-3 px-4">
                                  <p className="font-bold text-slate-800">
                                    {ord.shippingAddress?.fullName || "Customer"}
                                  </p>
                                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                                    <PhoneCall className="w-3 h-3 text-slate-400" />
                                    <span>{ord.shippingAddress?.phone}</span>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="font-semibold text-slate-700">
                                    {ord.items?.length || 0} item(s)
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <p className="font-bold text-slate-900 font-mono text-sm">
                                    ৳{ord.total?.toLocaleString("en-BD")}
                                  </p>
                                  <div className="flex items-center gap-1 mt-0.5">
                                    <span className="px-1.5 py-0.2 bg-slate-100 text-slate-700 rounded text-[9px] font-bold uppercase">
                                      {ord.paymentMethod}
                                    </span>
                                    <span
                                      className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                                        ord.paymentStatus === "PAID"
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          : "bg-amber-50 text-amber-800 border border-amber-200"
                                      }`}
                                    >
                                      {ord.paymentStatus || "PENDING"}
                                    </span>
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <p className="font-semibold text-slate-800 text-[11px]">
                                    {ord.courier || "Ashaal Express"}
                                  </p>
                                  <p className="text-[10px] text-slate-400 font-mono">
                                    {ord.trackingNumber || "No Tracking"}
                                  </p>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${
                                        ord.orderStatus === "DELIVERED"
                                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                          : ord.orderStatus === "CANCELLED"
                                            ? "bg-red-50 text-red-700 border border-red-200"
                                            : ord.orderStatus === "SHIPPED"
                                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                                              : ord.orderStatus === "PROCESSING"
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "bg-amber-50 text-amber-800 border border-amber-200"
                                      }`}
                                    >
                                      {ord.orderStatus}
                                    </span>

                                    {/* Quick Stage Progression Action */}
                                    {ord.orderStatus === "PLACED" && (
                                      <button
                                        onClick={() =>
                                          handleUpdateOrderStatus(
                                            ord.id,
                                            "PROCESSING",
                                          )
                                        }
                                        className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                        title="Move to orders_processing table"
                                      >
                                        Accept & Pack
                                      </button>
                                    )}
                                    {ord.orderStatus === "PROCESSING" && (
                                      <button
                                        onClick={() => setSelectedOrder(ord)}
                                        className="px-2 py-0.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                        title="Move to orders_shipped table"
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
                                        className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold cursor-pointer"
                                        title="Move to orders_delivered table"
                                      >
                                        Delivered
                                      </button>
                                    )}
                                  </div>
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => {
                                        setSelectedOrder(ord);
                                        setIsInvoiceOpen(true);
                                      }}
                                      className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer"
                                      title="Print Slip"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setSelectedOrder(ord)}
                                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                                    >
                                      Manage
                                    </button>
                                    <button
                                      onClick={() => handleDeleteOrder(ord.id)}
                                      className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center cursor-pointer"
                                      title="Delete Order"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Orders Paginator */}
                    <div className="px-4 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-white">
                      <span>
                        Showing {filteredOrders.length === 0 ? 0 : (orderPage - 1) * orderRowsPerPage + 1} to{" "}
                        {Math.min(orderPage * orderRowsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          disabled={orderPage <= 1}
                          onClick={() => setOrderPage(orderPage - 1)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        {Array.from(
                          { length: Math.ceil(filteredOrders.length / orderRowsPerPage) || 1 },
                          (_, i) => i + 1,
                        )
                          .slice(0, 5)
                          .map((pageNo) => (
                            <button
                              key={pageNo}
                              onClick={() => setOrderPage(pageNo)}
                              className={`px-3 py-1 rounded-lg font-semibold cursor-pointer ${
                                orderPage === pageNo
                                  ? "bg-emerald-600 text-white shadow-xs"
                                  : "border border-slate-200 hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              {pageNo}
                            </button>
                          ))}
                        <button
                          disabled={
                            orderPage >=
                            Math.ceil(filteredOrders.length / orderRowsPerPage)
                          }
                          onClick={() => setOrderPage(orderPage + 1)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 4: USERS DIRECTORY */}
              {/* ========================================================================= */}
              {activeRoute === "users" && (
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Customer & Users Directory
                      </h3>
                      <p className="text-xs text-slate-400">
                        {filteredUsers.length} total registered accounts
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={userRoleFilter}
                        onChange={(e) => setUserRoleFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        <option value="all">All Roles</option>
                        <option value="customer">Customers</option>
                        <option value="admin">Administrators</option>
                        <option value="seller">Sellers</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                        <tr>
                          <th className="py-3.5 px-4">User</th>
                          <th className="py-3.5 px-4">Email & Phone</th>
                          <th className="py-3.5 px-4">Role</th>
                          <th className="py-3.5 px-4">Joined Date</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredUsers.map((u) => (
                          <tr key={u.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{u.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">
                                ID: {u.id}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <p className="text-slate-700">{u.email}</p>
                              <p className="text-[11px] text-slate-400">
                                {u.phone || "No phone"}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                                  u.role === "admin"
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : u.role === "seller"
                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                      : "bg-slate-100 text-slate-700 border border-slate-200"
                                }`}
                              >
                                {u.role || "customer"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {u.joinDate || "Recent"}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center ml-auto cursor-pointer"
                                title="Delete User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 5: BANNERS & CAROUSEL */}
              {/* ========================================================================= */}
              {activeRoute === "banners" && (
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Homepage Banners & Sliders
                      </h3>
                      <p className="text-xs text-slate-400">
                        Control hero promotion carousel
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setEditingBanner({
                          id: `banner-${Date.now()}`,
                          title: "Mega Deal 2026",
                          subtitle: "Best prices on official gadgets",
                          image: SAMPLE_IMAGE_PRESETS[0].url,
                          linkType: "flash-sale",
                          badge: "HOT DEAL",
                        });
                        setIsBannerModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Banner</span>
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                        <tr>
                          <th className="py-3.5 px-4 w-28">Preview</th>
                          <th className="py-3.5 px-4">Title & Subtitle</th>
                          <th className="py-3.5 px-4">Badge</th>
                          <th className="py-3.5 px-4">Link Destination</th>
                          <th className="py-3.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {banners.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4">
                              <img
                                src={b.image}
                                alt=""
                                className="w-24 h-12 rounded-lg object-cover border border-slate-200 bg-slate-100"
                              />
                            </td>
                            <td className="py-3 px-4">
                              <p className="font-bold text-slate-900">{b.title}</p>
                              <p className="text-[11px] text-slate-400">
                                {b.subtitle}
                              </p>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded font-bold text-[10px]">
                                {b.badge || "FEATURED"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                              {b.linkType}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleDeleteBanner(b.id)}
                                className="w-8 h-8 rounded-full hover:bg-red-50 text-red-600 flex items-center justify-center ml-auto cursor-pointer"
                                title="Delete Banner"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 6: VISITORS */}
              {/* ========================================================================= */}
              {activeRoute === "visitors" && (
                <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-slate-200/80 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Live Visitors Stream
                      </h3>
                      <p className="text-xs text-slate-400">
                        Real-time audience IP, devices & location
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-bold">
                        <tr>
                          <th className="py-3.5 px-4">IP Address</th>
                          <th className="py-3.5 px-4">Active Page</th>
                          <th className="py-3.5 px-4">Device & OS</th>
                          <th className="py-3.5 px-4">Location</th>
                          <th className="py-3.5 px-4">Referrer</th>
                          <th className="py-3.5 px-4 text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {visitors.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50/70">
                            <td className="py-3 px-4 font-mono font-bold text-slate-800">
                              {v.ip}
                            </td>
                            <td className="py-3 px-4 font-mono text-emerald-600 font-semibold">
                              {v.page}
                            </td>
                            <td className="py-3 px-4 text-slate-600">{v.device}</td>
                            <td className="py-3 px-4 text-slate-600">
                              {v.city}, {v.country}
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {v.referrer}
                            </td>
                            <td className="py-3 px-4 text-right text-slate-400 font-mono">
                              {v.timestamp}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================================================= */}
              {/* TAB 7: API DOCS */}
              {/* ========================================================================= */}
              {activeRoute === "api-docs" && (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      REST API Endpoints & Developer Documentation
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Native Next.js route handlers connected to MySQL on 51.79.229.154:3306.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <p className="font-bold text-xs text-slate-800">Products API</p>
                      <code className="block font-mono text-xs text-emerald-700 bg-white p-2 rounded border border-slate-200">
                        GET /api/products
                      </code>
                      <code className="block font-mono text-xs text-emerald-700 bg-white p-2 rounded border border-slate-200">
                        POST /api/products
                      </code>
                      <code className="block font-mono text-xs text-emerald-700 bg-white p-2 rounded border border-slate-200">
                        DELETE /api/products/:id
                      </code>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <p className="font-bold text-xs text-slate-800">Status-Specific Orders API</p>
                      <code className="block font-mono text-xs text-blue-700 bg-white p-2 rounded border border-slate-200">
                        GET /api/orders?status=placed
                      </code>
                      <code className="block font-mono text-xs text-blue-700 bg-white p-2 rounded border border-slate-200">
                        GET /api/orders?status=processing
                      </code>
                      <code className="block font-mono text-xs text-blue-700 bg-white p-2 rounded border border-slate-200">
                        GET /api/orders?status=shipped
                      </code>
                      <code className="block font-mono text-xs text-blue-700 bg-white p-2 rounded border border-slate-200">
                        GET /api/orders?status=delivered
                      </code>
                      <code className="block font-mono text-xs text-blue-700 bg-white p-2 rounded border border-slate-200">
                        GET /api/orders?status=cancelled
                      </code>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* PRIMENG DIALOG: ORDER FULFILLMENT & DETAILS MODAL (p-dialog) */}
      {/* ========================================================================= */}
      {selectedOrder && !isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full shadow-2xl my-6 flex flex-col max-h-[92vh] overflow-hidden text-slate-800">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">
                      Order #{selectedOrder.orderNumber}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        selectedOrder.orderStatus === "DELIVERED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : selectedOrder.orderStatus === "CANCELLED"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : selectedOrder.orderStatus === "SHIPPED"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Placed on {selectedOrder.createdAt}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsInvoiceOpen(true)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Slip</span>
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Workflow Progress Bar */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600">
                  Workflow Action:
                </span>
                {selectedOrder.orderStatus === "PLACED" && (
                  <button
                    disabled={isUpdatingOrderWorkflow}
                    onClick={() =>
                      handleUpdateOrderStatus(selectedOrder.id, "PROCESSING")
                    }
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Accept & Mark Processing
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
                    className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Dispatch with Courier
                  </button>
                )}
                {selectedOrder.orderStatus === "SHIPPED" && (
                  <button
                    disabled={isUpdatingOrderWorkflow}
                    onClick={() =>
                      handleUpdateOrderStatus(selectedOrder.id, "DELIVERED")
                    }
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Mark as Delivered & Paid
                  </button>
                )}
              </div>

              {selectedOrder.orderStatus !== "CANCELLED" && (
                <button
                  onClick={() => {
                    if (
                      window.confirm(
                        `Cancel order #${selectedOrder.orderNumber}?`,
                      )
                    ) {
                      handleUpdateOrderStatus(selectedOrder.id, "CANCELLED");
                    }
                  }}
                  className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel Order
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left (7 Cols) */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Customer Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Customer & Delivery Address
                    </p>
                    <p className="font-bold text-slate-900 text-sm">
                      {selectedOrder.shippingAddress?.fullName}
                    </p>
                    <p className="text-slate-600 font-mono">
                      {selectedOrder.shippingAddress?.phone}
                    </p>
                    <p className="text-slate-600">
                      {selectedOrder.shippingAddress?.addressLine},{" "}
                      {selectedOrder.shippingAddress?.division}
                    </p>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <a
                        href={`tel:${selectedOrder.shippingAddress?.phone}`}
                        className="flex-1 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call Customer</span>
                      </a>
                      <a
                        href={`https://wa.me/880${selectedOrder.shippingAddress?.phone.replace(/[^0-9]/g, "").replace(/^880?/, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-3 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Ordered Products ({selectedOrder.items?.length || 0})
                    </p>
                    <div className="divide-y divide-slate-200">
                      {selectedOrder.items?.map((it, idx) => (
                        <div
                          key={idx}
                          className="py-2.5 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={it.product?.mainImage}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
                            />
                            <div>
                              <p className="font-bold text-slate-900 line-clamp-1">
                                {it.product?.title}
                              </p>
                              <p className="text-slate-400 text-[10px]">
                                Qty: {it.quantity} × ৳{it.product?.price}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-slate-900 font-mono">
                            ৳
                            {(
                              (it.product?.price || 0) * it.quantity
                            ).toLocaleString("en-BD")}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                      <span>Total Payable:</span>
                      <span className="text-emerald-700 font-mono">
                        ৳{selectedOrder.total?.toLocaleString("en-BD")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right (5 Cols) */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Courier Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Logistics Assignment
                    </p>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Courier Partner
                      </label>
                      <select
                        value={orderCourierInput}
                        onChange={(e) => setOrderCourierInput(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
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

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tracking Number
                      </label>
                      <input
                        type="text"
                        value={orderTrackingInput}
                        onChange={(e) => setOrderTrackingInput(e.target.value)}
                        placeholder="e.g. DEX-BD-928172"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleSaveOrderLogistics(selectedOrder.id)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Save Logistics
                    </button>
                  </div>

                  {/* Payment Status Switch */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                      Payment Settlement
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdatePaymentStatus(selectedOrder.id, "PAID")
                        }
                        className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                          selectedOrder.paymentStatus === "PAID"
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white border border-slate-300 text-slate-700"
                        }`}
                      >
                        Mark PAID
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdatePaymentStatus(selectedOrder.id, "PENDING")
                        }
                        className={`py-2 rounded-xl text-xs font-bold cursor-pointer ${
                          selectedOrder.paymentStatus === "PENDING"
                            ? "bg-amber-600 text-white shadow-xs"
                            : "bg-white border border-slate-300 text-slate-700"
                        }`}
                      >
                        Mark PENDING
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PRINTABLE PACKING SLIP & INVOICE MODAL */}
      {/* ========================================================================= */}
      {selectedOrder && isInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto print:p-0 print:bg-white print:static">
          <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-4 border border-slate-200 print:border-none print:shadow-none print:max-w-none print:w-full print:rounded-none">
            {/* Screen Controls */}
            <div className="px-6 py-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
              <span className="text-xs font-bold">
                Courier Dispatch Packing Slip
              </span>
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
                  className="px-3 py-1 bg-slate-800 text-slate-200 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Printable Area */}
            <div className="p-8 space-y-6 text-slate-900 font-sans print:p-4">
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
                <div>
                  <h1 className="text-2xl font-black tracking-wider text-slate-950 uppercase">
                    ASHAAL BANGLADESH
                  </h1>
                  <p className="text-xs text-slate-600">
                    Official Marketplace • Dhaka, Bangladesh
                  </p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-slate-900 text-white font-mono text-xs font-bold uppercase rounded">
                    PACKING SLIP
                  </span>
                  <p className="text-sm font-black font-mono mt-1 text-slate-950">
                    #{selectedOrder.orderNumber}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs border border-slate-300 rounded-xl p-4 bg-slate-50">
                <div>
                  <p className="font-bold text-slate-500 uppercase text-[10px] mb-1">
                    Deliver To:
                  </p>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedOrder.shippingAddress?.fullName}
                  </p>
                  <p className="font-mono font-bold text-slate-800">
                    {selectedOrder.shippingAddress?.phone}
                  </p>
                  <p className="text-slate-700 mt-0.5">
                    {selectedOrder.shippingAddress?.addressLine},{" "}
                    {selectedOrder.shippingAddress?.division}
                  </p>
                </div>
                <div>
                  <p className="font-bold text-slate-500 uppercase text-[10px] mb-1">
                    Courier Logistics:
                  </p>
                  <p className="font-bold text-slate-800">
                    Courier: {selectedOrder.courier || "Ashaal Express"}
                  </p>
                  <p className="font-mono text-slate-700">
                    Tracking: {selectedOrder.trackingNumber || "N/A"}
                  </p>
                  <p className="font-bold uppercase text-slate-900 mt-1">
                    Payment: {selectedOrder.paymentMethod} (
                    {selectedOrder.paymentStatus || "PENDING"})
                  </p>
                </div>
              </div>

              <div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-900 bg-slate-100 font-bold text-slate-800">
                      <th className="py-2 px-2">Description</th>
                      <th className="py-2 px-2 text-center w-16">Qty</th>
                      <th className="py-2 px-2 text-right w-24">Price</th>
                      <th className="py-2 px-2 text-right w-24">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {selectedOrder.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td className="py-2 px-2 font-semibold text-slate-900">
                          {it.product?.title}
                        </td>
                        <td className="py-2 px-2 text-center font-mono">
                          {it.quantity}
                        </td>
                        <td className="py-2 px-2 text-right font-mono">
                          ৳{it.product?.price?.toLocaleString("en-BD")}
                        </td>
                        <td className="py-2 px-2 text-right font-mono font-bold">
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

              <div className="flex justify-end pt-2">
                <div className="w-60 space-y-1 text-xs border-t-2 border-slate-900 pt-2">
                  <div className="flex justify-between font-black text-sm text-slate-950">
                    <span>TOTAL PAYABLE:</span>
                    <span className="font-mono">
                      ৳{selectedOrder.total?.toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
