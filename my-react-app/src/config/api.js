export const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://luminate-ai.onrender.com';

export const API_ROUTES = {
  me: `${API_BASE_URL}/users/me`,
  login: `${API_BASE_URL}/users/token`,
  register: `${API_BASE_URL}/users/register`,
  freeUsage: `${API_BASE_URL}/users/free-usage`,
  jobs: `${API_BASE_URL}/jobs/`,
  jobStatus: (jobId) => `${API_BASE_URL}/jobs/${jobId}/status`,
  jobAddresses: (jobId) => `${API_BASE_URL}/jobs/${jobId}/addresses/`,
  jobAddressImages: (jobId, addressId) => `${API_BASE_URL}/jobs/${jobId}/addresses/${addressId}/images`,
  jobDownloadAll: (jobId) => `${API_BASE_URL}/jobs/${jobId}/download-all`,
  // Billing routes
  subscriptionPlans: `${API_BASE_URL}/billing/subscription-plans`,
  paymentLink: `${API_BASE_URL}/billing/payment-link`,
  createPaymentLink: `${API_BASE_URL}/billing/create-payment-link`,
  mySubscription: `${API_BASE_URL}/billing/my-subscription`,
  cancelSubscription: `${API_BASE_URL}/billing/cancel-subscription`,
};

export const makeRequest = async (url, method = 'GET', data = null, isFormEncoded = false) => {
  const options = {
    method,
    headers: {
      'Content-Type': isFormEncoded ? 'application/x-www-form-urlencoded' : 'application/json',
    },
  };

  // Add authorization token if available
  const token = localStorage.getItem('auth_token');
  if (token && !url.includes('/token')) {
    // Ensure token is in the correct format for FastAPI
    options.headers['Authorization'] = `Bearer ${token}`;
    
    // Debug auth header for status requests only
    if (url.includes('/status')) {
      console.log('Auth header for status request:', options.headers['Authorization']);
    }
  }

  if (data) {
    if (isFormEncoded) {
      const formData = new URLSearchParams();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });
      options.body = formData.toString();
    } else {
      options.body = JSON.stringify(data);
    }
  }

  const response = await fetch(url, options);
  let responseData;
  try {
    responseData = await response.json();
  } catch (e) {
    responseData = null;
  }

  if (!response.ok) {
    console.error('API error response:', responseData);
    // Try to extract a meaningful error message
    let errorMsg = 'Something went wrong';
    if (responseData) {
      if (typeof responseData.detail === 'string') {
        errorMsg = responseData.detail;
      } else if (Array.isArray(responseData.detail) && responseData.detail[0]?.msg) {
        errorMsg = responseData.detail[0].msg;
      } else if (responseData.msg) {
        errorMsg = responseData.msg;
      }
    }
    throw new Error(errorMsg);
  }

  return responseData;
};

