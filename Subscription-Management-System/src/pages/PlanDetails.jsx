import { useParams, Link, useNavigate } from 'react-router-dom';

function PlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const allPlans = {
    basic: {
      id: 'basic',
      name: 'Basic Plan',
      price: 499,
      formattedPrice: '₹499',
      billingPeriod: 'month',
      description: 'Essential recurring billing for solo practitioners and small setups.',
      features: [
        '1 user account',
        'Email support',
        'Basic subscription analytics',
        'Monthly billing',
      ],
      renewalInfo: 'Automatic renewal every 30 days. Cancel anytime before cycle end.',
    },
    standard: {
      id: 'standard',
      name: 'Standard Plan',
      price: 999,
      formattedPrice: '₹999',
      billingPeriod: 'month',
      isPopular: true,
      description: 'The complete toolkit for growing membership and subscription businesses.',
      features: [
        '5 user accounts',
        'Priority email support',
        'Advanced subscription analytics',
        'Automated renewal reminders',
        'Monthly billing',
      ],
      renewalInfo: 'Smart SMS and email renewal alerts sent 7 days and 48 hours prior to charge.',
    },
    premium: {
      id: 'premium',
      name: 'Premium Plan',
      price: 1999,
      formattedPrice: '₹1,999',
      billingPeriod: 'month',
      description: 'High-volume scale with dedicated analytics and priority workflows.',
      features: [
        'Unlimited user accounts',
        '24/7 priority support',
        'Custom revenue reports',
        'Automated recurring billing',
        'Customer self-service portal',
        'Monthly billing',
      ],
      renewalInfo: 'Enterprise billing cycle with priority reconciliation & dedicated account manager.',
    },
  };

  const planKey = id ? id.toLowerCase() : '';
  const selectedPlan = allPlans[planKey];

  if (!selectedPlan) {
    return (
      <div className="plan-not-found-page">
        <div className="not-found-card">
          <span className="not-found-icon">🔍</span>
          <h2>Plan Not Found</h2>
          <p>The subscription plan you requested does not exist or may have been retired.</p>
          <Link to="/plans" className="btn btn-orange">
            ← Back to Plans
          </Link>
        </div>
      </div>
    );
  }

  const handleSubscribe = () => {
    navigate('/checkout', {
      state: {
        plan: selectedPlan,
      },
    });
  };

  const faqs = [
    {
      q: 'How does the billing cycle work?',
      a: 'Billing recurs automatically every month on the exact calendar date your subscription began.',
    },
    {
      q: 'Can I change my plan or cancel anytime?',
      a: 'Yes, you can upgrade, downgrade, or cancel your renewal anytime directly through your My Account portal.',
    },
    {
      q: 'Are renewal reminders automated?',
      a: 'Yes! Automated email and SMS alerts are triggered ahead of due dates so customers are never caught off guard.',
    },
    {
      q: 'What payment methods are supported at checkout?',
      a: 'We support instant UPI, all major Credit/Debit cards, and Net Banking options with 18% GST tax invoicing.',
    },
  ];

  return (
    <div className="plan-details-page">
      <div className="plan-details-container">
        {/* Navigation Breadcrumb */}
        <div className="details-breadcrumb">
          <Link to="/plans" className="breadcrumb-link">
            ← Back to Plans
          </Link>
        </div>

        {/* Selected Plan Hero */}
        <div className="plan-details-hero">
          <div className="details-hero-info">
            {selectedPlan.isPopular && (
              <span className="section-pill pill-plans">Most Popular Choice</span>
            )}
            <h1 className="details-plan-title">{selectedPlan.name}</h1>
            <p className="details-plan-summary">{selectedPlan.description}</p>
            <div className="details-price-badge">
              <span className="price-number">{selectedPlan.formattedPrice}</span>
              <span className="price-tenure">/{selectedPlan.billingPeriod}</span>
            </div>

            <div className="details-renewal-info">
              <span className="renewal-icon">🔄</span>
              <span><strong>Renewal Policy:</strong> {selectedPlan.renewalInfo}</span>
            </div>
          </div>

          <div className="details-hero-action">
            <h3 className="included-features-heading">What&apos;s Included:</h3>
            <ul className="details-feature-list">
              {selectedPlan.features.map((feat, index) => (
                <li key={index}>
                  <span className="check-icon">✓</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button onClick={handleSubscribe} className="btn btn-orange btn-lg btn-block">
              Subscribe Now
            </button>
            <p className="instant-activation-note">
              Instant activation &bull; 100% Secure Checkout
            </p>
          </div>
        </div>

        {/* Plan Comparison Table */}
        <div className="details-section">
          <h2 className="details-section-title">Compare All Plans</h2>
          <p className="details-section-subtitle">
            See how the <strong>{selectedPlan.name}</strong> compares against our other subscription tiers.
          </p>

          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Features</th>
                  <th className={planKey === 'basic' ? 'highlighted-col' : ''}>
                    Basic Plan
                    <div className="col-price">₹499/mo</div>
                  </th>
                  <th className={planKey === 'standard' ? 'highlighted-col' : ''}>
                    Standard Plan
                    <div className="col-price">₹999/mo</div>
                  </th>
                  <th className={planKey === 'premium' ? 'highlighted-col' : ''}>
                    Premium Plan
                    <div className="col-price">₹1,999/mo</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>User Accounts</td>
                  <td className={planKey === 'basic' ? 'highlighted-col' : ''}>1 User</td>
                  <td className={planKey === 'standard' ? 'highlighted-col' : ''}>5 Users</td>
                  <td className={planKey === 'premium' ? 'highlighted-col' : ''}>Unlimited</td>
                </tr>
                <tr>
                  <td>Support Level</td>
                  <td className={planKey === 'basic' ? 'highlighted-col' : ''}>Email Support</td>
                  <td className={planKey === 'standard' ? 'highlighted-col' : ''}>Priority Email Support</td>
                  <td className={planKey === 'premium' ? 'highlighted-col' : ''}>24/7 Dedicated Support</td>
                </tr>
                <tr>
                  <td>Subscription Analytics</td>
                  <td className={planKey === 'basic' ? 'highlighted-col' : ''}>Basic Analytics</td>
                  <td className={planKey === 'standard' ? 'highlighted-col' : ''}>Advanced Analytics</td>
                  <td className={planKey === 'premium' ? 'highlighted-col' : ''}>Custom Revenue Reports</td>
                </tr>
                <tr>
                  <td>Renewal Reminders</td>
                  <td className={planKey === 'basic' ? 'highlighted-col' : ''}>Standard</td>
                  <td className={planKey === 'standard' ? 'highlighted-col' : ''}>Automated SMS & Email</td>
                  <td className={planKey === 'premium' ? 'highlighted-col' : ''}>Automated Multi-Channel</td>
                </tr>
                <tr>
                  <td>Self-Service Portal</td>
                  <td className={planKey === 'basic' ? 'highlighted-col' : ''}>Basic Access</td>
                  <td className={planKey === 'standard' ? 'highlighted-col' : ''}>Full Customer Portal</td>
                  <td className={planKey === 'premium' ? 'highlighted-col' : ''}>Advanced Enterprise Portal</td>
                </tr>
                <tr>
                  <td>Select & Subscribe</td>
                  <td className={planKey === 'basic' ? 'highlighted-col' : ''}>
                    {planKey === 'basic' ? (
                      <span className="current-badge">Selected</span>
                    ) : (
                      <Link to="/plan/basic" className="btn btn-outline-dark btn-sm">Switch</Link>
                    )}
                  </td>
                  <td className={planKey === 'standard' ? 'highlighted-col' : ''}>
                    {planKey === 'standard' ? (
                      <span className="current-badge">Selected</span>
                    ) : (
                      <Link to="/plan/standard" className="btn btn-outline-dark btn-sm">Switch</Link>
                    )}
                  </td>
                  <td className={planKey === 'premium' ? 'highlighted-col' : ''}>
                    {planKey === 'premium' ? (
                      <span className="current-badge">Selected</span>
                    ) : (
                      <Link to="/plan/premium" className="btn btn-outline-dark btn-sm">Switch</Link>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="details-section">
          <h2 className="details-section-title">Frequently Asked Questions</h2>
          <div className="faqs-grid">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-card">
                <h3 className="faq-question">{faq.q}</h3>
                <p className="faq-answer">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanDetails;
