import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatUserRow, saveUserRecord } from '@/lib/db';

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const status = searchParams.get('status');
    const search = searchParams.get('search') || searchParams.get('q');
    const limit = searchParams.get('limit');

    let sql = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];

    if (role && role !== 'all') {
      sql += ' AND role = ?';
      params.push(role);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    const searchQuery = (search || '').toLowerCase().trim();
    if (searchQuery) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR phone LIKE ? OR id LIKE ?)';
      const likeParam = `%${searchQuery}%`;
      params.push(likeParam, likeParam, likeParam, likeParam);
    }

    sql += ' ORDER BY createdAt DESC';

    if (limit) {
      const numLimit = parseInt(limit, 10);
      if (!isNaN(numLimit) && numLimit > 0) {
        sql += ' LIMIT ?';
        params.push(numLimit);
      }
    }

    const [rows]: any = await pool.query(sql, params);
    const users = rows.map(formatUserRow).map(sanitizeUser);

    return NextResponse.json({
      success: true,
      count: users.length,
      users,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/users error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch users: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const userData = await request.json();
    if (!userData.name || !userData.email) {
      return NextResponse.json({ success: false, message: 'name and email are required fields.' }, { status: 400 });
    }

    const [existing]: any = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [userData.email]);
    if (existing.length > 0) {
      return NextResponse.json({ success: false, message: 'User with this email already exists.' }, { status: 409 });
    }

    const saved = await saveUserRecord(pool, userData);
    return NextResponse.json({ success: true, message: 'User registered successfully', user: sanitizeUser(saved) }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/users error:', err);
    return NextResponse.json({ success: false, message: 'Failed to save user: ' + err.message }, { status: 500 });
  }
}
