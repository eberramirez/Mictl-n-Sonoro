import React, { useState } from 'react';
import { generateCulturalStory } from '../services/geminiService';

const InteractiveStoryDisplay = ({ story, originalFormData }) => {
  const [storyChapters, setStoryChapters] = useState([story]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDecisions, setCurrentDecisions] = useState([]);
  const [decisionCount, setDecisionCount] = useState(0); // Contador de decisiones

  // Función para extraer decisiones del texto (solo la primera pregunta)
  const extractDecisions = (text) => {
    const lines = text.split('\n');
    const decisions = [];
    let foundDecisionSection = false;
    let currentQuestionFound = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Buscar indicadores de decisión
      if (!currentQuestionFound && (
          line.includes('[DECISIÓN:') || 
          line.includes('¿Cómo deben sellar') || 
          line.includes('¿Qué decide') || 
          line.includes('¿Qué hace') || 
          line.includes('¿Cuál es'))) {
        foundDecisionSection = true;
        currentQuestionFound = true;
        continue;
      }
      
      // Si ya encontramos una pregunta y hay otra, parar
      if (currentQuestionFound && foundDecisionSection && (
          line.includes('¿Cómo deben') || 
          line.includes('¿Qué decide') || 
          line.includes('¿Qué hace') || 
          line.includes('¿Cuál es'))) {
        break; // Solo procesar la primera pregunta
      }
      
      // Buscar opciones A), B), etc. (formato original)
      if (foundDecisionSection && line.match(/^[A-Z]\)/)) {
        const option = line.charAt(0);
        const text = line.substring(3).trim();
        decisions.push({
          option: option,
          text: text
        });
      }
      
      // Buscar opciones Opción A:, Opción B:, etc. (formato alternativo)
      if (foundDecisionSection && line.match(/^Opción [A-Z]:/)) {
        const option = line.match(/^Opción ([A-Z]):/)[1];
        const text = line.replace(/^Opción [A-Z]:\s*/, '').trim();
        decisions.push({
          option: option,
          text: text
        });
      }
      
      // Limitar a máximo 2 opciones
      if (decisions.length >= 2) {
        break;
      }
    }
    
    return decisions.slice(0, 2); // Solo devolver máximo 2 decisiones
  };

  // Función para limpiar el texto de decisiones (solo la primera pregunta)
  const cleanStoryText = (text) => {
    const lines = text.split('\n');
    const cleanLines = [];
    let skipMode = false;
    let foundFirstQuestion = false;
    
    for (const line of lines) {
      // Si encontramos la primera sección de decisión, marcamos para cortar
      if (!foundFirstQuestion && (
          line.includes('[DECISIÓN:') || 
          line.includes('¿Cómo deben sellar') ||
          line.includes('¿Qué decide') || 
          line.includes('¿Qué hace') || 
          line.includes('¿Cuál es'))) {
        foundFirstQuestion = true;
        skipMode = true;
        break;
      }
      
      // Detectar inicio de opciones
      if (line.match(/^[A-Z]\)/) || line.match(/^Opción [A-Z]:/)) {
        skipMode = true;
        break;
      }
      
      // Si no estamos en modo skip, agregamos la línea
      if (!skipMode && 
          !line.includes('Historia interactiva completada') &&
          !line.includes('(Supongamos que')) {
        cleanLines.push(line);
      }
    }
    
    return cleanLines.join('\n').trim();
  };

  // Renderizar la historia actual
  const renderCurrentStory = () => {
    const lastChapter = storyChapters[storyChapters.length - 1];
    const cleanText = cleanStoryText(lastChapter);
    const decisions = extractDecisions(lastChapter);
    
    // Actualizar decisiones si hay nuevas
    if (decisions.length > 0 && decisions.length !== currentDecisions.length) {
      setCurrentDecisions(decisions);
    }
    
    return { cleanText, decisions };
  };

  // Manejar selección de decisión
  const handleDecisionChoice = async (choice) => {
    setIsLoading(true);
    setCurrentDecisions([]);
    
    // Incrementar contador de decisiones
    const newDecisionCount = decisionCount + 1;
    setDecisionCount(newDecisionCount);
    
    try {
      // Determinar si esta es la última decisión
      const isLastDecision = newDecisionCount >= 3;
      
      // Crear prompt para continuar la historia
      const continuePrompt = {
        ...originalFormData,
        prompt: `Continúa esta historia cultural basándote en la decisión elegida:

HISTORIA HASTA AHORA:
${storyChapters.join('\n\n--- CAPÍTULO ANTERIOR ---\n\n')}

DECISIÓN ELEGIDA: ${choice.option}) ${choice.text}

INSTRUCCIONES IMPORTANTES:
- Continúa la narrativa desde la decisión elegida
- Mantén el mismo estilo y tono cultural
- Desarrolla las consecuencias de la elección en máximo 300 palabras
${isLastDecision 
  ? '- ESTA ES LA DECISIÓN FINAL: Concluye la historia de manera satisfactoria SIN incluir más decisiones'
  : '- Incluye SOLO UNA nueva decisión con EXACTAMENTE 2 opciones (A y B)'
}
- NO incluyas texto como "(Supongamos que se elige)" 
- NO resuelvas las decisiones automáticamente
${!isLastDecision ? `- Formato de decisiones:
  ¿[Pregunta clara]?
  A) [Opción 1]
  B) [Opción 2]` : ''}

Continúa la historia:`
      };

      const continuation = await generateCulturalStory(continuePrompt);
      setStoryChapters(prev => [...prev, continuation]);
      
    } catch (error) {
      console.error('Error al continuar la historia:', error);
      // Agregar un capítulo de error
      setStoryChapters(prev => [...prev, 
        `Los códices ancestrales se han difuminado... La historia continúa según tu elección: ${choice.text}\n\n(Error al generar continuación. Intenta recargar la página.)`
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const { cleanText, decisions } = renderCurrentStory();

  return (
    <div className="interactive-story-container">
      <div className="story-content">
        {/* Mostrar todos los capítulos */}
        {storyChapters.map((chapter, index) => (
          <div key={index} className="story-chapter">
            {index > 0 && <div className="chapter-divider">— ⚡ —</div>}
            <div className="story-text">
              {index === storyChapters.length - 1 
                ? cleanStoryText(chapter)
                : cleanStoryText(chapter)
              }
            </div>
          </div>
        ))}

        {/* Loading para nueva decisión */}
        {isLoading && (
          <div className="decision-loading">
            <div className="loading-spinner"></div>
            <p>Los códices revelan el siguiente capítulo...</p>
          </div>
        )}

        {/* Mostrar decisiones disponibles */}
        {decisions.length > 0 && !isLoading && decisionCount < 3 && (
          <div className="decisions-section">
            <div className="decision-prompt">
              <h3>¿Cómo continúa la historia?</h3>
              <p>Elige el camino que tomará tu protagonista:</p>
              <small className="decision-counter">Decisión {decisionCount + 1} de 3</small>
            </div>
            
            <div className="decision-options">
              {decisions.map((decision, index) => (
                <button
                  key={index}
                  className="decision-btn"
                  onClick={() => handleDecisionChoice(decision)}
                >
                  <span className="decision-letter">{decision.option})</span>
                  <span className="decision-text">{decision.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Indicador de final de historia */}
        {(decisions.length === 0 || decisionCount >= 3) && !isLoading && (
          <div className="story-completed">
            <div className="completion-icon">🎭</div>
            <h3>Historia Completada</h3>
            <p>Tu cuento cultural ha llegado a su fin después de {decisionCount} decisiones. ¡Que los ancestros bendigan esta narrativa!</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .interactive-story-container {
          max-width: 100%;
          margin: 0 auto;
        }

        .story-chapter {
          margin-bottom: 1.5rem;
        }

        .chapter-divider {
          text-align: center;
          font-size: 1.5rem;
          color: #6366f1;
          margin: 2rem 0;
          font-weight: bold;
        }

        .story-text {
          line-height: 1.8;
          color: #334155;
          font-size: 1rem;
          text-align: justify;
          white-space: pre-wrap;
        }

        .decision-loading {
          text-align: center;
          padding: 2rem;
          background: rgba(99, 102, 241, 0.05);
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin: 2rem 0;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #e2e8f0;
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .decisions-section {
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(79, 70, 229, 0.05));
          border: 2px solid #6366f1;
          border-radius: 16px;
          padding: 2rem;
          margin: 2rem 0;
        }

        .decision-prompt {
          text-align: center;
          margin-bottom: 2rem;
        }

        .decision-prompt h3 {
          color: #4f46e5;
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
          font-weight: 700;
        }

        .decision-prompt p {
          color: #64748b;
          font-size: 1.1rem;
        }

        .decision-counter {
          display: block;
          margin-top: 0.5rem;
          color: #6366f1;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .decision-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .decision-btn {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.9);
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
          font-family: inherit;
        }

        .decision-btn:hover {
          border-color: #6366f1;
          background: rgba(255, 255, 255, 1);
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(99, 102, 241, 0.15);
        }

        .decision-letter {
          background: #6366f1;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .decision-text {
          flex: 1;
          color: #334155;
          font-size: 1rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .story-completed {
          text-align: center;
          padding: 3rem 2rem;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.05));
          border: 2px solid #10b981;
          border-radius: 16px;
          margin: 2rem 0;
        }

        .completion-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .story-completed h3 {
          color: #059669;
          font-size: 1.5rem;
          margin-bottom: 1rem;
          font-weight: 700;
        }

        .story-completed p {
          color: #64748b;
          font-size: 1.1rem;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .decisions-section {
            padding: 1.5rem;
          }

          .decision-btn {
            padding: 1rem;
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }

          .decision-letter {
            align-self: center;
          }
        }
      `}</style>
    </div>
  );
};

export default InteractiveStoryDisplay;