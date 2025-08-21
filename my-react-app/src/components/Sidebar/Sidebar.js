import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
import { RiDashboardLine, RiBuilding2Line, RiImageLine, RiFileList2Line, RiPriceTag3Line, RiPaintLine, RiWalletLine, RiSettings3Line, RiLogoutBoxRLine } from 'react-icons/ri';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    try {
      logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigation = (route) => {
    navigate(route);
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    document.body.classList.toggle('sidebar-collapsed');
  };

  const mainMenuItems = [
    { icon: <RiDashboardLine size={20} />, label: "Dashboard", route: "/dashboard", active: true },
    { icon: <RiBuilding2Line size={20} />, label: "Neighborhoods", route: "/neighborhoods" },
    { icon: <RiImageLine size={20} />, label: "Render Batches", route: "/render-batches" },
    { icon: <RiFileList2Line size={20} />, label: "Flyers Library", route: "/flyers-library" },
    { icon: <RiPriceTag3Line size={20} />, label: "CRM Tags", route: "/crm-tags" },
    { icon: <RiPaintLine size={20} />, label: "Branding", route: "/branding" }
  ];

  const systemMenuItems = [
    { icon: <RiWalletLine size={20} />, label: "Billing", route: "/billing" },
    { icon: <RiSettings3Line size={20} />, label: "Settings", route: "/settings" }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <h1 className="sidebar-title">Light Craft</h1>
        <button className="hamburger-button" onClick={toggleSidebar}>
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      
      <nav className="nav-menu">
        {mainMenuItems.map((item, index) => (
          <div 
            key={index} 
            className={`nav-item ${item.active ? 'active' : ''}`}
            onClick={() => handleNavigation(item.route)}
            role="button"
            tabIndex={0}
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
              onClick={() => handleNavigation(item.route)}
              role="button"
              tabIndex={0}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </div>
      </nav>

      <div className="logout-section">
        <div className="nav-item" onClick={handleLogout} role="button" tabIndex={0}>
          <span className="nav-icon"><RiLogoutBoxRLine size={20} /></span>
          <span className="nav-label">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;