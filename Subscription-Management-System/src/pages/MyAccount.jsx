import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyAccount() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Active Tab: 'overview' | 'invoices' | 'settings' | 'support'
  const [activeTab, setActiveTab] = useState('overview');

  // Subscription State (read from local state or initialize default)
  const [subscription, setSubscription] = useState({
    planName: 'Standard Plan',
    status: 'Active',
    amount: '₹1,179',
    billingCycle: 'Monthly',
    startDate: '15 Oct 2026',
    nextBillingDate: '15 Nov 2026',
    autoRenew: true,
  });

  // Check if user recently checked out
  useEffect(() => {
    try {
      const storedSub = localStorage.getItem('sms_active_subscription');
      if (storedSub) {
        const parsed = JSON.parse(storedSub);
        setSubscription((prev) => ({
          ...prev,
          planName: parsed.planName || prev.planName,
          amount: `₹${parsed.price?.toLocaleString('en-IN')}` || prev.amount,
          startDate: parsed.startDate || prev.startDate,
          nextBillingDate: parsed.nextBillingDate || prev.nextBillingDate,
          status: parsed.status || 'Active',
        }));
      }
    } catch (e) {
      console.error('Error reading active sub', e);
    }
  }, []);

  // Invoices dummy data
  const [invoices, setInvoices] = useState([
    {
      id: 'INV-2026-001',
      date: '15 Oct 2026',
      amount: '₹1,179',
      plan: 'Standard Plan',
      status: 'Paid',
    },
    {
      id: 'INV-2026-002',
      date: '15 Sep 2026',
      amount: '₹1,179',
      plan: 'Standard Plan',
      status: 'Paid',
    },
    {
      id: 'INV-2026-003',
      date: '15 Aug 2026',
      amount: '₹1,179',
      plan: 'Standard Plan',
      status: 'Paid',
    },
  ]);

  // Support Form State
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [supportSuccess, setSupportSuccess] = useState(false);
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);

  // Cancellation Modal & Reason
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Too expensive');
  const [otherReasonText, setOtherReasonText] = useState('');
  const [notificationMsg, setNotificationMsg] = useState('');

  // Handle Support submit
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportForm.subject.trim() || !supportForm.message.trim()) return;

    setIsSubmittingSupport(true);
    setTimeout(() => {
      setIsSubmittingSupport(false);
      setSupportSuccess(true);
      setSupportForm({ subject: '', message: '' });
      setTimeout(() => setSupportSuccess(false), 4000);
    }, 800);
  };

  // Handle Download dummy invoice
  const handleDownloadInvoice = (invoiceId) => {
    setNotificationMsg(`Downloading tax invoice ${invoiceId}... (Demo PDF ready)`);
    setTimeout(() => setNotificationMsg(''), 3000);
  };

  // Handle Renew Now
  const handleRenewNow = () => {
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + 30);
    const formatted = nextDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    setSubscription((prev) => ({
      ...prev,
      status: 'Active',
      nextBillingDate: formatted,
    }));
    setNotificationMsg('Subscription renewed successfully! Next billing updated.');
    setTimeout(() => setNotificationMsg(''), 4000);
  };

  // Handle Cancel Subscription
  const handleConfirmCancel = () => {
    setSubscription((prev) => ({
      ...prev,
      status: 'Cancelled',
      autoRenew: false,
    }));
    setShowCancelModal(false);
    setNotificationMsg('Subscription cancelled. You will still have access until the end of current cycle.');
    setTimeout(() => setNotificationMsg(''), 5000);
  };

  return (
    <div className="account-page">
      <div className="account-container">
        {/* User Welcome Banner */}
        <div className="account-header">
          <div className="account-user-info">
            <div className="user-large-avatar">
              {(user?.fullName || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="account-user-name">{user?.fullName || user?.email?.split('@')[0]}</h1>
              <p className="account-user-email">
                {user?.email} &bull; Member since Oct 2026
              </p>
            </div>
          </div>

          <div className="account-header-actions">
            <button onClick={logout} className="btn btn-outline-dark btn-sm">
              Sign Out
            </button>
          </div>
        </div>

        {/* Global Notification Toast */}
        {notificationMsg && (
          <div className="alert-message alert-success toast-alert">
            <span className="alert-icon">ℹ️</span>
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="account-tabs-bar">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'invoices' ? 'active' : ''}`}
            onClick={() => setActiveTab('invoices')}
          >
            🧾 Invoices ({invoices.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Subscription Settings
          </button>
          <button
            className={`tab-btn ${activeTab === 'support' ? 'active' : ''}`}
            onClick={() => setActiveTab('support')}
          >
            💬 Support
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="tab-pane">
            <div className="subscription-card">
              <div className="sub-card-header">
                <div>
                  <span className="sub-type-badge">Active Membership</span>
                  <h2 className="sub-plan-name">{subscription.planName}</h2>
                </div>
                <div className="sub-status-wrap">
                  <span
                    className={`status-pill ${
                      subscription.status === 'Active' ? 'active' : 'renewing'
                    }`}
                  >
                    {subscription.status}
                  </span>
                </div>
              </div>

              <div className="sub-details-grid">
                <div className="sub-detail-box">
                  <span className="detail-label">Billing Amount</span>
                  <strong className="detail-val">{subscription.amount}</strong>
                  <span className="detail-sub">incl. 18% GST / month</span>
                </div>
                <div className="sub-detail-box">
                  <span className="detail-label">Subscription Start</span>
                  <strong className="detail-val">{subscription.startDate}</strong>
                  <span className="detail-sub">Current Cycle</span>
                </div>
                <div className="sub-detail-box">
                  <span className="detail-label">Next Billing Date</span>
                  <strong className="detail-val text-orange">
                    {subscription.nextBillingDate}
                  </strong>
                  <span className="detail-sub">
                    {subscription.autoRenew ? 'Auto-Renewal ON' : 'Renewal OFF'}
                  </span>
                </div>
              </div>

              <div className="sub-actions-bar">
                <button
                  onClick={handleRenewNow}
                  className="btn btn-orange"
                  disabled={subscription.status === 'Cancelled'}
                >
                  Renew Now
                </button>
                <Link to="/plans" className="btn btn-outline-dark">
                  Upgrade Plan
                </Link>
                {subscription.status === 'Active' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="btn btn-outline-danger"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="account-quick-stats">
              <div className="quick-stat-card">
                <span className="qs-icon">⚡</span>
                <span className="qs-label">Subscription Tier</span>
                <strong className="qs-value">{subscription.planName}</strong>
              </div>
              <div className="quick-stat-card">
                <span className="qs-icon">🔔</span>
                <span className="qs-label">Renewal Notifications</span>
                <strong className="qs-value">SMS & Email Enabled</strong>
              </div>
              <div className="quick-stat-card">
                <span className="qs-icon">🛡️</span>
                <span className="qs-label">Odoo Backend Sync</span>
                <strong className="qs-value">Live Connected</strong>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Invoices */}
        {activeTab === 'invoices' && (
          <div className="tab-pane">
            <div className="invoices-card">
              <div className="card-header-between">
                <div>
                  <h2 className="card-section-title">Billing & Invoices</h2>
                  <p className="card-section-desc">
                    View and download all official tax invoices generated for your recurring subscriptions.
                  </p>
                </div>
                {invoices.length > 0 && (
                  <button
                    onClick={() => setInvoices([])}
                    className="btn btn-outline-dark btn-sm"
                  >
                    Simulate Empty State
                  </button>
                )}
              </div>

              {invoices.length === 0 ? (
                <div className="empty-state-box">
                  <span className="empty-icon">📂</span>
                  <h3>No Invoices Found</h3>
                  <p>You have not been billed for any subscriptions yet.</p>
                  <button
                    onClick={() =>
                      setInvoices([
                        {
                          id: 'INV-2026-001',
                          date: '15 Oct 2026',
                          amount: '₹1,179',
                          plan: 'Standard Plan',
                          status: 'Paid',
                        },
                      ])
                    }
                    className="btn btn-orange btn-sm"
                  >
                    Restore Sample Invoices
                  </button>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="invoices-table">
                    <thead>
                      <tr>
                        <th>Invoice Number</th>
                        <th>Billing Date</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Payment Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoices.map((inv) => (
                        <tr key={inv.id}>
                          <td className="font-semibold text-dark">{inv.id}</td>
                          <td>{inv.date}</td>
                          <td>{inv.plan}</td>
                          <td className="font-semibold">{inv.amount}</td>
                          <td>
                            <span className="status-pill active">{inv.status}</span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDownloadInvoice(inv.id)}
                              className="btn btn-outline-dark btn-sm download-btn"
                            >
                              ⬇ Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Subscription Settings */}
        {activeTab === 'settings' && (
          <div className="tab-pane">
            <div className="settings-card">
              <h2 className="card-section-title">Subscription Management</h2>
              <p className="card-section-desc">
                Scale your plan as your requirements change or configure cancellation preferences.
              </p>

              <div className="settings-options-group">
                <div className="settings-row">
                  <div>
                    <h3 className="setting-name">Change Subscription Tier</h3>
                    <p className="setting-desc">
                      Upgrade to unlock additional user seats, custom reports, or downgrade to an essential plan.
                    </p>
                  </div>
                  <div className="setting-actions">
                    <Link to="/plans" className="btn btn-orange">
                      Upgrade Plan
                    </Link>
                    <Link to="/plans" className="btn btn-outline-dark">
                      Downgrade Plan
                    </Link>
                  </div>
                </div>

                <div className="settings-row cancel-row">
                  <div>
                    <h3 className="setting-name text-danger">Cancel Subscription</h3>
                    <p className="setting-desc">
                      Stop recurring renewal charges. Your service will remain accessible until the end of current cycle.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="btn btn-outline-danger"
                      disabled={subscription.status === 'Cancelled'}
                    >
                      {subscription.status === 'Cancelled' ? 'Cancelled' : 'Cancel Subscription'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Support */}
        {activeTab === 'support' && (
          <div className="tab-pane">
            <div className="support-card">
              <h2 className="card-section-title">Customer Support Helpdesk</h2>
              <p className="card-section-desc">
                Have questions about your subscription, renewal cycle, or billing invoice? Submit a ticket below.
              </p>

              {supportSuccess && (
                <div className="alert-message alert-success">
                  <span className="alert-icon">✓</span>
                  <span>
                    Your ticket has been logged with our support desk! Our team will respond within 24 hours.
                  </span>
                </div>
              )}

              <form onSubmit={handleSupportSubmit} className="support-form">
                <div className="form-group">
                  <label htmlFor="subject" className="form-label">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={supportForm.subject}
                    onChange={(e) =>
                      setSupportForm({ ...supportForm, subject: e.target.value })
                    }
                    placeholder="e.g. Question regarding my next renewal date"
                    className="form-input"
                    required
                    disabled={isSubmittingSupport}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message" className="form-label">
                    Message Details
                  </label>
                  <textarea
                    id="message"
                    rows="5"
                    value={supportForm.message}
                    onChange={(e) =>
                      setSupportForm({ ...supportForm, message: e.target.value })
                    }
                    placeholder="Please describe your issue or inquiry with relevant order details..."
                    className="form-input form-textarea"
                    required
                    disabled={isSubmittingSupport}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn btn-orange btn-lg"
                  disabled={isSubmittingSupport}
                >
                  {isSubmittingSupport ? 'Submitting Ticket…' : 'Submit Support Ticket'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {showCancelModal && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <h2 className="modal-title">Confirm Cancellation</h2>
              <p className="modal-desc">
                We are sorry to see you go! Are you sure you want to cancel your{' '}
                <strong>{subscription.planName}</strong>?
              </p>

              <div className="form-group">
                <label className="form-label">Please let us know your reason:</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="form-input"
                >
                  <option value="Too expensive">Too expensive</option>
                  <option value="Not using the service">Not using the service</option>
                  <option value="Switching to another provider">
                    Switching to another provider
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {cancelReason === 'Other' && (
                <div className="form-group" style={{ marginTop: '0.75rem' }}>
                  <input
                    type="text"
                    value={otherReasonText}
                    onChange={(e) => setOtherReasonText(e.target.value)}
                    placeholder="Tell us more..."
                    className="form-input"
                  />
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCancelModal(false)}
                  className="btn btn-outline-dark"
                >
                  Keep My Subscription
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCancel}
                  className="btn btn-danger"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAccount;
