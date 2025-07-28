import React from 'react';
import './Sidebar.css';
import { RiDashboardLine, RiBuilding2Line, RiImageLine, RiFileList2Line, RiPriceTag3Line, RiPaintLine, RiWalletLine, RiSettings3Line, RiLogoutBoxRLine } from 'react-icons/ri';

const Sidebar = () => {
  const mainMenuItems = [
    { icon: <RiDashboardLine size={20} />, label: "Dashboard", active: true },
    { icon: <RiBuilding2Line size={20} />, label: "Neighborhoods" },
    { icon: <RiImageLine size={20} />, label: "Render Batches" },
    { icon: <RiFileList2Line size={20} />, label: "Flyers Library" },
    { icon: <RiPriceTag3Line size={20} />, label: "CRM Tags" },
    { icon: <RiPaintLine size={20} />, label: "Branding" }
  ];

  const systemMenuItems = [
    { icon: <RiWalletLine size={20} />, label: "Billing" },
    { icon: <RiSettings3Line size={20} />, label: "Settings" }
  ];

  return (
    <div className="sidebar">
      <div className="logo-container">
        <h2>Light Craft</h2>
      </div>
      
      <nav className="nav-menu">
        {mainMenuItems.map((item, index) => (
          <div 
            key={index} 
            className={`nav-item ${item.active ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </div>
        ))}

        <div className="system-menu">
          {systemMenuItems.map((item, index) => (
            <div 
              key={index} 
              className="nav-item"
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      <div className="logout-section">
        <div className="nav-item">
          <span className="nav-icon"><RiLogoutBoxRLine size={20} /></span>
          <span className="nav-label">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 