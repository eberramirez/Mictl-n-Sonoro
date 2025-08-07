import React, { useState, useRef, useEffect } from 'react';

const MoctiAssistant = ({ onSuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      text: '¡Tlazocamati! Soy Mocti, tu guía espiritual de los cuentos ancestrales. ¿Qué historia de nuestros antepasados quieres crear hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [moctiPosition, setMoctiPosition] = useState(85); // Empieza desde la derecha
  const [moctiDirection, setMoctiDirection] = useState(-1); // -1 = izquierda, 1 = derecha
  const [isWalking, setIsWalking] = useState(true);
  const messagesEndRef = useRef(null);

  // Animación de Mocti caminando solo en la mitad derecha
  useEffect(() => {
    if (!isOpen) {
      const interval = setInterval(() => {
        setMoctiPosition(prev => {
          const newPos = prev + (moctiDirection * 0.15); // Velocidad lenta
          
          // Límites más reducidos hacia la derecha (65% - 85%)
          if (newPos >= 85) {
            setMoctiDirection(-1); // Cambia a izquierda
            return 85;
          }
          if (newPos <= 65) {
            setMoctiDirection(1); // Cambia a derecha
            return 65;
          }
          return newPos;
        });
      }, 100); // Intervalo lento

      return () => clearInterval(interval);
    }
  }, [moctiDirection, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const generateResponse = async (userMessage) => {
    try {
      // Usar tu servicio existente de Gemini
      const { generateCulturalStory } = await import('../services/geminiService');
      
      // Crear un prompt específico para Mocti como asistente conversacional
      const moctiPrompt = {
        cultura: 'general', 
        protagonista: 'Usuario consultando',
        configuracion: 'Chat de asistencia',
        tema: `Consulta sobre: ${userMessage}`,
        tono: 'conversacional',
        longitud: 'corta',
        incluirDialogos: false,
        incluirDecisiones: false,
        prompt: `Eres Mocti, un asistente inteligente especializado en cultura mexicana y creación de cuentos. 

EL USUARIO TE PREGUNTA: "${userMessage}"

INSTRUCCIONES PARA RESPONDER:
- Responde de manera conversacional y natural
- Si la pregunta es sobre culturas mexicanas (mexica, maya, zapoteca), da información específica y detallada
- Si preguntan sobre personajes, lugares, historia, elementos culturales, responde con conocimiento profundo
- Si preguntan sobre el software, ayúdalos a usar el generador de cuentos
- Si preguntan sobre cómo crear historias, da consejos creativos
- Usa ocasionalmente "Tlazocamati" y "joven tlacuilo" pero no en exceso
- Responde máximo 150 palabras
- Sé útil, informativo y amigable
- Si no sabes algo específico, admítelo y sugiere alternativas

IMPORTANTE: Responde SOLO la respuesta de Mocti, sin explicaciones adicionales o formato especial.`
      };

      const response = await generateCulturalStory(moctiPrompt);
      
      // Limpiar la respuesta de posibles formatos innecesarios
      let cleanResponse = response.replace(/^\*\*.*?\*\*\s*/, ''); // Quitar títulos en negrita
      cleanResponse = cleanResponse.replace(/^#.*?\n/, ''); // Quitar encabezados
      cleanResponse = cleanResponse.replace(/^\d+\.\s*/, ''); // Quitar numeración
      cleanResponse = cleanResponse.trim();
      
      return cleanResponse || 'Disculpa, los códices ancestrales están confusos. ¿Podrías reformular tu pregunta?';
      
    } catch (error) {
      console.error('Error al generar respuesta de Mocti:', error);
      
      // Sistema de fallback inteligente basado en palabras clave
      const message = userMessage.toLowerCase();
      
      if (message.includes('funciona') || message.includes('software') || message.includes('app')) {
        return 'Este generador te ayuda a crear cuentos auténticos de culturas mexicanas. Selecciona una cultura (mexica, maya o zapoteca), describe tu protagonista y tema, y yo crearemos una historia juntos. ¿Qué tipo de cuento te gustaría crear?';
      }
      
      if (message.includes('moctezuma') || message.includes('donde')) {
        return 'Moctezuma Xocoyotzin gobernó desde Tenochtitlan, la gran capital mexica construida sobre el lago Texcoco. Su palacio tenía jardines, aviarios y bibliotecas de códices. ¿Te interesa crear una historia ambientada en su época?';
      }
      
      if (message.includes('maya')) {
        return 'Los mayas desarrollaron escritura jeroglífica, astronomía avanzada y arquitectura monumental. Ciudades como Tikal, Palenque y Chichén Itzá fueron centros de poder. Sus sacerdotes-astrónomos predecían eclipses y crearon calendarios precisos. ¿Qué aspecto maya te fascina más?';
      }
      
      if (message.includes('mexica') || message.includes('azteca')) {
        return 'Los mexicas construyeron un imperio desde Tenochtitlan. Tenían guerreros jaguar y águila, sacerdotes de Quetzalcóatl, tlacuilos que pintaban códices, y pochtecas comerciantes. Su sociedad era altamente organizada con calmécacs para educar nobles. ¿Qué período mexica te interesa?';
      }
      
      if (message.includes('zapoteca')) {
        return 'Los zapotecas dominaron Oaxaca desde Monte Albán, una ciudad en las montañas con observatorio astronómico. Fueron excelentes artesanos del jade, tejedores de textiles complejos y constructores de tumbas elaboradas. La Guelaguetza celebra su legado. ¿Qué tradición zapoteca explorarías?';
      }
      
      return 'Disculpa, mi conexión con los códices ancestrales falló. Puedes preguntarme sobre culturas mexicanas, cómo usar este generador de cuentos, o cualquier aspecto de la historia y tradiciones de México. ¿En qué te puedo ayudar?';
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      // Generar respuesta usando lógica inteligente
      const response = await generateResponse(inputText);
      
      const assistantResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        text: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantResponse]);
    } catch (error) {
      console.error('Error en respuesta de Mocti:', error);
      
      const errorResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        text: 'Los espíritus ancestrales me confunden... Intenta preguntarme sobre culturas mexica, maya o zapoteca, joven tlacuilo.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleMoctiClick = () => {
    setIsOpen(!isOpen);
    setIsWalking(!isWalking);
  };

  return (
    <>
      {/* Mocti caminando */}
      <div 
        className={`mocti-character ${isOpen ? 'mocti-stationary' : ''}`}
        style={{ left: `${moctiPosition}%` }}
        onClick={handleMoctiClick}
      >
        <div className={`mocti-body ${moctiDirection === -1 ? 'facing-left' : 'facing-right'}`}>
          {/* Cuerpo de Mocti */}
          <div className="mocti-head">
            <div className="mocti-feathers"></div>
            <div className="mocti-face">
              <div className="mocti-eyes">
                <span>👁️</span>
                <span>👁️</span>
              </div>
            </div>
          </div>
          <div className="mocti-torso">
          </div>
          <div className="mocti-skirt"></div>
          <div className={`mocti-legs ${isWalking ? 'walking' : ''}`}>
            <div className="leg left"></div>
            <div className="leg right"></div>
          </div>
          <div className="mocti-spear"></div>
        </div>
        
        {/* Bubble de pensamiento */}
        {!isOpen && (
          <div className="thought-bubble">
            <span>💭</span>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {isOpen && (
        <div className="mocti-chat-overlay">
          <div className="mocti-chat-container">
            <div className="chat-header">
              <div className="header-info">
                <div className="mocti-avatar">
                  <span>👑</span>
                </div>
                <div>
                  <h3>Mocti</h3>
                  <span>Guía Cultural Ancestral</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-btn">
                ✕
              </button>
            </div>

            <div className="chat-messages">
              {messages.map((message) => (
                <div key={message.id} className={`message ${message.type}`}>
                  {message.type === 'assistant' && (
                    <div className="message-avatar">👑</div>
                  )}
                  <div className="message-content">
                    <p>{message.text}</p>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="message assistant">
                  <div className="message-avatar">👑</div>
                  <div className="message-content typing">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Pregúntale a Mocti sobre culturas ancestrales..."
                className="message-input"
              />
              <button onClick={handleSendMessage} className="send-btn">
                🚀
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .mocti-character {
          position: fixed;
          bottom: 20px;
          z-index: 1000;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mocti-character:hover {
          transform: scale(1.1);
        }

        .mocti-body {
          position: relative;
          width: 70px;
          height: 90px;
          transition: transform 0.3s ease;
        }

        .facing-left {
          transform: scaleX(-1);
        }

        .facing-right {
          transform: scaleX(1);
        }

        .mocti-head {
          position: relative;
          width: 36px;
          height: 36px;
          background: #CD853F;
          border-radius: 50%;
          margin: 0 auto 3px;
          border: 2px solid #8B4513;
          overflow: hidden;
        }

        .mocti-feathers {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 25px;
          height: 35px;
          background: linear-gradient(45deg, #FF6347, #FFD700);
          border-radius: 50% 50% 40% 40%;
          border: 2px solid #8B4513;
        }

        .mocti-feathers::before {
          content: '';
          position: absolute;
          top: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 15px;
          height: 25px;
          background: #FF6347;
          border-radius: 50% 50% 30% 30%;
        }

        .mocti-face {
          position: absolute;
          top: 8px;
          left: 6px;
          width: 24px;
          height: 20px;
        }

        .mocti-eyes {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }

        .mocti-eyes span {
          font-size: 6px;
          color: white;
          background: #000;
          border-radius: 50%;
          width: 8px;
          height: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mocti-face::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 3px;
          background: #654321;
          border-radius: 2px;
        }

        .mocti-torso {
          position: relative;
          width: 32px;
          height: 28px;
          background: #D2691E;
          margin: 0 auto 2px;
          border-radius: 6px;
          border: 2px solid #8B4513;
        }

        .mocti-torso::before {
          content: '';
          position: absolute;
          top: 5px;
          left: 3px;
          width: 26px;
          height: 3px;
          background: #8B4513;
          border-radius: 2px;
        }

        .mocti-torso::after {
          content: '';
          position: absolute;
          top: 12px;
          left: 6px;
          width: 20px;
          height: 2px;
          background: #654321;
          border-radius: 1px;
        }

        .mocti-skirt {
          position: relative;
          width: 40px;
          height: 18px;
          background: #FFD700;
          margin: 0 auto 3px;
          border-radius: 0 0 8px 8px;
          border: 2px solid #DAA520;
          border-top: none;
        }

        .mocti-skirt::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 100%;
          height: 8px;
          background: repeating-linear-gradient(
            90deg,
            #FFD700 0px,
            #FFD700 3px,
            #DAA520 3px,
            #DAA520 4px
          );
          border-radius: 0 0 6px 6px;
        }

        .mocti-legs {
          display: flex;
          justify-content: space-around;
          width: 26px;
          margin: 0 auto;
        }

        .leg {
          width: 7px;
          height: 16px;
          background: #CD853F;
          border-radius: 3px;
          border: 1px solid #8B4513;
        }

        .mocti-spear {
          position: absolute;
          right: -15px;
          top: 5px;
          width: 4px;
          height: 45px;
          background: #8B4513;
          border-radius: 2px;
          transform-origin: bottom;
        }

        .mocti-spear::before {
          content: '';
          position: absolute;
          top: -8px;
          left: -3px;
          width: 10px;
          height: 15px;
          background: #CD853F;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .walking .leg {
          animation: walk 2s infinite;
        }

        .walking .leg.right {
          animation-delay: 1s;
        }

        .walking .mocti-spear {
          animation: spearWalk 2s infinite;
        }

        @keyframes walk {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-2px) rotate(5deg); }
        }

        @keyframes spearWalk {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }

        .thought-bubble {
          position: absolute;
          top: -30px;
          right: -10px;
          font-size: 20px;
          animation: float 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .mocti-chat-overlay {
          position: fixed;
          bottom: 120px;
          right: 20px;
          z-index: 1001;
          width: 350px;
          height: 500px;
          max-height: calc(100vh - 150px);
          background: rgba(255, 255, 255, 0.98);
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          border: 2px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .chat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
          border-radius: 18px 18px 0 0;
        }

        .header-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .mocti-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .header-info h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .header-info span {
          font-size: 0.85rem;
          opacity: 0.9;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .chat-messages {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 350px;
          min-height: 300px;
        }

        .chat-messages::-webkit-scrollbar {
          width: 6px;
        }

        .chat-messages::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .chat-messages::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .message {
          display: flex;
          gap: 0.5rem;
          animation: slideIn 0.3s ease;
        }

        .message.user {
          flex-direction: row-reverse;
        }

        .message-avatar {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
          flex-shrink: 0;
        }

        .message-content {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          position: relative;
        }

        .message.assistant .message-content {
          background: #f1f5f9;
          color: #334155;
        }

        .message.user .message-content {
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          color: white;
        }

        .message-content p {
          margin: 0;
          line-height: 1.4;
        }

        .message-time {
          font-size: 0.7rem;
          opacity: 0.7;
          margin-top: 0.25rem;
          display: block;
        }

        .typing-dots {
          display: flex;
          gap: 0.25rem;
          padding: 0.5rem 0;
        }

        .typing-dots span {
          width: 8px;
          height: 8px;
          background: #94a3b8;
          border-radius: 50%;
          animation: typing 1.5s infinite;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-10px); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .chat-input {
          display: flex;
          padding: 1rem;
          border-top: 1px solid #e2e8f0;
          gap: 0.5rem;
        }

        .message-input {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 25px;
          outline: none;
          font-size: 0.9rem;
          transition: border-color 0.2s;
        }

        .message-input:focus {
          border-color: #4f46e5;
        }

        .send-btn {
          width: 44px;
          height: 44px;
          background: linear-gradient(135deg, #4f46e5, #6366f1);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .send-btn:hover {
          transform: scale(1.05);
        }

        @media (max-width: 768px) {
          .mocti-chat-overlay {
            right: 10px;
            left: 10px;
            width: auto;
            bottom: 100px;
          }
        }
      `}</style>
    </>
  );
};

export default MoctiAssistant;