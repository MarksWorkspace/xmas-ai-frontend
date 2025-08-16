import React from 'react';
import './BatchRenderRow.css';

const BatchRenderRow = ({ title, homes, startTime, status, progress, thumbnail }) => {
  // Get status display info
  const getStatusInfo = () => {
    const currentStatus = status?.toLowerCase() || 'pending';
    return {
      text: currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1),
      className: currentStatus
    };
  };

  const statusInfo = getStatusInfo();
  
  return (
    <div className={`batch-render-row ${statusInfo.className}`}>
      <div className="batch-content">
        <div className="thumbnail">
          <img src={thumbnail} alt={title} />
        </div>
        <div className="batch-info">
          <h3 className="batch-title">{title}</h3>
          <div className="batch-subtitle">
            <span>{homes} homes</span>
            <span>{startTime}</span>
            <span className={`status ${statusInfo.className}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchRenderRow; 