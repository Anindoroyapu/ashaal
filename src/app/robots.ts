import { MetadataRoute } from 'next';

const BASE_URL = 'https://ashaal.com.bd';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/product/',
          '/products/',
          '/category/',
          '/search',
          '/flash-sale',
          '/ashaalmall',
          '/daraz-mall',
          '/customer-care',
          '/seller-center',
          '/coins-rewards',
        ],
        disallow: [
          '/manage',
          '/manage/*',
          '/api/*',
          '/cart',
          '/checkout',
          '/order-confirmation',
          '/my-account',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/manage', '/manage/*', '/api/*'],
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/manage', '/manage/*', '/api/*'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}

