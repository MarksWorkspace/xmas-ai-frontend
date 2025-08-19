import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import './NewNeighborhoodButton.css';

const NewNeighborhoodButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/create-campaign');
  };

  return (
    <button className="new-neighborhood-btn" onClick={handleClick}>
      <FiPlus size={12} />
      New Neighborhood
    </button>
  );
};

export default NewNeighborhoodButton;