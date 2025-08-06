import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../Sidebar/Sidebar';
import TopBar from '../TopBar/TopBar';
import WelcomeBanner from '../WelcomeBanner/WelcomeBanner';
import ActiveBatchRenders from '../ActiveBatchRenders/ActiveBatchRenders';
import NewCampaign from '../NewCampaign/NewCampaign';
import StatCard from '../StatCard/StatCard';
import FlyerLibrary from '../FlyerLibrary/FlyerLibrary';
import CreateCampaign from '../CreateCampaign/CreateCampaign';
import Login from '../Auth/Login';
import Register from '../Auth/Register';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    try {
      logout();
      // Navigate to login page after successful logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // You might want to show an error message to the user here
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

  // Don't show layout elements for login/register pages
  if (location.pathname === '/login' || location.pathname === '/register') {
    return <div>{location.pathname === '/login' ? <Login /> : <Register />}</div>;
  }

  // Don't show dashboard content for create-campaign page
  const isDashboard = location.pathname === '/';
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

export default Layout;