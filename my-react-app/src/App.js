import React from 'react';
import { BrowserRouter as Router, useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
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

  if (location.pathname === '/login' || location.pathname === '/register') {
    return <div>{location.pathname === '/login' ? <Login /> : <Register />}</div>;
  }

  const isDashboard = location.pathname === '/' || location.pathname === '/dashboard';
  const isCreateCampaign = location.pathname === '/create-campaign';

  return (
    <div className="app">
      <Sidebar />
      <div className="header">
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
      <div className="main-content">
        <TopBar />
        {isDashboard ? (
          <div className="gradient-background">
            <WelcomeBanner />
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
        ) : isCreateCampaign ? (
          <CreateCampaign />
        ) : null}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;