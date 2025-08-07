import React, { useState } from 'react';
import '../styles/components.css';

const InteractiveDecision = ({ decision, options, onDecisionMade, storyContext }) => {
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedOption) {
      alert('Por favor, selecciona una opción antes de continuar.');
      return;
    }

    setIsSubmitting(true);
    await onDecisionMade(decision, selectedOption, storyContext);
    setIsSubmitting(false);
  };

  return (
    <div className="interactive-decision">
      <div className="decision-container">
        <h3>Momento de Decisión</h3>
        <p className="decision-prompt">{decision}</p>
        
        <div className="options-list">
          {options.map((option, index) => (
            <label key={index} className="option-item">
              <input
                type="radio"
                name="storyDecision"
                value={option}
                checked={selectedOption === option}
                onChange={(e) => setSelectedOption(e.target.value)}
                disabled={isSubmitting}
              />
              <span className="option-text">{option}</span>
            </label>
          ))}
        </div>

        <button 
          onClick={handleSubmit}
          className="decision-btn"
          disabled={!selectedOption || isSubmitting}
        >
          {isSubmitting ? 'Continuando historia...' : 'Tomar decisión'}
        </button>
      </div>
    </div>
  );
};

export default InteractiveDecision;