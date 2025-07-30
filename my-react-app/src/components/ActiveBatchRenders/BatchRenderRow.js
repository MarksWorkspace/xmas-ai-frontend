import React from 'react';
import './BatchRenderRow.css';

const BatchRenderRow = ({ title, homes, startTime, progress, thumbnail }) => {
  const isQueued = progress === 'Queued';
  
  return (
    <div className={`batch-render-row ${isQueued ? 'queued' : ''}`}>
      <div className="batch-content">
        <div className="thumbnail">
          <img src={thumbnail} alt={title} />
        </div>
        <div className="batch-info">
          <h3 className="batch-title">{title}</h3>
          <div className="batch-subtitle">
            <span>{homes} homes</span>
            <span>{startTime}</span>
          </div>
        </div>
      </div>
      <div className="progress-container">
        {!isQueued && (
          <>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="status">{progress}%</div>
          </>
        )}
        {isQueued && (
          <>
            <div className="progress-bar" />
            <div className="status">Queued</div>
          </>
        )}
      </div>
    </div>
  );
};

export default BatchRenderRow; 