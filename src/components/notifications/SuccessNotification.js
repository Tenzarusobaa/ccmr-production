// src/components/notifications/SuccessNotification.js
import React, { useEffect } from "react";
import "./SuccessNotification.css";

const SuccessNotification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-notification-overlay">
      <div className="success-notification">
        <div className="success-icon">✓</div>
        <div className="success-message">{message}</div>
        <button className="success-close-btn" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default SuccessNotification;