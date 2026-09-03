import { Product, Order, Banner, UserProfile } from '../types';



const BASE_API_URL = typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:3000/api';

/**
 * Generic API helper
 */
async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${BASE_API_URL}/${endpoint.replace(/^\//, '')}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    }
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

export const INITIAL_SEED_USERS: UserProfile[] = [];

// Simple event bus for immediate UI updates on mutations
const listeners = {
  products: new Set<(products: Product[]) => void>(),
  orders: new Set<(orders: Order[]) => void>(),
  banners: new Set<(banners: Banner[]) => void>(),
  users: new Set<(users: UserProfile[]) => void>()
};

// ==========================================
// 1. PRODUCTS (MySQL REST API)
// ==========================================

export async function fetchProducts(): Promise<Product[]> {
  try {
    const data = await apiRequest<{ success: boolean; products: Product[] }>('products');
    return data.products || [];
  } catch (err) {
    console.warn('API fetchProducts error, fallback to static:', err);
    return [];
  }
}

/**
 * Real-time listener & polling for Products from MySQL
 */
export function subscribeToProducts(onProductsChange: (products: Product[]) => void) {
  listeners.products.add(onProductsChange);

  // Initial fetch
  fetchProducts().then((prods) => {
    if (prods && prods.length > 0) {
      onProductsChange(prods);
    } else {
      onProductsChange([]);
    }
  });

  // Polling every 10 seconds to keep fresh across multi-window/admin updates
  const interval = setInterval(() => {
    fetchProducts().then((prods) => {
      if (prods && prods.length > 0) {
        onProductsChange(prods);
      }
    });
  }, 10000);

  return () => {
    listeners.products.delete(onProductsChange);
    clearInterval(interval);
  };
}

/**
 * Seed initial sample products to MySQL
 */
export async function seedInitialProducts(force: boolean = false): Promise<boolean> {
  try {
    await apiRequest('seed', { method: 'POST' });
    const fresh = await fetchProducts();
    listeners.products.forEach((fn) => fn(fresh));
    return true;
  } catch (error) {
    console.warn('Could not seed initial products to MySQL:', error);
    return false;
  }
}

/**
 * Add or update product in MySQL
 */
export async function saveProductToFirestore(product: Partial<Product> & { id?: string }): Promise<string> {
  const data = await apiRequest<{ success: boolean; product: Product }>('products', {
    method: 'POST',
    body: JSON.stringify(product)
  });

  // Refresh products list for all listeners
  fetchProducts().then((prods) => {
    listeners.products.forEach((fn) => fn(prods));
  });

  return data.product?.id || product.id || `prod-${Date.now()}`;
}

/**
 * Delete product from MySQL
 */
export async function deleteProductFromFirestore(productId: string): Promise<void> {
  await apiRequest(`products/${productId}`, { method: 'DELETE' });

  // Refresh products list
  fetchProducts().then((prods) => {
    listeners.products.forEach((fn) => fn(prods));
  });
}

// ==========================================
// 2. ORDERS (MySQL REST API)
// ==========================================

export async function fetchOrders(): Promise<Order[]> {
  try {
    const data = await apiRequest<{ success: boolean; orders: Order[] }>('orders');
    return data.orders || [];
  } catch (err) {
    console.warn('API fetchOrders error:', err);
    return [];
  }
}

/**
 * Real-time listener & polling for Orders from MySQL
 */
export function subscribeToOrders(onOrdersChange: (orders: Order[]) => void) {
  listeners.orders.add(onOrdersChange);

  fetchOrders().then((ords) => onOrdersChange(ords));

  const interval = setInterval(() => {
    fetchOrders().then((ords) => onOrdersChange(ords));
  }, 8000);

  return () => {
    listeners.orders.delete(onOrdersChange);
    clearInterval(interval);
  };
}

/**
 * Save Order to MySQL
 */
export async function saveOrderToFirestore(order: Order): Promise<void> {
  await apiRequest('orders', {
    method: 'POST',
    body: JSON.stringify(order)
  });

  fetchOrders().then((ords) => {
    listeners.orders.forEach((fn) => fn(ords));
  });
}

/**
 * Update order status (Admin / System operation)
 */
export async function updateOrderStatusInFirestore(
  orderId: string,
  newStatus: Order['orderStatus'],
  timelineUpdate?: any
): Promise<void> {
  await apiRequest(`orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify({
      orderStatus: newStatus,
      timeline: timelineUpdate
    })
  });

  fetchOrders().then((ords) => {
    listeners.orders.forEach((fn) => fn(ords));
  });
}

/**
 * Update comprehensive Order Details in MySQL (Status, Payment, Tracking, Courier, Timeline, Address)
 */
export async function updateOrderDetailsInFirestore(
  orderId: string,
  updateData: {
    orderStatus?: Order['orderStatus'];
    paymentStatus?: Order['paymentStatus'];
    trackingNumber?: string;
    courier?: string;
    timeline?: any;
    shippingAddress?: any;
  }
): Promise<void> {
  await apiRequest(`orders/${orderId}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  });

  fetchOrders().then((ords) => {
    listeners.orders.forEach((fn) => fn(ords));
  });
}

/**
 * Delete Order from MySQL
 */
export async function deleteOrderFromFirestore(orderId: string): Promise<void> {
  await apiRequest(`orders/${orderId}`, { method: 'DELETE' });

  fetchOrders().then((ords) => {
    listeners.orders.forEach((fn) => fn(ords));
  });
}

// ==========================================
// 3. BANNERS (MySQL REST API)
// ==========================================

export async function fetchBanners(): Promise<Banner[]> {
  try {
    const data = await apiRequest<{ success: boolean; banners: Banner[] }>('banners');
    return data.banners || [];
  } catch (err) {
    console.warn('API fetchBanners error:', err);
    return [];
  }
}

export function subscribeToBanners(onBannersChange: (banners: Banner[]) => void) {
  listeners.banners.add(onBannersChange);

  fetchBanners().then((b) => {
    if (b && b.length > 0) onBannersChange(b);
    else onBannersChange([]);
  });

  const interval = setInterval(() => {
    fetchBanners().then((b) => {
      if (b && b.length > 0) onBannersChange(b);
    });
  }, 15000);

  return () => {
    listeners.banners.delete(onBannersChange);
    clearInterval(interval);
  };
}

export async function seedInitialBanners(): Promise<void> {
  try {
    await apiRequest('seed', { method: 'POST' });
  } catch (e) {
    console.warn('Banners seed notice:', e);
  }
}

export async function saveBannerToFirestore(banner: Banner): Promise<void> {
  await apiRequest('banners', {
    method: 'POST',
    body: JSON.stringify(banner)
  });

  fetchBanners().then((b) => {
    listeners.banners.forEach((fn) => fn(b));
  });
}

export async function deleteBannerFromFirestore(bannerId: string): Promise<void> {
  await apiRequest(`banners/${bannerId}`, { method: 'DELETE' });

  fetchBanners().then((b) => {
    listeners.banners.forEach((fn) => fn(b));
  });
}

// ==========================================
// 4. USERS (MySQL REST API)
// ==========================================

export async function fetchUsers(): Promise<UserProfile[]> {
  try {
    const data = await apiRequest<{ success: boolean; users: UserProfile[] }>('users');
    return data.users || [];
  } catch (err) {
    console.warn('API fetchUsers error:', err);
    return [];
  }
}

export function subscribeToUsers(onUsersChange: (users: UserProfile[]) => void) {
  listeners.users.add(onUsersChange);

  fetchUsers().then((u) => {
    if (u && u.length > 0) onUsersChange(u);
    else onUsersChange([]);
  });

  const interval = setInterval(() => {
    fetchUsers().then((u) => {
      if (u && u.length > 0) onUsersChange(u);
    });
  }, 10000);

  return () => {
    listeners.users.delete(onUsersChange);
    clearInterval(interval);
  };
}

export async function seedInitialUsers(force: boolean = false): Promise<boolean> {
  try {
    await apiRequest('seed', { method: 'POST' });
    const fresh = await fetchUsers();
    listeners.users.forEach((fn) => fn(fresh));
    return true;
  } catch (error) {
    console.warn('Could not seed initial users to MySQL:', error);
    return false;
  }
}

export async function saveUserToFirestore(user: Partial<UserProfile> & { id?: string }): Promise<string> {
  const userId = user.id || `usr-${Date.now()}`;
  if (user.id) {
    await apiRequest(`users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user)
    });
  } else {
    await apiRequest('users', {
      method: 'POST',
      body: JSON.stringify(user)
    });
  }

  fetchUsers().then((u) => {
    listeners.users.forEach((fn) => fn(u));
  });

  return userId;
}

export async function deleteUserFromFirestore(userId: string): Promise<void> {
  await apiRequest(`users/${userId}`, { method: 'DELETE' });

  fetchUsers().then((u) => {
    listeners.users.forEach((fn) => fn(u));
  });
}

// ==========================================
// 5. VISITORS API
// ==========================================

export async function fetchVisitors(): Promise<any[]> {
  try {
    const data = await apiRequest<{ success: boolean; visitors: any[] }>('visitors');
    return data.visitors || [];
  } catch (err) {
    return [];
  }
}

export async function logVisitor(logData: { ip?: string; name?: string; phone?: string; location?: string; page?: string; platform?: string; time?: string }) {
  try {
    await apiRequest('visitors', {
      method: 'POST',
      body: JSON.stringify(logData)
    });
  } catch {
    // Ignore logging errors
  }
}

// ==========================================
// 6. LOCAL STORAGE TOKEN-BASED CART & FAVORITES
// ==========================================

const TOKEN_KEY = 'ash_user_token';
const GUEST_TOKEN_KEY = 'ash_guest_token';
const GENERAL_CART_KEY = 'ash_cart';
const GENERAL_WISHLIST_KEY = 'ash_wishlist';

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
export function loadCartByToken(token: string): any[] {
  if (typeof window === 'undefined') return [];
  try {
    // Check token-specific key first
    const key = `ash_cart_tok_${token}`;
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    // Fallback to general cart key
    const generalRaw = localStorage.getItem(GENERAL_CART_KEY);
    if (generalRaw) {
      const parsed = JSON.parse(generalRaw);
      if (Array.isArray(parsed)) return parsed;
    }

    return [];
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
    const serialized = JSON.stringify(cartItems);
    const key = `ash_cart_tok_${token}`;
    localStorage.setItem(key, serialized);
    // Also save in general cart key for universal persistence
    localStorage.setItem(GENERAL_CART_KEY, serialized);
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
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }

    const generalRaw = localStorage.getItem(GENERAL_WISHLIST_KEY);
    if (generalRaw) {
      const parsed = JSON.parse(generalRaw);
      if (Array.isArray(parsed)) return parsed;
    }

    return [];
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
    const serialized = JSON.stringify(wishlistIds);
    const key = `ash_wishlist_tok_${token}`;
    localStorage.setItem(key, serialized);
    localStorage.setItem(GENERAL_WISHLIST_KEY, serialized);
  } catch {}
}
