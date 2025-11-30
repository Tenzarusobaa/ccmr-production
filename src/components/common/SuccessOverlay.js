import React from 'react';
import './SuccessOverlay.css';

const SuccessOverlay = ({ 
  isVisible, 
  title = "Operation Completed Successfully!", 
  onView, 
  onExit,
  viewButtonText = "View",
  exitButtonText = "Exit"
}) => {
  if (!isVisible) return null;

  return (
    <div className="success-overlay">
      <div className="success-modal">
        <div className="success-icon">✓</div>
        <h3 className="success-title">{title}</h3>
        <div className="success-buttons">
          <button 
            className="success-btn exit-btn"
            onClick={onExit}
          >
            {exitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessOverlay;