import React from 'react';
import { BrowserRouter as Router, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { JobProvider } from './context/JobContext';
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

const AppContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const statsData = [
    {
      icon: "neighborhoods",
      value: "12",
      label: "Neighborhoods Targeted"
    },
    {
      icon: "jobs",
      value: "5",
      label: "Batch Jobs in Progress"
    },
    {
      icon: "flyers",
      value: "247",
      label: "Flyers Generated This Week"
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
      {user && (
        <div className="header">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
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