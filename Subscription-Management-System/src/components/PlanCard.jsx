import { Link } from 'react-router-dom';

function PlanCard({ plan }) {
  if (!plan) return null;

  const {
    id,
    name,
    price,
    billingPeriod,
    description,
    features = [],
    isPopular = false,
  } = plan;

  return (
    <div className={`plan-card ${isPopular ? 'popular-plan-card' : ''}`}>
      {/* Popular Badge */}
      {isPopular && (
        <div className="plan-badge-top">
          Most Popular
        </div>
      )}

      {/* Plan Header */}
      <div className="plan-card-header">
        <h3 className="plan-card-name">{name}</h3>
        {description && <p className="plan-card-desc">{description}</p>}
        <div className="plan-card-pricing">
          <span className="price-amount">{price}</span>
          <span className="price-cycle">/{billingPeriod}</span>
        </div>
      </div>

      <div className="plan-card-divider"></div>

      {/* Features List */}
      <ul className="plan-card-features">
        {features.map((feature, index) => (
          <li key={index}>
            <span className="feature-icon">✓</span>
            <span className="feature-text">{feature}</span>
          </li>
        ))}
      </ul>

      {/* Action Button */}
      <div className="plan-card-footer">
        <Link
          to={`/plan/${id}`}
          className={`btn btn-block ${isPopular ? 'btn-orange' : 'btn-outline-dark'}`}
        >
          Subscribe Now
        </Link>
      </div>
    </div>
  );
}

export default PlanCard;
