import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Voucher, DeliveryAddress, Order, PageView, Language } from '../types';
import { PRODUCTS_DATA } from '../data/productsData';
import { VOUCHERS_DATA } from '../data/bannersData';
import confetti from 'canvas-confetti';

interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  coins: number;
  memberTier: 'Silver Member' | 'Gold Member' | 'Diamond Club';
  joinDate: string;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currentPage: PageView;
  navigate: (page: PageView, params?: { productId?: string; categorySlug?: string; searchQuery?: string; orderId?: string; filter?: string }) => void;
  selectedProductId: string | null;
  selectedProduct: Product | null;
  selectedCategorySlug: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  searchFilter: string | null;
  setSearchFilter: (f: string | null) => void;
  cart: CartItem[];
  cartCount: number;
  addToCart: (product: Product, quantity?: number, variations?: Record<string, string>, buyNow?: boolean) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartItemQuantity: (cartItemId: string, newQty: number) => void;
  toggleSelectCartItem: (cartItemId: string) => void;
  selectAllCartItems: (select: boolean) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  user: UserProfile;
  isLoggedIn: boolean;
  login: (data?: Partial<UserProfile>) => void;
  logout: () => void;
  vouchers: Voucher[];
  claimVoucher: (id: string) => void;
  orders: Order[];
  currentOrderId: string | null;
  setCurrentOrderId: (id: string | null) => void;
  placeOrder: (paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod', address: DeliveryAddress, voucherDiscount?: number, coinDiscount?: number) => Order;
  cancelOrder: (orderId: string) => void;
  addresses: DeliveryAddress[];
  addAddress: (addr: Omit<DeliveryAddress, 'id'>) => void;
  activeLocation: { division: string; city: string };
  setActiveLocation: (loc: { division: string; city: string }) => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isLocationModalOpen: boolean;
  setIsLocationModalOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (msg: string) => void;
  t: (en: string, bn: string) => string;
}

const INITIAL_USER: UserProfile = {
  id: 'usr-daraz-1',
  name: 'Anindo Roy',
  phone: '+880 1712-345678',
  email: 'anindo.roy@example.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
  coins: 480,
  memberTier: 'Gold Member',
  joinDate: 'Jan 2023'
};

const INITIAL_ADDRESSES: DeliveryAddress[] = [
  {
    id: 'addr-1',
    fullName: 'Anindo Roy',
    phone: '+880 1712-345678',
    division: 'Dhaka',
    district: 'Dhaka North',
    thana: 'Gulshan-2',
    addressLine: 'House #45, Road #11, Block D, Gulshan-2',
    landmark: 'Near Pink City Shopping Mall',
    label: 'HOME',
    isDefault: true
  },
  {
    id: 'addr-2',
    fullName: 'Anindo Roy',
    phone: '+880 1712-345678',
    division: 'Dhaka',
    district: 'Dhaka South',
    thana: 'Dhanmondi',
    addressLine: 'Suite 402, Level 4, Concord Tower, Road 27, Dhanmondi',
    landmark: 'Opposite Rapa Plaza',
    label: 'OFFICE',
    isDefault: false
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-bd-98421',
    orderNumber: '68294721901',
    createdAt: 'Yesterday at 04:30 PM',
    items: [
      {
        id: 'cart-init-1',
        productId: 'prod-2',
        product: PRODUCTS_DATA[1],
        quantity: 1,
        selectedVariations: { Color: 'Black' },
        selected: true
      },
      {
        id: 'cart-init-2',
        productId: 'prod-9',
        product: PRODUCTS_DATA[8],
        quantity: 1,
        selectedVariations: {},
        selected: true
      }
    ],
    shippingAddress: INITIAL_ADDRESSES[0],
    paymentMethod: 'bkash',
    paymentStatus: 'PAID',
    orderStatus: 'SHIPPED',
    subtotal: 2940,
    shippingFee: 0,
    voucherDiscount: 100,
    coinDiscount: 40,
    total: 2800,
    trackingNumber: 'DEX-BD-948201',
    courier: 'Ashaal Express (DEX)',
    timeline: [
      {
        title: 'Order Placed & Verified',
        titleBn: 'অর্ডার গ্রহণ এবং নিশ্চিত করা হয়েছে',
        description: 'Payment via bKash verified (TrxID: 8N2K90L4)',
        descriptionBn: 'বিকাশ পেমেন্ট ভেরিফাইড হয়েছে',
        timestamp: '14 Aug 2026, 04:30 PM',
        completed: true,
        current: false
      },
      {
        title: 'Package Processed by Ashaal Hub',
        titleBn: 'আশাল হাব থেকে প্যাকেট প্রস্তুত',
        description: 'Packed with bubble wrap & handed over to DEX sorting facility',
        descriptionBn: 'আশাল তেজগাঁও সেন্টারে পাঠানো হয়েছে',
        timestamp: '15 Aug 2026, 09:15 AM',
        completed: true,
        current: false
      },
      {
        title: 'In Transit - Out for Delivery Soon',
        titleBn: 'ডেলিভারির জন্য পাঠানো হয়েছে',
        description: 'Package arrived at Gulshan Distribution Station. Rider assigned.',
        descriptionBn: 'গুলশান হাব থেকে রাইডার ডেলিভারি করছে',
        timestamp: 'Today, 10:45 AM',
        completed: true,
        current: true
      },
      {
        title: 'Delivered',
        titleBn: 'ডেলিভারি সম্পন্ন',
        description: 'Will be delivered to House #45, Road #11, Gulshan-2',
        descriptionBn: 'গ্রাহকের ঠিকানায় পৌঁছে দেয়া হবে',
        timestamp: 'Expected today by 06:00 PM',
        completed: false,
        current: false
      }
    ]
  }
];

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchFilter, setSearchFilter] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'cart-item-default-1',
      productId: 'prod-1',
      product: PRODUCTS_DATA[0],
      quantity: 1,
      selectedVariations: { Color: 'Midnight Black', Storage: '8GB/256GB' },
      selected: true
    }
  ]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3']);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [vouchers, setVouchers] = useState<Voucher[]>(VOUCHERS_DATA);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>('ord-bd-98421');
  const [addresses, setAddresses] = useState<DeliveryAddress[]>(INITIAL_ADDRESSES);
  const [activeLocation, setActiveLocation] = useState<{ division: string; city: string }>({
    division: 'Dhaka',
    city: 'Dhaka North - Gulshan'
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  const t = (en: string, bn: string) => {
    return language === 'BN' ? bn : en;
  };

  const navigate = (
    page: PageView,
    params?: { productId?: string; categorySlug?: string; searchQuery?: string; orderId?: string; filter?: string }
  ) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (params?.productId) setSelectedProductId(params.productId);
    if (params?.categorySlug !== undefined) setSelectedCategorySlug(params.categorySlug);
    if (params?.searchQuery !== undefined) setSearchQuery(params.searchQuery);
    if (params?.orderId) setCurrentOrderId(params.orderId);
    if (params?.filter !== undefined) setSearchFilter(params.filter);
    setCurrentPage(page);
  };

  const selectedProduct = PRODUCTS_DATA.find((p) => p.id === selectedProductId) || null;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    variations: Record<string, string> = {},
    buyNow: boolean = false
  ) => {
    const varKey = Object.entries(variations)
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    const lineId = `${product.id}-${varKey}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === lineId);
      if (existing) {
        return prev.map((item) =>
          item.id === lineId ? { ...item, quantity: item.quantity + quantity, selected: true } : item
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
          selected: true
        }
      ];
    });

    showToast(
      language === 'BN'
        ? `"${product.titleBn.substring(0, 24)}..." কার্টে যুক্ত হয়েছে!`
        : `Added "${product.title.substring(0, 24)}..." to cart!`
    );

    if (buyNow) {
      navigate('checkout');
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast(language === 'BN' ? 'কার্ট থেকে মুছে ফেলা হয়েছে' : 'Item removed from cart');
  };

  const updateCartItemQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const toggleSelectCartItem = (cartItemId: string) => {
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, selected: !item.selected } : item))
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
        showToast(language === 'BN' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast(language === 'BN' ? 'উইশলিস্টে যুক্ত হয়েছে ❤️' : 'Added to wishlist ❤️');
        return [...prev, productId];
      }
    });
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const login = (data?: Partial<UserProfile>) => {
    setIsLoggedIn(true);
    if (data) {
      setUser((prev) => ({ ...prev, ...data }));
    }
    setIsLoginModalOpen(false);
    showToast(language === 'BN' ? 'সফলভাবে লগইন করেছেন!' : 'Logged in successfully!');
  };

  const logout = () => {
    setIsLoggedIn(false);
    showToast(language === 'BN' ? 'লগআউট করা হয়েছে' : 'Logged out');
  };

  const claimVoucher = (id: string) => {
    setVouchers((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isClaimed: true } : v))
    );
    showToast(language === 'BN' ? 'ভাউচার সংগ্রহ সম্পন্ন হয়েছে! 🎉' : 'Voucher collected successfully! 🎉');
  };

  const placeOrder = (
    paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'cod',
    address: DeliveryAddress,
    voucherDiscount: number = 0,
    coinDiscount: number = 0
  ): Order => {
    const selectedItems = cart.filter((i) => i.selected);
    const subtotal = selectedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    const shippingFee = selectedItems.some((i) => !i.product.isFreeDelivery) ? 60 : 0;
    const total = Math.max(0, subtotal + shippingFee - voucherDiscount - coinDiscount);

    const randomOrderNum = '68' + Math.floor(100000000 + Math.random() * 900000000);
    const trackingNum = 'DEX-BD-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: randomOrderNum,
      createdAt: 'Just now',
      items: [...selectedItems],
      shippingAddress: address,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'PENDING' : 'PAID',
      orderStatus: 'PLACED',
      subtotal,
      shippingFee,
      voucherDiscount,
      coinDiscount,
      total,
      trackingNumber: trackingNum,
      courier: 'Ashaal Express (DEX)',
      timeline: [
        {
          title: 'Order Placed & Confirmed',
          titleBn: 'অর্ডার সম্পন্ন ও নিশ্চিত হয়েছে',
          description: `Order #${randomOrderNum} placed with ${paymentMethod.toUpperCase()} payment`,
          descriptionBn: `অর্ডার গ্রহণ করা হয়েছে (${paymentMethod.toUpperCase()})`,
          timestamp: 'Just now',
          completed: true,
          current: true
        },
        {
          title: 'Processing at Ashaal Fulfillment Hub',
          titleBn: 'আশাল ফুলফিলমেন্ট সেন্টারে প্রস্তুত হচ্ছে',
          description: 'Seller is packaging your goods for transit',
          descriptionBn: 'সেলার পণ্য প্যাকেজিং করছেন',
          timestamp: 'Expected within 12 hours',
          completed: false,
          current: false
        },
        {
          title: 'Handed to Ashaal Express Courier',
          titleBn: 'আশাল এক্সপ্রেস কুরিয়ারে হস্তান্তর',
          description: 'Dispatched to delivery hub near your location',
          descriptionBn: 'নিকটস্থ ডেলিভারি হাবে পাঠানো হবে',
          timestamp: 'Expected tomorrow',
          completed: false,
          current: false
        },
        {
          title: 'Delivered',
          titleBn: 'ডেলিভারি সম্পন্ন',
          description: `To ${address.addressLine}, ${address.thana}`,
          descriptionBn: `${address.thana} ঠিকানায় পৌঁছে দেয়া হবে`,
          timestamp: 'Expected in 2-3 business days',
          completed: false,
          current: false
        }
      ]
    };

    // Remove ordered items from cart
    setCart((prev) => prev.filter((i) => !i.selected));
    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrderId(newOrder.id);

    // Deduct coins if used
    if (coinDiscount > 0) {
      setUser((prev) => ({ ...prev, coins: Math.max(0, prev.coins - coinDiscount) }));
    }

    // Launch confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore in test
    }

    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: 'CANCELLED' } : o))
    );
    showToast(language === 'BN' ? 'অর্ডার বাতিল করা হয়েছে' : 'Order cancelled successfully');
  };

  const addAddress = (addr: Omit<DeliveryAddress, 'id'>) => {
    const newAddr: DeliveryAddress = {
      ...addr,
      id: `addr-${Date.now()}`
    };
    setAddresses((prev) => (addr.isDefault ? [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))] : [...prev, newAddr]));
    showToast(language === 'BN' ? 'নতুন ঠিকানা যোগ হয়েছে' : 'New address saved');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currentPage,
        navigate,
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
        isLoggedIn,
        login,
        logout,
        vouchers,
        claimVoucher,
        orders,
        currentOrderId,
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
        toast,
        showToast,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
