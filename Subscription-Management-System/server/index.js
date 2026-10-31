import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Helper functions for Database
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], plans: [], subscriptions: [], invoices: [], supportTickets: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
}

// -------------------------------------------------------------
// 1. Health Check
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Subscription Management System Backend',
    odooConfigured: Boolean(process.env.VITE_ODOO_URL || process.env.ODOO_URL),
    timestamp: new Date().toISOString(),
  });
});

// -------------------------------------------------------------
// 2. Authentication Endpoints
// -------------------------------------------------------------
app.post('/api/auth/signup', (req, res) => {
  const { fullName, email, phone, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
  }

  const db = readDB();
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (existingUser) {
    return res.status(409).json({ success: false, message: 'User with this email already exists.' });
  }

  const newUser = {
    id: `usr_${Date.now()}`,
    fullName,
    email,
    phone: phone || '',
    password,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDB(db);

  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({
    success: true,
    user: {
      ...userWithoutPassword,
      token: `token_${newUser.id}_${Date.now()}`,
    },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db = readDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: {
      ...userWithoutPassword,
      token: `token_${user.id}_${Date.now()}`,
    },
  });
});

// -------------------------------------------------------------
// 3. Plans Endpoints
// -------------------------------------------------------------
app.get('/api/plans', (req, res) => {
  const db = readDB();
  res.json(db.plans || []);
});

// -------------------------------------------------------------
// 4. Subscriptions & Orders
// -------------------------------------------------------------
app.post('/api/subscription/orders', (req, res) => {
  const { planId, billingCycle, customerDetails, paymentDetails, promoCode } = req.body;

  if (!planId || !customerDetails) {
    return res.status(400).json({ success: false, message: 'Missing required order details.' });
  }

  const db = readDB();
  const plan = db.plans.find((p) => p.id === planId) || db.plans[1];

  let rawPrice = plan.price || 999;
  let discount = 0;

  if (promoCode === 'SAVE10') discount = Math.round(rawPrice * 0.1);
  if (promoCode === 'HACKATHON') discount = Math.round(rawPrice * 0.15);

  const discounted = rawPrice - discount;
  const gst = Math.round(discounted * 0.18);
  const total = discounted + gst;

  const orderId = `ORD-${Date.now()}`;
  const invoiceId = `INV-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;

  const newSubscription = {
    id: `sub_${Date.now()}`,
    userId: customerDetails.email || 'usr_guest',
    planId: plan.id,
    planName: plan.name,
    amount: `₹${total.toLocaleString('en-IN')}`,
    billingCycle: billingCycle || 'Monthly',
    startDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    status: 'Active',
    autoRenew: true,
  };

  const newInvoice = {
    id: invoiceId,
    userId: customerDetails.email || 'usr_guest',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    amount: `₹${total.toLocaleString('en-IN')}`,
    plan: plan.name,
    status: 'Paid',
    pdfUrl: '#',
  };

  db.subscriptions = db.subscriptions || [];
  db.invoices = db.invoices || [];

  db.subscriptions.unshift(newSubscription);
  db.invoices.unshift(newInvoice);
  writeDB(db);

  res.status(201).json({
    success: true,
    orderId,
    invoiceId,
    subscription: newSubscription,
    invoice: newInvoice,
    message: 'Subscription created and activated successfully.',
  });
});

app.get('/api/customer/:id/subscriptions', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const userSubs = (db.subscriptions || []).filter(
    (s) => s.userId === id || s.userId === 'usr_demo_1' || id.includes('@')
  );

  res.json(userSubs.length > 0 ? userSubs : db.subscriptions || []);
});

app.get('/api/customer/:id/invoices', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const userInvoices = (db.invoices || []).filter(
    (inv) => inv.userId === id || inv.userId === 'usr_demo_1' || id.includes('@')
  );

  res.json(userInvoices.length > 0 ? userInvoices : db.invoices || []);
});

app.post('/api/subscription/:id/renew', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const subIndex = (db.subscriptions || []).findIndex((s) => s.id === id);

  if (subIndex !== -1) {
    db.subscriptions[subIndex].status = 'Active';
    db.subscriptions[subIndex].nextBillingDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(
      'en-GB',
      { day: '2-digit', month: 'short', year: 'numeric' }
    );
    writeDB(db);
    return res.json({ success: true, subscription: db.subscriptions[subIndex] });
  }

  res.json({ success: true, message: 'Subscription renewed successfully.' });
});

app.post('/api/subscription/:id/cancel', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const subIndex = (db.subscriptions || []).findIndex((s) => s.id === id);

  if (subIndex !== -1) {
    db.subscriptions[subIndex].status = 'Cancelled';
    db.subscriptions[subIndex].autoRenew = false;
    writeDB(db);
    return res.json({ success: true, subscription: db.subscriptions[subIndex] });
  }

  res.json({ success: true, message: 'Subscription cancelled successfully.' });
});

app.listen(PORT, () => {
  console.log(`⚡ Subscription Management System Backend running at: http://localhost:${PORT}`);
  console.log(`📊 Health Endpoint: http://localhost:${PORT}/api/health`);
});
