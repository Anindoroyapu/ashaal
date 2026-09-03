import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatProductRow, saveProductRecord } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    await initDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search') || searchParams.get('q');
    const limit = searchParams.get('limit');

    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' AND (categorySlug = ? OR category = ?)';
      params.push(category, category);
    }

    if (brand && brand !== 'all') {
      sql += ' AND LOWER(brand) = LOWER(?)';
      params.push(brand);
    }

    const searchQuery = (search || '').toLowerCase().trim();
    if (searchQuery) {
      sql += ' AND (LOWER(title) LIKE ? OR LOWER(titleBn) LIKE ? OR LOWER(brand) LIKE ? OR LOWER(category) LIKE ?)';
      const likeParam = `%${searchQuery}%`;
      params.push(likeParam, likeParam, likeParam, likeParam);
    }

    if (sort === 'price-asc') {
      sql += ' ORDER BY price ASC';
    } else if (sort === 'price-desc') {
      sql += ' ORDER BY price DESC';
    } else if (sort === 'rating') {
      sql += ' ORDER BY rating DESC';
    } else if (sort === 'popular') {
      sql += ' ORDER BY soldCount DESC';
    } else {
      sql += ' ORDER BY createdAt DESC';
    }

    if (limit) {
      const numLimit = parseInt(limit, 10);
      if (!isNaN(numLimit) && numLimit > 0) {
        sql += ' LIMIT ?';
        params.push(numLimit);
      }
    }

    const [rows]: any = await pool.query(sql, params);
    const products = rows.map(formatProductRow);

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch products: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const productData = await request.json();
    const saved = await saveProductRecord(pool, productData);
    return NextResponse.json({ success: true, message: 'Product saved successfully', product: saved }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/products error:', err);
    return NextResponse.json({ success: false, message: 'Failed to save product: ' + err.message }, { status: 500 });
  }
}

