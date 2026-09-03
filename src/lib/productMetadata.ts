import type { Metadata } from 'next';
import { pool, initDatabase, formatProductRow } from '@/lib/db';
import { Product } from '@/types';
import { CATEGORIES_DATA } from '@/data/categoriesData';

const SITE_URL = 'https://ashaal.com.bd';

export async function getProductFromDb(id: string): Promise<Product | null> {
  try {
    await initDatabase();
    const [rows]: any = await pool.query(
      'SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1',
      [id, id]
    );
    if (!rows || rows.length === 0) return null;
    return formatProductRow(rows[0]);
  } catch (err) {
    console.warn('[productMetadata] Failed to fetch product:', err);
    return null;
  }
}

export async function generateProductMetadata(id: string): Promise<Metadata> {
  const product = await getProductFromDb(id);

  if (!product) {
    return {
      title: 'Product Details | Ashaal Bangladesh',
      description:
        'Explore 100% authentic products with fast delivery, Cash on Delivery, and brand warranty on Ashaal.com.bd.',
    };
  }

  const priceBdt = `৳${product.price.toLocaleString('en-BD')}`;
  const title = `${product.title} - ${priceBdt} | Ashaal.com.bd`;
  const description = `Buy ${product.title} online at best price ${priceBdt} in Bangladesh${
    product.originalPrice > product.price
      ? ` (Discounted from ৳${product.originalPrice.toLocaleString('en-BD')})`
      : ''
  }. 100% Authentic Brand, Cash on Delivery across all 64 districts, and fast DEX Express delivery.`;

  const imageUrl = product.mainImage.startsWith('http')
    ? product.mainImage
    : `${SITE_URL}${product.mainImage}`;

  const productUrl = `${SITE_URL}/product/${product.slug || product.id}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      product.title,
      product.titleBn || '',
      product.brand || 'Ashaal',
      product.category,
      'online shopping bangladesh',
      'buy online bd',
      'cash on delivery',
      'best price in bd',
      'ashaal bd',
    ].filter(Boolean),
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: `${product.title} - ${priceBdt} | Ashaal Bangladesh`,
      description,
      url: productUrl,
      siteName: 'Ashaal.com.bd',
      locale: 'en_US',
      alternateLocale: ['bn_BD'],
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ashaalbd',
      creator: '@ashaalbd',
      title: `${product.title} - ${priceBdt}`,
      description,
      images: [imageUrl],
    },
    other: {
      'product:price:amount': String(product.price),
      'product:price:currency': 'BDT',
      'product:availability': product.inStock ? 'in stock' : 'out of stock',
      'product:brand': product.brand || 'Ashaal',
      'product:condition': 'new',
      'og:price:amount': String(product.price),
      'og:price:currency': 'BDT',
    },
  };
}

export function generateCategoryMetadata(slug: string): Metadata {
  const category = CATEGORIES_DATA.find((c) => c.slug === slug);

  if (!category) {
    return {
      title: 'Category Products | Ashaal Bangladesh',
      description:
        'Discover top deals, discounts, and brand-new products with fast delivery in Bangladesh on Ashaal.com.bd.',
    };
  }

  const title = `${category.name} (${category.nameBn}) Online Shopping | Ashaal Bangladesh`;
  const description = `Shop the latest ${category.name} in Bangladesh with Cash on Delivery, instant bKash cashback, and official warranty. Browse authentic brands on Ashaal.com.bd.`;
  const categoryUrl = `${SITE_URL}/category/${category.slug}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords: [
      category.name,
      category.nameBn,
      `${category.name} price in bd`,
      'online shopping bangladesh',
      'ashaal bd',
    ],
    alternates: {
      canonical: categoryUrl,
    },
    openGraph: {
      title,
      description,
      url: categoryUrl,
      siteName: 'Ashaal.com.bd',
      locale: 'en_US',
      alternateLocale: ['bn_BD'],
      type: 'website',
      images: [
        {
          url: category.image || `${SITE_URL}/icon.png`,
          width: 1200,
          height: 630,
          alt: category.name,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@ashaalbd',
      creator: '@ashaalbd',
      title,
      description,
      images: [category.image || `${SITE_URL}/icon.png`],
    },
  };
}
