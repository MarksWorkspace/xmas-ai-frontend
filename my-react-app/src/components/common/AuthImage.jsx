import React, { useState, useEffect } from 'react';
import NoImage from './NoImage/NoImage';

const AuthImage = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState('');

  useEffect(() => {
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
        const objectUrl = URL.createObjectURL(blob);
        setImageSrc(objectUrl);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    fetchImage();

    // Cleanup object URL on unmount
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [src]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {imageSrc ? (
        <img src={imageSrc} alt={alt} className={className} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <NoImage />
      )}
    </div>
  );
};

export default AuthImage;