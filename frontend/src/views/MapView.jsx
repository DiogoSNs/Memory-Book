// ============================================
// VIEW - MapView
// Componente principal do mapa
// ============================================

/**
 * Componente principal que gerencia a visualização e interação com o mapa interativo.
 * 
 * Responsabilidades:
 * - Renderizar mapa interativo usando Leaflet
 * - Gerenciar marcadores de memórias no mapa
 * - Controlar modo de adição de novas memórias
 * - Integrar formulário de criação de memórias
 * - Exibir modal de lista de memórias
 * - Gerenciar modal de perfil do usuário
 * - Aplicar temas visuais ao mapa
 * - Detectar e otimizar para dispositivos móveis
 * - Fornecer controles de navegação e localização
 * - Sincronizar com múltiplos contextos da aplicação
 * 
 * Dependências:
 * - React (useState, useEffect, useRef) para gerenciamento complexo
 * - React Leaflet para componentes de mapa
 * - Lucide React para ícones da interface
 * - Leaflet para configurações avançadas de mapa
 * - MemoryController para operações CRUD
 * - AuthContext para autenticação e perfil
 * - ToastContext para notificações
 * - GradientContext para temas visuais
 * - MapThemeContext para temas específicos do mapa
 * - Múltiplos componentes especializados
 * 
 * Padrões de Projeto:
 * - View: Componente principal de visualização MVC
 * - Observer: Reage a mudanças em múltiplos contextos
 * - Composite: Compõe múltiplos componentes especializados
 * - Strategy: Diferentes estratégias para mobile/desktop
 * - Facade: Simplifica interações complexas com mapa
 * - State: Gerencia múltiplos estados de UI e interação
 * - Mediator: Coordena comunicação entre componentes
 */

import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { List, Plus, User, Navigation, Crosshair } from "lucide-react";
import L from "leaflet";
import { useMemories } from '../controllers/MemoryController.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { useGradient } from '../contexts/GradientContext.jsx';
import { useMapTheme } from '../contexts/MapThemeContext.jsx';
import { MemoryMarker } from '../components/MemoryMarker.jsx';
import { MapClickHandler } from '../components/MapClickHandler.jsx';
import { MemoryForm } from '../components/MemoryForm.jsx';
import { MemoryListModal } from '../components/MemoryListModal.jsx';
import ProfileModal from '../components/ProfileModal.jsx';

export function MapView() {
  // Remoção de variáveis não utilizadas: _addMemory e _memoriesCount
  // Comentário: estes valores não são lidos neste componente; mantemos apenas 'memories'
  const { memories } = useMemories();
  const { showToast } = useToast();
  const { getCurrentGradientData } = useGradient();
  // Remoção de variável não utilizada: _mapThemes
  // Comentário: o conjunto de temas não é utilizado diretamente aqui; usamos apenas o tema atual, toggle e dados
  const { currentMapTheme, toggleMapTheme, getCurrentMapThemeData } = useMapTheme();
  const gradientData = getCurrentGradientData();
  
  // Estado para responsividade
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Estados do componente
  const [isAddingMemory, setIsAddingMemory] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [showMemoryList, setShowMemoryList] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const mapRef = useRef(null);
  // Não mantemos a coordenada em estado; apenas o marcador visível
  const [userLocationMarker, setUserLocationMarker] = useState(null);

  // Estilos CSS para animação suave
  const tooltipAnimation = `
    @keyframes fadeInSlide {
      from {
        opacity: 0;
        transform: translateX(-30%) translateY(0);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
  `;

  // UseEffect para detectar mudanças no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Adiciona os estilos de animação ao documento
    const style = document.createElement('style');
    style.textContent = tooltipAnimation;
    document.head.appendChild(style);
    
    return () => {
      // Remove os estilos quando o componente é desmontado
      document.head.removeChild(style);
    };
  }, [tooltipAnimation]);

  // UseEffect para forçar redimensionamento do mapa
  useEffect(() => {
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 200);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const icon = L.Icon.Default.prototype;
    delete icon._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  const handleMapClick = (latlng) => {
    setSelectedLocation(latlng);
    setShowForm(true);
    setIsAddingMemory(false);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedLocation(null);
    setIsAddingMemory(false);
  };

  const handleToggleAddingMemory = () => {
    if (isAddingMemory) {
      // Se está cancelando, limpa tudo
      setIsAddingMemory(false);
      setShowForm(false);
      setSelectedLocation(null);
    } else {
      // Se está iniciando, apenas ativa o modo
      setIsAddingMemory(true);
    }
  };

  const handleThemeToggle = () => {
    toggleMapTheme();
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      showToast('Geolocalização não é suportada pelo seu navegador', 'error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = [latitude, longitude];
        
        if (mapRef.current) {
          // Centraliza o mapa na localização do usuário
          mapRef.current.setView(newLocation, 16);
          
          // Remove marcador anterior se existir
          if (userLocationMarker) {
            mapRef.current.removeLayer(userLocationMarker);
          }
          
          // Cria um marcador azul personalizado para a localização do usuário
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background: #4285f4;
                border: 3px solid white;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                position: relative;
              ">
                <div style="
                  width: 40px;
                  height: 40px;
                  background: rgba(66, 133, 244, 0.2);
                  border-radius: 50%;
                  position: absolute;
                  top: -13px;
                  left: -13px;
                  animation: pulse 4s infinite;
                "></div>
              </div>
              <style>
                @keyframes pulse {
                  0% { transform: scale(0.8); opacity: 1; }
                  100% { transform: scale(2); opacity: 0; }
                }
              </style>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
          
          // Adiciona o novo marcador
          const marker = L.marker(newLocation, { icon: userIcon }).addTo(mapRef.current);
          marker.bindPopup('Você está aqui!').openPopup();
          
          // Salva a referência do marcador
          setUserLocationMarker(marker);
        }
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            showToast('Permissão de localização negada. Por favor, permita o acesso à localização.', 'error');
            break;
          case error.POSITION_UNAVAILABLE:
            showToast('Localização indisponível.', 'error');
            break;
          case error.TIMEOUT:
            showToast('Tempo limite para obter localização excedido.', 'error');
            break;
          default:
            showToast('Erro desconhecido ao obter localização.', 'error');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <div style={{ 
      position: "relative",
      height: '100vh', // Agora ocupa toda a altura da tela
      width: '100vw'
    }}>
        <MapContainer
          center={[-23.5505, -46.6333]}
          zoom={5}
          minZoom={2}
          maxZoom={18}
          maxBounds={[[-90, -180], [90, 180]]}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          style={{ 
            height: "100%", 
            width: "100%", 
            background: "#e5e7eb" // Volta para o fundo cinza original
          }}
          ref={mapRef}
        >
          <TileLayer
            key={currentMapTheme} // Força re-render quando o tema muda
            attribution={getCurrentMapThemeData().attribution}
            url={getCurrentMapThemeData().url}
            bounds={[[-90, -180], [90, 180]]}
            noWrap={true}
            keepBuffer={2}
            updateWhenIdle={false}
            updateWhenZooming={false}
            errorTileUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=="
          />

          <MapClickHandler
            onMapClick={handleMapClick}
            isAddingMemory={isAddingMemory}
          />

          {memories.map((memory) => (
            <MemoryMarker key={memory.id} memory={memory} />
          ))}
        </MapContainer>

        {/* Botão de adicionar memória - Responsivo */}
        <button
          onClick={handleToggleAddingMemory}
          style={{
            position: "absolute",
            bottom: isMobile ? "5rem" : "7rem",
            left: isMobile ? "1rem" : "2rem",
            background: isAddingMemory 
              ? "linear-gradient(to right, #ef4444, #dc2626)" 
              : gradientData.gradient,
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: isMobile ? "3.5rem" : "4rem",
            height: isMobile ? "3.5rem" : "4rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: isAddingMemory 
              ? "0 10px 25px rgba(239, 68, 68, 0.3)" 
              : "0 10px 25px rgba(76, 29, 149, 0.3)",
            transition: "all 0.3s ease",
            zIndex: 950,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
            e.currentTarget.style.boxShadow = isAddingMemory 
              ? "0 15px 35px rgba(239, 68, 68, 0.4)" 
              : "0 15px 35px rgba(76, 29, 149, 0.4)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = isAddingMemory 
              ? "0 10px 25px rgba(239, 68, 68, 0.3)" 
              : "0 10px 25px rgba(76, 29, 149, 0.3)";
          }}
          title={isAddingMemory ? "Cancelar adição" : "Adicionar memória"}
        >
          <Plus 
            style={{ 
              width: isMobile ? "1.25rem" : "1.5rem", 
              height: isMobile ? "1.25rem" : "1.5rem",
              transform: isAddingMemory ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 0.3s ease"
            }} 
          />
        </button>

        {/* Botão de perfil no canto superior direito - Responsivo */}
        <button
            onClick={() => setShowProfile(true)}
            style={{
              position: "absolute",
              top: isMobile ? "1rem" : "2rem",
              right: isMobile ? "1rem" : "2rem",
              background: gradientData.gradient,
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: isMobile ? "3rem" : "3.5rem",
              height: isMobile ? "3rem" : "3.5rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 20px rgba(76, 29, 149, 0.3)",
              transition: "all 0.3s ease",
              zIndex: 950,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 12px 30px rgba(76, 29, 149, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(76, 29, 149, 0.3)";
            }}
            title="Perfil do usuário"
          >
             <User style={{ 
               width: isMobile ? "1.25rem" : "1.5rem", 
               height: isMobile ? "1.25rem" : "1.5rem" 
             }} />
           </button>

        {/* Botão de localização abaixo do botão de perfil - Responsivo */}
         <button
            onClick={handleLocationClick}
            style={{
              position: "absolute",
              top: isMobile ? "4.5rem" : "6rem",
              right: isMobile ? "1rem" : "2rem",
              background: "white",
              color: "#374151",
              border: "2px solid #e5e7eb",
              borderRadius: "50%",
              width: isMobile ? "2.8rem" : "3.2rem",
              height: isMobile ? "2.8rem" : "3.2rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              transition: "all 0.3s ease",
              zIndex: 950,
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
              e.currentTarget.style.background = "#f9fafb";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.background = "white";
            }}
            title="Ir para minha localização"
          >
             <Navigation style={{ 
               width: isMobile ? "1.25rem" : "1.5rem", 
               height: isMobile ? "1.25rem" : "1.5rem" 
             }} />
           </button>

        {/* Mensagem de orientação no topo - Responsivo */}
        {isAddingMemory && (
          <div
            style={{
              position: "absolute",
              top: isMobile ? "4rem" : "7rem",
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0, 0, 0, 0.8)",
              color: "white",
              padding: isMobile ? "0.5rem 1rem" : "0.75rem 1.5rem",
              borderRadius: "0.5rem",
              fontSize: isMobile ? "0.75rem" : "0.875rem",
              fontWeight: "500",
              whiteSpace: isMobile ? "normal" : "nowrap",
              textAlign: "center",
              maxWidth: isMobile ? "90%" : "auto",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              zIndex: 951,
              animation: "fadeInSlide 0.3s ease-out",
            }}
          >
            {isMobile ? "Toque no mapa para adicionar uma memória" : "Clique em qualquer lugar do mapa para adicionar uma memória"}
          </div>
        )}

        {/* Container do botão de lista com contador - Responsivo */}
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "1rem" : "2rem",
            left: isMobile ? "1rem" : "2rem",
            zIndex: 950,
          }}
        >
          {/* Botão de lista de memórias */}
          <button
            onClick={() => setShowMemoryList(true)}
            style={{
              background: gradientData.gradient,
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: isMobile ? "3.5rem" : "4rem",
              height: isMobile ? "3.5rem" : "4rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(76, 29, 149, 0.3)",
              transition: "all 0.3s ease",
              position: "relative",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "scale(1.1)";
              e.currentTarget.style.boxShadow = "0 15px 35px rgba(76, 29, 149, 0.4)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 10px 25px rgba(76, 29, 149, 0.3)";
            }}
            title="Ver todas as memórias"
          >
            <List style={{ 
              width: isMobile ? "1.25rem" : "1.5rem", 
              height: isMobile ? "1.25rem" : "1.5rem" 
            }} />
          </button>

          {/* Contador de memórias - Grudado no botão e oculto quando modal aberto */}
          {memories.length > 0 && !showMemoryList && (
            <div
              style={{
                position: "absolute",
                top: "-0.5rem",
                right: "-0.5rem",
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: isMobile ? "1.25rem" : "1.5rem",
                height: isMobile ? "1.25rem" : "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: isMobile ? "0.625rem" : "0.75rem",
                fontWeight: "bold",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                border: "2px solid red",
                zIndex: 1,
              }}
            >
              {memories.length > 99 ? "99+" : memories.length}
            </div>
          )}
        </div>

      {showForm && selectedLocation && (
        <MemoryForm
          selectedLocation={selectedLocation}
          onClose={handleCloseForm}
        />
      )}

      <MemoryListModal
        isOpen={showMemoryList}
        onClose={() => setShowMemoryList(false)}
      />

      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        onThemeToggle={handleThemeToggle}
        currentTheme={getCurrentMapThemeData().name}
        // Removido prop não utilizado pelo componente filho
        // Comentário: ProfileModal não referencia 'currentThemeIcon'; manter apenas 'currentTheme'
        memories={memories}
      />
    </div>
  );
}
