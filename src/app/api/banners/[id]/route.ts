import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [rows]: any = await pool.query('SELECT * FROM banners WHERE id = ? LIMIT 1', [id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: `Banner not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, banner: rows[0] });
  } catch (err: any) {
    console.error('GET /api/banners/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch banner: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [result]: any = await pool.query('DELETE FROM banners WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: `Banner not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/banners/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete banner: ' + err.message }, { status: 500 });
  }
}
