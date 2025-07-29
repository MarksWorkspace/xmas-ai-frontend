import React from 'react';
import './BatchRenderRow.css';

const BatchRenderRow = ({ batch }) => {
  const [homes, timeInfo] = batch.subtitle.split(' · ');
  
  return (
    <div className={`batch-row ${batch.status}`}>
      <img className="batch-thumb" src={batch.image} alt={batch.title} />
      <div className="batch-info">
        <div className="batch-title">{batch.title}</div>
        <div className="batch-subtitle">
          <span>{homes}</span>
          <span>{timeInfo}</span>
        </div>
        {batch.status === 'active' ? (
          <div className="batch-progress-container">
            <div className="batch-progress-text">{batch.progress}%</div>
            <div className="batch-progress-bar">
              <div className="batch-progress" style={{ width: `${batch.progress}%` }} />
            </div>
          </div>
        ) : (
          <div className="batch-status-queued" />
        )}
      </div>
    </div>
  );
};

export default BatchRenderRow; 