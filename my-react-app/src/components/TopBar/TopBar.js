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
    </div>
  );
};

export default TopBar; 