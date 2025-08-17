import React, { useState, useEffect } from 'react';

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

  return imageSrc ? (
    <img src={imageSrc} alt={alt} className={className} />
  ) : (
    <div className={`${className} image-placeholder`} />
  );
};

export default AuthImage;