import { NextResponse } from 'next/server';
import { seedProducts, seedBanners, seedUsers, seedOrders, seedVisitors } from '@/lib/db';

export async function POST() {
  try {
    await seedProducts();
    await seedBanners();
    await seedUsers();
    await seedOrders();
    await seedVisitors();
    return NextResponse.json({ success: true, message: 'Successfully seeded MySQL database with marketplace data' });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ success: false, message: 'Seed failed: ' + err.message }, { status: 500 });
  }
}
