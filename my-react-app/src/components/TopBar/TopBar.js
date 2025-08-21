import React, { useState } from 'react';
import './TopBar.css';
import { FiSearch } from 'react-icons/fi';

const TopBar = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  
  return (
    <div className="topbar">
      <div className="topbar-left">
        <input
          className="topbar-search"
          type="text"
          placeholder="Search for Address or Project..."
          onFocus={() => setSearchFocus(true)}
          onBlur={() => setSearchFocus(false)}
          aria-label="Search"
        />
        <span className="topbar-search-icon">
          <FiSearch size={18} />
        </span>
      </div>
    </div>
  );
};

export default TopBar; 