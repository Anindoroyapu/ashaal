import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

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
      userByToken: "/api/users/by-token/:token"
    }
  });
});

// ==========================================
// 2. USER LIST API (GET /api/users)
// ==========================================
app.get("/api/users", (req, res) => {
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
      u.id.toLowerCase().includes(searchQuery) ||
      (u.token && u.token.toLowerCase().includes(searchQuery))
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
    users: filtered,
    meta: {
      timestamp: new Date().toISOString(),
      filters: { role: role || 'all', status: status || 'all', search: searchQuery || null }
    }
  });
});

// ==========================================
// 3. GET SINGLE USER BY ID (GET /api/users/:id)
// ==========================================
app.get("/api/users/:id", (req, res) => {
  const user = usersStore.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, message: `User not found with id: ${req.params.id}` });
  }
  res.json({ success: true, user });
});

// ==========================================
// 4. GET USER BY TOKEN (GET /api/users/by-token/:token)
// ==========================================
app.get("/api/users/by-token/:token", (req, res) => {
  const user = usersStore.find(u => u.token === req.params.token);
  if (!user) {
    return res.status(404).json({ success: false, message: `No active user session for token: ${req.params.token}` });
  }
  res.json({ success: true, user });
});

// ==========================================
// 5. CREATE / REGISTER USER (POST /api/users)
// ==========================================
app.post("/api/users", (req, res) => {
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
  res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
});

// Start server with Vite middleware support
async function startServer() {
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
  });
}

startServer();
