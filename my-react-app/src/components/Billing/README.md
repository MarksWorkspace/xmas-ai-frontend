# Billing System Documentation

## Overview

The billing system provides a complete subscription management interface for yearly unlimited Christmas lights image generation. It integrates with Stripe for secure payment processing and includes subscription management features.

## Components

### 1. Billing.jsx
Main billing page component that orchestrates the entire billing experience.

**Features:**
- Displays available subscription plans
- Shows current subscription status
- Handles subscription creation via Stripe
- Manages subscription cancellation
- Provides FAQ and features sections

**Key Functions:**
- `fetchSubscriptionPlans()` - Gets available plans from API
- `fetchCurrentSubscription()` - Gets user's current subscription
- `handleSubscribe(planId)` - Creates payment link and redirects to Stripe
- `handleCancelSubscription()` - Cancels active subscription

### 2. SubscriptionCard.jsx
Displays individual subscription plan details in a card format.

**Props:**
- `plan` - Plan object with pricing and features
- `isCurrentPlan` - Boolean indicating if this is user's current plan
- `isSubscribed` - Boolean indicating if user has active subscription
- `onSubscribe` - Function to handle subscription
- `subscribing` - Boolean for loading state
- `formatPrice` - Function to format price display
- `isAuthenticated` - Boolean for auth state

### 3. CurrentSubscription.jsx
Shows the user's current subscription status and management options.

**Props:**
- `subscription` - Current subscription object
- `isActive` - Boolean indicating if subscription is active
- `onCancel` - Function to handle cancellation

**Features:**
- Displays subscription details (plan, status, dates)
- Shows remaining days
- Handles cancellation requests
- Shows benefits for active subscriptions

### 4. PaymentSuccess.jsx
Success page shown after successful payment completion.

**Features:**
- Animated success checkmark
- Subscription confirmation details
- Benefits overview
- Navigation back to dashboard

## API Integration

The billing system integrates with the following API endpoints:

```javascript
// API Routes (added to config/api.js)
subscriptionPlans: '/billing/subscription-plans'
paymentLink: '/billing/payment-link'
createPaymentLink: '/billing/create-payment-link'
mySubscription: '/billing/my-subscription'
cancelSubscription: '/billing/cancel-subscription'
```

## User Flow

### New Subscription Flow:
1. User visits `/billing` page
2. Views available subscription plans
3. Clicks "Subscribe Now" on desired plan
4. System creates Stripe payment link via API
5. User redirected to Stripe checkout
6. After payment, user redirected to `/billing/success`
7. Webhook updates subscription in database
8. User sees success page and returns to dashboard

### Subscription Management Flow:
1. User visits `/billing` page
2. Current subscription status displayed at top
3. User can view subscription details
4. User can cancel subscription (remains active until period end)
5. Expired subscriptions show renewal options

## Styling

Each component has its own CSS file with:
- Responsive design for mobile/tablet/desktop
- Modern gradient backgrounds
- Smooth animations and transitions
- Consistent color scheme matching app theme
- Loading states and interactive feedback

## Security Features

- All payments processed through Stripe (PCI compliant)
- No payment information stored locally
- JWT token authentication for API calls
- Protected routes requiring login
- Secure webhook validation

## Configuration

### Environment Variables
```
REACT_APP_API_URL=your_api_base_url
```

### Stripe Configuration
- Payment links configured on Stripe dashboard
- Webhook endpoints configured for subscription events
- Success/cancel URLs point to app routes

## Usage

### Adding to Routes
```javascript
import { Billing, PaymentSuccess } from './components/Billing';

// In your router
<Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
<Route path="/billing/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
```

### Navigation
The billing page is accessible via:
- Sidebar navigation (already configured)
- Direct URL: `/billing`
- Success page: `/billing/success`

## Error Handling

The system handles various error scenarios:
- Network connectivity issues
- API errors
- Invalid subscription states
- Payment failures
- Authentication errors

## Testing

### Manual Testing Checklist:
- [ ] View billing page without authentication
- [ ] View billing page with no subscription
- [ ] View billing page with active subscription
- [ ] View billing page with expired subscription
- [ ] Subscribe to plan (test mode)
- [ ] Cancel active subscription
- [ ] View success page after payment
- [ ] Test responsive design on mobile

### Stripe Test Cards:
- Success: 4242424242424242
- Decline: 4000000000000002

## Future Enhancements

Potential improvements:
- Multiple subscription tiers
- Monthly billing options
- Proration for plan changes
- Usage tracking and limits
- Invoice history
- Payment method management
- Subscription pause/resume
