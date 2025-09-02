import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ROUTES, makeRequest } from '../../config/api';
import './PaymentSuccess.css';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState(null);

  useEffect(() => {
    // Check subscription status after payment
    const checkSubscription = async () => {
      try {
        const subData = await makeRequest(API_ROUTES.mySubscription);
        setSubscription(subData);
      } catch (err) {
        console.error('Error fetching subscription:', err);
      } finally {
        setLoading(false);
      }
    };

    // Delay to allow webhook processing
    const timer = setTimeout(checkSubscription, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleContinue = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="payment-success-container">
        <div className="payment-loading">
          <div className="loading-spinner"></div>
          <h2>Processing your subscription...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <div className="success-icon">
          <div className="checkmark">
            <div className="checkmark-circle"></div>
            <div className="checkmark-stem"></div>
            <div className="checkmark-kick"></div>
          </div>
        </div>
        
        <h1>Payment Successful!</h1>
        <p>Thank you for subscribing to Yearly Unlimited Christmas Lights.</p>
        
        {subscription && (
          <div className="subscription-details">
            <h3>Subscription Details</h3>
            <div className="detail-item">
              <span>Plan:</span>
              <span>Yearly Unlimited</span>
            </div>
            <div className="detail-item">
              <span>Status:</span>
              <span className="status-active">Active</span>
            </div>
            <div className="detail-item">
              <span>Valid Until:</span>
              <span>
                {new Date(subscription.current_period_end).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        )}
        
        <div className="success-benefits">
          <h3>You now have access to:</h3>
          <ul>
            <li>✨ Unlimited Christmas lights image generation</li>
            <li>⚡ Priority processing queue</li>
            <li>🏠 All address types supported</li>
            <li>📧 Premium email support</li>
            <li>💼 Perfect for seasonal businesses</li>
          </ul>
        </div>
        
        <button 
          className="continue-btn"
          onClick={handleContinue}
        >
          Continue to Dashboard
        </button>
        
        <p className="receipt-note">
          A receipt has been sent to your email address.
        </p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
