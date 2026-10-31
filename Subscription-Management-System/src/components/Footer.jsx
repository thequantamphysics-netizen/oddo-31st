import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Brand & Mission */}
        <div className="footer-brand-section">
          <div className="footer-logo">
            <span className="logo-icon">⚡</span>
            <h3>Subscription Management System</h3>
          </div>
          <p className="footer-description">
            A complete platform to manage recurring subscriptions, invoices, renewals, and customer accounts.
            Built for SaaS, gyms, institutes, ISPs, and modern recurring businesses.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-links-section">
          <h4>Navigation</h4>
          <ul className="footer-nav-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/plans">Plans</Link></li>
            <li><Link to="/my-account">My Account</Link></li>
          </ul>
        </div>

        {/* Legal & Policies */}
        <div className="footer-links-section">
          <h4>Legal & Policies</h4>
          <ul className="footer-nav-list">
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#cancellation">Cancellation Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="footer-contact-section">
          <h4>Contact & Support</h4>
          <ul className="footer-contact-list">
            <li>
              <strong>Email:</strong> support@subscriptionsystem.com
            </li>
            <li>
              <strong>Phone:</strong> +91 (800) 123-4567
            </li>
            <li>
              <strong>Hours:</strong> Mon - Fri, 9:00 AM - 6:00 PM IST
            </li>
            <li>
              <strong>Backend:</strong> Powered by Odoo ERP
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="footer-bottom-bar">
        <p>&copy; 2026 Subscription Management System. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
