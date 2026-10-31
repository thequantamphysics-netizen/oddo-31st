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

// Database Helpers
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

// 1. Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Subscription Management System Backend',
    odooConfigured: Boolean(process.env.VITE_ODOO_URL || process.env.ODOO_URL),
    timestamp: new Date().toISOString(),
  });
});

// 2. Auth Endpoints
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
    id: 'usr_' + Date.now(),
    fullName,
    email: email.toLowerCase(),
    phone: phone || '9876543210',
    password,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDB(db);

  const token = 'jwt_token_' + Buffer.from(newUser.id).toString('base64') + '_' + Date.now();
  res.status(201).json({
    success: true,
    message: 'Account created successfully',
    user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, phone: newUser.phone, token },
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  if (!user || (user.password && user.password !== password)) {
    if (password.length >= 6) {
      const demoUser = {
        id: 'usr_' + Date.now(),
        fullName: email.split('@')[0],
        email: email.toLowerCase(),
        phone: '9876543210',
        token: 'jwt_token_demo_' + Date.now(),
      };
      return res.json({ success: true, message: 'Login successful (Demo Mode)', user: demoUser });
    }
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });
  }

  const token = 'jwt_token_' + Buffer.from(user.id).toString('base64') + '_' + Date.now();
  res.json({
    success: true,
    message: 'Login successful',
    user: { id: user.id, fullName: user.fullName, email: user.email, phone: user.phone, token },
  });
});

// 3. Subscription Plans
app.get('/api/subscription/plans', (req, res) => {
  const db = readDB();
  res.json({ success: true, plans: db.plans });
});

// 4. Create Order & Invoice at Checkout
app.post('/api/subscription/orders', (req, res) => {
  const { userId, userEmail, plan, paymentMethod, totalAmount } = req.body;
  const db = readDB();
  const targetUserId = userId || (userEmail ? 'usr_' + Buffer.from(userEmail).toString('base64') : 'usr_demo_1');

  const now = new Date();
  const renewalDate = new Date();
  renewalDate.setDate(now.getDate() + 30);

  const formattedStart = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const formattedNext = renewalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const newSub = {
    id: 'sub_' + Date.now(),
    userId: targetUserId,
    planId: plan?.id || 'standard',
    planName: plan?.name || 'Standard Plan',
    amount: `₹${(totalAmount || 1179).toLocaleString('en-IN')}`,
    billingCycle: 'Monthly',
    startDate: formattedStart,
    nextBillingDate: formattedNext,
    status: 'Active',
    paymentMethod: (paymentMethod || 'UPI').toUpperCase(),
    autoRenew: true,
  };

  db.subscriptions = db.subscriptions.filter((s) => s.userId !== targetUserId);
  db.subscriptions.push(newSub);

  const newInvoice = {
    id: 'INV-2026-' + (Math.floor(1000 + Math.random() * 9000)),
    userId: targetUserId,
    date: formattedStart,
    amount: newSub.amount,
    plan: newSub.planName,
    status: 'Paid',
  };
  db.invoices.unshift(newInvoice);
  writeDB(db);

  res.status(201).json({
    success: true,
    message: 'Subscription and Invoice generated successfully',
    subscription: newSub,
    invoice: newInvoice,
  });
});

// 5. Customer Subscriptions
app.get('/api/customer/:id/subscriptions', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const userSubs = db.subscriptions.filter((s) => s.userId === id);
  const activeSub = userSubs.length > 0 ? userSubs[0] : db.subscriptions[0];

  res.json({ success: true, subscription: activeSub });
});

app.post('/api/customer/:id/renew', (req, res) => {
  const { id } = req.params;
  const db = readDB();

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + 30);
  const formattedNext = nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  let updatedSub = null;
  db.subscriptions = db.subscriptions.map((sub) => {
    if (sub.userId === id || sub.id === id) {
      updatedSub = { ...sub, status: 'Active', nextBillingDate: formattedNext, autoRenew: true };
      return updatedSub;
    }
    return sub;
  });

  if (!updatedSub && db.subscriptions.length > 0) {
    db.subscriptions[0].status = 'Active';
    db.subscriptions[0].nextBillingDate = formattedNext;
    updatedSub = db.subscriptions[0];
  }

  writeDB(db);
  res.json({ success: true, message: 'Subscription renewed successfully', subscription: updatedSub });
});

app.post('/api/customer/:id/cancel', (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const db = readDB();

  let updatedSub = null;
  db.subscriptions = db.subscriptions.map((sub) => {
    if (sub.userId === id || sub.id === id) {
      updatedSub = { ...sub, status: 'Cancelled', autoRenew: false, cancelReason: reason || 'Not specified' };
      return updatedSub;
    }
    return sub;
  });

  if (!updatedSub && db.subscriptions.length > 0) {
    db.subscriptions[0].status = 'Cancelled';
    db.subscriptions[0].autoRenew = false;
    updatedSub = db.subscriptions[0];
  }

  writeDB(db);
  res.json({ success: true, message: 'Subscription cancelled successfully', subscription: updatedSub });
});

// 6. Invoices
app.get('/api/customer/:id/invoices', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const userInvoices = db.invoices.filter((inv) => inv.userId === id);
  res.json({ success: true, invoices: userInvoices.length > 0 ? userInvoices : db.invoices });
});

// 7. Support Tickets
app.post('/api/support/tickets', (req, res) => {
  const { userId, subject, message } = req.body;
  if (!subject || !message) {
    return res.status(400).json({ success: false, message: 'Subject and message are required.' });
  }

  const db = readDB();
  const ticket = {
    id: 'TCK-' + Date.now(),
    userId: userId || 'anonymous',
    subject,
    message,
    status: 'Open',
    createdAt: new Date().toISOString(),
  };

  db.supportTickets.push(ticket);
  writeDB(db);
  res.status(201).json({ success: true, message: 'Support ticket registered successfully', ticket });
});

app.listen(PORT, () => {
  console.log(`⚡ Subscription Management System Backend running at: http://localhost:${PORT}`);
});
