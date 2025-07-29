import React from 'react';
import './ActiveBatchRenders.css';
import BatchRenderRow from './BatchRenderRow';
import { FiZap } from 'react-icons/fi';

const batchRenders = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=72&h=72',
    title: 'Westover Heights',
    subtitle: '47 homes · Started 2h ago',
    progress: 76,
    status: 'active'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=72&h=72',
    title: 'Maple Ridge',
    subtitle: '23 homes · Started 45m ago',
    progress: 35,
    status: 'active'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1508921912186-1d1a45ebb3c1?auto=format&fit=crop&w=72&h=72',
    title: 'Luxury Estates',
    subtitle: '8 homes · Starting soon',
    progress: 0,
    status: 'queued'
  }
];

const ActiveBatchRenders = () => (
  <div className="batch-renders-section">
    <div className="batch-renders-header">
      <FiZap className="batch-renders-header-icon" />
      <span>Active Batch Renders</span>
    </div>
    <div className="batch-renders-list">
      {batchRenders.map(batch => (
        <BatchRenderRow key={batch.id} batch={batch} />
      ))}
    </div>
  </div>
);

export default ActiveBatchRenders; 