import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, deleteDoc, query, orderBy } from "firebase/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };

const app = express();
const PORT = 3000;

const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

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
  const { token, password, ...safeUser } = user;
  return safeUser;
}

// In-memory / initial seed data for user list API
let usersStore = [
  {
    id: 'usr-tanvir-1',
    name: 'Tanvir Ahmed',
    phone: '+880 1712-345678',
    email: 'tanvir.ahmed@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
    coins: 480,
    memberTier: 'Gold Member',
    joinDate: 'Jan 2023',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_tanvir_94821',
    totalOrders: 14,
    totalSpent: 28400,
    createdAt: '2023-01-15T10:00:00.000Z'
  },
  {
    id: 'usr-anindo-2',
    name: 'Anindo Roy',
    phone: '+880 1819-876543',
    email: 'anindo.roy@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    coins: 850,
    memberTier: 'Diamond Club',
    joinDate: 'Mar 2023',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_anindo_55102',
    totalOrders: 28,
    totalSpent: 64200,
    createdAt: '2023-03-20T14:30:00.000Z'
  },
  {
    id: 'usr-sadia-3',
    name: 'Sadia Islam',
    phone: '+880 1911-223344',
    email: 'sadia.islam@yahoo.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    coins: 210,
    memberTier: 'Silver Member',
    joinDate: 'Aug 2024',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_sadia_88301',
    totalOrders: 5,
    totalSpent: 9800,
    createdAt: '2024-08-10T09:15:00.000Z'
  },
  {
    id: 'usr-rafiq-4',
    name: 'Rafiqul Hasan',
    phone: '+880 1622-998877',
    email: 'rafiqul.hasan@outlook.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    coins: 120,
    memberTier: 'Silver Member',
    joinDate: 'Nov 2024',
    role: 'customer',
    status: 'active',
    token: 'usr_tok_rafiq_47291',
    totalOrders: 3,
    totalSpent: 4500,
    createdAt: '2024-11-05T16:45:00.000Z'
  }
];

// In-memory stores synced from Firestore
let productsStore: any[] = [];
let ordersStore: any[] = [];
let bannersStore: any[] = [];

// Sync Firestore data to in-memory stores
async function syncStoresFromFirestore() {
  try {
    // Products
    try {
      const productsRef = collection(db, 'products');
      const productsSnap = await getDocs(productsRef);
      if (!productsSnap.empty) {
        productsStore = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        productsStore = [];
      }
    } catch (e) {
      console.warn('Could not sync products from Firestore:', e);
    }

    // Orders
    try {
      const ordersRef = collection(db, 'orders');
      const ordersSnap = await getDocs(ordersRef);
      if (!ordersSnap.empty) {
        ordersStore = ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        ordersStore = [];
      }
    } catch (e) {
      console.warn('Could not sync orders from Firestore:', e);
    }

    // Banners
    try {
      const bannersRef = collection(db, 'banners');
      const bannersSnap = await getDocs(bannersRef);
      if (!bannersSnap.empty) {
        bannersStore = bannersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      } else {
        bannersStore = [];
      }
    } catch (e) {
      console.warn('Could not sync banners from Firestore:', e);
    }

    console.log('Stores synced from Firestore:', { products: productsStore.length, orders: ordersStore.length, banners: bannersStore.length });
  } catch (err) {
    console.error('Error syncing stores from Firestore:', err);
  }
}

// ==========================================
// 1. HEALTH & METADATA API
// ==========================================
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "Ashaal Bangladesh & BetterMorning API",
    version: "1.0.0",
    time: new Date().toISOString(),
    endpoints: {
      users: "/api/users",
      userById: "/api/users/:id",
      userByToken: "/api/users/by-token/:token",
      products: "/api/products",
      productById: "/api/products/:id",
      orders: "/api/orders",
      orderById: "/api/orders/:id",
      banners: "/api/banners",
      bannerById: "/api/banners/:id"
    }
  });
});

// ==========================================
// 2. USER LIST API (GET /api/users)
// ==========================================
app.get("/api/users", (req, res) => {
  try {
    const { role, status, search, q, limit } = req.query;
    const searchQuery = ((search || q || "") as string).toLowerCase().trim();

    let filtered = [...usersStore];

    if (role && role !== 'all') {
      filtered = filtered.filter(u => u.role === role);
    }

    if (status && status !== 'all') {
      filtered = filtered.filter(u => u.status === status);
    }

    if (searchQuery) {
      filtered = filtered.filter(u =>
        u.name.toLowerCase().includes(searchQuery) ||
        u.email.toLowerCase().includes(searchQuery) ||
        u.phone.includes(searchQuery) ||
        u.id.toLowerCase().includes(searchQuery)
      );
    }

    if (limit) {
      const numLimit = parseInt(limit as string, 10);
      if (!isNaN(numLimit) && numLimit > 0) {
        filtered = filtered.slice(0, numLimit);
      }
    }

    res.json({
      success: true,
      count: filtered.length,
      total: usersStore.length,
      users: filtered.map(sanitizeUser),
      meta: {
        timestamp: new Date().toISOString(),
        filters: { role: role || 'all', status: status || 'all', search: searchQuery || null }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 3. GET SINGLE USER BY ID (GET /api/users/:id)
// ==========================================
app.get("/api/users/:id", (req, res) => {
  try {
    const user = usersStore.find(u => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: `User not found with id: ${req.params.id}` });
    }
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 4. GET USER BY TOKEN (GET /api/users/by-token/:token)
// ==========================================
app.get("/api/users/by-token/:token", (req, res) => {
  try {
    const user = usersStore.find(u => u.token === req.params.token);
    if (!user) {
      return res.status(404).json({ success: false, message: `No active user session for the provided token` });
    }
    res.json({ success: true, user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 5. CREATE / REGISTER USER (POST /api/users)
// ==========================================
app.post("/api/users", (req, res) => {
  try {
    const { name, email, phone, password, role, memberTier, coins } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "name and email are required fields." });
    }

    const existing = usersStore.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ success: false, message: "User with this email already exists." });
    }

    const newId = `usr-${Date.now()}`;
    const newUser = {
      id: newId,
      name,
      email,
      phone: phone || '+880 1700-000000',
      password: password || 'default123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80',
      coins: Number(coins) || 200,
      memberTier: memberTier || 'Silver Member',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      role: role || 'customer',
      status: 'active',
      token: `usr_tok_${newId}_${Math.random().toString(36).substring(2, 9)}`,
      totalOrders: 0,
      totalSpent: 0,
      createdAt: new Date().toISOString()
    };

    usersStore.unshift(newUser);
    res.status(201).json({ success: true, message: "User registered successfully", user: sanitizeUser(newUser) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 6. PRODUCTS API (GET /api/products)
// ==========================================
app.get("/api/products", async (req, res) => {
  try {
    const { category, brand, sort, limit } = req.query;
    let filtered = [...productsStore];

    if (category && category !== 'all') {
      filtered = filtered.filter(p => p.categorySlug === category || p.category === category);
    }
    if (brand && brand !== 'all') {
      filtered = filtered.filter(p => p.brand.toLowerCase() === (brand as string).toLowerCase());
    }
    if (sort === 'price-asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    if (limit) {
      const numLimit = parseInt(limit as string, 10);
      if (!isNaN(numLimit) && numLimit > 0) {
        filtered = filtered.slice(0, numLimit);
      }
    }

    res.json({
      success: true,
      count: filtered.length,
      total: productsStore.length,
      products: filtered,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 7. GET SINGLE PRODUCT BY ID (GET /api/products/:id)
// ==========================================
app.get("/api/products/:id", (req, res) => {
  try {
    const product = productsStore.find(p => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: `Product not found with id: ${req.params.id}` });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 8. CREATE PRODUCT (POST /api/products)
// ==========================================
app.post("/api/products", async (req, res) => {
  try {
    const productData = req.body;
    const productId = productData.id || `prod-${Date.now()}`;
    const newProduct = { ...productData, id: productId, createdAt: new Date().toISOString() };

    productsStore.unshift(newProduct);

    // Also save to Firestore
    try {
      await setDoc(doc(db, 'products', productId), newProduct);
    } catch (fireErr) {
      console.warn('Could not save product to Firestore:', fireErr);
    }

    res.status(201).json({ success: true, message: "Product created successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 9. ORDERS API (GET /api/orders)
// ==========================================
app.get("/api/orders", async (req, res) => {
  try {
    const { status, orderId } = req.query;
    let filtered = [...ordersStore];

    if (status && status !== 'all') {
      filtered = filtered.filter(o => o.orderStatus === status);
    }
    if (orderId) {
      filtered = filtered.filter(o => o.id === orderId || o.orderNumber === orderId);
    }

    res.json({
      success: true,
      count: filtered.length,
      total: ordersStore.length,
      orders: filtered,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 10. GET SINGLE ORDER BY ID (GET /api/orders/:id)
// ==========================================
app.get("/api/orders/:id", (req, res) => {
  try {
    const order = ordersStore.find(o => o.id === req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: `Order not found with id: ${req.params.id}` });
    }
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 11. CREATE ORDER (POST /api/orders)
// ==========================================
app.post("/api/orders", async (req, res) => {
  try {
    const orderData = req.body;
    const orderId = orderData.id || `ord-${Date.now()}`;
    const newOrder = { ...orderData, id: orderId, createdAt: new Date().toISOString() };

    ordersStore.unshift(newOrder);

    // Also save to Firestore
    try {
      await setDoc(doc(db, 'orders', orderId), newOrder);
    } catch (fireErr) {
      console.warn('Could not save order to Firestore:', fireErr);
    }

    res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 12. BANNERS API (GET /api/banners)
// ==========================================
app.get("/api/banners", async (req, res) => {
  try {
    res.json({
      success: true,
      count: bannersStore.length,
      total: bannersStore.length,
      banners: bannersStore,
      meta: { timestamp: new Date().toISOString() }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 13. GET SINGLE BANNER BY ID (GET /api/banners/:id)
// ==========================================
app.get("/api/banners/:id", (req, res) => {
  try {
    const banner = bannersStore.find(b => b.id === req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: `Banner not found with id: ${req.params.id}` });
    }
    res.json({ success: true, banner });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 14. CREATE BANNER (POST /api/banners)
// ==========================================
app.post("/api/banners", async (req, res) => {
  try {
    const bannerData = req.body;
    const bannerId = bannerData.id || `b-${Date.now()}`;
    const newBanner = { ...bannerData, id: bannerId };

    bannersStore.unshift(newBanner);

    // Also save to Firestore
    try {
      await setDoc(doc(db, 'banners', bannerId), newBanner);
    } catch (fireErr) {
      console.warn('Could not save banner to Firestore:', fireErr);
    }

    res.status(201).json({ success: true, message: "Banner created successfully", banner: newBanner });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 15. UPDATE USER (PUT /api/users/:id)
// ==========================================
app.put("/api/users/:id", (req, res) => {
  try {
    const { name, email, phone, coins, memberTier, status } = req.body;
    const userIndex = usersStore.findIndex(u => u.id === req.params.id);
    if (userIndex === -1) {
      return res.status(404).json({ success: false, message: `User not found with id: ${req.params.id}` });
    }
    usersStore[userIndex] = { ...usersStore[userIndex], ...req.body, id: req.params.id };
    res.json({ success: true, message: "User updated successfully", user: sanitizeUser(usersStore[userIndex]) });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 16. DELETE PRODUCT (DELETE /api/products/:id)
// ==========================================
app.delete("/api/products/:id", async (req, res) => {
  try {
    const productId = req.params.id;
    const index = productsStore.findIndex(p => p.id === productId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Product not found with id: ${productId}` });
    }
    productsStore.splice(index, 1);

    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (fireErr) {
      console.warn('Could not delete product from Firestore:', fireErr);
    }

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 17. DELETE ORDER (DELETE /api/orders/:id)
// ==========================================
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const index = ordersStore.findIndex(o => o.id === orderId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Order not found with id: ${orderId}` });
    }
    ordersStore.splice(index, 1);

    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (fireErr) {
      console.warn('Could not delete order from Firestore:', fireErr);
    }

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// 18. DELETE BANNER (DELETE /api/banners/:id)
// ==========================================
app.delete("/api/banners/:id", async (req, res) => {
  try {
    const bannerId = req.params.id;
    const index = bannersStore.findIndex(b => b.id === bannerId);
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Banner not found with id: ${bannerId}` });
    }
    bannersStore.splice(index, 1);

    try {
      await deleteDoc(doc(db, 'banners', bannerId));
    } catch (fireErr) {
      console.warn('Could not delete banner from Firestore:', fireErr);
    }

    res.json({ success: true, message: "Banner deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// ==========================================
// GLOBAL ERROR HANDLING MIDDLEWARE
// ==========================================
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Server Error:", err.stack || err.message || err);
  res.status(500).json({ success: false, message: "Something went wrong on the server" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Endpoint ${req.method} ${req.path} not found` });
});
});

// Start server with Vite middleware support
async function startServer() {
  // Sync data from Firestore on startup
  await syncStoresFromFirestore();

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
    console.log(`API available at http://0.0.0.0:${PORT}/api/`);
  });
}

startServer();