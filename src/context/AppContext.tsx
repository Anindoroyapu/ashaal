"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Product,
  CartItem,
  Voucher,
  DeliveryAddress,
  Order,
  PageView,
  Language,
  Banner,
  UserProfile,
} from "../types";

import { VOUCHERS_DATA } from "../data/bannersData";
import {
  subscribeToProducts,
  subscribeToOrders,
  subscribeToBanners,
  subscribeToUsers,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  saveUserToFirestore,
  deleteUserFromFirestore,
  loginUserViaApi,
  signupUserViaApi,
  getActiveSessionToken,
  setUserSessionToken,
  clearUserSessionToken,
  loadCartByToken,
  saveCartByToken,
  loadWishlistByToken,
  saveWishlistByToken,
} from "../services/firestoreService";
import confetti from "canvas-confetti";

export interface RouteState {
  page: PageView;
  productId?: string | null;
  categorySlug?: string | null;
  searchQuery?: string;
  searchFilter?: string | null;
  orderId?: string | null;
}

export function parseRouteFromBrowserLocation(): RouteState {
  if (typeof window === "undefined") {
    return { page: "home" };
  }

  let rawPath = window.location.pathname;
  let rawSearch = window.location.search;

  // Support Hash Routing as well (e.g. #/product/prod-1)
  if (window.location.hash && window.location.hash.startsWith("#/")) {
    const hashContent = window.location.hash.slice(1);
    const [hPath, hQuery] = hashContent.split("?");
    rawPath = hPath || "/";
    if (hQuery) rawSearch = "?" + hQuery;
  }

  const searchParams = new URLSearchParams(rawSearch);
  const path = rawPath.replace(/\/+$/, "") || "/";

  // Match /product/:id or /products/:id or /product?id=...
  const productMatch = path.match(/^\/products?\/([^/]+)$/i);
  if (productMatch) {
    return {
      page: "product-details",
      productId: productMatch[1],
    };
  }
  if (path === "/product" || path === "/products") {
    const qId = searchParams.get("id") || searchParams.get("productId");
    return {
      page: "product-details",
      productId: qId || null,
    };
  }

  // Match /category/:slug
  const categoryMatch = path.match(/^\/category\/([^/]+)$/i);
  if (categoryMatch) {
    return {
      page: "search",
      categorySlug: categoryMatch[1],
      searchQuery: searchParams.get("q") || "",
    };
  }

  // Match /search
  if (path === "/search") {
    return {
      page: "search",
      searchQuery: searchParams.get("q") || "",
      categorySlug: searchParams.get("category") || null,
      searchFilter: searchParams.get("filter") || null,
    };
  }

  if (path === "/flash-sale" || path === "/flashsale" || path === "/deals") {
    return { page: "flash-sale" };
  }

  if (path === "/ashaalmall" || path === "/daraz-mall" || path === "/mall") {
    return { page: "daraz-mall" };
  }

  if (path === "/cart") {
    return { page: "cart" };
  }

  if (path === "/checkout") {
    return { page: "checkout" };
  }

  if (path === "/order-confirmation" || path === "/order-success") {
    return {
      page: "order-confirmation",
      orderId: searchParams.get("orderId") || null,
    };
  }

  if (path === "/track-order" || path === "/track") {
    return {
      page: "track-order",
      orderId: searchParams.get("orderId") || null,
    };
  }

  if (path === "/seller-center" || path === "/seller") {
    return { page: "seller-center" };
  }

  if (path === "/customer-care" || path === "/help" || path === "/support") {
    return { page: "customer-care" };
  }

  if (path === "/my-account" || path === "/account" || path === "/profile") {
    return { page: "my-account" };
  }

  if (path === "/coins-rewards" || path === "/coins" || path === "/rewards") {
    return { page: "coins-rewards" };
  }

  if (path === "/manage" || path.startsWith("/manage/")) {
    return { page: "manage" };
  }

  return { page: "home" };
}

export function buildRouteUrl(
  page: PageView,
  params?: {
    productId?: string;
    categorySlug?: string;
    searchQuery?: string;
    orderId?: string;
    filter?: string;
  },
): string {
  switch (page) {
    case "home":
      return "/";
    case "manage":
      return "/manage";
    case "product-details":
      return params?.productId ? `/product/${params.productId}` : "/product";
    case "search": {
      const searchParams = new URLSearchParams();
      if (params?.searchQuery) searchParams.set("q", params.searchQuery);
      if (params?.categorySlug)
        searchParams.set("category", params.categorySlug);
      if (params?.filter) searchParams.set("filter", params.filter);
      const qs = searchParams.toString();
      return qs ? `/search?${qs}` : "/search";
    }
    case "flash-sale":
      return "/flash-sale";
    case "daraz-mall":
      return "/ashaalmall";
    case "cart":
      return "/cart";
    case "checkout":
      return "/checkout";
    case "order-confirmation":
      return params?.orderId
        ? `/order-confirmation?orderId=${params.orderId}`
        : "/order-confirmation";
    case "track-order":
      return params?.orderId
        ? `/track-order?orderId=${params.orderId}`
        : "/track-order";
    case "seller-center":
      return "/seller-center";
    case "customer-care":
      return "/customer-care";
    case "my-account":
      return "/my-account";
    case "coins-rewards":
      return "/coins-rewards";
    default:
      return "/";
  }
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentPage: PageView;
  navigate: (
    page: PageView,
    params?: {
      productId?: string;
      categorySlug?: string;
      searchQuery?: string;
      orderId?: string;
      filter?: string;
    },
  ) => void;
  products: Product[];
  banners: Banner[];
  selectedProductId: string | null;
  selectedProduct: Product | null;
  selectedCategorySlug: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchFilter: string | null;
  setSearchFilter: (f: string | null) => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: (
    product: Product,
    quantity?: number,
    variations?: Record<string, string>,
    buyNow?: boolean,
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, newQty: number) => void;
  toggleSelectCartItem: (cartItemId: string) => void;
  selectAllCartItems: (select: boolean) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  user: UserProfile;
  allUsers: UserProfile[];
  sessionToken: string;
  isLoggedIn: boolean;
  login: (
    identifierOrData?: string | Partial<UserProfile>,
    password?: string,
  ) => Promise<{ success: boolean; message?: string }>;
  signup: (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  addCoins: (amount: number) => void;
  updateUserProfile: (
    userId: string,
    data: Partial<UserProfile>,
  ) => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;
  vouchers: Voucher[];
  claimVoucher: (id: string) => void;
  orders: Order[];
  userOrders: Order[];
  currentOrderId: string | null;
  currentOrder: Order | null;
  setCurrentOrderId: (id: string | null) => void;
  placeOrder: (
    paymentMethod: "bkash" | "nagad" | "rocket" | "card" | "cod",
    address: DeliveryAddress,
    voucherDiscount?: number,
    coinDiscount?: number,
  ) => Order;
  cancelOrder: (orderId: string) => void;
  addresses: DeliveryAddress[];
  addAddress: (addr: Omit<DeliveryAddress, "id">) => void;
  activeLocation: { division: string; city: string };
  setActiveLocation: (loc: { division: string; city: string }) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  isMobileCategoryDrawerOpen: boolean;
  setIsMobileCategoryDrawerOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  t: (en: string, bn: string) => string;
}

const INITIAL_USER: UserProfile = {
  id: "usr-guest",
  name: "Guest User",
  phone: "",
  email: "",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
  coins: 0,
  memberTier: "Silver Member",
  joinDate: "2026",
  role: "customer",
  status: "active",
  token: "",
  totalOrders: 0,
  totalSpent: 0,
  addresses: [],
};

const INITIAL_ADDRESSES: DeliveryAddress[] = [];

const INITIAL_ORDERS: Order[] = [];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize route from current browser URL
  const initialRoute = parseRouteFromBrowserLocation();

  // Retrieve stored language, cart, wishlist, orders if available in localStorage
  const getStoredItem = <T,>(key: string, fallback: T): T => {
    if (typeof window === "undefined") return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const [language, setLanguageState] = useState<Language>(() =>
    getStoredItem<Language>("ash_lang", "EN"),
  );
  const [currentPage, setCurrentPage] = useState<PageView>(initialRoute.page);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    initialRoute.productId || null,
  );
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<
    string | null
  >(initialRoute.categorySlug || null);
  const [searchQuery, setSearchQuery] = useState<string>(
    initialRoute.searchQuery || "",
  );
  const [searchFilter, setSearchFilter] = useState<string | null>(
    initialRoute.searchFilter || null,
  );
  const [products, setProducts] = useState<Product[]>(() =>
    getStoredItem<Product[]>("ash_products", []),
  );
  const [banners, setBanners] = useState<Banner[]>(() => []);

  // Users state from Firestore
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() =>
    getStoredItem<UserProfile[]>("ash_all_users", []),
  );

  // Active Logged-in User and Token
  const [sessionToken, setSessionToken] = useState<string>(() =>
    getActiveSessionToken(),
  );
  const [user, setUser] = useState<UserProfile>(() => {
    const savedUser = getStoredItem<UserProfile | null>(
      "ash_active_user",
      null,
    );
    return savedUser || INITIAL_USER;
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return getStoredItem<boolean>("ash_is_logged_in", false);
  });

  // Token-controlled Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const activeTok = getActiveSessionToken();
    const tokenCart = loadCartByToken(activeTok);
    return tokenCart || [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const activeTok = getActiveSessionToken();
    const tokenWishlist = loadWishlistByToken(activeTok);
    if (tokenWishlist && tokenWishlist.length > 0) return tokenWishlist;
    return [];
  });

  const [vouchers, setVouchers] = useState<Voucher[]>(VOUCHERS_DATA);
  const [orders, setOrders] = useState<Order[]>(() =>
    getStoredItem<Order[]>("ash_orders", []),
  );
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(
    initialRoute.orderId || null,
  );
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(
    user.addresses && user.addresses.length > 0
      ? user.addresses
      : INITIAL_ADDRESSES,
  );
  const [activeLocation, setActiveLocation] = useState<{
    division: string;
    city: string;
  }>({
    division: "Dhaka",
    city: "Dhaka North - Gulshan",
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] =
    useState<boolean>(false);
  const [isMobileCategoryDrawerOpen, setIsMobileCategoryDrawerOpen] =
    useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Sync language with storage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("ash_lang", JSON.stringify(lang));
    } catch {}
  };

  // Real-time Firestore Subscriptions for Products, Orders, Banners, and Users
  useEffect(() => {
    const unsubProducts = subscribeToProducts((loadedProducts) => {
      if (loadedProducts && loadedProducts.length > 0) {
        setProducts(loadedProducts);
        try {
          localStorage.setItem("ash_products", JSON.stringify(loadedProducts));
        } catch {}
      }
    });

    const unsubOrders = subscribeToOrders((loadedOrders) => {
      if (loadedOrders && loadedOrders.length > 0) {
        setOrders(loadedOrders);
        try {
          localStorage.setItem("ash_orders", JSON.stringify(loadedOrders));
        } catch {}
      }
    });

    const unsubBanners = subscribeToBanners((loadedBanners) => {
      if (loadedBanners && loadedBanners.length > 0) {
        setBanners(loadedBanners);
      }
    });

    const unsubUsers = subscribeToUsers((loadedUsers) => {
      if (loadedUsers && loadedUsers.length > 0) {
        setAllUsers(loadedUsers);
        try {
          localStorage.setItem("ash_all_users", JSON.stringify(loadedUsers));
        } catch {}
        // If current user is in loadedUsers, sync details
        setUser((currentUser) => {
          const matched = loadedUsers.find((u) => u.id === currentUser.id);
          return matched ? { ...currentUser, ...matched } : currentUser;
        });
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubBanners();
      unsubUsers();
    };
  }, []);

  // Save Cart and Wishlist scoped to current session token
  useEffect(() => {
    if (sessionToken) {
      saveCartByToken(sessionToken, cart);
    }
  }, [cart, sessionToken]);

  useEffect(() => {
    if (sessionToken) {
      saveWishlistByToken(sessionToken, wishlist);
    }
  }, [wishlist, sessionToken]);

  // Sync user and auth state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("ash_active_user", JSON.stringify(user));
      localStorage.setItem("ash_is_logged_in", JSON.stringify(isLoggedIn));
    } catch {}
  }, [user, isLoggedIn]);
  useEffect(() => {
    try {
      localStorage.setItem("ash_orders", JSON.stringify(orders));
    } catch {}
  }, [orders]);

  // Filter orders for active user
  const userOrders = isLoggedIn
    ? orders.filter((o) => {
        const orderUserId = (o as any).userId;
        return (
          orderUserId === user.id || o.shippingAddress?.fullName === user.name
        );
      })
    : orders;

  // Keep state synced with router location changes
  useEffect(() => {
    const route = parseRouteFromBrowserLocation();
    setCurrentPage(route.page);
    if (route.productId !== undefined) setSelectedProductId(route.productId);
    if (route.categorySlug !== undefined)
      setSelectedCategorySlug(route.categorySlug);
    if (route.searchQuery !== undefined) setSearchQuery(route.searchQuery);
    if (route.searchFilter !== undefined) setSearchFilter(route.searchFilter);
    if (route.orderId !== undefined) setCurrentOrderId(route.orderId);
  }, [pathname, searchParams]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const t = (en: string, bn: string) => {
    return language === "BN" ? bn : en;
  };

  const navigate = (
    page: PageView,
    params?: {
      productId?: string;
      categorySlug?: string;
      searchQuery?: string;
      orderId?: string;
      filter?: string;
    },
  ) => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    const targetUrl = buildRouteUrl(page, params);

    if (params?.productId !== undefined) setSelectedProductId(params.productId);
    if (params?.categorySlug !== undefined)
      setSelectedCategorySlug(params.categorySlug);
    if (params?.searchQuery !== undefined) setSearchQuery(params.searchQuery);
    if (params?.orderId !== undefined) setCurrentOrderId(params.orderId);
    if (params?.filter !== undefined) setSearchFilter(params.filter);
    setCurrentPage(page);

    router.push(targetUrl);
  };

  const selectedProduct =
    products.find((p) => p.id === selectedProductId) || products[0] || null;
  const currentOrder =
    orders.find((o) => o.id === currentOrderId) || orders[0] || null;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variations: Record<string, string> = {},
    buyNow: boolean = false,
  ) => {
    const varKey = Object.entries(variations)
      .map(([k, v]) => `${k}:${v}`)
      .join("|");
    const lineId = `${product.id}-${varKey}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId
            ? { ...item, quantity: item.quantity + quantity, selected: true }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: lineId,
          productId: product.id,
          product,
          quantity,
          selectedVariations: variations,
          selected: true,
        },
      ];
    });

    showToast(
      language === "BN"
        ? `"${product.titleBn.substring(0, 24)}..." কার্টে যুক্ত হয়েছে!`
        : `Added "${product.title.substring(0, 24)}..." to cart!`,
    );

    if (buyNow) {
      navigate("checkout");
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast(
      language === "BN"
        ? "কার্ট থেকে মুছে ফেলা হয়েছে"
        : "Item removed from cart",
    );
  };

  const updateCartItemQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQty } : item,
      ),
    );
  };

  const toggleSelectCartItem = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, selected: !item.selected } : item,
      ),
    );
  };

  const selectAllCartItems = (select: boolean) => {
    setCart((prev) => prev.map((item) => ({ ...item, selected: select })));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast(
          language === "BN"
            ? "উইশলিস্ট থেকে সরানো হয়েছে"
            : "Removed from wishlist",
        );
        return prev.filter((id) => id !== productId);
      } else {
        showToast(
          language === "BN"
            ? "উইশলিস্টে যুক্ত হয়েছে ❤️"
            : "Added to wishlist ❤️",
        );
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  /**
   * User Sign In (Strict database credential verification via MySQL API)
   */
  const login = async (
    identifierOrData?: string | Partial<UserProfile>,
    password?: string,
  ): Promise<{ success: boolean; message?: string }> => {
    let targetUser: UserProfile | undefined;
    let userToken = "";

    if (typeof identifierOrData === "object") {
      // Direct login data passed
      targetUser = {
        ...INITIAL_USER,
        ...identifierOrData,
      };
      userToken = targetUser.token || `usr_tok_${targetUser.id}`;
    } else if (
      typeof identifierOrData === "string" &&
      identifierOrData.trim()
    ) {
      const cleanIdent = identifierOrData.trim();
      // Authenticate directly with MySQL database via API
      const res = await loginUserViaApi(cleanIdent, password);
      if (!res.success || !res.user) {
        showToast(
          res.message ||
            (language === "BN" ? "লগইন ব্যর্থ হয়েছে" : "Login failed"),
        );
        return {
          success: false,
          message: res.message || "Invalid credentials",
        };
      }
      targetUser = res.user;
      userToken = res.token || targetUser.token || `usr_tok_${targetUser.id}`;
    } else {
      return {
        success: false,
        message:
          language === "BN"
            ? "ফোন নম্বর অথবা ইমেইল দিন"
            : "Please enter phone or email",
      };
    }

    if (targetUser) {
      setUser(targetUser);
      setIsLoggedIn(true);
      setSessionToken(userToken);
      setUserSessionToken(userToken);

      // Load user-specific token cart & wishlist (merge current guest items if existing)
      const existingUserCart = loadCartByToken(userToken);
      if (existingUserCart && existingUserCart.length > 0) {
        setCart(existingUserCart);
      }
      const existingUserWishlist = loadWishlistByToken(userToken);
      if (existingUserWishlist && existingUserWishlist.length > 0) {
        setWishlist(existingUserWishlist);
      }

      setIsLoginModalOpen(false);
      showToast(
        language === "BN"
          ? `স্বাগতম, ${targetUser.name}!`
          : `Welcome back, ${targetUser.name}!`,
      );
      return { success: true };
    }

    return { success: false, message: "Login failed" };
  };

  /**
   * User Sign Up (Registers directly to MySQL database & assigns unique token)
   */
  const signup = async (userData: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await signupUserViaApi(userData);
      if (!res.success || !res.user) {
        showToast(
          res.message ||
            (language === "BN"
              ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে"
              : "Signup failed"),
        );
        return { success: false, message: res.message || "Signup failed" };
      }

      const newUser = res.user;
      const userToken = res.token || newUser.token || `usr_tok_${newUser.id}`;

      setUser(newUser);
      setIsLoggedIn(true);
      setSessionToken(userToken);
      setUserSessionToken(userToken);

      // Save current guest cart/wishlist into this user's token space
      saveCartByToken(userToken, cart);
      saveWishlistByToken(userToken, wishlist);

      setIsLoginModalOpen(false);
      showToast(
        language === "BN"
          ? "আশাল একাউন্ট সফলভাবে তৈরি হয়েছে! (+৫০০ কয়েন 🎉)"
          : "Account created successfully! (+500 Welcome Coins 🎉)",
      );
      return { success: true };
    } catch (err: any) {
      console.error("Signup error:", err);
      const errMsg =
        err?.message ||
        (language === "BN" ? "রেজিস্ট্রেশন ব্যর্থ হয়েছে" : "Signup failed");
      showToast(errMsg);
      return { success: false, message: errMsg };
    }
  };

  /**
   * User Log Out
   */
  const logout = () => {
    setIsLoggedIn(false);
    clearUserSessionToken();
    const guestTok = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSessionToken(guestTok);
    // Reset to initial or empty guest state
    setCart([]);
    setWishlist([]);
    showToast(
      language === "BN"
        ? "সফলভাবে লগআউট করা হয়েছে"
        : "Logged out successfully",
    );
  };

  /**
   * Add Coins to user balance
   */
  const addCoins = (amount: number) => {
    const newCoins = (user.coins || 0) + amount;
    updateUserProfile(user.id, { coins: newCoins });
  };

  /**
   * Update User Profile
   */
  const updateUserProfile = async (
    userId: string,
    data: Partial<UserProfile>,
  ) => {
    try {
      await saveUserToFirestore({ id: userId, ...data });
      if (user.id === userId) {
        setUser((prev) => ({ ...prev, ...data }));
      }
      showToast(
        language === "BN"
          ? "প্রোফাইল আপডেট সম্পন্ন হয়েছে"
          : "Profile updated successfully",
      );
    } catch (e) {
      console.error("Profile update error:", e);
    }
  };

  /**
   * Delete User Account (Admin action)
   */
  const deleteUserAccount = async (userId: string) => {
    try {
      await deleteUserFromFirestore(userId);
      setAllUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast(
        language === "BN"
          ? "ইউজার একাউন্ট মুছে ফেলা হয়েছে"
          : "User account removed",
      );
    } catch (e) {
      console.error("Delete user error:", e);
    }
  };

  const claimVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isClaimed: true } : v)),
    );
    showToast(
      language === "BN"
        ? "ভাউচার সংগ্রহ সম্পন্ন হয়েছে! 🎉"
        : "Voucher collected successfully! 🎉",
    );
  };

  const placeOrder = (
    paymentMethod: "bkash" | "nagad" | "rocket" | "card" | "cod",
    address: DeliveryAddress,
    voucherDiscount: number = 0,
    coinDiscount: number = 0,
  ): Order => {
    const selectedItems = cart.filter((i) => i.selected);
    const subtotal = selectedItems.reduce(
      (sum, i) => sum + i.product.price * i.quantity,
      0,
    );
    const shippingFee = selectedItems.some((i) => !i.product.isFreeDelivery)
      ? 60
      : 0;
    const total = Math.max(
      0,
      subtotal + shippingFee - voucherDiscount - coinDiscount,
    );

    const randomOrderNum =
      "68" + Math.floor(100000000 + Math.random() * 900000000);
    const trackingNum = "DEX-BD-" + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: randomOrderNum,
      createdAt: "Just now",
      items: [...selectedItems],
      shippingAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "PENDING" : "PAID",
      orderStatus: "PLACED",
      subtotal,
      shippingFee,
      voucherDiscount,
      coinDiscount,
      total,
      trackingNumber: trackingNum,
      courier: "Ashaal Express (DEX)",
      timeline: [
        {
          title: "Order Placed & Confirmed",
          titleBn: "অর্ডার সম্পন্ন ও নিশ্চিত হয়েছে",
          description: `Order #${randomOrderNum} placed with ${paymentMethod.toUpperCase()} payment`,
          descriptionBn: `অর্ডার গ্রহণ করা হয়েছে (${paymentMethod.toUpperCase()})`,
          timestamp: "Just now",
          completed: true,
          current: true,
        },
        {
          title: "Processing at Ashaal Fulfillment Hub",
          titleBn: "আশাল ফুলফিলমেন্ট সেন্টারে প্রস্তুত হচ্ছে",
          description: "Seller is packaging your goods for transit",
          descriptionBn: "সেলার পণ্য প্যাকেজিং করছেন",
          timestamp: "Expected within 12 hours",
          completed: false,
          current: false,
        },
        {
          title: "Handed to Ashaal Express Courier",
          titleBn: "আশাল এক্সপ্রেস কুরিয়ারে হস্তান্তর",
          description: "Dispatched to delivery hub near your location",
          descriptionBn: "নিকটস্থ ডেলিভারি হাবে পাঠানো হবে",
          timestamp: "Expected tomorrow",
          completed: false,
          current: false,
        },
        {
          title: "Delivered",
          titleBn: "ডেলিভারি সম্পন্ন",
          description: `To ${address.addressLine}, ${address.thana}`,
          descriptionBn: `${address.thana} ঠিকানায় পৌঁছে দেয়া হবে`,
          timestamp: "Expected in 2-3 business days",
          completed: false,
          current: false,
        },
      ],
    };

    // Attach user profile metadata
    (newOrder as any).userId = user.id;
    (newOrder as any).userEmail = user.email;

    // Remove ordered items from cart
    setCart((prev) => prev.filter((i) => !i.selected));
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrderId(newOrder.id);

    // Save to Firestore asynchronously
    saveOrderToFirestore(newOrder).catch((err) => {
      console.warn("Firestore order save notice:", err);
    });

    // Update user stats
    const updatedTotalOrders = (user.totalOrders || 0) + 1;
    const updatedTotalSpent = (user.totalSpent || 0) + total;
    const coinsEarned = Math.round(total * 0.05);
    const updatedCoins = Math.max(0, user.coins - coinDiscount) + coinsEarned;

    updateUserProfile(user.id, {
      totalOrders: updatedTotalOrders,
      totalSpent: updatedTotalSpent,
      coins: updatedCoins,
    });

    // Launch confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, orderStatus: "CANCELLED" } : o,
      ),
    );
    updateOrderStatusInFirestore(orderId, "CANCELLED").catch((err) => {
      console.warn("Firestore cancel order notice:", err);
    });
    showToast(
      language === "BN"
        ? "অর্ডার বাতিল করা হয়েছে"
        : "Order cancelled successfully",
    );
  };

  const addAddress = (addr: Omit<DeliveryAddress, "id">) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`,
    };
    const updatedAddrs = addr.isDefault
      ? [newAddr, ...addresses.map((a) => ({ ...a, isDefault: false }))]
      : [...addresses, newAddr];

    setAddresses(updatedAddrs);
    updateUserProfile(user.id, { addresses: updatedAddrs });
    showToast(
      language === "BN" ? "নতুন ঠিকানা যোগ হয়েছে" : "New address saved",
    );
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentPage,
        navigate,
        products,
        banners,
        selectedProductId,
        selectedProduct,
        selectedCategorySlug,
        searchQuery,
        setSearchQuery,
        searchFilter,
        setSearchFilter,
        cart,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        toggleSelectCartItem,
        selectAllCartItems,
        clearCart,
        wishlist,
        toggleWishlist,
        isWishlisted,
        user,
        allUsers,
        sessionToken,
        isLoggedIn,
        login,
        signup,
        logout,
        addCoins,
        updateUserProfile,
        deleteUserAccount,
        vouchers,
        claimVoucher,
        orders,
        userOrders,
        currentOrderId,
        currentOrder,
        setCurrentOrderId,
        placeOrder,
        cancelOrder,
        addresses,
        addAddress,
        activeLocation,
        setActiveLocation,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isLocationModalOpen,
        setIsLocationModalOpen,
        isMobileCategoryDrawerOpen,
        setIsMobileCategoryDrawerOpen,
        toast,
        showToast,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
