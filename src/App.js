import React, { useState, useEffect } from 'react';
import StoryForm from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import InteractiveStoryDisplay from './components/InteractiveStoryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import MoctiAssistant from './components/MoctiAssistant';
import { generateCulturalStory } from './services/geminiService';
import './styles/App.css';



function App() {
  const [story, setStory] = useState('');
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('form'); // 'form' o 'story'

  // Efecto para el header sticky
  useEffect(() => {
    const header = document.querySelector('.app-header');
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleGenerateStory = async (formData) => {
    setIsLoading(true);
    setError('');
    setStory('');
    setOriginalFormData(formData);

    try {
      const generatedStory = await generateCulturalStory(formData);
      setStory(generatedStory);
      setCurrentView('story'); // Cambiar a vista del cuento
    } catch (err) {
      setError('Error al generar el cuento cultural: ' + err.message);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    setCurrentView('form');
    setStory('');
    setError('');
  };

  // Función para manejar sugerencias de Mocti
  const handleMoctiSuggestion = (suggestion) => {
    console.log('Sugerencia de Mocti:', suggestion);
    // Aquí puedes implementar lógica para usar las sugerencias
    // Por ejemplo, pre-llenar campos del formulario
  };

  // Función para detectar si la historia tiene decisiones interactivas
  const hasInteractiveDecisions = (storyText) => {
    return (storyText.includes('¿Qué decide') || 
           storyText.includes('¿Qué hace') || 
           storyText.includes('¿Cuál es') ||
           storyText.includes('[DECISIÓN:') ||
           storyText.includes('Opción A:')) && 
           !storyText.includes('(Supongamos que se elige');
  };

  return (
    <div className="App mictlan-app">
      <header className="app-header cultural-header">
        <div className="header-content">
          <h1>Mictlán Sonoro</h1>
          <p>Cuentos interactivos de la cultura mexicana</p>
        </div>
      </header>

      <main className="app-main">
        {/* Vista del Formulario */}
        {currentView === 'form' && (
          <div className="app-container-single">
            <div className="form-section">
              <StoryForm
                onSubmit={handleGenerateStory}
                isLoading={isLoading}
              />
              
              {/* Loading superpuesto */}
              {isLoading && (
                <div className="loading-overlay">
                  <LoadingSpinner message="Consultando los códices ancestrales..." />
                </div>
              )}
              
              {/* Error en el formulario */}
              {error && (
                <div className="error-message cultural-error">
                  <h3>Error en la generación</h3>
                  <p>{error}</p>
                  <small>Verifica tu conexión a internet y tu API key de Gemini.</small>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vista del Cuento */}
        {currentView === 'story' && story && (
          <div className="app-container-single">
            <div className="story-section">
              <div className="story-header-actions">
                <button
                  onClick={handleBackToForm}
                  className="back-to-form-btn"
                >
                  ← Crear Nuevo Cuento
                </button>
              </div>
              
              {/* Usar InteractiveStoryDisplay si tiene decisiones, sino StoryDisplay normal */}
              {hasInteractiveDecisions(story) ? (
                <InteractiveStoryDisplay
                  story={story}
                  originalFormData={originalFormData}
                />
              ) : (
                <StoryDisplay
                  story={story}
                  originalFormData={originalFormData}
                />
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Mictlán Sonoro - Preservando la cultura mexicana a través de la tecnología</p>
        <small>Desarrollado con respeto y admiración por nuestras raíces ancestrales</small>
      </footer>

      {/* Mocti Assistant - Siempre visible */}
      <MoctiAssistant onSuggestion={handleMoctiSuggestion} />
    </div>
  );
}

export default App;