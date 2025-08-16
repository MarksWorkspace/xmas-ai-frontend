const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://luminate-ai.onrender.com';

export const API_ROUTES = {
  login: `${API_BASE_URL}/users/token`,
  register: `${API_BASE_URL}/users/register`,
  jobs: `${API_BASE_URL}/jobs/`,  // Added trailing slash to match API route
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
    options.headers['Authorization'] = `Bearer ${token}`;
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

