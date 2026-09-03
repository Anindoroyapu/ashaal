import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatUserRow } from '@/lib/db';

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: `User not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: sanitizeUser(formatUserRow(rows[0])) });
  } catch (err: any) {
    console.error('GET /api/users/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch user: ' + err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const body = await request.json();
    const { name, phone, email, coins, memberTier, role, status, addresses, totalOrders, totalSpent } = body;
    const updates: string[] = [];
    const queryParams: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); queryParams.push(name); }
    if (phone !== undefined) { updates.push('phone = ?'); queryParams.push(phone); }
    if (email !== undefined) { updates.push('email = ?'); queryParams.push(email); }
    if (coins !== undefined) { updates.push('coins = ?'); queryParams.push(coins); }
    if (memberTier !== undefined) { updates.push('memberTier = ?'); queryParams.push(memberTier); }
    if (role !== undefined) { updates.push('role = ?'); queryParams.push(role); }
    if (status !== undefined) { updates.push('status = ?'); queryParams.push(status); }
    if (totalOrders !== undefined) { updates.push('totalOrders = ?'); queryParams.push(totalOrders); }
    if (totalSpent !== undefined) { updates.push('totalSpent = ?'); queryParams.push(totalSpent); }
    if (addresses !== undefined) { updates.push('addresses = ?'); queryParams.push(JSON.stringify(addresses)); }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, message: 'No fields provided to update' }, { status: 400 });
    }

    queryParams.push(id);
    const [result]: any = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, queryParams);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: `User not found with id: ${id}` }, { status: 404 });
    }

    const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    return NextResponse.json({ success: true, message: 'User updated successfully', user: sanitizeUser(formatUserRow(rows[0])) });
  } catch (err: any) {
    console.error('PUT /api/users/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update user: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [result]: any = await pool.query('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: `User not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/users/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete user: ' + err.message }, { status: 500 });
  }
}
