import React from 'react';
import './ActiveBatchRenders.css';
import BatchRenderRow from './BatchRenderRow';
import { useJobs } from '../../context/JobContext';

const ActiveBatchRenders = () => {
  const { activeJobs, isLoading, error } = useJobs();

  if (isLoading && activeJobs.length === 0) {
    return (
      <div className="jobs-in-progress">
        <div className="batch-renders-header">
          <div className="batch-renders-title">
            <h2>Jobs in Progress</h2>
          </div>
        </div>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-in-progress">
        <div className="batch-renders-header">
          <div className="batch-renders-title">
            <h2>Jobs in Progress</h2>
          </div>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="jobs-in-progress">
      <div className="batch-renders-header">
        <div className="batch-renders-title">
          <div className="icon-batch">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13 5L21 5M21 5L21 13M21 5L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M11 19L3 19M3 19L3 11M3 19L11 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <h2>Jobs in Progress</h2>
        </div>
      </div>
      <div className="batch-renders-list">
        {activeJobs.map((job) => (
          <BatchRenderRow
            key={job.id}
            id={job.id}
            title={job.title}
            streets={job.streets}
            startTime={job.startTime}
            progress={job.progress}
            status={job.status}
            thumbnail={job.thumbnail}
            completedAddresses={job.completedAddresses}
            totalAddresses={job.totalAddresses}
          />
        ))}
        {activeJobs.length === 0 && (
          <div className="no-jobs-message">No active renders at the moment</div>
        )}
      </div>
    </div>
  );
};

export default ActiveBatchRenders; 