import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatUserRow } from '@/lib/db';

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await initDatabase();
    const { token } = await params;
    const [rows]: any = await pool.query('SELECT * FROM users WHERE token = ? LIMIT 1', [token]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'No active user session for token' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: sanitizeUser(formatUserRow(rows[0])) });
  } catch (err: any) {
    console.error('GET /api/users/by-token error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch user by token: ' + err.message }, { status: 500 });
  }
}
