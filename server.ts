import 'dotenv/config';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  pool,
  initDatabase,
  seedProducts,
  seedBanners,
  seedUsers,
  seedOrders,
  seedVisitors,
  formatProductRow,
  saveProductRecord,
  formatOrderRow,
  saveOrderRecord,
  formatUserRow,
  saveUserRecord
} from './src/server/db.js';

const appDir = process.cwd();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Enable CORS for public external API access
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Session-Token');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Helper to strip sensitive fields from user objects
function sanitizeUser(user: any) {
  if (!user) return null;
  const { password, ...safeUser } = user;
  return safeUser;
}

// ==========================================
// 1. HEALTH & METADATA API
// ==========================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Ashaal Bangladesh & BetterMorning API',
    database: 'MySQL (51.79.229.154)',
    version: '1.0.0',
    time: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      userById: '/api/users/:id',
      userByToken: '/api/users/by-token/:token',
      products: '/api/products',
      productById: '/api/products/:id',
      orders: '/api/orders',
      orderById: '/api/orders/:id',
      banners: '/api/banners',
      bannerById: '/api/banners/:id',
      visitors: '/api/visitors',
      seed: '/api/seed'
    }
  });
});

// ==========================================
// 2. SEED API (Admin trigger to populate DB)
// ==========================================
app.post('/api/seed', async (req, res) => {
  try {
    await seedProducts();
    await seedBanners();
    await seedUsers();
    await seedOrders();
    await seedVisitors();
    res.json({ success: true, message: 'Successfully seeded MySQL database with marketplace data' });
  } catch (err: any) {
    console.error('Seed error:', err);
    res.status(500).json({ success: false, message: 'Seed failed: ' + err.message });
  }
});

// ==========================================
// 3. PRODUCTS API (GET, POST, DELETE)
// ==========================================
app.get('/api/products', async (req, res) => {
  try {
    const { category, brand, sort, search, q, limit } = req.query;
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

    const searchQuery = ((search || q || '') as string).toLowerCase().trim();
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
      const numLimit = parseInt(limit as string, 10);
      if (!isNaN(numLimit) && numLimit > 0) {
        sql += ' LIMIT ?';
        params.push(numLimit);
      }
    }

    const [rows]: any = await pool.query(sql, params);
    const products = rows.map(formatProductRow);

    res.json({
      success: true,
      count: products.length,
      products,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/products error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch products: ' + err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM products WHERE id = ? OR slug = ? LIMIT 1', [
      req.params.id,
      req.params.id
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Product not found with id: ${req.params.id}` });
    }
    res.json({ success: true, product: formatProductRow(rows[0]) });
  } catch (err: any) {
    console.error('GET /api/products/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch product: ' + err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const productData = req.body;
    const saved = await saveProductRecord(pool, productData);
    res.status(201).json({ success: true, message: 'Product saved successfully', product: saved });
  } catch (err: any) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ success: false, message: 'Failed to save product: ' + err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const [result]: any = await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `Product not found with id: ${req.params.id}` });
    }
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/products/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete product: ' + err.message });
  }
});

// ==========================================
// 4. ORDERS API (GET, POST, PUT, DELETE)
// ==========================================
app.get('/api/orders', async (req, res) => {
  try {
    const { status, orderId, userId } = req.query;
    let sql = 'SELECT * FROM orders WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      sql += ' AND orderStatus = ?';
      params.push(status);
    }
    if (orderId) {
      sql += ' AND (id = ? OR orderNumber = ?)';
      params.push(orderId, orderId);
    }
    if (userId) {
      sql += ' AND userId = ?';
      params.push(userId);
    }

    sql += ' ORDER BY updatedAt DESC';

    const [rows]: any = await pool.query(sql, params);
    const orders = rows.map(formatOrderRow);

    res.json({
      success: true,
      count: orders.length,
      orders,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch orders: ' + err.message });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM orders WHERE id = ? OR orderNumber = ? LIMIT 1', [
      req.params.id,
      req.params.id
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Order not found with id: ${req.params.id}` });
    }
    res.json({ success: true, order: formatOrderRow(rows[0]) });
  } catch (err: any) {
    console.error('GET /api/orders/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch order: ' + err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;
    const saved = await saveOrderRecord(pool, orderData);
    res.status(201).json({ success: true, message: 'Order placed successfully', order: saved });
  } catch (err: any) {
    console.error('POST /api/orders error:', err);
    res.status(500).json({ success: false, message: 'Failed to save order: ' + err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const { orderStatus, paymentStatus, timeline } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (orderStatus) {
      updates.push('orderStatus = ?');
      params.push(orderStatus);
    }
    if (paymentStatus) {
      updates.push('paymentStatus = ?');
      params.push(paymentStatus);
    }
    if (timeline) {
      updates.push('timeline = ?');
      params.push(JSON.stringify(timeline));
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    params.push(req.params.id);
    const [result]: any = await pool.query(
      `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `Order not found with id: ${req.params.id}` });
    }

    const [rows]: any = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Order updated successfully', order: formatOrderRow(rows[0]) });
  } catch (err: any) {
    console.error('PUT /api/orders/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to update order: ' + err.message });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  try {
    const [result]: any = await pool.query('DELETE FROM orders WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `Order not found with id: ${req.params.id}` });
    }
    res.json({ success: true, message: 'Order deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/orders/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete order: ' + err.message });
  }
});

// ==========================================
// 5. BANNERS API (GET, POST, DELETE)
// ==========================================
app.get('/api/banners', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM banners ORDER BY id ASC');
    res.json({
      success: true,
      count: rows.length,
      banners: rows,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/banners error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch banners: ' + err.message });
  }
});

app.get('/api/banners/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM banners WHERE id = ? LIMIT 1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `Banner not found with id: ${req.params.id}` });
    }
    res.json({ success: true, banner: rows[0] });
  } catch (err: any) {
    console.error('GET /api/banners/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch banner: ' + err.message });
  }
});

app.post('/api/banners', async (req, res) => {
  try {
    const b = req.body;
    const id = b.id || `b-${Date.now()}`;
    await pool.query(
      `INSERT INTO banners (id, title, subtitle, image, linkType, targetId, bgColor, badge)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        title = VALUES(title), subtitle = VALUES(subtitle), image = VALUES(image),
        linkType = VALUES(linkType), targetId = VALUES(targetId), bgColor = VALUES(bgColor), badge = VALUES(badge)`,
      [id, b.title, b.subtitle, b.image, b.linkType || 'flash-sale', b.targetId || null, b.bgColor || null, b.badge || null]
    );
    res.status(201).json({ success: true, message: 'Banner saved successfully', banner: { ...b, id } });
  } catch (err: any) {
    console.error('POST /api/banners error:', err);
    res.status(500).json({ success: false, message: 'Failed to save banner: ' + err.message });
  }
});

app.delete('/api/banners/:id', async (req, res) => {
  try {
    const [result]: any = await pool.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `Banner not found with id: ${req.params.id}` });
    }
    res.json({ success: true, message: 'Banner deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/banners/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete banner: ' + err.message });
  }
});

// ==========================================
// 6. USERS API (GET, POST, PUT, DELETE)
// ==========================================
app.get('/api/users', async (req, res) => {
  try {
    const { role, status, search, q, limit } = req.query;
    let sql = 'SELECT * FROM users WHERE 1=1';
    const params: any[] = [];

    if (role && role !== 'all') {
      sql += ' AND role = ?';
      params.push(role);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    const searchQuery = ((search || q || '') as string).toLowerCase().trim();
    if (searchQuery) {
      sql += ' AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ? OR phone LIKE ? OR id LIKE ?)';
      const likeParam = `%${searchQuery}%`;
      params.push(likeParam, likeParam, likeParam, likeParam);
    }

    sql += ' ORDER BY createdAt DESC';

    if (limit) {
      const numLimit = parseInt(limit as string, 10);
      if (!isNaN(numLimit) && numLimit > 0) {
        sql += ' LIMIT ?';
        params.push(numLimit);
      }
    }

    const [rows]: any = await pool.query(sql, params);
    const users = rows.map(formatUserRow).map(sanitizeUser);

    res.json({
      success: true,
      count: users.length,
      users,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err: any) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch users: ' + err.message });
  }
});

app.get('/api/users/by-token/:token', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE token = ? LIMIT 1', [req.params.token]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No active user session for token' });
    }
    res.json({ success: true, user: sanitizeUser(formatUserRow(rows[0])) });
  } catch (err: any) {
    console.error('GET /api/users/by-token error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user by token: ' + err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ? LIMIT 1', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: `User not found with id: ${req.params.id}` });
    }
    res.json({ success: true, user: sanitizeUser(formatUserRow(rows[0])) });
  } catch (err: any) {
    console.error('GET /api/users/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch user: ' + err.message });
  }
});

app.post('/api/users', async (req, res) => {
  try {
    const userData = req.body;
    if (!userData.name || !userData.email) {
      return res.status(400).json({ success: false, message: 'name and email are required fields.' });
    }

    const [existing]: any = await pool.query('SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [userData.email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'User with this email already exists.' });
    }

    const saved = await saveUserRecord(pool, userData);
    res.status(201).json({ success: true, message: 'User registered successfully', user: sanitizeUser(saved) });
  } catch (err: any) {
    console.error('POST /api/users error:', err);
    res.status(500).json({ success: false, message: 'Failed to save user: ' + err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, phone, email, coins, memberTier, role, status, addresses, totalOrders, totalSpent } = req.body;
    const updates: string[] = [];
    const params: any[] = [];

    if (name !== undefined) { updates.push('name = ?'); params.push(name); }
    if (phone !== undefined) { updates.push('phone = ?'); params.push(phone); }
    if (email !== undefined) { updates.push('email = ?'); params.push(email); }
    if (coins !== undefined) { updates.push('coins = ?'); params.push(coins); }
    if (memberTier !== undefined) { updates.push('memberTier = ?'); params.push(memberTier); }
    if (role !== undefined) { updates.push('role = ?'); params.push(role); }
    if (status !== undefined) { updates.push('status = ?'); params.push(status); }
    if (totalOrders !== undefined) { updates.push('totalOrders = ?'); params.push(totalOrders); }
    if (totalSpent !== undefined) { updates.push('totalSpent = ?'); params.push(totalSpent); }
    if (addresses !== undefined) { updates.push('addresses = ?'); params.push(JSON.stringify(addresses)); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields provided to update' });
    }

    params.push(req.params.id);
    const [result]: any = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `User not found with id: ${req.params.id}` });
    }

    const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User updated successfully', user: sanitizeUser(formatUserRow(rows[0])) });
  } catch (err: any) {
    console.error('PUT /api/users/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to update user: ' + err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    const [result]: any = await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: `User not found with id: ${req.params.id}` });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err: any) {
    console.error('DELETE /api/users/:id error:', err);
    res.status(500).json({ success: false, message: 'Failed to delete user: ' + err.message });
  }
});

// ==========================================
// 7. VISITORS API (GET, POST)
// ==========================================
app.get('/api/visitors', async (req, res) => {
  try {
    const [rows]: any = await pool.query('SELECT * FROM visitors ORDER BY id DESC LIMIT 50');
    res.json({ success: true, count: rows.length, visitors: rows });
  } catch (err: any) {
    console.error('GET /api/visitors error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch visitors: ' + err.message });
  }
});

app.post('/api/visitors', async (req, res) => {
  try {
    const { ip, name, phone, location, page, platform, time } = req.body;
    await pool.query(
      `INSERT INTO visitors (ip, name, phone, location, page, platform, time)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [ip || '127.0.0.1', name || '—', phone || '—', location || 'Dhaka, BD', page || '/', platform || 'Web', time || 'Just now']
    );
    res.status(201).json({ success: true, message: 'Visitor logged' });
  } catch (err: any) {
    console.error('POST /api/visitors error:', err);
    res.status(500).json({ success: false, message: 'Failed to log visitor: ' + err.message });
  }
});

// ==========================================
// GLOBAL ERROR HANDLING MIDDLEWARE FOR API
// ==========================================
app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server API Error:', err.stack || err.message || err);
  res.status(500).json({ success: false, message: 'Internal server error in API' });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.path} not found` });
});

// Start server with Vite middleware or production static build
async function startServer() {
  try {
    // Initialize MySQL Database
    await initDatabase();
  } catch (err) {
    console.error('Warning: Database initialization error:', err);
  }

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`API available at http://0.0.0.0:${PORT}/api/`);
  });
}

startServer();