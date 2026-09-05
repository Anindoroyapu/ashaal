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

  // Also sync to normalized Product table
  try {
    await connOrPool.query(
      `INSERT INTO Product (
        id, title, titleBn, slug, brand, category, categorySlug, subCategory,
        price, originalPrice, discountPercentage, rating, reviewsCount, questionsCount,
        soldCount, inStock, isDarazMall, isFreeDelivery, isFlashSale, flashSaleEndTime,
        coinsCashback, mainImage, description, descriptionBn, specifications,
        seller, reviews, warranty, returnPolicy, tags, deliveryFee, estimatedDeliveryDays
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        description = VALUES(description),
        descriptionBn = VALUES(descriptionBn),
        specifications = VALUES(specifications),
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
        coinsCashback, mainImage, description, descriptionBn, specifications,
        seller, reviews, warranty, returnPolicy, tags, deliveryFee, estimatedDeliveryDays
      ]
    );
  } catch (prodErr) {
    console.warn('[saveProductRecord] Could not sync Product table:', prodErr);
  }

  // 1. Save all product media to ProductMedia table (matched by productId)
  try {
    await connOrPool.query('DELETE FROM ProductMedia WHERE productId = ?', [id]);
    if (mainImage) {
      await connOrPool.query(
        'INSERT INTO ProductMedia (id, productId, url, type, isMain, displayOrder) VALUES (?, ?, ?, ?, ?, ?)',
        [`pm-${id}-main`, id, mainImage, 'IMAGE', 1, 0]
      );
    }
    const rawImages: string[] = product.images && Array.isArray(product.images) ? product.images : [];
    let mediaOrder = 1;
    for (const imgUrl of rawImages) {
      if (imgUrl && imgUrl !== mainImage) {
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

  // 2. Save all variants to ProductVariant table (matched by productId)
  try {
    await connOrPool.query('DELETE FROM ProductVariant WHERE productId = ?', [id]);
    const rawVars = product.variations && Array.isArray(product.variations) ? product.variations : [];
    let varCounter = 1;
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
  } catch (varErr) {
    console.warn('[saveProductRecord] Could not sync ProductVariant table:', varErr);
  }

  return formatProductRow({
    id, title, titleBn, slug, brand, category, categorySlug, subCategory,
    price, originalPrice, discountPercentage, rating, reviewsCount, questionsCount,
    soldCount, inStock, isDarazMall, isFreeDelivery, isFlashSale, flashSaleEndTime,
    coinsCashback, mainImage, images, description, descriptionBn, specifications,
    variations, seller, reviews, warranty, returnPolicy, tags, deliveryFee, estimatedDeliveryDays
  });
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

