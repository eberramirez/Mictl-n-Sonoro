// src/components/SavedStories.js
import React, { useState, useEffect } from 'react';
import { getStoriesFromFirebase, deleteStory, getStoriesStats } from '../services/storyService';

const SavedStories = ({ onSelectStory, onBackToForm }) => {
  const [stories, setStories] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadStories();
    loadStats();
  }, []);

  const loadStories = async () => {
    try {
      setLoading(true);
      const storiesData = await getStoriesFromFirebase();
      setStories(storiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const statsData = await getStoriesStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este cuento?')) {
      return;
    }

    try {
      setDeleting(storyId);
      await deleteStory(storyId);
      await loadStories(); // Recargar la lista
      await loadStats(); // Actualizar estadísticas
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Fecha no disponible';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="saved-stories-container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando cuentos guardados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-stories-container">
      <div className="saved-stories-header">
        <div className="header-actions">
          <button onClick={onBackToForm} className="back-to-form-btn">
            ← Volver al Formulario
          </button>
          <h2>📚 Cuentos Guardados</h2>
        </div>
        
        {/* Estadísticas */}
        {stats && (
          <div className="stories-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Cuentos totales</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.averageWords}</span>
              <span className="stat-label">Palabras promedio</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{Object.keys(stats.cultures).length}</span>
              <span className="stat-label">Culturas diferentes</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={loadStories}>Reintentar</button>
        </div>
      )}

      {stories.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📖</div>
          <h3>No hay cuentos guardados</h3>
          <p>Crea tu primer cuento cultural y guárdalo para verlo aquí.</p>
          <button onClick={onBackToForm} className="cultural-btn">
            Crear Primer Cuento
          </button>
        </div>
      ) : (
        <div className="stories-grid">
          {stories.map((story) => (
            <div key={story.id} className="story-card">
              <div className="story-card-header">
                <h3>{story.title}</h3>
                <div className="story-meta">
                  <span className="culture-tag">{story.culture}</span>
                  <span className="date">{formatDate(story.createdAt)}</span>
                </div>
              </div>
              
              <div className="story-preview">
                <p>{story.story.substring(0, 150)}...</p>
              </div>
              
              <div className="story-details">
                <span className="word-count">{story.wordCount} palabras</span>
                <span className="story-type">{story.storyType}</span>
              </div>
              
              <div className="story-actions">
                <button 
                  onClick={() => onSelectStory(story)}
                  className="read-btn"
                >
                  📖 Leer
                </button>
                <button 
                  onClick={() => handleDeleteStory(story.id)}
                  className="delete-btn"
                  disabled={deleting === story.id}
                >
                  {deleting === story.id ? '⏳' : '🗑️'} Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedStories;