import PlanCard from '../components/PlanCard';

function Plans() {
  const subscriptionPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₹499',
      billingPeriod: 'month',
      description: 'Ideal for early-stage setups and individual entrepreneurs.',
      isPopular: false,
      features: [
        '1 user account',
        'Email support',
        'Basic subscription analytics',
        'Monthly billing',
      ],
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: '₹999',
      billingPeriod: 'month',
      description: 'Best for growing businesses needing automated recurring flows.',
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
      price: '₹1,999',
      billingPeriod: 'month',
      description: 'Designed for scaling companies with dedicated self-service tools.',
      isPopular: false,
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

  return (
    <div className="plans-page">
      <div className="plans-container">
        {/* Page Header */}
        <div className="plans-header">
          <span className="section-pill pill-plans">Flexible Pricing</span>
          <h1 className="plans-title">Choose Your Subscription Plan</h1>
          <p className="plans-subheading">Select a plan that fits your business needs.</p>
        </div>

        {/* Responsive 3-Column Grid */}
        <div className="plans-grid">
          {subscriptionPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        {/* Small reassurance note below plans */}
        <div className="plans-footnote">
          <span className="footnote-icon">ℹ️</span>
          <p>All plans include automated invoicing and renewal reminders.</p>
        </div>
      </div>
    </div>
  );
}

export default Plans;
