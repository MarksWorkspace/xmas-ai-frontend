import React from 'react';
import { BrowserRouter as Router, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider, useJobs } from './context/JobContext';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import WelcomeBanner from './components/WelcomeBanner/WelcomeBanner';
import NewNeighborhoodButton from './components/NewNeighborhoodButton/NewNeighborhoodButton';
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

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Calculate real stats from the data
  const calculateNeighborhoodCount = () => {
    const allNeighborhoods = new Set();
    
    // Count unique neighborhoods from completed flyers
    Object.values(completedFlyers).forEach(jobData => {
      Object.keys(jobData.streets || {}).forEach(streetName => {
        allNeighborhoods.add(streetName);
      });
    });
    
    return allNeighborhoods.size;
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
      value: calculateNeighborhoodCount().toString(),
      label: "Completed Jobs"
    },
    {
      icon: "jobs",
      value: calculateProcessingJobs().toString(),
      label: "Batch Jobs in Progress"
    },
    {
      icon: "flyers",
      value: calculateTotalFlyers().toString(),
      label: "Flyers Generated"
    },
    {
      icon: "conversion",
      value: "4.8%",
      label: "Conversion CTR"
    }
  ];

  const { user } = useAuth();
  
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
                  <NewNeighborhoodButton />
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
                  <NewNeighborhoodButton />
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