import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, fetchProductByIdWithRelations, saveProductRecord } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const product = await fetchProductByIdWithRelations(pool, id);

    if (!product) {
      return NextResponse.json({ success: false, message: `Product not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, product });
  } catch (err: any) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch product: ' + err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const updateData = await request.json();
    const saved = await saveProductRecord(pool, { ...updateData, id });
    return NextResponse.json({ success: true, message: 'Product updated successfully', product: saved });
  } catch (err: any) {
    console.error('PUT /api/products/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update product: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;

    // Delete related child rows from ProductMedia and ProductVariant first
    await pool.query('DELETE FROM ProductMedia WHERE productId = ?', [id]);
    await pool.query('DELETE FROM ProductVariant WHERE productId = ?', [id]);
    await pool.query('DELETE FROM Product WHERE id = ?', [id]);
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

