import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { API_ROUTES, makeRequest } from '../../config/api';
import SubscriptionCard from './SubscriptionCard';
import CurrentSubscription from './CurrentSubscription';
import './Billing.css';

const Billing = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchSubscriptionPlans();
    if (isAuthenticated) {
      fetchCurrentSubscription();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchSubscriptionPlans = async () => {
    try {
      const plans = await makeRequest(API_ROUTES.subscriptionPlans);
      setSubscriptionPlans(plans);
    } catch (err) {
      console.error('Error fetching subscription plans:', err);
      setError('Failed to load subscription plans');
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const subscription = await makeRequest(API_ROUTES.mySubscription);
      setCurrentSubscription(subscription);
    } catch (err) {
      // If user doesn't have a subscription, that's okay
      if (!err.message.includes('404') && !err.message.includes('No subscription')) {
        console.error('Error fetching current subscription:', err);
      }
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    if (!isAuthenticated) {
      alert('Please log in to subscribe');
      return;
    }

    setSubscribing(true);
    setError(null);

    try {
      const response = await makeRequest(API_ROUTES.createPaymentLink, 'POST', {
        plan_id: planId
      });

      // Redirect to Stripe checkout
      window.location.href = response.payment_url;
    } catch (err) {
      console.error('Error creating payment link:', err);
      setError('Failed to create payment link. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    const confirmed = window.confirm(
      'Are you sure you want to cancel your subscription? It will remain active until the end of your current billing period.'
    );

    if (!confirmed) return;

    try {
      await makeRequest(API_ROUTES.cancelSubscription, 'POST');
      alert('Your subscription has been scheduled for cancellation at the end of the current period.');
      fetchCurrentSubscription(); // Refresh subscription data
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      setError('Failed to cancel subscription. Please try again.');
    }
  };

  const formatPrice = (priceInCents) => {
    return (priceInCents / 100).toFixed(2);
  };

  const isSubscriptionActive = () => {
    if (!currentSubscription) return false;
    
    const now = new Date();
    const endDate = new Date(currentSubscription.current_period_end);
    
    return currentSubscription.status === 'active' && now < endDate;
  };

  if (loading) {
    return (
      <div className="billing-container">
        <div className="billing-loading">
          <div className="loading-spinner"></div>
          <p>Loading billing information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="billing-container">
      <div className="billing-header">
        <h1>Billing & Subscription</h1>
        <p>Unlock unlimited Christmas lights image generation with our yearly subscription</p>
      </div>

      {error && (
        <div className="billing-error">
          <p>{error}</p>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {/* Current Subscription Status */}
      {isAuthenticated && (
        <CurrentSubscription 
          subscription={currentSubscription}
          isActive={isSubscriptionActive()}
          onCancel={handleCancelSubscription}
        />
      )}

      {/* Subscription Plans */}
      <div className="subscription-plans">
        <h2>Available Plans</h2>
        <div className="plans-grid">
          {subscriptionPlans.map((plan) => (
            <SubscriptionCard
              key={plan.plan_id}
              plan={plan}
              isCurrentPlan={currentSubscription?.plan_id === plan.plan_id}
              isSubscribed={isSubscriptionActive()}
              onSubscribe={() => handleSubscribe(plan.plan_id)}
              subscribing={subscribing}
              formatPrice={formatPrice}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="billing-features">
        <h2>Why Choose Yearly Unlimited?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎄</div>
            <h3>Unlimited Generation</h3>
            <p>Generate as many Christmas lights images as you need throughout the year</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🏠</div>
            <h3>All Address Types</h3>
            <p>Support for residential, commercial, and all property types</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">⚡</div>
            <h3>Priority Processing</h3>
            <p>Your images get processed faster with priority queue access</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📧</div>
            <h3>Email Support</h3>
            <p>Get help when you need it with dedicated email support</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💼</div>
            <h3>Perfect for Business</h3>
            <p>Ideal for seasonal businesses, contractors, and decorating services</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <h3>Premium Features</h3>
            <p>Access to all current and future premium features</p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="billing-faq">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>How does billing work?</h3>
          <p>You pay once per year for unlimited access. Your subscription automatically renews unless cancelled.</p>
        </div>
        <div className="faq-item">
          <h3>Can I cancel anytime?</h3>
          <p>Yes, you can cancel your subscription at any time. You'll retain access until the end of your current billing period.</p>
        </div>
        <div className="faq-item">
          <h3>What payment methods do you accept?</h3>
          <p>We accept all major credit cards, debit cards, and digital wallets through our secure Stripe integration.</p>
        </div>
        <div className="faq-item">
          <h3>Is my payment information secure?</h3>
          <p>Yes, all payments are processed securely through Stripe. We never store your payment information.</p>
        </div>
      </div>
    </div>
  );
};

export default Billing;
