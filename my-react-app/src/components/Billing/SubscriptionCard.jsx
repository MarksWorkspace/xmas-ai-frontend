import React from 'react';
import './SubscriptionCard.css';

const SubscriptionCard = ({ 
  plan, 
  isCurrentPlan, 
  isSubscribed, 
  onSubscribe, 
  subscribing, 
  formatPrice,
  isAuthenticated 
}) => {
  const handleSubscribeClick = () => {
    if (!isAuthenticated) {
      alert('Please log in to subscribe');
      return;
    }
    onSubscribe();
  };

  const getButtonText = () => {
    if (subscribing) return 'Processing...';
    if (isCurrentPlan && isSubscribed) return 'Current Plan';
    if (isSubscribed) return 'Switch Plan';
    return 'Subscribe Now';
  };

  const isButtonDisabled = () => {
    return subscribing || (isCurrentPlan && isSubscribed);
  };

  return (
    <div className={`subscription-card ${isCurrentPlan ? 'current-plan' : ''}`}>
      {isCurrentPlan && (
        <div className="current-plan-badge">
          Current Plan
        </div>
      )}
      
      <div className="plan-header">
        <h3 className="plan-name">{plan.name}</h3>
        <div className="plan-price">
          <span className="price-currency">$</span>
          <span className="price-amount">{formatPrice(plan.price)}</span>
          <span className="price-interval">/{plan.interval}</span>
        </div>
      </div>

      <div className="plan-features">
        <ul>
          {plan.features.map((feature, index) => (
            <li key={index}>
              <span className="feature-check">✓</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <div className="plan-action">
        <button 
          className={`subscribe-btn ${isCurrentPlan ? 'current' : ''}`}
          onClick={handleSubscribeClick}
          disabled={isButtonDisabled()}
        >
          {getButtonText()}
        </button>
        
        {!isAuthenticated && (
          <p className="auth-notice">
            Please log in to subscribe
          </p>
        )}
      </div>

      {plan.plan_id === 'yearly_unlimited' && (
        <div className="plan-highlight">
          <div className="highlight-badge">
            🔥 Most Popular
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCard;
