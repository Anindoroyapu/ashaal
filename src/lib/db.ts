import mysql from 'mysql2/promise';
import { Product, Order, Banner, UserProfile } from '../types';



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

export const INITIAL_SEED_USERS: UserProfile[] = [];

export const INITIAL_ORDERS: Order[] = [];

export const INITIAL_VISITORS: any[] = [];

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

    // Normalized Product master table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Product (
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
        description TEXT,
        descriptionBn TEXT,
        specifications JSON,
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

    // ProductMedia table - linked by productId
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ProductMedia (
        id VARCHAR(128) PRIMARY KEY,
        productId VARCHAR(128) NOT NULL,
        url TEXT NOT NULL,
        type VARCHAR(64) DEFAULT 'IMAGE',
        isMain BOOLEAN DEFAULT FALSE,
        displayOrder INT DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_pm_pid (productId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ProductVariant table - linked by productId
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ProductVariant (
        id VARCHAR(128) PRIMARY KEY,
        productId VARCHAR(128) NOT NULL,
        name VARCHAR(128) NOT NULL,
        optionValue VARCHAR(255) NOT NULL,
        price DECIMAL(12, 2) DEFAULT NULL,
        stock INT DEFAULT NULL,
        sku VARCHAR(128) DEFAULT NULL,
        image TEXT DEFAULT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_pv_pid (productId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ReturnRequest table - linked by orderId / userId
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ReturnRequest (
        id VARCHAR(128) PRIMARY KEY,
        orderId VARCHAR(128) NOT NULL,
        userId VARCHAR(128),
        userEmail VARCHAR(255),
        status VARCHAR(64) DEFAULT 'PENDING',
        reason TEXT,
        refundMethod VARCHAR(64),
        refundAmount DECIMAL(12, 2) DEFAULT 0,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_rr_order (orderId),
        INDEX idx_rr_user (userId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // ReturnRequestItem table - linked by returnRequestId & productId
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ReturnRequestItem (
        id VARCHAR(128) PRIMARY KEY,
        returnRequestId VARCHAR(128) NOT NULL,
        productId VARCHAR(128) NOT NULL,
        quantity INT DEFAULT 1,
        itemPrice DECIMAL(12, 2) DEFAULT 0,
        reason TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_rri_req (returnRequestId),
        INDEX idx_rri_prod (productId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Session table - linked by userId & token
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Session (
        id VARCHAR(128) PRIMARY KEY,
        userId VARCHAR(128) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        ipAddress VARCHAR(64),
        userAgent TEXT,
        expiresAt DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_sess_user (userId),
        INDEX idx_sess_tok (token)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Safe migration: Add all enterprise product columns to both products & Product tables if not present
    const extraProductCols = [
      'uuid VARCHAR(128)',
      'name VARCHAR(512)',
      'short_description TEXT',
      'category_id VARCHAR(128)',
      'subcategory_id VARCHAR(128)',
      'child_category_id VARCHAR(128)',
      'brand_id VARCHAR(128)',
      'vendor_id VARCHAR(128)',
      'supplier_id VARCHAR(128)',
      'sku VARCHAR(128)',
      'barcode VARCHAR(128)',
      "discount_type VARCHAR(64) DEFAULT 'percentage'",
      'discount_value DECIMAL(12, 2) DEFAULT 0',
      'final_price DECIMAL(12, 2) DEFAULT 0',
      'purchase_price DECIMAL(12, 2) DEFAULT 0',
      'cost_price DECIMAL(12, 2) DEFAULT 0',
      'profit_margin DECIMAL(12, 2) DEFAULT 0',
      'stock_quantity INT DEFAULT 50',
      'stock_alert_quantity INT DEFAULT 5',
      "stock_status VARCHAR(64) DEFAULT 'in_stock'",
      "unit VARCHAR(64) DEFAULT 'piece'",
      'weight DECIMAL(10, 2) DEFAULT 0',
      'length DECIMAL(10, 2) DEFAULT 0',
      'width DECIMAL(10, 2) DEFAULT 0',
      'height DECIMAL(10, 2) DEFAULT 0',
      'color_options JSON',
      'size_options JSON',
      'thumbnail_image TEXT',
      'gallery_images JSON',
      'video_url TEXT',
      'warranty_period VARCHAR(128)',
      'return_policy VARCHAR(255)',
      "origin_country VARCHAR(128) DEFAULT 'Bangladesh'",
      'manufacturing_date VARCHAR(64)',
      'expiry_date VARCHAR(64)',
      'is_featured BOOLEAN DEFAULT FALSE',
      'is_trending BOOLEAN DEFAULT FALSE',
      'is_best_seller BOOLEAN DEFAULT FALSE',
      'total_reviews INT DEFAULT 0',
      'total_sales INT DEFAULT 0',
      'meta_title VARCHAR(512)',
      'meta_description TEXT',
      'meta_keywords TEXT',
      "status VARCHAR(64) DEFAULT 'active'",
      "visibility VARCHAR(64) DEFAULT 'public'",
      "created_by VARCHAR(128) DEFAULT 'admin'",
      "updated_by VARCHAR(128) DEFAULT 'admin'"
    ];

    for (const col of extraProductCols) {
      try {
        await connection.query(`ALTER TABLE products ADD COLUMN ${col}`);
      } catch (e) {}
      try {
        await connection.query(`ALTER TABLE Product ADD COLUMN ${col}`);
      } catch (e) {}
    }

    // Ensure default admin exists in MySQL users table
    try {
      const [adminCheck]: any = await connection.query(
        "SELECT id FROM users WHERE role = 'admin' OR email = 'admin@ashaal.com' LIMIT 1"
      );
      if (!adminCheck || adminCheck.length === 0) {
        await connection.query(`
          INSERT INTO users (
            id, name, phone, email, password, avatar, coins, memberTier,
            joinDate, role, status, token, totalOrders, totalSpent, addresses
          ) VALUES (
            'usr-admin-0', 'Ashaal Admin', '+880 1700-123456', 'admin@ashaal.com', 'password123',
            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&q=80', 5000,
            'Diamond Club', 'Jan 2022', 'admin', 'active', 'usr_tok_admin_00001', 0, 0, '[]'
          ) ON DUPLICATE KEY UPDATE role = 'admin'
        `);
      }
    } catch (adminErr) {
      console.warn('[initDatabase] Admin user check/seed error:', adminErr);
    }

    // Tables initialized. Data is managed live through MySQL and Admin panel.

    globalForDb.dbInitialized = true;
  } catch (err) {
    console.error('[MySQL] Error initializing database in Next.js:', err);
  } finally {
    connection.release();
  }
}

/**
 * Database seeding functions - all demo data removed.
 * Data is exclusively stored and fetched from MySQL (51.79.229.154:3306).
 */
export async function seedProducts() {}
export async function seedBanners() {}
export async function seedUsers() {}
export async function seedOrders() {}
export async function seedVisitors() {}

/**
 * Format raw row to Product object
 */
export function formatProductRow(row: any): Product {
  const parseJsonField = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    if (typeof val === 'string') {
      try {
        return JSON.parse(val);
      } catch (e) {
        return typeof fallback === 'string' ? val : [val];
      }
    }
    return fallback;
  };

  const id = row.id || `prod-${Date.now()}`;
  const title = row.title || row.name || 'Product';
  const name = row.name || title;
  const mainImage = row.mainImage || row.thumbnail_image || '';
  const thumbnail_image = row.thumbnail_image || mainImage;
  const images = parseJsonField(row.images || row.gallery_images, [mainImage].filter(Boolean));
  const gallery_images = parseJsonField(row.gallery_images || row.images, images);
  const price = Number(row.price) || 0;
  const originalPrice = Number(row.originalPrice) || price;
  const discountPercentage = Number(row.discountPercentage) || 0;
  const discount_value = Number(row.discount_value) || discountPercentage;
  const final_price = Number(row.final_price) || price;
  const inStock = Number(row.inStock ?? row.stock_quantity) ?? 50;
  const stock_quantity = Number(row.stock_quantity ?? inStock);
  const stock_alert_quantity = Number(row.stock_alert_quantity) || 5;
  const stock_status = row.stock_status || (inStock > 0 ? 'in_stock' : 'out_of_stock');
  const soldCount = Number(row.soldCount ?? row.total_sales) || 0;
  const total_sales = soldCount;
  const reviewsCount = Number(row.reviewsCount ?? row.total_reviews) || 0;
  const total_reviews = reviewsCount;
  const warranty = row.warranty || row.warranty_period || '1 Year Brand Warranty';
  const warranty_period = row.warranty_period || warranty;
  const returnPolicy = row.returnPolicy || row.return_policy || '14 Days Easy Free Return';
  const return_policy = row.return_policy || returnPolicy;

  return {
    id,
    uuid: row.uuid || id,
    name,
    title,
    titleBn: row.titleBn || title,
    slug: row.slug || '',
    short_description: row.short_description || (Array.isArray(row.description) ? row.description[0] : (typeof row.description === 'string' ? row.description : '')),
    description: parseJsonField(row.description, ['High quality authentic product on Ashaal.']),
    descriptionBn: parseJsonField(row.descriptionBn, ['আশাল এ সেরা মানের আসল পণ্য।']),
    category: row.category || 'Electronic Devices',
    categorySlug: row.categorySlug || 'electronic-devices',
    category_id: row.category_id || row.categorySlug || 'electronic-devices',
    subcategory_id: row.subcategory_id || row.subCategory || 'general',
    child_category_id: row.child_category_id || '',
    subCategory: row.subCategory || row.subcategory_id || 'general',
    brand: row.brand || 'Ashaal',
    brand_id: row.brand_id || '',
    vendor_id: row.vendor_id || '',
    supplier_id: row.supplier_id || '',
    sku: row.sku || `SKU-${id.toUpperCase()}`,
    barcode: row.barcode || '',
    price,
    discount_type: row.discount_type || 'percentage',
    discount_value,
    final_price,
    purchase_price: Number(row.purchase_price) || 0,
    cost_price: Number(row.cost_price) || 0,
    profit_margin: Number(row.profit_margin) || 0,
    originalPrice,
    discountPercentage,
    stock_quantity,
    stock_alert_quantity,
    stock_status,
    unit: row.unit || 'piece',
    weight: Number(row.weight) || 0,
    length: Number(row.length) || 0,
    width: Number(row.width) || 0,
    height: Number(row.height) || 0,
    color_options: parseJsonField(row.color_options, []),
    size_options: parseJsonField(row.size_options, []),
    tags: parseJsonField(row.tags, []),
    thumbnail_image,
    gallery_images,
    video_url: row.video_url || '',
    warranty,
    warranty_period,
    returnPolicy,
    return_policy,
    origin_country: row.origin_country || 'Bangladesh',
    manufacturing_date: row.manufacturing_date || '',
    expiry_date: row.expiry_date || '',
    is_featured: Boolean(row.is_featured),
    is_trending: Boolean(row.is_trending),
    is_best_seller: Boolean(row.is_best_seller),
    rating: Number(row.rating) || 5.0,
    reviewsCount,
    total_reviews,
    soldCount,
    total_sales,
    questionsCount: Number(row.questionsCount) || 0,
    inStock,
    isDarazMall: Boolean(row.isDarazMall),
    isFreeDelivery: Boolean(row.isFreeDelivery),
    isFlashSale: Boolean(row.isFlashSale),
    flashSaleEndTime: row.flashSaleEndTime || '',
    coinsCashback: Number(row.coinsCashback) || 0,
    mainImage,
    images,
    specifications: parseJsonField(row.specifications, { Warranty: '1 Year Brand Warranty', Origin: 'Genuine Import' }),
    variations: parseJsonField(row.variations, []),
    seller: parseJsonField(row.seller, { name: 'Ashaal Official Flagship Store', isOfficial: true, rating: 98, shipOnTime: 99, chatResponse: 97, joinedYears: 3, location: 'Dhaka' }),
    reviews: parseJsonField(row.reviews, []),
    meta_title: row.meta_title || `${title} | Ashaal Bangladesh`,
    meta_description: row.meta_description || row.short_description || '',
    meta_keywords: row.meta_keywords || '',
    status: row.status || 'active',
    visibility: row.visibility || 'public',
    created_by: row.created_by || 'admin',
    updated_by: row.updated_by || 'admin',
    deliveryFee: Number(row.deliveryFee) || 0,
    estimatedDeliveryDays: row.estimatedDeliveryDays || '2-4 Days',
    created_at: row.createdAt || row.created_at || new Date().toISOString(),
    updated_at: row.updatedAt || row.updated_at || new Date().toISOString()
  };
}

/**
 * Save / Update Product
 */
export async function saveProductRecord(connOrPool: mysql.Pool | mysql.PoolConnection, product: Partial<Product> & { id?: string }): Promise<Product> {
  const id = product.id || `prod-${Date.now()}`;
  const uuid = product.uuid || `uuid-${id}`;
  const name = product.name || product.title || 'New Product';
  const title = product.title || product.name || name;
  const titleBn = product.titleBn || title;
  const slug = product.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const short_description = product.short_description || (Array.isArray(product.description) ? product.description[0] : (typeof product.description === 'string' ? product.description : ''));
  const category = product.category || 'Electronic Devices';
  const categorySlug = product.categorySlug || 'electronic-devices';
  const category_id = product.category_id || categorySlug;
  const subcategory_id = product.subcategory_id || product.subCategory || 'general';
  const child_category_id = product.child_category_id || '';
  const subCategory = product.subCategory || subcategory_id;
  const brand = product.brand || 'Ashaal';
  const brand_id = product.brand_id || '';
  const vendor_id = product.vendor_id || '';
  const supplier_id = product.supplier_id || '';
  const sku = product.sku || `SKU-${id.toUpperCase()}`;
  const barcode = product.barcode || `880${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice) || price;
  const discountPercentage = product.originalPrice && product.price && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : Number(product.discountPercentage) || 0;
  const discount_type = product.discount_type || 'percentage';
  const discount_value = Number(product.discount_value) || discountPercentage;
  const final_price = Number(product.final_price) || price;
  const purchase_price = Number(product.purchase_price) || Math.round(price * 0.7);
  const cost_price = Number(product.cost_price) || purchase_price;
  const profit_margin = Number(product.profit_margin) || Math.max(0, price - cost_price);
  const stock_quantity = Number(product.stock_quantity ?? product.inStock) || 50;
  const stock_alert_quantity = Number(product.stock_alert_quantity) || 5;
  const inStock = stock_quantity;
  const stock_status = product.stock_status || (stock_quantity > 0 ? 'in_stock' : 'out_of_stock');
  const unit = product.unit || 'piece';
  const weight = Number(product.weight) || 0;
  const length = Number(product.length) || 0;
  const width = Number(product.width) || 0;
  const height = Number(product.height) || 0;
  const color_options = JSON.stringify(product.color_options || []);
  const size_options = JSON.stringify(product.size_options || []);
  const rating = Number(product.rating) || 5.0;
  const reviewsCount = Number(product.reviewsCount ?? product.total_reviews) || 0;
  const total_reviews = reviewsCount;
  const questionsCount = Number(product.questionsCount) || 0;
  const soldCount = Number(product.soldCount ?? product.total_sales) || 0;
  const total_sales = soldCount;
  const isDarazMall = product.isDarazMall ? 1 : 0;
  const isFreeDelivery = product.isFreeDelivery ? 1 : 0;
  const isFlashSale = product.isFlashSale ? 1 : 0;
  const flashSaleEndTime = product.flashSaleEndTime || '12h 00m 00s';
  const coinsCashback = Number(product.coinsCashback) || 50;
  const mainImage = product.mainImage || product.thumbnail_image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
  const thumbnail_image = product.thumbnail_image || mainImage;
  const rawImages = product.images && product.images.length > 0 ? product.images : (product.gallery_images && product.gallery_images.length > 0 ? product.gallery_images : [mainImage]);
  const images = JSON.stringify(rawImages);
  const gallery_images = images;
  const video_url = product.video_url || '';
  const description = JSON.stringify(Array.isArray(product.description) ? product.description : [product.description || 'High quality authentic product on Ashaal.']);
  const descriptionBn = JSON.stringify(Array.isArray(product.descriptionBn) ? product.descriptionBn : [product.descriptionBn || 'আশাল এ সেরা মানের আসল পণ্য।']);
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
  const warranty = product.warranty || product.warranty_period || '1 Year Brand Warranty';
  const warranty_period = product.warranty_period || warranty;
  const returnPolicy = product.returnPolicy || product.return_policy || '14 Days Easy Free Return';
  const return_policy = product.return_policy || returnPolicy;
  const origin_country = product.origin_country || 'Bangladesh';
  const manufacturing_date = product.manufacturing_date || '';
  const expiry_date = product.expiry_date || '';
  const is_featured = product.is_featured ? 1 : 0;
  const is_trending = product.is_trending ? 1 : 0;
  const is_best_seller = product.is_best_seller ? 1 : 0;
  const meta_title = product.meta_title || `${title} | Ashaal Bangladesh`;
  const meta_description = product.meta_description || short_description || '';
  const meta_keywords = product.meta_keywords || `${title}, ${brand}, ${category}, online shopping bd`;
  const status = product.status || 'active';
  const visibility = product.visibility || 'public';
  const created_by = product.created_by || 'admin';
  const updated_by = product.updated_by || 'admin';
  const tags = JSON.stringify(product.tags || []);
  const deliveryFee = product.isFreeDelivery ? 0 : (product.deliveryFee ?? 60);
  const estimatedDeliveryDays = product.estimatedDeliveryDays || '2-4 Days';

  const productData = {
    id, uuid, name, title, titleBn, slug, short_description, description, descriptionBn,
    category, categorySlug, category_id, subcategory_id, child_category_id, subCategory,
    brand, brand_id, vendor_id, supplier_id, sku, barcode,
    price, discount_type, discount_value, final_price, purchase_price, cost_price, profit_margin,
    originalPrice, discountPercentage, stock_quantity, stock_alert_quantity, stock_status,
    unit, weight, length, width, height, color_options, size_options, tags,
    thumbnail_image, gallery_images, video_url, warranty, warranty_period, returnPolicy, return_policy,
    origin_country, manufacturing_date, expiry_date, is_featured, is_trending, is_best_seller,
    rating, reviewsCount, total_reviews, soldCount, total_sales, questionsCount, inStock,
    isDarazMall, isFreeDelivery, isFlashSale, flashSaleEndTime, coinsCashback,
    mainImage, images, specifications, variations, seller, reviews,
    meta_title, meta_description, meta_keywords, status, visibility, created_by, updated_by,
    deliveryFee, estimatedDeliveryDays
  };

  const cols = Object.keys(productData);
  const vals = Object.values(productData);
  const placeholders = cols.map(() => '?').join(', ');
  const updateClause = cols.map((col) => `${col} = VALUES(${col})`).join(', ');

  // 1. Insert/Update into products
  await connOrPool.query(
    `INSERT INTO products (${cols.join(', ')}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateClause}`,
    vals
  );

  // 2. Insert/Update into Product
  try {
    await connOrPool.query(
      `INSERT INTO Product (${cols.join(', ')}) VALUES (${placeholders}) ON DUPLICATE KEY UPDATE ${updateClause}`,
      vals
    );
  } catch (prodErr) {
    console.warn('[saveProductRecord] Could not sync Product table:', prodErr);
  }

  // 3. Save all product media to ProductMedia table (matched by productId)
  try {
    await connOrPool.query('DELETE FROM ProductMedia WHERE productId = ?', [id]);
    if (thumbnail_image || mainImage) {
      const mainImgUrl = thumbnail_image || mainImage;
      await connOrPool.query(
        'INSERT INTO ProductMedia (id, productId, url, type, isMain, displayOrder) VALUES (?, ?, ?, ?, ?, ?)',
        [`pm-${id}-main`, id, mainImgUrl, 'IMAGE', 1, 0]
      );
    }
    let mediaOrder = 1;
    for (const imgUrl of rawImages) {
      if (imgUrl && imgUrl !== thumbnail_image && imgUrl !== mainImage) {
        await connOrPool.query(
          'INSERT INTO ProductMedia (id, productId, url, type, isMain, displayOrder) VALUES (?, ?, ?, ?, ?, ?)',
          [`pm-${id}-${mediaOrder}`, id, imgUrl, 'IMAGE', 0, mediaOrder]
        );
        mediaOrder++;
      }
    }
  } catch (mediaErr) {
    console.warn('[saveProductRecord] Could not sync ProductMedia table:', mediaErr);
  }

  // 4. Save all variants to ProductVariant table (matched by productId)
  try {
    await connOrPool.query('DELETE FROM ProductVariant WHERE productId = ?', [id]);
    let varCounter = 1;

    // Structured variations
    const rawVars = product.variations && Array.isArray(product.variations) ? product.variations : [];
    for (const vGroup of rawVars) {
      if (vGroup && vGroup.name && Array.isArray(vGroup.options)) {
        for (const optVal of vGroup.options) {
          if (optVal) {
            await connOrPool.query(
              'INSERT INTO ProductVariant (id, productId, name, optionValue) VALUES (?, ?, ?, ?)',
              [`pv-${id}-${varCounter}`, id, String(vGroup.name), String(optVal)]
            );
            varCounter++;
          }
        }
      }
    }

    // Color options
    const rawColors = product.color_options && Array.isArray(product.color_options) ? product.color_options : [];
    for (const color of rawColors) {
      if (color) {
        await connOrPool.query(
          'INSERT INTO ProductVariant (id, productId, name, optionValue) VALUES (?, ?, ?, ?)',
          [`pv-${id}-c-${varCounter}`, id, 'Color', String(color)]
        );
        varCounter++;
      }
    }

    // Size options
    const rawSizes = product.size_options && Array.isArray(product.size_options) ? product.size_options : [];
    for (const size of rawSizes) {
      if (size) {
        await connOrPool.query(
          'INSERT INTO ProductVariant (id, productId, name, optionValue) VALUES (?, ?, ?, ?)',
          [`pv-${id}-s-${varCounter}`, id, 'Size', String(size)]
        );
        varCounter++;
      }
    }
  } catch (varErr) {
    console.warn('[saveProductRecord] Could not sync ProductVariant table:', varErr);
  }

  return formatProductRow(productData);
}

/**
 * Attach ProductMedia and ProductVariant records joined by productId
 */
export async function attachProductRelations(
  connOrPool: mysql.Pool | mysql.PoolConnection,
  products: Product[]
): Promise<Product[]> {
  if (!products || products.length === 0) return [];
  const productIds = products.map((p) => p.id).filter(Boolean);
  if (productIds.length === 0) return products;

  try {
    // 1. Query ProductMedia by productId
    const [mediaRows]: any = await connOrPool.query(
      'SELECT productId, url, type, isMain, displayOrder FROM ProductMedia WHERE productId IN (?) ORDER BY isMain DESC, displayOrder ASC',
      [productIds]
    );

    // 2. Query ProductVariant by productId
    const [variantRows]: any = await connOrPool.query(
      'SELECT productId, name, optionValue, price, stock, sku, image FROM ProductVariant WHERE productId IN (?) ORDER BY id ASC',
      [productIds]
    );

    // Group media by productId
    const mediaByProduct = new Map<string, { mainImage: string; images: string[] }>();
    if (Array.isArray(mediaRows)) {
      for (const m of mediaRows) {
        if (!mediaByProduct.has(m.productId)) {
          mediaByProduct.set(m.productId, { mainImage: '', images: [] });
        }
        const entry = mediaByProduct.get(m.productId)!;
        if (m.url && !entry.images.includes(m.url)) {
          entry.images.push(m.url);
        }
        if (m.isMain && !entry.mainImage) {
          entry.mainImage = m.url;
        }
      }
    }

    // Group variants by productId
    const variantsByProduct = new Map<string, Map<string, string[]>>();
    if (Array.isArray(variantRows)) {
      for (const v of variantRows) {
        if (!variantsByProduct.has(v.productId)) {
          variantsByProduct.set(v.productId, new Map());
        }
        const prodVarMap = variantsByProduct.get(v.productId)!;
        if (!prodVarMap.has(v.name)) {
          prodVarMap.set(v.name, []);
        }
        if (!prodVarMap.get(v.name)!.includes(v.optionValue)) {
          prodVarMap.get(v.name)!.push(v.optionValue);
        }
      }
    }

    // Merge into each product
    return products.map((p) => {
      const media = mediaByProduct.get(p.id);
      const varMap = variantsByProduct.get(p.id);

      let mainImage = p.mainImage;
      let images = p.images;
      if (media && media.images.length > 0) {
        mainImage = media.mainImage || media.images[0];
        images = media.images;
      }

      let variations = p.variations;
      if (varMap && varMap.size > 0) {
        variations = Array.from(varMap.entries()).map(([name, options], idx) => ({
          id: `var-${p.id}-${idx + 1}`,
          name,
          options,
        }));
      }

      return {
        ...p,
        mainImage,
        images,
        variations,
      };
    });
  } catch (err) {
    console.warn('[attachProductRelations] Note: Relational tables query failed (fallback to product JSON):', err);
    return products;
  }
}

/**
 * Fetch a single product by ID or Slug with all ProductMedia and ProductVariant relations joined
 */
export async function fetchProductByIdWithRelations(
  connOrPool: mysql.Pool | mysql.PoolConnection,
  idOrSlug: string
): Promise<Product | null> {
  const [rows]: any = await connOrPool.query(
    'SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1',
    [idOrSlug, idOrSlug]
  );
  if (!rows || rows.length === 0) return null;

  const product = formatProductRow(rows[0]);
  const [attached] = await attachProductRelations(connOrPool, [product]);
  return attached || product;
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
      password = VALUES(password),
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

