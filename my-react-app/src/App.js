import React from 'react';
import { BrowserRouter as Router, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { makeRequest, API_ROUTES } from './config/api';
import { JobProvider, useJobs } from './context/JobContext';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import WelcomeBanner from './components/WelcomeBanner/WelcomeBanner';

import ActiveBatchRenders from './components/ActiveBatchRenders/ActiveBatchRenders';
import NewCampaign from './components/NewCampaign/NewCampaign';
import StatCard from './components/StatCard/StatCard';
import FlyerLibrary from './components/FlyerLibrary/FlyerLibrary';
import CreateCampaign from './components/CreateCampaign/CreateCampaign';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import StreetView from './components/StreetView/StreetView';
import ProtectedRoute from './components/ProtectedRoute';
import { Billing, PaymentSuccess } from './components/Billing';

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { completedFlyers, activeJobs } = useJobs();
  const [subscriptionStats, setSubscriptionStats] = React.useState({
    imagesUsed: 0,
    imagesLimit: 0,
    imagesRemaining: 0
  });

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Calculate real stats from the data
  const calculateCompletedJobs = () => {
    // Count total number of completed jobs
    return Object.keys(completedFlyers).length;
  };

  const calculateProcessingJobs = () => {
    // Count jobs that are currently processing (not completed)
    return activeJobs.filter(job => job.status !== 'completed').length;
  };

  const calculateTotalFlyers = () => {
    let total = 0;
    Object.values(completedFlyers).forEach(jobData => {
      Object.values(jobData.streets || {}).forEach(streetFlyers => {
        total += streetFlyers.length;
      });
    });
    return total;
  };

  const statsData = [
    {
      icon: "neighborhoods",
      value: calculateCompletedJobs().toString(),
      label: "Completed Jobs"
    },
    {
      icon: "jobs",
      value: calculateProcessingJobs().toString(),
      label: "Batch Jobs in Progress"
    },
    {
      icon: "flyers",
      value: subscriptionStats.imagesUsed.toString(),
      label: "Images Created"
    },
    {
      icon: "conversion",
      value: subscriptionStats.imagesRemaining.toString(),
      label: "Images Remaining"
    }
  ];

  const { user } = useAuth();

  // Fetch subscription data
  React.useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await makeRequest(API_ROUTES.mySubscription, 'GET');
        if (response && 
            typeof response.yearly_images_used === 'number' && 
            typeof response.yearly_images_limit === 'number' &&
            typeof response.images_remaining === 'number') {
          setSubscriptionStats({
            imagesUsed: response.yearly_images_used,
            imagesLimit: response.yearly_images_limit,
            imagesRemaining: response.images_remaining
          });
        } else {
          console.error('Invalid subscription data format:', response);
        }
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      }
    };

    if (user) {
      fetchSubscriptionData();
    }
  }, [user]);
  
  // If on login or register page, only show those components
  if (location.pathname === '/login' || location.pathname === '/register') {
    return (
      <div className="auth-container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    );
  }
  return (
    <div className="app">
      {user && <Sidebar />}
      <div className={`main-content ${!user ? 'full-width' : ''}`}>
        {user && <TopBar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <div className="gradient-background">
                <div className="welcome-wrapper">
                  <WelcomeBanner />
                </div>
                <div className="stats-container">
                  {statsData.map((stat, index) => (
                    <StatCard 
                      key={index}
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                    />
                  ))}
                </div>
                <div className="dashboard-row">
                  <div className="dashboard-main">
                    <ActiveBatchRenders />
                  </div>
                  <div className="dashboard-side">
                    <NewCampaign />
                  </div>
                </div>
                <FlyerLibrary />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="gradient-background">
                <div className="welcome-wrapper">
                  <WelcomeBanner />
                </div>
                <div className="stats-container">
                  {statsData.map((stat, index) => (
                    <StatCard 
                      key={index}
                      icon={stat.icon}
                      value={stat.value}
                      label={stat.label}
                    />
                  ))}
                </div>
                <div className="dashboard-row">
                  <div className="dashboard-main">
                    <ActiveBatchRenders />
                  </div>
                  <div className="dashboard-side">
                    <NewCampaign />
                  </div>
                </div>
                <FlyerLibrary />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/billing/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/street/:streetName" element={<ProtectedRoute><StreetView /></ProtectedRoute>} />
          <Route path="/batch/:batchId" element={<ProtectedRoute><StreetView /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <JobProvider>
          <AppContent />
        </JobProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;