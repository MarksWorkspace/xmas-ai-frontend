import React, { useState, useEffect } from 'react';
import './MobileBlocker.css';

const MobileBlocker = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isMobile) return null;

  return (
    <div className="mobile-blocker">
      <div className="mobile-blocker-content">
        <svg className="desktop-icon" viewBox="0 0 24 24" width="48" height="48">
          <path fill="currentColor" d="M21,14H3V4H21M21,2H3C1.89,2 1,2.89 1,4V16C1,17.11 1.89,18 3,18H10V20H8V22H16V20H14V18H21C22.11,18 23,17.11 23,16V4C23,2.89 22.11,2 21,2M21,16H3V14H21V16Z" />
        </svg>
        <h2>Desktop Only</h2>
        <p>This application is optimized for desktop use only. Please access it from a computer for the best experience.</p>
      </div>
    </div>
  );
};

export default MobileBlocker;
