// WelcomePage.js - Componente de página de bienvenida
import React, { useState, useEffect } from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onEnterApp }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    // Animación de entrada
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    // Simular carga de imágenes
    const imageTimer = setTimeout(() => {
      setImagesLoaded(true);
    }, 500);

    return () => {
      clearTimeout(timer);
      clearTimeout(imageTimer);
    };
  }, []);

  // Imágenes culturales - USANDO RUTAS PÚBLICAS ABSOLUTAS
  const culturalImages = [
    {
      id: 1,
      src: `${process.env.PUBLIC_URL}/images/aztec-calendar.jpg`,
      alt: "Calendario Azteca",
      fallback: "🌅"
    },
    {
      id: 2,
      src: `${process.env.PUBLIC_URL}/images/maya-pyramid.jpg`,
      alt: "Pirámide Maya",
      fallback: "🏛️"
    },
    {
      id: 3,
      src: `${process.env.PUBLIC_URL}/images/quetzal.jpg`,
      alt: "Quetzal",
      fallback: "🦅"
    },
    {
      id: 4,
      src: `${process.env.PUBLIC_URL}/images/obsidian-blade.jpg`,
      alt: "Navaja de Obsidiana", 
      fallback: "⚔️"
    },
    {
      id: 5,
      src: `${process.env.PUBLIC_URL}/images/feathered-serpent.jpg`,
      alt: "Serpiente Emplumada",
      fallback: "🐍"
    },
    {
      id: 6,
      src: `${process.env.PUBLIC_URL}/images/jade-mask.jpg`,
      alt: "Máscara de Jade",
      fallback: "💎"
    },
    {
      id: 7,
      src: `${process.env.PUBLIC_URL}/images/cacao-pod.jpg`,
      alt: "Vaina de Cacao",
      fallback: "🍫"
    },
    {
      id: 8,
      src: `${process.env.PUBLIC_URL}/images/aztec-warrior.jpg`,
      alt: "Guerrero Azteca", 
      fallback: "⚡"
    }
  ];

  const handleEnterApp = () => {
    // Animación de salida suave
    setIsVisible(false);
    setTimeout(() => {
      onEnterApp();
    }, 800);
  };

  return (
    <div className={`welcome-container ${isVisible ? 'visible' : ''}`}>
      {/* Fondo animado */}
      <div className="welcome-background">
        <div className="bg-gradient-1"></div>
        <div className="bg-gradient-2"></div>
        <div className="bg-particles"></div>
      </div>

      {/* Contenido principal */}
      <div className="welcome-content">
        {/* Lado izquierdo - Texto */}
        <div className="welcome-text-section">
          <div className="welcome-category">
            <span className="category-badge">INTELIGENCIA ANCESTRAL</span>
          </div>
          
          <h1 className="welcome-title">
            <span className="title-highlight">Mictlán Sonoro</span>
            <br />
            <span className="title-subtitle">Cuentos que cobran vida</span>
          </h1>
          
          <p className="welcome-description">
            Descubre el poder de la narrativa ancestral fusionada con inteligencia artificial. 
            Crea historias interactivas únicas basadas en las ricas tradiciones culturales 
            de México. Explora mitos, leyendas y sabiduría milenaria reimaginada para el presente.
          </p>

          <div className="welcome-features">
            <div className="feature-item">
              <div className="feature-icon">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/img.jpg`} 
                  alt="Culturas Prehispánicas"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="feature-icon-fallback">🏛️</span>
              </div>
              <span>Culturas Prehispánicas</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/img.jpg`} 
                  alt="Historias Interactivas"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="feature-icon-fallback">📚</span>
              </div>
              <span>Historias Interactivas</span>
            </div>
            <div className="feature-item">
              <div className="feature-icon">
                <img 
                  src={`${process.env.PUBLIC_URL}/images/img.jpg`} 
                  alt="Narrativa Inmersiva"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <span className="feature-icon-fallback">🎭</span>
              </div>
              <span>Narrativa Inmersiva</span>
            </div>
          </div>

          <button className="welcome-cta-button" onClick={handleEnterApp}>
            <span className="button-text">Comenzar mi Aventura</span>
            <span className="button-arrow">→</span>
          </button>

          <div className="welcome-author">
            <div className="author-avatar">
              <span>🏺</span>
            </div>
            <div className="author-info">
              <div className="author-name">Mocti - Guardián Digital</div>
              <div className="author-title">Experto en Tradiciones Ancestrales</div>
            </div>
          </div>
        </div>

        {/* Lado derecho - Imágenes flotantes */}
        <div className="welcome-images-section">
          <div className={`floating-images-container ${imagesLoaded ? 'loaded' : ''}`}>
            {culturalImages.map((image, index) => (
              <div
                key={image.id}
                className={`floating-image floating-image-${index + 1}`}
                style={{
                  animationDelay: `${index * 0.2}s`
                }}
              >
                <div className="image-card">
                  <div className="image-content">
                    <span className="image-fallback">{image.fallback}</span>
                    <img 
                      src={image.src} 
                      alt={image.alt}
                      onError={(e) => {
                        console.log(`Error cargando imagen: ${image.src}`);
                        e.target.style.display = 'none';
                      }}
                      onLoad={(e) => {
                        console.log(`Imagen cargada exitosamente: ${image.src}`);
                        e.target.previousSibling.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="image-glow"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partículas decorativas */}
      <div className="welcome-particles">
        {[...Array(12)].map((_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
    </div>
  );
};

export default WelcomePage;