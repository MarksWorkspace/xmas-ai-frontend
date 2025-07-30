import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout/Layout';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import WelcomeBanner from './components/WelcomeBanner/WelcomeBanner';
import ActiveBatchRenders from './components/ActiveBatchRenders/ActiveBatchRenders';
import NewCampaign from './components/NewCampaign/NewCampaign';
import StatCard from './components/StatCard/StatCard';
import FlyerLibrary from './components/FlyerLibrary/FlyerLibrary';
import CreateCampaign from './components/CreateCampaign/CreateCampaign';

function Dashboard() {
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

  return (
    <Layout>
      <Sidebar />
      <div className="main-content">
        <TopBar />
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
      </div>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
      </Routes>
    </Router>
  );
}

export default App;