import React, { useState, useEffect } from 'react';
import StoryForm from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import InteractiveStoryDisplay from './components/InteractiveStoryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import MoctiAssistant from './components/MoctiAssistant';
import SavedStories from './components/SavedStories';
import WelcomePage from './components/WelcomePage'; // NUEVO COMPONENTE
import { generateCulturalStory } from './services/geminiService';
import { saveStory } from './services/storyService';
import './styles/App.css';

function App() {
  const [story, setStory] = useState('');
  const [originalFormData, setOriginalFormData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentView, setCurrentView] = useState('welcome'); // CAMBIAR A 'welcome'
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Efecto para el header sticky y notificaciones
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
    
    // Pedir permiso para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // NUEVA FUNCIÓN para manejar entrada a la app
  const handleEnterApp = () => {
    setCurrentView('form');
  };

  const handleGenerateStory = async (formData) => {
    setIsLoading(true);
    setError('');
    setStory('');
    setOriginalFormData(formData);
    // Resetear estados de guardado
    setIsSaving(false);
    setSaveMessage('');

    try {
      const generatedStory = await generateCulturalStory(formData);
      setStory(generatedStory);
      setCurrentView('story');
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
    setSaveMessage('');
    // Resetear estado de guardado
    setIsSaving(false);
  };

  const handleViewSavedStories = () => {
    setCurrentView('saved');
    setSaveMessage('');
    // Resetear estado de guardado
    setIsSaving(false);
  };

  const handleSelectStory = (savedStory) => {
    setStory(savedStory.story);
    setOriginalFormData(savedStory.formData);
    setCurrentView('story');
    // Resetear estados de guardado
    setIsSaving(false);
    setSaveMessage('');
  };

  const handleSaveStory = async () => {
    if (!story || !originalFormData) {
      alert('No hay cuento para guardar');
      return;
    }

    // Prevenir doble clic
    if (isSaving) {
      return;
    }

    // Prompt para el título personalizado
    const customTitle = prompt(
      'Título del cuento (opcional):',
      `Cuento ${originalFormData.cultura} - ${new Date().toLocaleDateString()}`
    );

    if (customTitle === null) return; // Usuario canceló

    setIsSaving(true);
    setSaveMessage('');

    try {
      const storyData = {
        story: story,
        formData: originalFormData,
        title: customTitle || undefined
      };

      const storyId = await saveStory(storyData);
      
      // Notificación de éxito mejorada
      setSaveMessage('✅ ¡Cuento guardado exitosamente!');
      
      // Notificación del navegador
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Mictlán Sonoro', {
          body: '¡Tu cuento se guardó en la biblioteca ancestral!',
          icon: '/favicon.ico'
        });
      }
      
      // Limpiar mensaje después de 4 segundos
      setTimeout(() => setSaveMessage(''), 4000);
      
      console.log('Cuento guardado con ID:', storyId);
      
    } catch (err) {
      console.error('Error al guardar:', err);
      setSaveMessage('❌ Error al guardar el cuento. Inténtalo de nuevo.');
      
      // Limpiar mensaje de error después de 5 segundos
      setTimeout(() => setSaveMessage(''), 5000);
      
    } finally {
      // CRÍTICO: Siempre resetear el estado
      setIsSaving(false);
    }
  };

  // Función para manejar sugerencias de Mocti
  const handleMoctiSuggestion = (suggestion) => {
    console.log('Sugerencia de Mocti:', suggestion);
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

  // NUEVA LÓGICA DE RENDERIZADO
  return (
    <div className="App mictlan-app">
      {/* Mostrar página de bienvenida */}
      {currentView === 'welcome' && (
        <WelcomePage onEnterApp={handleEnterApp} />
      )}

      {/* Mostrar aplicación principal solo si no está en welcome */}
      {currentView !== 'welcome' && (
        <>
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
                    onViewSavedStories={handleViewSavedStories}
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
                    <div className="story-buttons-container">
                      <button
                        onClick={handleBackToForm}
                        className="story-back-btn"
                      >
                        ← Crear Nuevo Cuento
                      </button>
                      
                      <button
                        onClick={handleSaveStory}
                        className="story-save-btn"
                        disabled={isSaving}
                      >
                        {isSaving ? '⏳ Guardando...' : '💾 Guardar Cuento'}
                      </button>
                      
                      <button
                        onClick={handleViewSavedStories}
                        className="story-view-saved-btn"
                      >
                        📚 Ver Guardados
                      </button>
                    </div>
                    
                    {/* Mensaje de guardado mejorado */}
                    {saveMessage && (
                      <div className={`
                        ${saveMessage.includes('✅') ? 'save-notification-success' : 'save-notification-error'}
                      `} style={{ 
                        textAlign: 'center', 
                        marginTop: '1rem'
                      }}>
                        {saveMessage}
                      </div>
                    )}
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

            {/* Vista de Cuentos Guardados */}
            {currentView === 'saved' && (
              <SavedStories
                onSelectStory={handleSelectStory}
                onBackToForm={handleBackToForm}
              />
            )}
          </main>

          <footer className="app-footer">
            <p>Mictlán Sonoro - Preservando la cultura mexicana a través de la tecnología</p>
            <small>Desarrollado con respeto y admiración por nuestras raíces ancestrales</small>
          </footer>

          {/* Mocti Assistant - Solo visible cuando NO está en welcome */}
          <MoctiAssistant onSuggestion={handleMoctiSuggestion} />
        </>
      )}
    </div>
  );
}

export default App;