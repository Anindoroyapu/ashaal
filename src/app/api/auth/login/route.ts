import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, formatUserRow } from '@/lib/db';

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const body = await request.json();
    const { identifier, password } = body || {};

    if (!identifier || !String(identifier).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'ফোন নম্বর অথবা ইমেইল প্রয়োজন (Phone number or email is required).'
        },
        { status: 400 }
      );
    }

    if (!password || !String(password).trim()) {
      return NextResponse.json(
        {
          success: false,
          message: 'অনুগ্রহ করে পাসওয়ার্ড দিন (Password is required).'
        },
        { status: 400 }
      );
    }

    const cleanInput = String(identifier).trim();
    const cleanLower = cleanInput.toLowerCase();
    const cleanDigits = cleanInput.replace(/\D/g, '');

    // Search query matching by email, id, or phone digits
    let query = `
      SELECT * FROM users 
      WHERE LOWER(email) = ? 
         OR id = ?
    `;
    const params: any[] = [cleanLower, cleanInput];

    if (cleanDigits.length >= 6) {
      // Look for phone containing or matching digits
      query += ` OR REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+', ''), '(', '') LIKE ?`;
      params.push(`%${cleanDigits.slice(-10)}%`);
    } else {
      query += ` OR phone = ?`;
      params.push(cleanInput);
    }

    query += ` LIMIT 1`;

    const [rows]: any = await pool.query(query, params);

    if (!rows || rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'কোনো অ্যাকাউন্ট পাওয়া যায়নি। অনুগ্রহ করে সঠিক তথ্য দিন অথবা সাইন আপ করুন।'
        },
        { status: 404 }
      );
    }

    const dbUser = rows[0];

    // Verify password if user has password set in database
    if (dbUser.password) {
      const inputPass = String(password).trim();
      const storedPass = String(dbUser.password).trim();

      if (inputPass !== storedPass) {
        return NextResponse.json(
          {
            success: false,
            message: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।'
          },
          { status: 401 }
        );
      }
    }

    // Ensure user has a valid persistent token
    let userToken = dbUser.token;
    if (!userToken) {
      userToken = `usr_tok_${dbUser.id}_${Math.random().toString(36).substring(2, 9)}`;
      await pool.query('UPDATE users SET token = ? WHERE id = ?', [userToken, dbUser.id]);
      dbUser.token = userToken;
    }

    const formatted = formatUserRow(dbUser);
    const safeUser = sanitizeUser(formatted);

    return NextResponse.json({
      success: true,
      message: 'লগইন সফল হয়েছে',
      user: safeUser,
      token: userToken
    });
  } catch (err: any) {
    console.error('POST /api/auth/login error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'লগইন প্রক্রিয়াকরণে সমস্যা হয়েছে: ' + (err?.message || 'সার্ভার ত্রুটি')
      },
      { status: 500 }
    );
  }
}
