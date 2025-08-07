import React, { useState } from 'react';
import CulturalSelector from './CulturalSelector';
import { CULTURAS_PREHISPANICAS } from '../utils/culturalData';
import '../styles/components.css';

const StoryForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    cultura: 'mexica',
    tipoHistoria: 'mito',
    personajesPrincipales: '',
    lugar: '',
    tema: '',
    edad: '9-12',
    duracion: 'media',
    incluirDecisiones: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cultura || !formData.personajesPrincipales.trim() || 
        !formData.lugar.trim() || !formData.tema.trim()) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    onSubmit(formData);
  };

  const fillExample = (exampleNum) => {
    const examples = [
      {
        cultura: 'mexica',
        tipoHistoria: 'mito',
        personajesPrincipales: 'Quetzalcóatl y una joven sacerdotisa llamada Itzel',
        lugar: 'El gran Teocalli de Tenochtitlan durante el solsticio de verano',
        tema: 'El origen del cacao y su importancia sagrada para el pueblo mexica',
        edad: '9-12',
        duracion: 'media',
        incluirDecisiones: true
      },
      {
        cultura: 'maya',
        tipoHistoria: 'aventura',
        personajesPrincipales: 'Itzamná, dios creador, y un joven escriba maya llamado Akbal',
        lugar: 'Las selvas del Petén y la ciudad sagrada de Tikal',
        tema: 'La búsqueda del conocimiento perdido en los códices ancestrales',
        edad: '13-17',
        duracion: 'larga',
        incluirDecisiones: true
      },
      {
        cultura: 'zapoteca',
        tipoHistoria: 'leyenda',
        personajesPrincipales: 'Pitao Cocijo, señor de la lluvia, y la princesa Donají',
        lugar: 'Monte Albán y los valles centrales de Oaxaca',
        tema: 'El sacrificio heroico para salvar a su pueblo de la sequía',
        edad: '18+',
        duracion: 'media',
        incluirDecisiones: false
      }
    ];

    const example = examples[exampleNum - 1];
    setFormData(example);
  };

  return (
    <div className="story-form cultural-theme">
      <div className="form-header">
        <h2>Crear Cuento Cultural</h2>
        <p>Genera historias basadas en las ricas tradiciones de México ancestral</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <CulturalSelector 
          formData={formData} 
          onChange={handleChange} 
          disabled={isLoading} 
        />

        <div className="story-details">
          <h3>Detalles de la Historia</h3>
          
          <div className="form-group">
            <label htmlFor="personajesPrincipales">Personajes Principales *</label>
            <input
              type="text"
              id="personajesPrincipales"
              name="personajesPrincipales"
              value={formData.personajesPrincipales}
              onChange={handleChange}
              placeholder="Ej: Quetzalcóatl y una joven sacerdotisa llamada Citlali"
              disabled={isLoading}
            />
            {formData.cultura && (
              <div className="suggestions">
                <small>Personajes sugeridos: {CULTURAS_PREHISPANICAS[formData.cultura].personajes.join(', ')}</small>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="lugar">Lugar Principal *</label>
            <input
              type="text"
              id="lugar"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              placeholder="Ej: El gran templo de Tenochtitlan durante la ceremonia del fuego nuevo"
              disabled={isLoading}
            />
            {formData.cultura && (
              <div className="suggestions">
                <small>Lugares sugeridos: {CULTURAS_PREHISPANICAS[formData.cultura].lugares.join(', ')}</small>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tema">Tema Central *</label>
            <textarea
              id="tema"
              name="tema"
              value={formData.tema}
              onChange={handleChange}
              placeholder="Ej: La búsqueda del equilibrio entre el mundo terrenal y el espiritual, donde los protagonistas deben aprender el valor de la sabiduría ancestral..."
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="generate-btn cultural-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creando cuento...' : 'Generar Cuento Cultural'}
          </button>
        </div>
      </form>

      <div className="examples cultural-examples">
        <h3>Ejemplos Culturales:</h3>
        <div className="example-buttons">
          <button 
            type="button" 
            onClick={() => fillExample(1)}
            className="example-btn mexica-btn"
            disabled={isLoading}
          >
            Mito Mexica
          </button>
          <button 
            type="button" 
            onClick={() => fillExample(2)}
            className="example-btn maya-btn"
            disabled={isLoading}
          >
            Aventura Maya
          </button>
          <button 
            type="button" 
            onClick={() => fillExample(3)}
            className="example-btn zapoteca-btn"
            disabled={isLoading}
          >
            Leyenda Zapoteca
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoryForm;