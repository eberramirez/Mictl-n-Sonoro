import React from 'react';
import { CULTURAS_PREHISPANICAS, TIPOS_HISTORIA } from '../utils/culturalData';
import '../styles/components.css';

const CulturalSelector = ({ formData, onChange, disabled }) => {
  return (
    <div className="cultural-selector">
      <h3>Selección Cultural</h3>
      
      <div className="form-group">
        <label htmlFor="cultura">Civilización Prehispánica</label>
        <select
          id="cultura"
          name="cultura"
          value={formData.cultura}
          onChange={onChange}
          disabled={disabled}
          className="cultural-select"
        >
          <option value="">Selecciona una civilización...</option>
          {Object.entries(CULTURAS_PREHISPANICAS).map(([key, cultura]) => (
            <option key={key} value={key}>
              {cultura.nombre}
            </option>
          ))}
        </select>
        {formData.cultura && (
          <p className="cultura-description">
            {CULTURAS_PREHISPANICAS[formData.cultura].descripcion}
          </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="tipoHistoria">Tipo de Historia</label>
        <select
          id="tipoHistoria"
          name="tipoHistoria"
          value={formData.tipoHistoria}
          onChange={onChange}
          disabled={disabled}
        >
          {Object.entries(TIPOS_HISTORIA).map(([key, descripcion]) => (
            <option key={key} value={key}>
              {key.charAt(0).toUpperCase() + key.slice(1)} - {descripcion}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="edad">Edad del Público</label>
          <select
            id="edad"
            name="edad"
            value={formData.edad}
            onChange={onChange}
            disabled={disabled}
          >
            <option value="6-8">6-8 años (Infantil)</option>
            <option value="9-12">9-12 años (Pre-adolescente)</option>
            <option value="13-17">13-17 años (Adolescente)</option>
            <option value="18+">18+ años (Adulto)</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="duracion">Duración</label>
          <select
            id="duracion"
            name="duracion"
            value={formData.duracion}
            onChange={onChange}
            disabled={disabled}
          >
            <option value="corta">Corta (3-5 min)</option>
            <option value="media">Media (5-8 min)</option>
            <option value="larga">Larga (8-12 min)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            name="incluirDecisiones"
            checked={formData.incluirDecisiones}
            onChange={onChange}
            disabled={disabled}
          />
          <span>Incluir decisiones interactivas</span>
        </label>
      </div>
    </div>
  );
};

export default CulturalSelector;