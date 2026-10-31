# Subscription Management System ⚡

A modern, responsive, and full-featured frontend for recurring subscription businesses (SaaS companies, coaching institutes, ISPs, maintenance services, and membership organizations). Built with React + Vite, styled with custom CSS, and architected for seamless integration with an Odoo ERP backend.

---

## 🌟 Key Problems Solved

- **Revenue Leakage:** Eliminates missed renewals and unintentional customer churn with automated reminder flows.
- **Manual Billing Bottlenecks:** Automates recurring invoicing, tax breakdown (18% GST), and payment receipts.
- **Customer Friction:** Provides a self-service customer portal for instant plan switches, invoice downloads, and renewal management.
- **Real-Time Visibility:** Generates instant operational clarity over active, expiring, and cancelled subscriptions.

---

## 🛠️ Tech Stack

- **Framework:** React 19 + Vite
- **Routing:** React Router DOM (v7)
- **API Client:** Axios (configured with environment variables and safe hackathon fallbacks)
- **Styling:** Vanilla CSS (CSS variables, responsive grid & flexbox, no heavy framework dependencies)
- **State & Auth:** React Context API (`AuthContext`) with persistent `localStorage` session handling
- **Backend Readiness:** Odoo ERP XML-RPC / JSON-RPC REST API bridge (`src/api/odooApi.js`)

---

## 📂 Project Structure

```text
src/
├── api/
│   └── odooApi.js             # Odoo REST client & hackathon offline fallbacks
├── components/
│   ├── Footer.jsx             # Comprehensive multi-column dark footer
│   ├── Navbar.jsx             # Sticky responsive navigation with auth pills
│   ├── PlanCard.jsx           # Reusable subscription pricing cards
│   └── ProtectedRoute.jsx     # Route guard redirecting to /login
├── context/
│   └── AuthContext.jsx        # Authentication provider with simulated session
├── pages/
│   ├── Home.jsx               # Hero, Problems, Solutions, Plans, How It Works, CTA
│   ├── Plans.jsx              # Basic (₹499), Standard (₹999), Premium (₹1,999)
│   ├── PlanDetails.jsx        # Comparison matrix, FAQs, and checkout intent
│   ├── Login.jsx              # Client-validated login with password toggles
│   ├── Signup.jsx             # Full registration form with 10-digit phone validation
│   ├── Checkout.jsx           # Order review, GST, SAVE10/HACKATHON coupons, payment simulation
│   └── MyAccount.jsx          # Overview, Invoices table, plan settings modal, support tickets
├── App.jsx                    # Root layout & route configuration
├── index.css                  # Modern dark navy, white, and orange design system
└── main.jsx                   # Browser entry point
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy the example environment file:
```bash
cp .env.example .env
```
Default parameters:
```env
VITE_ODOO_URL=http://localhost:8069
VITE_ODOO_DB=odoo_subscription_db
VITE_ODOO_API_KEY=your_odoo_external_api_key_here
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 💳 Testing Coupons & Demo Credentials

- **Promo Coupons:**
  - `SAVE10` &rarr; 10% Discount at checkout
  - `HACKATHON` &rarr; 15% Discount at checkout
- **Demo Login:**
  - Email: `demo@subscriber.com`
  - Password: `password123` (any password with &ge; 6 characters)

---

## 📄 License
MIT License &copy; 2026 Subscription Management System. Powered by Odoo ERP.
