import React from 'react';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="app">
      {children}
    </div>
  );
};

export default Layout; 