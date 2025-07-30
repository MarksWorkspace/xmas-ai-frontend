import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewCampaign.css';

const NewCampaign = () => {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      title: 'Select Neighbourhood',
      color: '#006633'
    },
    {
      number: 2,
      title: 'Start Batch Render',
      color: '#008040'
    },
    {
      number: 3,
      title: 'Export Flyers',
      color: '#e6b800'
    }
  ];

  return (
    <div className="campaign-section">
      <div className="campaign-header">
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
      <button 
        className="start-campaign-btn"
        onClick={() => navigate('/create-campaign')}
      >
        Start Now
      </button>
    </div>
  );
};

export default NewCampaign;