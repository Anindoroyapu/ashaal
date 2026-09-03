import mysql from 'mysql2/promise';
import { Product, Order, Banner, UserProfile } from '../types';
import { PRODUCTS_DATA } from '../data/productsData';
import { HERO_BANNERS } from '../data/bannersData';

const DB_CONFIG = {
  host: process.env.DB_HOST || '51.79.229.154',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'ashastd24',
  password: process.env.DB_PASSWORD || 'T%va(oyL[anE',
  database: process.env.DB_NAME || 'ashastd24_ashaal',
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
};

// Global singleton for Next.js to prevent connection pool exhaustion during hot reload
const globalForDb = globalThis as unknown as {
  mysqlPool: mysql.Pool | undefined;
  dbInitialized: boolean | undefined;
};

export const pool = globalForDb.mysqlPool ?? mysql.createPool(DB_CONFIG);
if (process.env.NODE_ENV !== 'production') {
  globalForDb.mysqlPool = pool;
}

export const INITIAL_SEED_USERS: UserProfile[] = [
  {
    id: 'usr-admin-0',
    name: 'Ashaal Admin',
    phone: '+880 1700-123456',
    email: 'admin@ashaal.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80',
    coins: 5000,
    memberTier: 'Diamond Club',
    joinDate: 'Jan 2022',
    role: 'admin',
    status: 'active',
    token: 'usr_tok_admin_00001',
    totalOrders: 0,
    totalSpent: 0,
    addresses: [],
    createdAt: '2022-01-01T00:00:00.000Z'
  },
  {
    id: 'usr-anindo-2',
    name: 'Anindo Roy',
    phone: '+880 1819-876543',
    email: 'anindo.roy@gmail.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    coins: 850,
    memberTier: 'Diamond Club',
    joinDate: 'Mar 2023',
    role: 'admin',
    status: 'active',
    token: 'usr_tok_anindo_55102',
    totalOrders: 28,
    totalSpent: 64200,
    createdAt: '2023-03-20T14:30:00.000Z'
  },
  {
    id: 'usr-tanvir-1',
    name: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    email: 'tanvir.ahmed@example.com',
    password: 'password123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    coins: 480,
    memberTier: 'Gold Member',
    joinDate: 'Jan 2023',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_tanvir_94821',
    totalOrders: 14,
    totalSpent: 28400,
    addresses: [
      {
        id: 'addr-1',
        fullName: 'Tanvir Ahmed',
        phone: '+880 1712-345678',
        division: 'Dhaka',
        district: 'Dhaka North',
        thana: 'Gulshan-2',
        addressLine: 'House #45, Road #11, Block D, Gulshan-2',
        landmark: 'Near Pink City Shopping Mall',
        label: 'HOME',
        isDefault: true
      }
    ],
    createdAt: '2023-01-15T10:00:00.000Z'
  },
  {
    id: 'usr-sadia-3',
    name: 'Sadia Islam',
    phone: '+880 1911-223344',
    email: 'sadia.islam@yahoo.com',
    password: 'password123',
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
    password: 'password123',
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

export const INITIAL_ORDERS: Order[] = [
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
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Tanvir Ahmed',
      phone: '+880 1712-345678',
      division: 'Dhaka',
      district: 'Dhaka North',
      thana: 'Gulshan-2',
      addressLine: 'House #45, Road #11, Block D, Gulshan-2',
      landmark: 'Near Pink City Shopping Mall',
      label: 'HOME',
      isDefault: true
    },
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

export const INITIAL_VISITORS = [
  { ip: '172.71.31.62', name: '—', phone: '—', location: 'Dhaka, BD', page: 'https://ashaa.xyz/', platform: 'Linux x86_64', time: '1 min ago' },
  { ip: '104.22.56.28', name: '—', phone: '—', location: 'Chittagong, BD', page: 'https://ashaa.xyz/', platform: 'Linux x86_64', time: '3 mins ago' },
  { ip: '172.69.159.176', name: '—', phone: '—', location: 'Sylhet, BD', page: 'https://ashaa.xyz/booking', platform: 'Win32', time: '7 mins ago' },
  { ip: '172.71.223.162', name: '—', phone: '—', location: 'Dhaka, BD', page: 'https://ashaa.xyz/', platform: 'Win32', time: '12 mins ago' },
  { ip: '172.71.183.5', name: '—', phone: '—', location: 'Rajshahi, BD', page: 'https://ashaa.xyz/?fbclid=IwY2xjaw...', platform: 'Windows', time: '15 mins ago' }
];

/**
 * Initialize all database tables and seed if empty
 */
export async function initDatabase() {
  if (globalForDb.dbInitialized) return;

  const connection = await pool.getConnection();
  try {
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(512) NOT NULL,
        titleBn VARCHAR(512),
        slug VARCHAR(512),
        brand VARCHAR(255),
        category VARCHAR(255),
        categorySlug VARCHAR(255),
        subCategory VARCHAR(255),
        price DECIMAL(12, 2) NOT NULL DEFAULT 0,
        originalPrice DECIMAL(12, 2) NOT NULL DEFAULT 0,
        discountPercentage INT DEFAULT 0,
        rating DECIMAL(3, 2) DEFAULT 5.0,
        reviewsCount INT DEFAULT 0,
        questionsCount INT DEFAULT 0,
        soldCount INT DEFAULT 0,
        inStock INT DEFAULT 50,
        isDarazMall BOOLEAN DEFAULT FALSE,
        isFreeDelivery BOOLEAN DEFAULT FALSE,
        isFlashSale BOOLEAN DEFAULT FALSE,
        flashSaleEndTime VARCHAR(128),
        coinsCashback INT DEFAULT 0,
        mainImage TEXT,
        images JSON,
        description JSON,
        descriptionBn JSON,
        specifications JSON,
        variations JSON,
        seller JSON,
        reviews JSON,
        warranty VARCHAR(255),
        returnPolicy VARCHAR(255),
        tags JSON,
        deliveryFee DECIMAL(10, 2) DEFAULT 0,
        estimatedDeliveryDays VARCHAR(128),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(128) PRIMARY KEY,
        orderNumber VARCHAR(64) NOT NULL,
        userId VARCHAR(128),
        userEmail VARCHAR(255),
        createdAt VARCHAR(128),
        items JSON NOT NULL,
        shippingAddress JSON NOT NULL,
        paymentMethod VARCHAR(64),
        paymentStatus VARCHAR(64),
        orderStatus VARCHAR(64),
        subtotal DECIMAL(12, 2) DEFAULT 0,
        shippingFee DECIMAL(10, 2) DEFAULT 0,
        voucherDiscount DECIMAL(10, 2) DEFAULT 0,
        coinDiscount DECIMAL(10, 2) DEFAULT 0,
        total DECIMAL(12, 2) DEFAULT 0,
        trackingNumber VARCHAR(128),
        courier VARCHAR(128),
        timeline JSON,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Dedicated tables for each order status
    const statusTables = [
      'orders_placed',
      'orders_processing',
      'orders_shipped',
      'orders_delivered',
      'orders_cancelled'
    ];
    for (const table of statusTables) {
      await connection.query(`
        CREATE TABLE IF NOT EXISTS ${table} (
          id VARCHAR(128) PRIMARY KEY,
          orderNumber VARCHAR(64) NOT NULL,
          userId VARCHAR(128),
          userEmail VARCHAR(255),
          createdAt VARCHAR(128),
          items JSON NOT NULL,
          shippingAddress JSON NOT NULL,
          paymentMethod VARCHAR(64),
          paymentStatus VARCHAR(64),
          orderStatus VARCHAR(64),
          subtotal DECIMAL(12, 2) DEFAULT 0,
          shippingFee DECIMAL(10, 2) DEFAULT 0,
          voucherDiscount DECIMAL(10, 2) DEFAULT 0,
          coinDiscount DECIMAL(10, 2) DEFAULT 0,
          total DECIMAL(12, 2) DEFAULT 0,
          trackingNumber VARCHAR(128),
          courier VARCHAR(128),
          timeline JSON,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `);
    }

    await connection.query(`
      CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(128) PRIMARY KEY,
        title VARCHAR(255),
        subtitle VARCHAR(255),
        image TEXT NOT NULL,
        linkType VARCHAR(64),
        targetId VARCHAR(128),
        bgColor VARCHAR(64),
        badge VARCHAR(64),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(128) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(64),
        email VARCHAR(255) NOT NULL,
        password VARCHAR(255),
        avatar TEXT,
        coins INT DEFAULT 200,
        memberTier VARCHAR(64) DEFAULT 'Silver Member',
        joinDate VARCHAR(64),
        role VARCHAR(64) DEFAULT 'customer',
        status VARCHAR(64) DEFAULT 'active',
        token VARCHAR(255),
        totalOrders INT DEFAULT 0,
        totalSpent DECIMAL(12, 2) DEFAULT 0,
        addresses JSON,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        ip VARCHAR(128),
        name VARCHAR(128) DEFAULT '—',
        phone VARCHAR(128) DEFAULT '—',
        location VARCHAR(128) DEFAULT 'Dhaka, BD',
        page TEXT,
        platform VARCHAR(128),
        time VARCHAR(128),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if products table is empty
    const [prodRows]: any = await connection.query('SELECT COUNT(*) as count FROM products');
    if (prodRows[0].count === 0) {
      await seedProducts(connection);
    }

    // Check if banners table is empty
    const [bannerRows]: any = await connection.query('SELECT COUNT(*) as count FROM banners');
    if (bannerRows[0].count === 0) {
      await seedBanners(connection);
    }

    // Check if users table is empty
    const [userRows]: any = await connection.query('SELECT COUNT(*) as count FROM users');
    if (userRows[0].count === 0) {
      await seedUsers(connection);
    }

    // Check if orders table is empty
    const [orderRows]: any = await connection.query('SELECT COUNT(*) as count FROM orders');
    if (orderRows[0].count === 0) {
      await seedOrders(connection);
    }

    // Check if visitors table is empty
    const [visitorRows]: any = await connection.query('SELECT COUNT(*) as count FROM visitors');
    if (visitorRows[0].count === 0) {
      await seedVisitors(connection);
    }

    globalForDb.dbInitialized = true;
  } catch (err) {
    console.error('[MySQL] Error initializing database in Next.js:', err);
  } finally {
    connection.release();
  }
}

/**
 * Seed all products
 */
export async function seedProducts(connection?: mysql.PoolConnection) {
  const conn = connection || (await pool.getConnection());
  try {
    for (const p of PRODUCTS_DATA) {
      await saveProductRecord(conn, p);
    }
  } finally {
    if (!connection) conn.release();
  }
}

/**
 * Seed all banners
 */
export async function seedBanners(connection?: mysql.PoolConnection) {
  const conn = connection || (await pool.getConnection());
  try {
    for (const b of HERO_BANNERS) {
      await conn.query(
        `INSERT INTO banners (id, title, subtitle, image, linkType, targetId, bgColor, badge)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
          title = VALUES(title), subtitle = VALUES(subtitle), image = VALUES(image),
          linkType = VALUES(linkType), targetId = VALUES(targetId), bgColor = VALUES(bgColor), badge = VALUES(badge)`,
        [b.id, b.title, b.subtitle, b.image, b.linkType, b.targetId || null, b.bgColor || null, b.badge || null]
      );
    }
  } finally {
    if (!connection) conn.release();
  }
}

/**
 * Seed all initial users
 */
export async function seedUsers(connection?: mysql.PoolConnection) {
  const conn = connection || (await pool.getConnection());
  try {
    for (const u of INITIAL_SEED_USERS) {
      await saveUserRecord(conn, u);
    }
  } finally {
    if (!connection) conn.release();
  }
}

/**
 * Seed initial orders
 */
export async function seedOrders(connection?: mysql.PoolConnection) {
  const conn = connection || (await pool.getConnection());
  try {
    for (const o of INITIAL_ORDERS) {
      await saveOrderRecord(conn, o);
    }
  } finally {
    if (!connection) conn.release();
  }
}

/**
 * Seed initial visitors
 */
export async function seedVisitors(connection?: mysql.PoolConnection) {
  const conn = connection || (await pool.getConnection());
  try {
    for (const v of INITIAL_VISITORS) {
      await conn.query(
        `INSERT INTO visitors (ip, name, phone, location, page, platform, time)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [v.ip, v.name, v.phone, v.location, v.page, v.platform, v.time]
      );
    }
  } finally {
    if (!connection) conn.release();
  }
}

/**
 * Format raw row to Product object
 */
export function formatProductRow(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    titleBn: row.titleBn || row.title,
    slug: row.slug || '',
    brand: row.brand || '',
    category: row.category || '',
    categorySlug: row.categorySlug || '',
    subCategory: row.subCategory || '',
    price: Number(row.price) || 0,
    originalPrice: Number(row.originalPrice) || Number(row.price) || 0,
    discountPercentage: Number(row.discountPercentage) || 0,
    rating: Number(row.rating) || 5.0,
    reviewsCount: Number(row.reviewsCount) || 0,
    questionsCount: Number(row.questionsCount) || 0,
    soldCount: Number(row.soldCount) || 0,
    inStock: Number(row.inStock) ?? 50,
    isDarazMall: Boolean(row.isDarazMall),
    isFreeDelivery: Boolean(row.isFreeDelivery),
    isFlashSale: Boolean(row.isFlashSale),
    flashSaleEndTime: row.flashSaleEndTime || '',
    coinsCashback: Number(row.coinsCashback) || 0,
    mainImage: row.mainImage || '',
    images: typeof row.images === 'string' ? JSON.parse(row.images) : (row.images || [row.mainImage]),
    description: typeof row.description === 'string' ? JSON.parse(row.description) : (row.description || []),
    descriptionBn: typeof row.descriptionBn === 'string' ? JSON.parse(row.descriptionBn) : (row.descriptionBn || []),
    specifications: typeof row.specifications === 'string' ? JSON.parse(row.specifications) : (row.specifications || {}),
    variations: typeof row.variations === 'string' ? JSON.parse(row.variations) : (row.variations || []),
    seller: typeof row.seller === 'string' ? JSON.parse(row.seller) : (row.seller || { name: 'Ashaal Official Flagship Store', isOfficial: true }),
    reviews: typeof row.reviews === 'string' ? JSON.parse(row.reviews) : (row.reviews || []),
    warranty: row.warranty || '1 Year Brand Warranty',
    returnPolicy: row.returnPolicy || '14 Days Easy Free Return',
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : (row.tags || []),
    deliveryFee: Number(row.deliveryFee) || 0,
    estimatedDeliveryDays: row.estimatedDeliveryDays || '2-4 Days'
  };
}

/**
 * Save / Update Product
 */
export async function saveProductRecord(connOrPool: mysql.Pool | mysql.PoolConnection, product: Partial<Product> & { id?: string }): Promise<Product> {
  const id = product.id || `prod-${Date.now()}`;
  const title = product.title || 'New Product';
  const titleBn = product.titleBn || title;
  const slug = product.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const brand = product.brand || 'Ashaal';
  const category = product.category || 'Electronic Devices';
  const categorySlug = product.categorySlug || 'electronic-devices';
  const subCategory = product.subCategory || 'general';
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || price;
  const discountPercentage = product.originalPrice && product.price && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : Number(product.discountPercentage) || 0;
  const rating = Number(product.rating) || 5.0;
  const reviewsCount = Number(product.reviewsCount) || 0;
  const questionsCount = Number(product.questionsCount) || 0;
  const soldCount = Number(product.soldCount) || 0;
  const inStock = Number(product.inStock) ?? 50;
  const isDarazMall = product.isDarazMall ? 1 : 0;
  const isFreeDelivery = product.isFreeDelivery ? 1 : 0;
  const isFlashSale = product.isFlashSale ? 1 : 0;
  const flashSaleEndTime = product.flashSaleEndTime || '12h 00m 00s';
  const coinsCashback = Number(product.coinsCashback) || 50;
  const mainImage = product.mainImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
  const images = JSON.stringify(product.images && product.images.length > 0 ? product.images : [mainImage]);
  const description = JSON.stringify(product.description || ['High quality authentic product on Ashaal.']);
  const descriptionBn = JSON.stringify(product.descriptionBn || ['আশাল এ সেরা মানের আসল পণ্য।']);
  const specifications = JSON.stringify(product.specifications || { Warranty: '1 Year Brand Warranty', Origin: 'Genuine Import' });
  const variations = JSON.stringify(product.variations || []);
  const seller = JSON.stringify(product.seller || {
    id: 'seller-official',
    name: 'Ashaal Official Flagship Store',
    isOfficial: true,
    rating: 98,
    shipOnTime: 99,
    chatResponse: 97,
    joinedYears: 3,
    location: 'Dhaka'
  });
  const reviews = JSON.stringify(product.reviews || []);
  const warranty = product.warranty || '100% Authentic Brand Warranty';
  const returnPolicy = product.returnPolicy || '14 Days Easy Free Return';
  const tags = JSON.stringify(product.tags || []);
  const deliveryFee = product.isFreeDelivery ? 0 : (product.deliveryFee ?? 60);
  const estimatedDeliveryDays = product.estimatedDeliveryDays || '2-4 Days';

  await connOrPool.query(
    `INSERT INTO products (
      id, title, titleBn, slug, brand, category, categorySlug, subCategory,
      price, originalPrice, discountPercentage, rating, reviewsCount, questionsCount,
      soldCount, inStock, isDarazMall, isFreeDelivery, isFlashSale, flashSaleEndTime,
      coinsCashback, mainImage, images, description, descriptionBn, specifications,
      variations, seller, reviews, warranty, returnPolicy, tags, deliveryFee, estimatedDeliveryDays
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      titleBn = VALUES(titleBn),
      slug = VALUES(slug),
      brand = VALUES(brand),
      category = VALUES(category),
      categorySlug = VALUES(categorySlug),
      subCategory = VALUES(subCategory),
      price = VALUES(price),
      originalPrice = VALUES(originalPrice),
      discountPercentage = VALUES(discountPercentage),
      rating = VALUES(rating),
      reviewsCount = VALUES(reviewsCount),
      questionsCount = VALUES(questionsCount),
      soldCount = VALUES(soldCount),
      inStock = VALUES(inStock),
      isDarazMall = VALUES(isDarazMall),
      isFreeDelivery = VALUES(isFreeDelivery),
      isFlashSale = VALUES(isFlashSale),
      flashSaleEndTime = VALUES(flashSaleEndTime),
      coinsCashback = VALUES(coinsCashback),
      mainImage = VALUES(mainImage),
      images = VALUES(images),
      description = VALUES(description),
      descriptionBn = VALUES(descriptionBn),
      specifications = VALUES(specifications),
      variations = VALUES(variations),
      seller = VALUES(seller),
      reviews = VALUES(reviews),
      warranty = VALUES(warranty),
      returnPolicy = VALUES(returnPolicy),
      tags = VALUES(tags),
      deliveryFee = VALUES(deliveryFee),
      estimatedDeliveryDays = VALUES(estimatedDeliveryDays)`,
    [
      id, title, titleBn, slug, brand, category, categorySlug, subCategory,
      price, originalPrice, discountPercentage, rating, reviewsCount, questionsCount,
      soldCount, inStock, isDarazMall, isFreeDelivery, isFlashSale, flashSaleEndTime,
      coinsCashback, mainImage, images, description, descriptionBn, specifications,
      variations, seller, reviews, warranty, returnPolicy, tags, deliveryFee, estimatedDeliveryDays
    ]
  );

  return formatProductRow({
    id, title, titleBn, slug, brand, category, categorySlug, subCategory,
    price, originalPrice, discountPercentage, rating, reviewsCount, questionsCount,
    soldCount, inStock, isDarazMall, isFreeDelivery, isFlashSale, flashSaleEndTime,
    coinsCashback, mainImage, images, description, descriptionBn, specifications,
    variations, seller, reviews, warranty, returnPolicy, tags, deliveryFee, estimatedDeliveryDays
  });
}

/**
 * Format raw row to Order object
 */
export function formatOrderRow(row: any): Order {
  return {
    id: row.id,
    orderNumber: row.orderNumber,
    createdAt: row.createdAt,
    items: typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []),
    shippingAddress: typeof row.shippingAddress === 'string' ? JSON.parse(row.shippingAddress) : (row.shippingAddress || {}),
    paymentMethod: row.paymentMethod,
    paymentStatus: row.paymentStatus,
    orderStatus: row.orderStatus,
    subtotal: Number(row.subtotal) || 0,
    shippingFee: Number(row.shippingFee) || 0,
    voucherDiscount: Number(row.voucherDiscount) || 0,
    coinDiscount: Number(row.coinDiscount) || 0,
    total: Number(row.total) || 0,
    trackingNumber: row.trackingNumber || '',
    courier: row.courier || 'Ashaal Express (DEX)',
    timeline: typeof row.timeline === 'string' ? JSON.parse(row.timeline) : (row.timeline || [])
  };
}

/**
 * Save Order
 */
export async function saveOrderRecord(connOrPool: mysql.Pool | mysql.PoolConnection, order: Order & { userId?: string; userEmail?: string }): Promise<Order> {
  const id = order.id || `ord-${Date.now()}`;
  const orderNumber = order.orderNumber || '68' + Math.floor(100000000 + Math.random() * 900000000);
  const userId = order.userId || null;
  const userEmail = order.userEmail || null;
  const createdAt = order.createdAt || new Date().toLocaleString('en-US');
  const items = JSON.stringify(order.items || []);
  const shippingAddress = JSON.stringify(order.shippingAddress || {});
  const paymentMethod = order.paymentMethod || 'bkash';
  const paymentStatus = order.paymentStatus || (paymentMethod === 'cod' ? 'PENDING' : 'PAID');
  const orderStatus = order.orderStatus || 'PLACED';
  const subtotal = Number(order.subtotal) || 0;
  const shippingFee = Number(order.shippingFee) || 0;
  const voucherDiscount = Number(order.voucherDiscount) || 0;
  const coinDiscount = Number(order.coinDiscount) || 0;
  const total = Number(order.total) || Math.max(0, subtotal + shippingFee - voucherDiscount - coinDiscount);
  const trackingNumber = order.trackingNumber || 'DEX-BD-' + Math.floor(100000 + Math.random() * 900000);
  const courier = order.courier || 'Ashaal Express (DEX)';
  const timeline = JSON.stringify(order.timeline || []);

  await connOrPool.query(
    `INSERT INTO orders (
      id, orderNumber, userId, userEmail, createdAt, items, shippingAddress,
      paymentMethod, paymentStatus, orderStatus, subtotal, shippingFee,
      voucherDiscount, coinDiscount, total, trackingNumber, courier, timeline
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      paymentStatus = VALUES(paymentStatus),
      orderStatus = VALUES(orderStatus),
      trackingNumber = VALUES(trackingNumber),
      courier = VALUES(courier),
      timeline = VALUES(timeline),
      shippingAddress = VALUES(shippingAddress)`,
    [
      id, orderNumber, userId, userEmail, createdAt, items, shippingAddress,
      paymentMethod, paymentStatus, orderStatus, subtotal, shippingFee,
      voucherDiscount, coinDiscount, total, trackingNumber, courier, timeline
    ]
  );

  // Sync to dedicated status table
  await syncOrderStatusTable(connOrPool, id, orderStatus);

  return formatOrderRow({
    id, orderNumber, userId, userEmail, createdAt, items, shippingAddress,
    paymentMethod, paymentStatus, orderStatus, subtotal, shippingFee,
    voucherDiscount, coinDiscount, total, trackingNumber, courier, timeline
  });
}

/**
 * Synchronize order into its dedicated status table and remove from other status tables
 */
export async function syncOrderStatusTable(
  connOrPool: mysql.Pool | mysql.PoolConnection,
  orderId: string,
  targetStatus: string
) {
  const statusTables = [
    'orders_placed',
    'orders_processing',
    'orders_shipped',
    'orders_delivered',
    'orders_cancelled'
  ];
  const targetTable = `orders_${targetStatus.toLowerCase()}`;

  // Fetch current order from master orders table
  const [rows]: any = await connOrPool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  if (!rows || rows.length === 0) return;

  const ord = rows[0];

  // Remove from all other status tables
  for (const t of statusTables) {
    if (t !== targetTable) {
      await connOrPool.query(`DELETE FROM ${t} WHERE id = ?`, [orderId]);
    }
  }

  // Insert or update in the target status table
  if (statusTables.includes(targetTable)) {
    await connOrPool.query(
      `INSERT INTO ${targetTable} (
        id, orderNumber, userId, userEmail, createdAt, items, shippingAddress,
        paymentMethod, paymentStatus, orderStatus, subtotal, shippingFee,
        voucherDiscount, coinDiscount, total, trackingNumber, courier, timeline
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        paymentStatus = VALUES(paymentStatus),
        orderStatus = VALUES(orderStatus),
        trackingNumber = VALUES(trackingNumber),
        courier = VALUES(courier),
        timeline = VALUES(timeline),
        shippingAddress = VALUES(shippingAddress)`,
      [
        ord.id,
        ord.orderNumber,
        ord.userId,
        ord.userEmail,
        ord.createdAt,
        typeof ord.items === 'string' ? ord.items : JSON.stringify(ord.items || []),
        typeof ord.shippingAddress === 'string' ? ord.shippingAddress : JSON.stringify(ord.shippingAddress || {}),
        ord.paymentMethod,
        ord.paymentStatus,
        ord.orderStatus,
        ord.subtotal,
        ord.shippingFee,
        ord.voucherDiscount,
        ord.coinDiscount,
        ord.total,
        ord.trackingNumber,
        ord.courier,
        typeof ord.timeline === 'string' ? ord.timeline : JSON.stringify(ord.timeline || [])
      ]
    );
  }
}

/**
 * Format raw row to UserProfile object
 */
export function formatUserRow(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone || '+880 1700-000000',
    email: row.email,
    password: row.password,
    avatar: row.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    coins: Number(row.coins) ?? 200,
    memberTier: row.memberTier || 'Silver Member',
    joinDate: row.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    role: row.role || 'customer',
    status: row.status || 'active',
    token: row.token || `usr_tok_${row.id}`,
    totalOrders: Number(row.totalOrders) || 0,
    totalSpent: Number(row.totalSpent) || 0,
    addresses: typeof row.addresses === 'string' ? JSON.parse(row.addresses) : (row.addresses || []),
    createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : undefined,
    updatedAt: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined
  };
}

/**
 * Save User
 */
export async function saveUserRecord(connOrPool: mysql.Pool | mysql.PoolConnection, user: Partial<UserProfile> & { id?: string }): Promise<UserProfile> {
  const id = user.id || `usr-${Date.now()}`;
  const name = user.name || 'Anonymous User';
  const phone = user.phone || '+880 1700-000000';
  const email = user.email || `${id}@example.com`;
  const password = user.password || 'password123';
  const avatar = user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80';
  const coins = Number(user.coins) ?? 200;
  const memberTier = user.memberTier || 'Silver Member';
  const joinDate = user.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const role = user.role || 'customer';
  const status = user.status || 'active';
  const token = user.token || `usr_tok_${id}_${Math.random().toString(36).substring(2, 9)}`;
  const totalOrders = Number(user.totalOrders) || 0;
  const totalSpent = Number(user.totalSpent) || 0;
  const addresses = JSON.stringify(user.addresses || []);

  await connOrPool.query(
    `INSERT INTO users (
      id, name, phone, email, password, avatar, coins, memberTier,
      joinDate, role, status, token, totalOrders, totalSpent, addresses
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      phone = VALUES(phone),
      email = VALUES(email),
      avatar = VALUES(avatar),
      coins = VALUES(coins),
      memberTier = VALUES(memberTier),
      role = VALUES(role),
      status = VALUES(status),
      totalOrders = VALUES(totalOrders),
      totalSpent = VALUES(totalSpent),
      addresses = VALUES(addresses)`,
    [
      id, name, phone, email, password, avatar, coins, memberTier,
      joinDate, role, status, token, totalOrders, totalSpent, addresses
    ]
  );

  return formatUserRow({
    id, name, phone, email, password, avatar, coins, memberTier,
    joinDate, role, status, token, totalOrders, totalSpent, addresses
  });
}

