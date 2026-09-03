import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatOrderRow, syncOrderStatusTable } from '@/lib/db';
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [rows]: any = await pool.query('SELECT * FROM orders WHERE id = ? OR orderNumber = ? LIMIT 1', [id, id]);

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: `Order not found with id: ${id}` }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: formatOrderRow(rows[0]) });
  } catch (err: any) {
    console.error('GET /api/orders/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch order: ' + err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const { orderStatus, paymentStatus, timeline, trackingNumber, courier, shippingAddress } = await request.json();
    const updates: string[] = [];
    const queryParams: any[] = [];

    if (orderStatus) {
      updates.push('orderStatus = ?');
      queryParams.push(orderStatus);
    }
    if (paymentStatus) {
      updates.push('paymentStatus = ?');
      queryParams.push(paymentStatus);
    }
    if (trackingNumber !== undefined) {
      updates.push('trackingNumber = ?');
      queryParams.push(trackingNumber);
    }
    if (courier !== undefined) {
      updates.push('courier = ?');
      queryParams.push(courier);
    }
    if (timeline) {
      updates.push('timeline = ?');
      queryParams.push(JSON.stringify(timeline));
    }
    if (shippingAddress) {
      updates.push('shippingAddress = ?');
      queryParams.push(JSON.stringify(shippingAddress));
    }

    if (updates.length === 0) {
      return NextResponse.json({ success: false, message: 'No fields to update' }, { status: 400 });
    }

    queryParams.push(id);
    const [result]: any = await pool.query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      queryParams
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: `Order not found with id: ${id}` }, { status: 404 });
    }

    const [rows]: any = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
    if (rows.length > 0) {
      await syncOrderStatusTable(pool, id, rows[0].orderStatus);
    }
    return NextResponse.json({ success: true, message: 'Order updated successfully', order: formatOrderRow(rows[0]) });
  } catch (err: any) {
    console.error('PUT /api/orders/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to update order: ' + err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await initDatabase();
    const { id } = await params;
    const [result]: any = await pool.query('DELETE FROM orders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: `Order not found with id: ${id}` }, { status: 404 });
    }

    // Delete from all status tables
  } catch (err: any) {
    console.error('DELETE /api/orders/[id] error:', err);
    return NextResponse.json({ success: false, message: 'Failed to delete order: ' + err.message }, { status: 500 });
  }
}

