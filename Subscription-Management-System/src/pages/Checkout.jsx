import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fallback to Standard Plan if navigated directly to checkout
  const selectedPlan = location.state?.plan || {
    id: 'standard',
    name: 'Standard Plan',
    price: 999,
    formattedPrice: '₹999',
    billingPeriod: 'month',
    features: [
      '5 user accounts',
      'Priority email support',
      'Advanced subscription analytics',
      'Automated renewal reminders',
    ],
  };

  // State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Financial Calculations
  const basePrice = Number(selectedPlan.price) || 999;
  let discountAmount = 0;

  if (appliedCoupon === 'SAVE10') {
    discountAmount = Math.round(basePrice * 0.1);
  } else if (appliedCoupon === 'HACKATHON') {
    discountAmount = Math.round(basePrice * 0.15);
  }

  const subtotal = basePrice - discountAmount;
  const gstAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + gstAmount;

  // Coupon handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();

    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    if (code === 'SAVE10' || code === 'HACKATHON') {
      setAppliedCoupon(code);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try SAVE10 or HACKATHON.');
      setAppliedCoupon(null);
    }
  };

  // Payment Confirmation
  const handleConfirmAndPay = () => {
    setIsProcessing(true);

    // Simulate payment processing for 2 seconds
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);

      // Save active subscription in localStorage for demo state
      const nextRenewalDate = new Date();
      nextRenewalDate.setDate(nextRenewalDate.getDate() + 30);

      const activeSub = {
        planId: selectedPlan.id,
        planName: selectedPlan.name,
        price: totalAmount,
        startDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        nextBillingDate: nextRenewalDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: 'Active',
        paymentMethod: paymentMethod.toUpperCase(),
      };

      localStorage.setItem('sms_active_subscription', JSON.stringify(activeSub));
    }, 2000);
  };

  // Next Billing Date formatted for success card
  const futureBillingDate = new Date();
  futureBillingDate.setDate(futureBillingDate.getDate() + 30);
  const formattedNextDate = futureBillingDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Success Screen
  if (paymentSuccess) {
    return (
      <div className="checkout-page">
        <div className="checkout-success-card">
          <div className="success-badge-icon">✓</div>
          <span className="success-tag">Payment Confirmed</span>
          <h1 className="success-heading">Subscription Activated Successfully</h1>
          <p className="success-subheading">
            Congratulations! Your <strong>{selectedPlan.name}</strong> is now live with automated billing.
          </p>

          <div className="success-summary-box">
            <div className="summary-row">
              <span>Selected Plan:</span>
              <strong>{selectedPlan.name}</strong>
            </div>
            <div className="summary-row">
              <span>Total Paid (incl. 18% GST):</span>
              <strong>₹{totalAmount.toLocaleString('en-IN')}</strong>
            </div>
            <div className="summary-row">
              <span>Next Renewal Date:</span>
              <strong className="text-orange">{formattedNextDate}</strong>
            </div>
            <div className="summary-row">
              <span>Invoice Reference:</span>
              <span>INV-2026-{(Math.floor(Math.random() * 9000) + 1000)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/my-account')}
            className="btn btn-orange btn-lg btn-block"
          >
            Go to My Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Page Title */}
        <div className="checkout-header">
          <span className="section-pill pill-plans">Secure Checkout</span>
          <h1 className="checkout-title">Review & Complete Subscription</h1>
          <p className="checkout-subtitle">
            Authenticated subscriber: <strong>{user?.email}</strong>
          </p>
        </div>

        <div className="checkout-layout-grid">
          {/* Left Column: Payment Method Selection */}
          <div className="checkout-left-column">
            <div className="checkout-section-card">
              <h2 className="card-section-title">Select Payment Method</h2>
              <p className="card-section-desc">
                All transactions are encrypted and secured with SSL.
              </p>

              <div className="payment-options-list">
                <label className={`payment-option-item ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                  />
                  <div className="option-content">
                    <div className="option-title-row">
                      <span className="method-name">UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                      <span className="method-pill">Instant</span>
                    </div>
                    <span className="option-sub">Zero transaction fee & instant activation</span>
                  </div>
                </label>

                <label className={`payment-option-item ${paymentMethod === 'card' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  <div className="option-content">
                    <div className="option-title-row">
                      <span className="method-name">Credit / Debit Card</span>
                      <span className="method-pill">Visa / Mastercard / RuPay</span>
                    </div>
                    <span className="option-sub">Seamless recurring auto-debit supported</span>
                  </div>
                </label>

                <label className={`payment-option-item ${paymentMethod === 'netbanking' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="netbanking"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                  />
                  <div className="option-content">
                    <div className="option-title-row">
                      <span className="method-name">Net Banking</span>
                      <span className="method-pill">50+ Banks</span>
                    </div>
                    <span className="option-sub">HDFC, ICICI, SBI, Axis, Kotak, and more</span>
                  </div>
                </label>
              </div>

              {/* Coupon Box */}
              <div className="coupon-box-wrapper">
                <h3 className="coupon-title">Have a Promotional Coupon?</h3>
                <form onSubmit={handleApplyCoupon} className="coupon-form">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. SAVE10 or HACKATHON"
                    className="form-input coupon-input"
                    disabled={isProcessing}
                  />
                  <button type="submit" className="btn btn-outline-dark" disabled={isProcessing}>
                    Apply Coupon
                  </button>
                </form>

                {couponError && <p className="field-error-text">{couponError}</p>}
                {appliedCoupon && (
                  <p className="coupon-success-text">
                    ✓ Coupon <strong>{appliedCoupon}</strong> applied! You saved ₹{discountAmount}.
                  </p>
                )}

                <div className="available-coupons-hint">
                  <span>💡 Try hackathon codes: <strong>SAVE10</strong> (10% off) or <strong>HACKATHON</strong> (15% off)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="checkout-right-column">
            <div className="order-summary-card">
              <h2 className="summary-title">Order Summary</h2>

              <div className="selected-plan-banner">
                <div>
                  <h3 className="selected-plan-name">{selectedPlan.name}</h3>
                  <span className="selected-plan-period">Billed {selectedPlan.billingPeriod}ly</span>
                </div>
                <div className="selected-plan-price">
                  ₹{basePrice.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="calculation-breakdown">
                <div className="breakdown-row">
                  <span>Base Plan Price</span>
                  <span>₹{basePrice.toLocaleString('en-IN')}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="breakdown-row discount-row">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>

                <div className="breakdown-row">
                  <span>GST (18% Goods & Services Tax)</span>
                  <span>+₹{gstAmount.toLocaleString('en-IN')}</span>
                </div>

                <div className="breakdown-divider"></div>

                <div className="breakdown-row total-row">
                  <span>Total Amount</span>
                  <span className="total-highlight">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleConfirmAndPay}
                className="btn btn-orange btn-lg btn-block pay-btn"
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing Secure Payment…' : `Confirm and Pay ₹${totalAmount.toLocaleString('en-IN')}`}
              </button>

              <div className="secure-badge-footer">
                <span className="lock-icon">🔒</span>
                <span>256-Bit SSL Encrypted &bull; 100% Secure Transaction</span>
              </div>

              <div className="change-plan-link-wrap">
                <Link to="/plans" className="change-plan-link">
                  ← Choose a different plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
