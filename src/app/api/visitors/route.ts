import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const [rows]: any = await pool.query('SELECT * FROM visitors ORDER BY id DESC LIMIT 50');
    return NextResponse.json({ success: true, count: rows.length, visitors: rows });
  } catch (err: any) {
    console.error('GET /api/visitors error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch visitors: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const body = await request.json();
    const { ip, name, phone, location, page, platform, time } = body;
    await pool.query(
      `INSERT INTO visitors (ip, name, phone, location, page, platform, time)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ip || '127.0.0.1', name || '—', phone || '—', location || 'Dhaka, BD', page || '/', platform || 'Web', time || 'Just now']
    );
    return NextResponse.json({ success: true, message: 'Visitor logged' }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/visitors error:', err);
    return NextResponse.json({ success: false, message: 'Failed to log visitor: ' + err.message }, { status: 500 });
  }
}

