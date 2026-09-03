import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    framework: 'Next.js App Router',
    app: 'Ashaal Bangladesh & BetterMorning API',
    database: 'MySQL (51.79.229.154)',
    version: '2.0.0',
    time: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      userById: '/api/users/:id',
      userByToken: '/api/users/by-token/:token',
      products: '/api/products',
      productById: '/api/products/:id',
      orders: '/api/orders',
      orderById: '/api/orders/:id',
      banners: '/api/banners',
      bannerById: '/api/banners/:id',
      visitors: '/api/visitors',
      seed: '/api/seed'
    }
  });
}
