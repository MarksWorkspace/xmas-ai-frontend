import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';
import WelcomeBanner from './components/WelcomeBanner/WelcomeBanner';
import ActiveBatchRenders from './components/ActiveBatchRenders/ActiveBatchRenders';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        <WelcomeBanner />
        <div className="dashboard-row">
          <div className="dashboard-main">
            <ActiveBatchRenders />
          </div>
          <div className="dashboard-side">
            {/* Start a New Campaign component will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
