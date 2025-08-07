import React, { useState } from 'react';
import '../styles/components.css';

const SmartWatchSync = ({ user }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWatch = async () => {
    setIsConnecting(true);
    
    // Simulación de conexión - en producción sería con Bluetooth Web API
    try {
      // Simular búsqueda de dispositivos
      setTimeout(() => {
        setIsConnected(true);
        setDeviceName('Galaxy Watch 4');
        setIsConnecting(false);
      }, 2000);
    } catch (error) {
      console.error('Error conectando smartwatch:', error);
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setDeviceName('');
  };

  return (
    <div className="smartwatch-sync">
      <h3>⌚ Sincronización SmartWatch</h3>
      
      {!isConnected ? (
        <div className="connection-setup">
          <p>Conecta tu smartwatch para narración interactiva</p>
          <button 
            onClick={handleConnectWatch}
            disabled={isConnecting}
            className="connect-btn"
          >
            {isConnecting ? '🔄 Buscando dispositivos...' : '📡 Conectar SmartWatch'}
          </button>
          
          <div className="compatibility-info">
            <small>
              📱 Compatible con: Wear OS, Galaxy Watch, Apple Watch
            </small>
          </div>
        </div>
      ) : (
        <div className="connected-device">
          <div className="device-info">
            <span className="status-indicator">🟢</span>
            <div>
              <strong>{deviceName}</strong>
              <p>Conectado y listo para narración</p>
            </div>
          </div>
          
          <div className="device-actions">
            <button className="sync-btn">
              📤 Enviar cuento al reloj
            </button>
            <button 
              onClick={handleDisconnect}
              className="disconnect-btn"
            >
              🔌 Desconectar
            </button>
          </div>
          
          <div className="features-list">
            <small>
              ✅ Narración por voz<br/>
              ✅ Decisiones interactivas<br/>
              ✅ Control de reproducción
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartWatchSync;