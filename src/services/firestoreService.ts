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
import { Product, Order, Banner } from '../types';
import { PRODUCTS_DATA } from '../data/productsData';
import { HERO_BANNERS } from '../data/bannersData';

const PRODUCTS_COLLECTION = 'products';
const ORDERS_COLLECTION = 'orders';
const BANNERS_COLLECTION = 'banners';

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
