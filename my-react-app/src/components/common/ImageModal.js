import React, { useEffect } from 'react';
import AuthImage from './AuthImage';
import './ImageModal.css';

const ImageModal = ({ imageUrl, onClose }) => {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Close on background click
  const handleBackgroundClick = (e) => {
    if (e.target.classList.contains('image-modal-overlay')) {
      onClose();
    }
  };

  return (
    <div className="image-modal-overlay" onClick={handleBackgroundClick}>
      <div className="image-modal-content">
        <button className="image-modal-close" onClick={onClose}>×</button>
        <AuthImage 
          src={imageUrl} 
          alt="Full size view" 
          className="image-modal-image"
        />
      </div>
    </div>
  );
};

export default ImageModal;
