import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Sidebar.css';
import { RiDashboardLine, RiAddLine, RiWalletLine, RiLogoutBoxRLine, RiCustomerService2Line, RiMenuLine, RiCloseLine } from 'react-icons/ri';

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
    { icon: <RiAddLine size={20} />, label: "Create Campaign", route: "/create-campaign" }
  ];

  const systemMenuItems = [
    { icon: <RiWalletLine size={20} />, label: "Billing", route: "/billing" },
    { icon: <RiCustomerService2Line size={20} />, label: "Contact Us", route: "/contact" }
  ];

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <nav className="nav-menu">
        <div className="nav-item toggle-item" onClick={toggleSidebar}>
          {isCollapsed ? (
            <>
              <span className="nav-icon">
                <RiMenuLine size={20} />
              </span>
              <span className="nav-label">Smart Lights</span>
            </>
          ) : (
            <>
              <span className="nav-label">Smart Lights</span>
              <span className="nav-icon close-icon">
                <RiCloseLine size={20} />
              </span>
            </>
          )}
        </div>

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

        <div className="logout-section">
          <div className="nav-item" onClick={handleLogout} role="button" tabIndex={0}>
            <span className="nav-icon"><RiLogoutBoxRLine size={20} /></span>
            <span className="nav-label">Logout</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;