import React from 'react';
import './BatchRenderRow.css';
import { useJobs } from '../../context/JobContext';

const BatchRenderRow = ({ id, title, homes, startTime, status, progress, thumbnail }) => {
  const { deleteJob } = useJobs();
  
  // Format the title to show address and number of homes
  const formatTitle = (title, homes) => {
    // Extract the address from the title (assuming format "Generate image for [address]")
    const addressMatch = title.match(/Generate image for (.+)/i);
    const address = addressMatch ? addressMatch[1] : title;
    
    // If there's more than one home, add indicator
    if (homes > 1) {
      return `${address} (+${homes - 1} more)`;
    }
    return address;
  };

  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  // Get status display info
  const getStatusInfo = () => {
    const currentStatus = status?.toLowerCase() || 'pending';
    return {
      text: currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1),
      className: currentStatus
    };
  };

  const statusInfo = getStatusInfo();
  const formattedTitle = formatTitle(title, homes);
  
  return (
    <div className={`batch-render-row ${statusInfo.className}`}>
      <div className="batch-content">
        <div className="thumbnail">
          <img src={thumbnail} alt={title} />
        </div>
        <div className="batch-info">
          <h3 className="batch-title">{formattedTitle}</h3>
          <div className="batch-subtitle">
            <span>{homes} {homes === 1 ? 'home' : 'homes'}</span>
            <span>{formatDate(startTime)}</span>
            <span className={`status ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>
        <button 
          className="delete-button"
          onClick={() => {
            if (window.confirm('Are you sure you want to delete this batch?')) {
              deleteJob(id);
            }
          }}
          aria-label="Delete batch"
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 7V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V7M6 7H5M6 7H8M18 7H19M18 7H16M10 11V16M14 11V16M8 7V5C8 3.89543 8.89543 3 10 3H14C15.1046 3 16 3.89543 16 5V7M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BatchRenderRow; 