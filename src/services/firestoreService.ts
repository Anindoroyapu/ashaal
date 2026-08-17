import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Order, Banner, UserProfile } from '../types';
import { PRODUCTS_DATA } from '../data/productsData';
import { HERO_BANNERS } from '../data/bannersData';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const BANNERS_COLLECTION = 'banners';
const USERS_COLLECTION = 'users';

export const INITIAL_SEED_USERS: UserProfile[] = [
  {
    id: 'usr-tanvir-1',
    name: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    email: 'tanvir.ahmed@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    coins: 480,
    memberTier: 'Gold Member',
    joinDate: 'Jan 2023',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_tanvir_94821',
    totalOrders: 14,
    totalSpent: 28400,
    createdAt: '2023-01-15T10:00:00.000Z'
  },
  {
    id: 'usr-anindo-2',
    name: 'Anindo Roy',
    phone: '+880 1819-876543',
    email: 'anindo.roy@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    coins: 850,
    memberTier: 'Diamond Club',
    joinDate: 'Mar 2023',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_anindo_55102',
    totalOrders: 28,
    totalSpent: 64200,
    createdAt: '2023-03-20T14:30:00.000Z'
  },
  {
    id: 'usr-sadia-3',
    name: 'Sadia Islam',
    phone: '+880 1911-223344',
    email: 'sadia.islam@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    coins: 210,
    memberTier: 'Silver Member',
    joinDate: 'Aug 2024',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_sadia_88301',
    totalOrders: 5,
    totalSpent: 9800,
    createdAt: '2024-08-10T09:15:00.000Z'
  },
  {
    id: 'usr-rafiq-4',
    name: 'Rafiqul Hasan',
    phone: '+880 1622-998877',
    email: 'rafiqul.hasan@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    coins: 120,
    memberTier: 'Silver Member',
    joinDate: 'Nov 2024',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_rafiq_47291',
    totalOrders: 3,
    totalSpent: 4500,
    createdAt: '2024-11-05T16:45:00.000Z'
  }
];

/**
 * Real-time listener for Products collection in Firestore
 */
export function subscribeToProducts(onProductsChange: (products: Product[]) => void) {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const q = query(productsRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Product[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Product;
            items.push({
              ...data,
              id: docSnap.id
            });
          });
          onProductsChange(items);
        } else {
          // If Firestore is empty, we trigger initial seeding
          seedInitialProducts().then(() => {
            onProductsChange(PRODUCTS_DATA);
          });
        }
      },
      (error) => {
        console.warn('Firestore products subscribe notice:', error);
        onProductsChange(PRODUCTS_DATA);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore products error, fallback to static:', err);
    onProductsChange(PRODUCTS_DATA);
    return () => {};
  }
}

/**
 * Seed initial sample products to Firestore if empty
 */
export async function seedInitialProducts(force: boolean = false) {
  try {
    const productsRef = collection(db, PRODUCTS_COLLECTION);
    const snapshot = await getDocs(productsRef);
    if (snapshot.empty || force) {
      const promises = PRODUCTS_DATA.map((product) => {
        const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
        return setDoc(docRef, {
          ...product,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      await Promise.all(promises);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not seed initial products to Firestore:', error);
    return false;
  }
}

/**
 * Add or update product in Firestore
 */
export async function saveProductToFirestore(product: Partial<Product> & { id?: string }): Promise<string> {
  const productId = product.id || `prod-${Date.now()}`;
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);

  const productData: Product = {
    id: productId,
    title: product.title || 'New Product',
    titleBn: product.titleBn || product.title || 'নতুন পণ্য',
    slug: product.slug || (product.title || 'product').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    brand: product.brand || 'Ashaal',
    category: product.category || 'Electronic Devices',
    categorySlug: product.categorySlug || 'electronic-devices',
    subCategory: product.subCategory || 'general',
    price: Number(product.price) || 0,
    originalPrice: Number(product.originalPrice) || Number(product.price) || 0,
    discountPercentage: product.originalPrice && product.price && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : Number(product.discountPercentage) || 0,
    rating: Number(product.rating) || 5.0,
    reviewsCount: Number(product.reviewsCount) || 1,
    questionsCount: Number(product.questionsCount) || 0,
    soldCount: Number(product.soldCount) || 0,
    inStock: Number(product.inStock) ?? 50,
    isDarazMall: Boolean(product.isDarazMall),
    isFreeDelivery: Boolean(product.isFreeDelivery),
    isFlashSale: Boolean(product.isFlashSale),
    flashSaleEndTime: product.flashSaleEndTime || '12h 00m 00s',
    coinsCashback: Number(product.coinsCashback) || 50,
    mainImage: product.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    images: product.images && product.images.length > 0
      ? product.images
      : [product.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80'],
    description: product.description || ['High quality authentic product on Ashaal.'],
    descriptionBn: product.descriptionBn || ['আশাল এ সেরা মানের আসল পণ্য।'],
    specifications: product.specifications || { Warranty: '1 Year Brand Warranty', Origin: 'Genuine Import' },
    seller: product.seller || {
      id: 'seller-official',
      name: 'Ashaal Official Flagship Store',
      isOfficial: true,
      rating: 98,
      shipOnTime: 99,
      chatResponse: 97,
      joinedYears: 3,
      location: 'Dhaka'
    },
    warranty: product.warranty || '100% Authentic Brand Warranty',
    returnPolicy: product.returnPolicy || '14 Days Easy Free Return',
    deliveryFee: product.isFreeDelivery ? 0 : (product.deliveryFee ?? 60),
    estimatedDeliveryDays: product.estimatedDeliveryDays || '2-4 Days'
  };

  await setDoc(docRef, productData, { merge: true });
  return productId;
}

/**
 * Delete product from Firestore
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const docRef = doc(db, PRODUCTS_COLLECTION, productId);
  await deleteDoc(docRef);
}

/**
 * Real-time listener for Orders collection in Firestore
 */
export function subscribeToOrders(onOrdersChange: (orders: Order[]) => void) {
  try {
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            items.push({
              ...data,
              id: docSnap.id
            });
          });
          onOrdersChange(items);
        } else {
          onOrdersChange([]);
        }
      },
      (error) => {
        console.warn('Firestore orders subscription notice:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore orders error:', err);
    return () => {};
  }
}

/**
 * Save Order to Firestore (Called upon user checkout)
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    await setDoc(docRef, {
      ...order,
      createdAt: order.createdAt || new Date().toLocaleString('en-US')
    });
  } catch (err) {
    console.error('Error saving order to Firestore:', err);
  }
}

/**
 * Update order status (Admin operation)
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: Order['orderStatus'],
  timelineUpdate?: any
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updates: Record<string, any> = {
      orderStatus: newStatus
    };
    if (timelineUpdate) {
      updates.timeline = timelineUpdate;
    }
    await updateDoc(docRef, updates);
  } catch (err) {
    console.error('Error updating order in Firestore:', err);
  }
}

/**
 * Delete Order (Admin operation)
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  await deleteDoc(docRef);
}

/**
 * Real-time listener for Banners in Firestore
 */
export function subscribeToBanners(onBannersChange: (banners: Banner[]) => void) {
  try {
    const bannersRef = collection(db, BANNERS_COLLECTION);
    const unsubscribe = onSnapshot(
      bannersRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: Banner[] = [];
          snapshot.forEach((docSnap) => {
            items.push({
              ...(docSnap.data() as Banner),
              id: docSnap.id
            });
          });
          onBannersChange(items);
        } else {
          // seed initial banners
          seedInitialBanners().then(() => onBannersChange(HERO_BANNERS));
        }
      },
      (error) => {
        console.warn('Firestore banners notice:', error);
        onBannersChange(HERO_BANNERS);
      }
    );
    return unsubscribe;
  } catch {
    onBannersChange(HERO_BANNERS);
    return () => {};
  }
}

export async function seedInitialBanners() {
  try {
    const bannersRef = collection(db, BANNERS_COLLECTION);
    const snapshot = await getDocs(bannersRef);
    if (snapshot.empty) {
      const promises = HERO_BANNERS.map((b) => {
        const docRef = doc(db, BANNERS_COLLECTION, b.id);
        return setDoc(docRef, b);
      });
      await Promise.all(promises);
    }
  } catch (e) {
    console.warn('Banners seed notice:', e);
  }
}

export async function saveBannerToFirestore(banner: Banner): Promise<void> {
  const bannerId = banner.id || `b-${Date.now()}`;
  const docRef = doc(db, BANNERS_COLLECTION, bannerId);
  await setDoc(docRef, { ...banner, id: bannerId }, { merge: true });
}

export async function deleteBannerFromFirestore(bannerId: string): Promise<void> {
  const docRef = doc(db, BANNERS_COLLECTION, bannerId);
  await deleteDoc(docRef);
}

/**
 * ============================================================================
 * USERS & AUTHENTICATION FIRESTORE INTEGRATION
 * ============================================================================
 */

/**
 * Real-time listener for Users collection in Firestore
 */
export function subscribeToUsers(onUsersChange: (users: UserProfile[]) => void) {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const items: UserProfile[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as UserProfile;
            items.push({
              ...data,
              id: docSnap.id
            });
          });
          onUsersChange(items);
        } else {
          // If Firestore is empty, seed initial users
          seedInitialUsers().then(() => {
            onUsersChange(INITIAL_SEED_USERS);
          });
        }
      },
      (error) => {
        console.warn('Firestore users subscribe notice:', error);
        onUsersChange(INITIAL_SEED_USERS);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Firestore users error, fallback to static:', err);
    onUsersChange(INITIAL_SEED_USERS);
    return () => {};
  }
}

/**
 * Seed initial sample users to Firestore
 */
export async function seedInitialUsers(force: boolean = false) {
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);
    if (snapshot.empty || force) {
      const promises = INITIAL_SEED_USERS.map((usr) => {
        const docRef = doc(db, USERS_COLLECTION, usr.id);
        return setDoc(docRef, {
          ...usr,
          createdAt: usr.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      await Promise.all(promises);
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not seed initial users to Firestore:', error);
    return false;
  }
}

/**
 * Add or update User profile in Firestore
 */
export async function saveUserToFirestore(user: Partial<UserProfile> & { id?: string }): Promise<string> {
  const userId = user.id || `usr-${Date.now()}`;
  const docRef = doc(db, USERS_COLLECTION, userId);

  const cleanUserData: UserProfile = {
    id: userId,
    name: user.name || 'Anonymous User',
    phone: user.phone || '+880 1700-000000',
    email: user.email || `${userId}@example.com`,
    password: user.password || 'password123',
    avatar: user.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80`,
    coins: Number(user.coins) ?? 200,
    memberTier: user.memberTier || 'Silver Member',
    joinDate: user.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    role: user.role || 'customer',
    status: user.status || 'active',
    token: user.token || `usr_tok_${userId}_${Math.random().toString(36).substring(2, 9)}`,
    totalOrders: Number(user.totalOrders) || 0,
    totalSpent: Number(user.totalSpent) || 0,
    addresses: user.addresses || [],
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await setDoc(docRef, cleanUserData, { merge: true });
  return userId;
}

/**
 * Delete user from Firestore
 */
export async function deleteUserFromFirestore(userId: string): Promise<void> {
  const docRef = doc(db, USERS_COLLECTION, userId);
  await deleteDoc(docRef);
}

/**
 * ============================================================================
 * LOCAL STORAGE TOKEN-BASED CART & FAVORITES HANDLERS
 * ============================================================================
 */

const TOKEN_KEY = 'ash_user_token';
const GUEST_TOKEN_KEY = 'ash_guest_token';

/**
 * Get or create current active token (User token or Guest token)
 */
export function getActiveSessionToken(customToken?: string | null): string {
  if (typeof window === 'undefined') return 'guest_default';
  
  if (customToken) {
    try {
      localStorage.setItem(TOKEN_KEY, customToken);
    } catch {}
    return customToken;
  }

  try {
    const savedUserToken = localStorage.getItem(TOKEN_KEY);
    if (savedUserToken) return savedUserToken;

    let guestTok = localStorage.getItem(GUEST_TOKEN_KEY);
    if (!guestTok) {
      guestTok = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      localStorage.setItem(GUEST_TOKEN_KEY, guestTok);
    }
    return guestTok;
  } catch {
    return 'guest_fallback';
  }
}

/**
 * Set user authentication token upon signin/signup
 */
export function setUserSessionToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

/**
 * Clear user token on logout
 */
export function clearUserSessionToken() {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

/**
 * Load token-controlled Cart from localStorage
 */
export function loadCartByToken(token: string) {
  if (typeof window === 'undefined') return [];
  try {
    const key = `ash_cart_tok_${token}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save token-controlled Cart to localStorage
 */
export function saveCartByToken(token: string, cartItems: any[]) {
  if (typeof window === 'undefined') return;
  try {
    const key = `ash_cart_tok_${token}`;
    localStorage.setItem(key, JSON.stringify(cartItems));
  } catch {}
}

/**
 * Load token-controlled Wishlist/Favorites from localStorage
 */
export function loadWishlistByToken(token: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const key = `ash_wishlist_tok_${token}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Save token-controlled Wishlist/Favorites to localStorage
 */
export function saveWishlistByToken(token: string, wishlistIds: string[]) {
  if (typeof window === 'undefined') return;
  try {
    const key = `ash_wishlist_tok_${token}`;
    localStorage.setItem(key, JSON.stringify(wishlistIds));
  } catch {}
}

