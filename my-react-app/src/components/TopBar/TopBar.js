import React from 'react';
import './TopBar.css';
import { FiSearch } from 'react-icons/fi';

const TopBar = () => {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <input
          className="topbar-search"
          type="text"
          placeholder="Search for Address or Project..."
        />
        <span className="topbar-search-icon">
          <FiSearch size={18} />
        </span>
      </div>
      <div className="topbar-right">
        <div className="topbar-avatar">
          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
};

export default TopBar; 