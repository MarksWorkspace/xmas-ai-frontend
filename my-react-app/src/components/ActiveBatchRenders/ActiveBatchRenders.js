import React from 'react';
import './ActiveBatchRenders.css';
import BatchRenderRow from './BatchRenderRow';

const ActiveBatchRenders = () => {
  // This would come from your API in a real application
  const batchRenders = [
    {
      id: 1,
      title: 'Westover Heights',
      homes: '47',
      startTime: 'Started 2h ago',
      progress: 76,
      thumbnail: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=200&h=150'
    },
    {
      id: 2,
      title: 'Maple Ridge',
      homes: '23',
      startTime: 'Started 45m ago',
      progress: 35,
      thumbnail: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=200&h=150'
    },
    {
      id: 3,
      title: 'Luxury Estates',
      homes: '8',
      startTime: 'Starting soon',
      progress: 'Queued',
      thumbnail: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=200&h=150'
    }
  ];

  return (
    <div className="active-batch-renders">
      <div className="batch-renders-header">
        <div className="batch-renders-title">
          <div className="icon-batch">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 5L21 5M21 5L21 13M21 5L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M11 19L3 19M3 19L3 11M3 19L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Active Batch Renders</h2>
        </div>
      </div>
      <div className="batch-renders-list">
        {batchRenders.map((batch) => (
          <BatchRenderRow
            key={batch.id}
            title={batch.title}
            homes={batch.homes}
            startTime={batch.startTime}
            progress={batch.progress}
            thumbnail={batch.thumbnail}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveBatchRenders; 