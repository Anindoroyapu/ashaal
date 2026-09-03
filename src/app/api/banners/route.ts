import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase } from '@/lib/db';

export async function GET() {
  try {
    await initDatabase();
    const [rows]: any = await pool.query('SELECT * FROM banners ORDER BY id ASC');
    return NextResponse.json({
      success: true,
      count: rows.length,
      banners: rows,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/banners error:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch banners: ' + err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const b = await request.json();
    const id = b.id || `b-${Date.now()}`;
    await pool.query(
      `INSERT INTO banners (id, title, subtitle, image, linkType, targetId, bgColor, badge)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        title = VALUES(title), subtitle = VALUES(subtitle), image = VALUES(image),
        linkType = VALUES(linkType), targetId = VALUES(targetId), bgColor = VALUES(bgColor), badge = VALUES(badge)`,
      [id, b.title, b.subtitle, b.image, b.linkType || 'flash-sale', b.targetId || null, b.bgColor || null, b.badge || null]
    );
    return NextResponse.json({ success: true, message: 'Banner saved successfully', banner: { ...b, id } }, { status: 201 });
  } catch (err: any) {
    console.error('POST /api/banners error:', err);
    return NextResponse.json({ success: false, message: 'Failed to save banner: ' + err.message }, { status: 500 });
  }
}

