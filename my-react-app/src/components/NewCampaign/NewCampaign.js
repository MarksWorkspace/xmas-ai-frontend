import React from 'react';
import './NewCampaign.css';
import { TbArrowsExchange } from 'react-icons/tb';

const steps = [
  {
    number: 1,
    title: 'Select Neighbourhood',
    color: '#1b4332'
  },
  {
    number: 2,
    title: 'Start Batch Render',
    color: '#2d6a4f'
  },
  {
    number: 3,
    title: 'Export Flyers',
    color: '#ffd700'
  }
];

const NewCampaign = () => {
  return (
    <div className="campaign-section">
      <div className="campaign-header">
        <TbArrowsExchange className="campaign-header-icon" />
        <span>Start a New Campaign</span>
      </div>
      <div className="campaign-steps">
        {steps.map((step, index) => (
          <div key={index} className="campaign-step">
            <div className="step-indicator">
              <div 
                className="step-line" 
                style={{ backgroundColor: step.color }}
              />
              <div className="step-number">
                STEP {step.number}
              </div>
            </div>
            <div className="step-title">{step.title}</div>
          </div>
        ))}
      </div>
      <button className="start-campaign-btn">
        Start Now
      </button>
    </div>
  );
};

export default NewCampaign; 