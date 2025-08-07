import React from 'react';
import '../styles/components.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <div className="loading-text">
        <h3>Generando tu cuento...</h3>
        <p>La IA está creando una historia única para ti</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;