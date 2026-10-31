import { Link } from 'react-router-dom';

function Home() {
  const problems = [
    {
      icon: '📉',
      title: 'Missed renewals cause revenue loss',
      description: 'Without automation, expiring contracts go unnoticed, resulting in involuntary churn and lost recurring income.',
    },
    {
      icon: '⏳',
      title: 'Manual billing takes too much time',
      description: 'Creating invoices and chasing recurring payments manually wastes hours every billing cycle.',
    },
    {
      icon: '🔔',
      title: 'Customers forget payment dates',
      description: 'Without proactive SMS or email reminders, clients delay payments and memberships lapse unintentionally.',
    },
    {
      icon: '📊',
      title: 'Businesses lack clear subscription insights',
      description: 'Spreadsheets fail to show real-time MRR, active vs churned subscribers, and revenue forecasts.',
    },
  ];

  const solutions = [
    {
      icon: '⚡',
      title: 'Automated recurring billing',
      description: 'Generate invoices and schedule renewals seamlessly without manual intervention or human error.',
    },
    {
      icon: '⏰',
      title: 'Smart renewal reminders',
      description: 'Automated notification alerts ensure customers know when renewals are due, boosting payment collection rates.',
    },
    {
      icon: '👤',
      title: 'Customer self-service portal',
      description: 'Empower subscribers to view their active plan, download invoices, and request upgrades anytime.',
    },
    {
      icon: '📈',
      title: 'Real-time subscription dashboard',
      description: 'Comprehensive analytics on subscriber lifetime value, churn rates, and monthly recurring revenue.',
    },
  ];

  const popularPlans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: '₹499',
      period: 'per month',
      description: 'Essential recurring billing for solo practitioners and small setups.',
      isPopular: false,
      features: [
        'Up to 50 Active Subscriptions',
        'Automated Monthly Invoicing',
        'Standard Email Renewal Alerts',
        'Basic Customer Portal Access',
      ],
    },
    {
      id: 'standard',
      name: 'Standard Plan',
      price: '₹999',
      period: 'per month',
      description: 'The complete toolkit for growing membership and subscription businesses.',
      isPopular: true,
      features: [
        'Up to 250 Active Subscriptions',
        'Automated Invoices & Tax Management',
        'SMS & Email Smart Reminders',
        'Full Self-Service Customer Portal',
      ],
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: '₹1,999',
      period: 'per month',
      description: 'High-volume scale with dedicated analytics and priority workflows.',
      isPopular: false,
      features: [
        'Unlimited Active Subscriptions',
        'Custom Billing Cycles & Prorations',
        'Advanced Analytics & MRR Reports',
        'Priority Support & ERP Sync',
      ],
    },
  ];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Customer selects a subscription plan',
      description: 'Members choose from flexible recurring tiers that match their specific requirements.',
    },
    {
      step: '02',
      title: 'Customer completes secure checkout',
      description: 'Frictionless checkout process captures billing details and confirms registration.',
    },
    {
      step: '03',
      title: 'System creates subscription and invoice',
      description: 'The platform instantly generates the subscription record, assigns the cycle, and produces an official invoice.',
    },
    {
      step: '04',
      title: 'Customer receives automatic renewal reminders',
      description: 'Intelligent notifications alert the customer before due dates to maintain uninterrupted service.',
    },
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <span className="hero-badge">Enterprise-Grade Subscription Engine</span>
            <h1 className="hero-title">Simplify Subscription Management</h1>
            <p className="hero-subtitle">
              Automate recurring billing, renewal reminders, customer self-service, and revenue tracking for your business.
            </p>
            <div className="hero-cta-group">
              <Link to="/plans" className="btn btn-orange btn-lg">
                View Plans
              </Link>
              <a href="#problem-section" className="btn btn-outline-dark btn-lg">
                Learn More
              </a>
            </div>
            <div className="hero-stats-row">
              <div className="hero-stat">
                <span className="stat-number">99.8%</span>
                <span className="stat-label">On-Time Renewals</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">10x</span>
                <span className="stat-label">Faster Invoicing</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">Zero</span>
                <span className="stat-label">Missed Billing Cycles</span>
              </div>
            </div>
          </div>

          {/* Professional Dashboard Mockup Placeholder */}
          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <span className="mockup-header-title">Live Subscription Overview</span>
              </div>
              <div className="mockup-body">
                <div className="mockup-metrics-grid">
                  <div className="mockup-metric-card">
                    <span className="metric-label">Active Subscriptions</span>
                    <span className="metric-value">1,428</span>
                    <span className="metric-trend positive">+12.4% this month</span>
                  </div>
                  <div className="mockup-metric-card">
                    <span className="metric-label">Monthly Recurring Revenue</span>
                    <span className="metric-value">₹8,45,000</span>
                    <span className="metric-trend positive">+8.6% vs target</span>
                  </div>
                </div>

                <div className="mockup-chart-preview">
                  <div className="chart-header">
                    <span>Renewal Success Rate</span>
                    <strong className="chart-score">96.4%</strong>
                  </div>
                  <div className="mockup-progress-bar">
                    <div className="progress-fill" style={{ width: '96.4%' }}></div>
                  </div>
                </div>

                <div className="mockup-table-preview">
                  <div className="mockup-row header-row">
                    <span>Subscriber</span>
                    <span>Plan</span>
                    <span>Status</span>
                  </div>
                  <div className="mockup-row">
                    <span className="user-name">Apex Solutions</span>
                    <span>Premium Monthly</span>
                    <span className="status-pill active">Active</span>
                  </div>
                  <div className="mockup-row">
                    <span className="user-name">Nova Studio</span>
                    <span>Standard Tier</span>
                    <span className="status-pill renewing">Renewing Soon</span>
                  </div>
                  <div className="mockup-row">
                    <span className="user-name">Zenith Digital</span>
                    <span>Basic Annual</span>
                    <span className="status-pill active">Active</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section id="problem-section" className="section section-problems">
        <div className="section-container">
          <div className="section-heading-center">
            <span className="section-pill pill-alert">Current Challenges</span>
            <h2 className="section-title">The Problem</h2>
            <p className="section-lead">
              Managing subscriptions manually causes operational friction, uncollected revenue, and unhappy customers.
            </p>
          </div>

          <div className="cards-grid cards-grid-4">
            {problems.map((item, index) => (
              <div key={index} className="feature-card problem-card">
                <div className="card-icon-bubble problem-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section id="solution-section" className="section section-solutions">
        <div className="section-container">
          <div className="section-heading-center">
            <span className="section-pill pill-solution">Engineered For Growth</span>
            <h2 className="section-title">Our Solution</h2>
            <p className="section-lead">
              A unified platform to eliminate manual work, streamline billing, and retain customers effortlessly.
            </p>
          </div>

          <div className="cards-grid cards-grid-4">
            {solutions.map((item, index) => (
              <div key={index} className="feature-card solution-card">
                <div className="card-icon-bubble solution-icon">{item.icon}</div>
                <h3 className="card-title">{item.title}</h3>
                <p className="card-desc">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Popular Plans Section */}
      <section className="section section-plans">
        <div className="section-container">
          <div className="section-heading-center">
            <span className="section-pill pill-plans">Flexible Packages</span>
            <h2 className="section-title">Popular Plans</h2>
            <p className="section-lead">
              Transparent, scalable pricing tailored to your recurring business model.
            </p>
          </div>

          <div className="cards-grid cards-grid-3 pricing-grid">
            {popularPlans.map((plan) => (
              <div 
                key={plan.id} 
                className={`pricing-card ${plan.isPopular ? 'popular-pricing-card' : ''}`}
              >
                {plan.isPopular && (
                  <div className="popular-badge-ribbon">Most Popular</div>
                )}
                <div className="plan-header">
                  <h3 className="plan-name">{plan.name}</h3>
                  <p className="plan-summary">{plan.description}</p>
                  <div className="plan-price-wrap">
                    <span className="price-value">{plan.price}</span>
                    <span className="price-period">/{plan.period}</span>
                  </div>
                </div>

                <div className="plan-divider"></div>

                <ul className="plan-features-list">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex}>
                      <span className="feature-check">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="plan-cta-wrapper">
                  <Link 
                    to="/plans" 
                    className={`btn btn-block ${plan.isPopular ? 'btn-orange' : 'btn-outline-dark'}`}
                  >
                    Subscribe Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="section section-how-it-works">
        <div className="section-container">
          <div className="section-heading-center">
            <span className="section-pill pill-process">Simple 4-Step Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-lead">
              From plan selection to automated renewal reminders, everything runs seamlessly on autopilot.
            </p>
          </div>

          <div className="cards-grid cards-grid-4 steps-grid">
            {howItWorksSteps.map((stepItem, index) => (
              <div key={index} className="step-card">
                <div className="step-number-badge">{stepItem.step}</div>
                <h3 className="step-title">{stepItem.title}</h3>
                <p className="step-desc">{stepItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Call-to-Action Section */}
      <section className="section cta-banner-section">
        <div className="section-container">
          <div className="cta-banner">
            <div className="cta-content">
              <span className="cta-tag">Ready to Automate?</span>
              <h2 className="cta-title">Start Managing Subscriptions Smarter</h2>
              <p className="cta-desc">
                Say goodbye to missed payments and manual billing friction. Launch recurring subscriptions with full tracking today.
              </p>
              <div className="cta-button-wrap">
                <Link to="/plans" className="btn btn-orange btn-lg">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
