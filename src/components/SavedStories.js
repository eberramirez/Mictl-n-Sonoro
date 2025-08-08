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

  // ESTADO DE CARGA ACTUALIZADO CON LAS NUEVAS CLASES
  if (loading) {
    return (
      <div className="carga-cuentos-guardados">
        <div className="carga-container-completo">
          
          {/* Spinner principal */}
          <div className="carga-spinner-container">
            <div className="carga-spinner-principal"></div>
          </div>
          
          {/* Textos */}
          <h3 className="carga-titulo">Cargando Cuentos Guardados</h3>
          <p className="carga-mensaje">Consultando la biblioteca ancestral...</p>
          
          {/* Puntos animados */}
          <div className="carga-puntos">
            <div className="carga-punto"></div>
            <div className="carga-punto"></div>
            <div className="carga-punto"></div>
          </div>
          
          <p className="carga-descripcion">
            Recuperando tus historias de la tradición oral digital
          </p>
          
        </div>
      </div>
    );
  }

  return (
    <div className="biblioteca-cuentos-wrapper">
      <div className="biblioteca-header-section">
        <div className="biblioteca-top-controls">
          <button onClick={onBackToForm} className="back-to-form-btn">
            ← Volver al Formulario
          </button>
          <h2 className="biblioteca-main-title">Cuentos Guardados</h2>
        </div>
        
        {/* Estadísticas */}
        {stats && (
          <div className="biblioteca-stats-container">
            <div className="biblioteca-stat-box">
              <span className="biblioteca-stat-value">{stats.total}</span>
              <span className="biblioteca-stat-name">Cuentos totales</span>
            </div>
            <div className="biblioteca-stat-box">
              <span className="biblioteca-stat-value">{stats.averageWords}</span>
              <span className="biblioteca-stat-name">Palabras promedio</span>
            </div>
            <div className="biblioteca-stat-box">
              <span className="biblioteca-stat-value">{Object.keys(stats.cultures).length}</span>
              <span className="biblioteca-stat-name">Culturas diferentes</span>
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
        <div className="biblioteca-estado-vacio">
          <div className="biblioteca-icono-vacio">📖</div>
          <h3>No hay cuentos guardados</h3>
          <p>Crea tu primer cuento cultural y guárdalo para verlo aquí.</p>
          <button onClick={onBackToForm} className="cultural-btn">
            Crear Primer Cuento
          </button>
        </div>
      ) : (
        <div className="biblioteca-cuentos-grid">
          {stories.map((story) => (
            <div key={story.id} className="biblioteca-cuento-tarjeta">
              <div className="biblioteca-cuento-titulo">
                <h3>{story.title}</h3>
                <div className="biblioteca-cuento-info">
                  <span className="biblioteca-etiqueta-cultura">{story.culture}</span>
                  <span className="biblioteca-fecha-creacion">{formatDate(story.createdAt)}</span>
                </div>
              </div>
              
              <div className="biblioteca-resumen-cuento">
                <p>{story.story.substring(0, 150)}...</p>
              </div>
              
              <div className="biblioteca-datos-extra">
                <span className="biblioteca-palabras-total">{story.wordCount} palabras</span>
                <span className="biblioteca-tipo-historia">{story.storyType}</span>
              </div>
              
              <div className="biblioteca-botones-accion">
                <button 
                  onClick={() => onSelectStory(story)}
                  className="biblioteca-btn-leer"
                >
                  📖 Leer
                </button>
                <button 
                  onClick={() => handleDeleteStory(story.id)}
                  className="biblioteca-btn-eliminar"
                  disabled={deleting === story.id}
                >
                  {deleting === story.id ? '⏳' : '🗑️'} Eliminar
                </button>
              </div>
              
              {/* Overlay de carga para el botón eliminar */}
              {deleting === story.id && (
                <div className="biblioteca-overlay-carga">
                  <div className="biblioteca-mini-spinner"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedStories;