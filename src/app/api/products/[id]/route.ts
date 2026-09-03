import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatProductRow } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1', [id, id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: `Product not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, product: formatProductRow(rows[0]) });
  } catch (err: any) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch product: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [result]: any = await pool.query('DELETE FROM products WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: `Product not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete product: ' + err.message }, { status: 500 });
  }
}

