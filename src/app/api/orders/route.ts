import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatOrderRow, saveOrderRecord } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const orderId = searchParams.get('orderId');
    const userId = searchParams.get('userId');

    const validStatusTables: Record<string, string> = {
      placed: 'orders_placed',
      processing: 'orders_processing',
      shipped: 'orders_shipped',
      delivered: 'orders_delivered',
      cancelled: 'orders_cancelled',
    };

    const cleanStatus = status?.toLowerCase();
    const sourceTable = cleanStatus && validStatusTables[cleanStatus]
      ? validStatusTables[cleanStatus]
      : 'orders';

    let sql = `SELECT * FROM ${sourceTable} WHERE 1=1`;
    const params: any[] = [];

    if (status && status !== 'all' && sourceTable === 'orders') {
      sql += ' AND orderStatus = ?';
      params.push(status);
    }
    if (orderId) {
      sql += ' AND (id = ? OR orderNumber = ?)';
      params.push(orderId, orderId);
    }
    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }

    sql += ' ORDER BY updatedAt DESC';

    const [rows]: any = await pool.query(sql, params);
    const orders = rows.map(formatOrderRow);

    return NextResponse.json({
      success: true,
      count: orders.length,
      orders,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const orderData = await request.json();
    const saved = await saveOrderRecord(pool, orderData);
    return NextResponse.json({ success: true, message: 'Order placed successfully', order: saved }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ success: false, message: 'Failed to save order: ' + err.message }, { status: 500 });
  }
}

