import React, { useState, useEffect } from 'react';
import NoImage from './NoImage/NoImage';
import './AuthImage.css';

const AuthImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setHasError(false);

    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(src, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to load image');
        
        const blob = await response.blob();
        if (isMounted) {
          const objectUrl = URL.createObjectURL(blob);
          setImageSrc(objectUrl);
        }
      } catch (error) {
        console.error('Error loading image:', error);
        if (isMounted) {
          setHasError(true);
        }
      }
    };

    if (src) {
      fetchImage();
    }

    // Cleanup object URL and prevent state updates after unmount
    return () => {
      isMounted = false;
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  // Only show NoImage if there's no source URL provided or there's an error
  if (!src || hasError) {
    return <NoImage />;
  }

  // Show nothing while loading (parent's background will show through)
  if (!imageSrc) {
    return <div style={{ width: '100%', height: '100%', background: 'transparent' }} />;
  }

  // Show image once loaded
  return (
    <img 
      src={imageSrc} 
      alt={alt} 
      className={className} 
      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
    />
  );
};

export default AuthImage;