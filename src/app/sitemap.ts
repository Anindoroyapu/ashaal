import { MetadataRoute } from 'next';
import { CATEGORIES_DATA } from '@/data/categoriesData';
import { pool, initDatabase } from '@/lib/db';

const BASE_URL = 'https://ashaal.com.bd';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date().toISOString();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/flash-sale`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.95,
    },
    {
      url: `${BASE_URL}/ashaalmall`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/coins-rewards`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/seller-center`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/customer-care`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Category routes
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORIES_DATA.map((cat) => ({
    url: `${BASE_URL}/category/${cat.slug}`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 0.85,
  }));

  // Fetch live products from MySQL for dynamic product indexing
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    await initDatabase();
    const [rows]: any = await pool.query('SELECT id, slug, updatedAt FROM products');
    if (Array.isArray(rows) && rows.length > 0) {
      productRoutes = rows.map((p) => ({
        url: `${BASE_URL}/product/${p.slug || p.id}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt).toISOString() : currentDate,
        changeFrequency: 'daily',
        priority: 0.8,
      }));
    }
  } catch (err) {
    console.warn('[Sitemap] Could not query dynamic products from DB:', err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

