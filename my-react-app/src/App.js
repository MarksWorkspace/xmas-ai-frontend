import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import TopBar from './components/TopBar/TopBar';

function App() {
  return (
    <div className="app">
      <Sidebar />
      <div className="main-content">
        <TopBar />
        {/* Main content will go here */}
      </div>
    </div>
  );
}

export default App;
