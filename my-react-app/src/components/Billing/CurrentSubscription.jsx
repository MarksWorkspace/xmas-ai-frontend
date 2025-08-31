import React from 'react';
import './CurrentSubscription.css';

const CurrentSubscription = ({ subscription, isActive, onCancel }) => {
  if (!subscription) {
    return (
      <div className="current-subscription no-subscription">
        <div className="subscription-status">
          <h2>No Active Subscription</h2>
          <p>Subscribe to generate 300 Christmas lights images</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = () => {
    if (!isActive) return 'expired';
    if (subscription.cancel_at_period_end) return 'cancelling';
    return 'active';
  };

  const getStatusText = () => {
    if (!isActive) return 'Expired';
    if (subscription.cancel_at_period_end) return 'Cancelling';
    return 'Active';
  };

  const getStatusIcon = () => {
    if (!isActive) return '❌';
    if (subscription.cancel_at_period_end) return '⚠️';
    return '✅';
  };

  const getRemainingDays = () => {
    const endDate = new Date(subscription.current_period_end);
    const now = new Date();
    const diffTime = endDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const remainingDays = getRemainingDays();

  return (
    <div className={`current-subscription ${getStatusColor()}`}>
      <div className="subscription-header">
        <h2>Your Subscription</h2>
        <div className={`subscription-status ${getStatusColor()}`}>
          <span className="status-icon">{getStatusIcon()}</span>
          <span className="status-text">{getStatusText()}</span>
        </div>
      </div>

      <div className="subscription-details">
        <div className="subscription-info">
          <div className="info-item">
            <label>Plan</label>
            <span>Yearly 300 Images</span>
          </div>
          
          <div className="info-item">
            <label>Status</label>
            <span className={`status-badge ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          <div className="info-item">
            <label>Current Period</label>
            <span>
              {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
            </span>
          </div>

          {isActive && (
            <div className="info-item">
              <label>Days Remaining</label>
              <span className={remainingDays <= 30 ? 'expiring-soon' : ''}>
                {remainingDays} days
                {remainingDays <= 30 && ' (Expiring Soon)'}
              </span>
            </div>
          )}
        </div>

        <div className="subscription-actions">
          {isActive && !subscription.cancel_at_period_end && (
            <button 
              className="cancel-btn"
              onClick={onCancel}
            >
              Cancel Subscription
            </button>
          )}

          {subscription.cancel_at_period_end && (
            <div className="cancellation-notice">
              <p>
                Your subscription will end on {formatDate(subscription.current_period_end)}.
                You'll continue to have access until then.
              </p>
            </div>
          )}

          {!isActive && (
            <div className="expired-notice">
              <p>
                Your subscription expired on {formatDate(subscription.current_period_end)}.
                Subscribe again to continue generating images.
              </p>
            </div>
          )}
        </div>
      </div>

      {isActive && (
        <div className="subscription-benefits">
          <h3>Active Benefits</h3>
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">🎄</span>
              <span>300 Christmas lights images</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">⚡</span>
              <span>Priority processing</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📧</span>
              <span>Email support</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">✨</span>
              <span>All premium features</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentSubscription;
