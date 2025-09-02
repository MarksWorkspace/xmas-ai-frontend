import React from 'react';
import './FlyerLibrary.css';
import AuthImage from '../common/AuthImage';

const CompletedJobCard = ({ image, title, subtitle, completedAt, houseCount, onView }) => {
  // Format the date to be more readable and in local time
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Parse the UTC date string and explicitly handle timezone conversion
    const utcDate = new Date(dateString);
    
    // Get user's timezone offset in minutes
    const timezoneOffset = utcDate.getTimezoneOffset();
    
    // Create a new date adjusted for the local timezone
    const localDate = new Date(utcDate.getTime() - (timezoneOffset * 60000));
    
    return localDate.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  return (
    <div className="flyer-card">
      <div className="flyer-image">
        <AuthImage 
          src={image}
          alt={`Houses from ${title}`}
        />
      </div>
      <div className="flyer-details">
        <h3 className="flyer-title">{title}</h3>
        <p className="flyer-subtitle">{subtitle}</p>
        {completedAt && (
          <p className="completion-date">
            Completed: {formatDate(completedAt)}
          </p>
        )}
        <p className="house-count">{houseCount} houses</p>
        <div className="street-card-footer">
          <button 
            className="view-street-btn"
            onClick={onView}
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompletedJobCard;
