import axios from 'axios';

// Read configuration from environment variables
const ODOO_URL = import.meta.env.VITE_ODOO_URL || 'http://localhost:8069';
const ODOO_DB = import.meta.env.VITE_ODOO_DB || 'odoo_subscription_db';
const ODOO_API_KEY = import.meta.env.VITE_ODOO_API_KEY || '';

// Axios client instance
const odooApi = axios.create({
  baseURL: `${ODOO_URL}/api`,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    ...(ODOO_API_KEY ? { 'X-Odoo-Api-Key': ODOO_API_KEY } : {}),
  },
});

// Interceptor to attach local token if present
odooApi.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem('sms_auth_user');
      if (stored) {
        const user = JSON.parse(stored);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (e) {
      console.warn('Could not read user token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// -------------------------------------------------------------
// Fallback Dummy Data for Hackathon Offline Reliability
// -------------------------------------------------------------
const fallbackPlans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 499,
    formattedPrice: '₹499',
    billingPeriod: 'month',
    features: ['1 user account', 'Email support', 'Basic subscription analytics', 'Monthly billing'],
  },
  {
    id: 'standard',
    name: 'Standard Plan',
    price: 999,
    formattedPrice: '₹999',
    billingPeriod: 'month',
    isPopular: true,
    features: [
      '5 user accounts',
      'Priority email support',
      'Advanced subscription analytics',
      'Automated renewal reminders',
      'Monthly billing',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 1999,
    formattedPrice: '₹1,999',
    billingPeriod: 'month',
    features: [
      'Unlimited user accounts',
      '24/7 priority support',
      'Custom revenue reports',
      'Automated recurring billing',
      'Customer self-service portal',
      'Monthly billing',
    ],
  },
];

const fallbackInvoices = [
  { id: 'INV-2026-001', date: '15 Oct 2026', amount: '₹1,179', plan: 'Standard Plan', status: 'Paid' },
  { id: 'INV-2026-002', date: '15 Sep 2026', amount: '₹1,179', plan: 'Standard Plan', status: 'Paid' },
  { id: 'INV-2026-003', date: '15 Aug 2026', amount: '₹1,179', plan: 'Standard Plan', status: 'Paid' },
];

// -------------------------------------------------------------
// Odoo API Operations with Safe Fallback
// -------------------------------------------------------------

/**
 * 1. Login to Odoo backend or authenticate user session
 */
export async function loginToOdoo(credentials) {
  try {
    const response = await odooApi.post('/auth/login', {
      db: ODOO_DB,
      login: credentials.email,
      password: credentials.password,
    });
    return response.data;
  } catch (error) {
    console.warn('Odoo API unavailable. Using fallback authentication for hackathon demo.', error.message);
    return {
      success: true,
      user: {
        id: 'odoo_usr_demo_1',
        email: credentials.email,
        name: credentials.email.split('@')[0],
        token: 'mock_odoo_session_jwt',
      },
    };
  }
}

/**
 * 2. Fetch Subscription Plans list
 */
export async function getSubscriptionPlans() {
  try {
    const response = await odooApi.get('/subscription/plans');
    return response.data;
  } catch (error) {
    console.warn('Odoo API plans endpoint offline. Providing fallback plan catalog.', error.message);
    return fallbackPlans;
  }
}

/**
 * 3. Create Subscription Order & Invoice in Odoo
 */
export async function createSubscriptionOrder(orderData) {
  try {
    const response = await odooApi.post('/subscription/orders', orderData);
    return response.data;
  } catch (error) {
    console.warn('Odoo API order creation offline. Simulating confirmed order for hackathon demo.', error.message);
    return {
      success: true,
      orderId: 'SO-' + Date.now(),
      invoiceId: 'INV-' + Math.floor(1000 + Math.random() * 9000),
      status: 'Active',
      plan: orderData.plan,
    };
  }
}

/**
 * 4. Get active Customer Subscriptions
 */
export async function getCustomerSubscriptions(userId) {
  try {
    const response = await odooApi.get(`/customer/${userId}/subscriptions`);
    return response.data;
  } catch (error) {
    console.warn('Odoo API customer subscriptions offline. Providing demo subscription data.', error.message);
    return [
      {
        planName: 'Standard Plan',
        status: 'Active',
        amount: '₹1,179',
        startDate: '15 Oct 2026',
        nextBillingDate: '15 Nov 2026',
      },
    ];
  }
}

/**
 * 5. Get Customer Invoices history
 */
export async function getCustomerInvoices(userId) {
  try {
    const response = await odooApi.get(`/customer/${userId}/invoices`);
    return response.data;
  } catch (error) {
    console.warn('Odoo API invoices offline. Providing demo invoices list.', error.message);
    return fallbackInvoices;
  }
}

export default odooApi;
