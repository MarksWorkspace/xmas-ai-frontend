import React from 'react';
import { FiPlus } from 'react-icons/fi';
import './NewNeighborhoodButton.css';

const NewNeighborhoodButton = () => {
  return (
    <button className="new-neighborhood-btn">
      <FiPlus size={12} />
      New Neighborhood
    </button>
  );
};

export default NewNeighborhoodButton;