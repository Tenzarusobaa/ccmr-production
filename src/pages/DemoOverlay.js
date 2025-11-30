// src/pages/DemoOverlay.js
import React from 'react';
import './DemoOverlay.css';

const DemoOverlay = () => {
  return (
    <div className="demo-overlay">
      <div className="demo-watermark main-watermark">
        CCMR Deployment Demo
      </div>
      <div className="demo-watermark top-left-watermark">
        CCMR Deployment Demo
      </div>
      <div className="demo-watermark top-right-watermark">
        CCMR Deployment Demo
      </div>
      <div className="demo-watermark bottom-left-watermark">
        CCMR Deployment Demo
      </div>
      <div className="demo-watermark bottom-right-watermark">
        CCMR Deployment Demo
      </div>
    </div>
  );
};

export default DemoOverlay;