import { NextRequest, NextResponse } from 'next/server';
import { pool, initDatabase, saveUserRecord, formatUserRow } from '@/lib/db';
import { UserProfile } from '@/types';

function sanitizeUser(user: any) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function POST(request: NextRequest) {
  try {
    await initDatabase();
    const body = await request.json();
    const { name, email, phone, password } = body || {};

    if (!name || !String(name).trim()) {
      return NextResponse.json(
        { success: false, message: 'অনুগ্রহ করে পুরো নাম লিখুন (Full name is required).' },
        { status: 400 }
      );
    }

    const cleanEmail = email ? String(email).trim().toLowerCase() : '';
    const cleanPhone = phone ? String(phone).trim() : '';
    const cleanDigits = cleanPhone.replace(/\D/g, '');

    if (!cleanEmail && !cleanPhone) {
      return NextResponse.json(
        { success: false, message: 'ইমেইল অথবা ফোন নম্বর প্রদান করুন (Email or phone is required).' },
        { status: 400 }
      );
    }

    if (!password || String(password).trim().length < 4) {
      return NextResponse.json(
        { success: false, message: 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে (Password must be at least 4 characters).' },
        { status: 400 }
      );
    }

    // Check duplicate email
    if (cleanEmail) {
      const [existingEmail]: any = await pool.query(
        'SELECT id FROM users WHERE LOWER(email) = ? LIMIT 1',
        [cleanEmail]
      );
      if (existingEmail && existingEmail.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।'
          },
          { status: 409 }
        );
      }
    }

    // Check duplicate phone
    if (cleanDigits.length >= 8) {
      const [existingPhone]: any = await pool.query(
        `SELECT id FROM users WHERE REPLACE(REPLACE(REPLACE(REPLACE(phone, ' ', ''), '-', ''), '+', ''), '(', '') LIKE ? LIMIT 1`,
        [`%${cleanDigits.slice(-10)}%`]
      );
      if (existingPhone && existingPhone.length > 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'এই ফোন নম্বর দিয়ে ইতিমধ্যে অ্যাকাউন্ট রয়েছে। অনুগ্রহ করে লগইন করুন।'
          },
          { status: 409 }
        );
      }
    }

    const newUserId = `usr-${Date.now()}`;
    const userToken = `usr_tok_${newUserId}_${Math.random().toString(36).substring(2, 9)}`;
    const finalEmail = cleanEmail || `${cleanDigits || newUserId}@customer.ashaal.com.bd`;

    const userToSave: Partial<UserProfile> & { id: string } = {
      id: newUserId,
      name: String(name).trim(),
      email: finalEmail,
      phone: cleanPhone || '+880 1700-000000',
      password: String(password).trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      coins: 500, // Welcome gift of 500 coins
      memberTier: 'Silver Member' as const,
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      role: 'customer' as const,
      status: 'active' as const,
      token: userToken,
      totalOrders: 0,
      totalSpent: 0,
      addresses: []
    };

    const saved = await saveUserRecord(pool, userToSave);

    return NextResponse.json(
      {
        success: true,
        message: 'অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! (+৫০০ কয়েন বোনাস 🎉)',
        user: sanitizeUser(saved),
        token: userToken
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('POST /api/auth/signup error:', err);
    return NextResponse.json(
      {
        success: false,
        message: 'অ্যাকাউন্ট তৈরিতে ত্রুটি হয়েছে: ' + (err?.message || 'সার্ভার ত্রুটি')
      },
      { status: 500 }
    );
  }
}
