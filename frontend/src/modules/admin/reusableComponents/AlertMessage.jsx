// AlertMessage.js
import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

// Define an enum or constants for the types of alert
const ALERT_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
};

const AlertMessage = ({ type, message, show }) => {
  const [isVisible, setIsVisible] = useState(show);

  const getAlertStyle = () => {
    switch (type) {
      case ALERT_TYPES.SUCCESS:
        return { backgroundColor: '#28a745', color: '#fff' };
      case ALERT_TYPES.ERROR:
        return { backgroundColor: '#dc3545', color: '#fff' };
      case ALERT_TYPES.WARNING:
        return { backgroundColor: '#ffc107', color: '#212529' };
      default:
        return {};
    }
  };

  const getIcon = () => {
    switch (type) {
      case ALERT_TYPES.SUCCESS:
        return 'check-circle-fill';
      case ALERT_TYPES.ERROR:
        return 'exclamation-triangle-fill';
      case ALERT_TYPES.WARNING:
        return 'info-fill';
      default:
        return '';
    }
  };

  return (
    <ToastContainer position="top-end">
      <Toast
        style={getAlertStyle()}
        show={isVisible}
        onClose={() => setIsVisible(false)}
        delay={3000} // Dismiss the alert after 3 seconds
        autohide
      >
        <Toast.Body>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            fill="currentColor"
            className="bi bi-check-circle-fill"
            viewBox="0 0 16 16"
            style={{ marginRight: '10px', width: '20px', height: '20px' }}
          >
            <use xlinkHref={`#${getIcon()}`} />
          </svg>
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default AlertMessage;
