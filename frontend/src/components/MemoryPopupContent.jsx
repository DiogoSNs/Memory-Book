// ============================================
// COMPONENT - MemoryPopupContent
// Conteúdo do popup das memórias
// ============================================

/**
 * Componente de conteúdo rico para exibição detalhada de memórias em popup.
 * 
 * Responsabilidades:
 * - Exibir informações completas da memória (título, descrição, data)
 * - Gerenciar galeria de fotos com navegação e zoom
 * - Integrar player do Spotify quando disponível
 * - Detectar e otimizar para dispositivos móveis
 * - Fornecer controles de navegação por gestos touch
 * - Implementar auto-hide de controles em tela cheia
 * - Renderizar modal de imagem em tela cheia
 * - Fornecer opção de exclusão da memória
 * 
 * Dependências:
 * - React (useState) para gerenciamento de estado complexo
 * - ReactDOM para renderização de portais
 * - Lucide React para ícones de navegação e ações
 * - Utilitários para extração de ID do Spotify
 * - Props para dados da memória e callbacks
 * 
 * Padrões de Projeto:
 * - Component: Encapsula lógica de exibição de conteúdo
 * - State: Gerencia múltiplos estados de UI e interação
 * - Observer: Reage a eventos de touch e mouse
 * - Strategy: Diferentes estratégias para mobile e desktop
 * - Portal: Renderiza modal de imagem em tela cheia
 * - Template Method: Define estrutura de navegação de fotos
 */

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Trash2, ChevronLeft, ChevronRight, X, Music } from "lucide-react";

export function MemoryPopupContent({ memory, onDelete, onClose }) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [hideTimeout, setHideTimeout] = useState(null);
  const selectedMusic = memory.music;
  const getSpotifyEmbedUrl = (music) => {
    if (!music) return null;
    const id = music.id || music.spotify_id || (() => {
      const url = music.external_url || '';
      const idx = url.indexOf('/track/');
      if (idx === -1) return null;
      const rest = url.slice(idx + 7);
      const q = rest.indexOf('?');
      return q !== -1 ? rest.slice(0, q) : rest;
    })();
    return id ? `https://open.spotify.com/embed/track/${id}` : null;
  };

  // Mobile detection
  const isMobile = window.innerWidth <= 768;

  const openPhoto = (index) => {
    setSelectedPhotoIndex(index);
    setShowFullImage(true);
    setShowControls(true);
    resetHideTimer();
  };

  // Reset timer to hide controls
  const resetHideTimer = () => {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
    }
    setShowControls(true);
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);
    setHideTimeout(timer);
  };

  // Toggle controls on image click
  const toggleControls = (e) => {
    e.stopPropagation();
    if (showControls) {
      if (hideTimeout) clearTimeout(hideTimeout);
      setShowControls(false);
    } else {
      resetHideTimer();
    }
  };

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => 
      prev === memory.photos.length - 1 ? 0 : prev + 1
    );
    resetHideTimer();
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex((prev) => 
      prev === 0 ? memory.photos.length - 1 : prev - 1
    );
    resetHideTimer();
  };

  // Touch gesture functions for mobile swipe navigation
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (memory.photos.length > 1) {
      if (isLeftSwipe) {
        nextPhoto();
      } else if (isRightSwipe) {
        prevPhoto();
      }
    }
  };

  return (
    <div style={{ padding: "0.5rem", width: "320px", maxWidth: "90vw" }}>
      <h3
        style={{
          fontWeight: "bold",
          fontSize: "1.125rem",
          marginBottom: "0.5rem",
          color: memory.color,
          wordBreak: "break-word",
        }}
      >
        {memory.title}
      </h3>

      {memory.photos && memory.photos.length > 0 && (
        <div style={{ marginBottom: "0.75rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0.5rem",
            }}
          >
            {memory.photos.slice(0, 4).map((photo, idx) => (
              <img
                key={idx}
                src={photo}
                alt={`Memória ${idx + 1}`}
                onClick={() => openPhoto(idx)}
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "0.375rem",
                  cursor: "pointer",
                  border: "2px solid #e5e7eb",
                  transition: "transform 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            ))}
          </div>
          {memory.photos.length > 4 && (
            <p
              style={{
                fontSize: "0.75rem",
                color: "#6b7280",
                marginTop: "0.25rem",
              }}
            >
              +{memory.photos.length - 4} fotos
            </p>
          )}
        </div>
      )}

      {Array.isArray(memory.videos) && memory.videos.length > 0 && (
        <div style={{ marginBottom: "0.75rem", display: "grid", gap: "0.5rem" }}>
          {memory.videos.map((v, idx) => (
            <video key={idx} src={v} controls style={{ width: "100%", borderRadius: "0.5rem", border: "1px solid #e5e7eb" }} />
          ))}
        </div>
      )}

      {selectedMusic && (
        <div style={{ marginBottom: "0.75rem" }}>
          {getSpotifyEmbedUrl(selectedMusic) ? (
            <iframe
              src={getSpotifyEmbedUrl(selectedMusic)}
              style={{ width: "100%", height: "80px", border: "none", borderRadius: "0.5rem" }}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          ) : (
            (selectedMusic.external_url || selectedMusic.spotify_id) && (
              <div style={{ marginTop: "0.5rem" }}>
                <a
                  href={
                    selectedMusic.external_url ||
                    (selectedMusic.spotify_id
                      ? `https://open.spotify.com/track/${selectedMusic.spotify_id}`
                      : "#")
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#2563eb", textDecoration: "none", fontWeight: 600 }}
                >
                  Abrir no Spotify
                </a>
              </div>
            )
          )}
        </div>
      )}

      {memory.description && (
        <p
          style={{
            color: "#374151",
            marginBottom: "0.5rem",
            fontSize: "0.875rem",
            wordBreak: "break-word",
          }}
        >
          {memory.description}
        </p>
      )}

      <p
        style={{
          color: "#6b7280",
          fontSize: "0.75rem",
          marginBottom: "0.75rem",
        }}
      >
        📅 {new Date(memory.date).toLocaleDateString("pt-BR")}
      </p>

      <button
        onClick={() => {
          onDelete();
          if (onClose) onClose();
        }}
        style={{
          color: "#ef4444",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.875rem",
          fontWeight: 500,
          padding: 0,
        }}
      >
        <Trash2 style={{ width: "1rem", height: "1rem" }} />
        Excluir memória
      </button>

      {showFullImage && memory.photos && ReactDOM.createPortal(
        <div
          onClick={() => {
            if (hideTimeout) clearTimeout(hideTimeout);
            setShowFullImage(false);
            setShowControls(true);
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseMove={resetHideTimer}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: isMobile ? "0.5rem" : "2rem",
            cursor: "pointer",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hideTimeout) clearTimeout(hideTimeout);
              setShowFullImage(false);
              setShowControls(true);
            }}
            style={{
              position: "absolute",
              top: isMobile ? "0.75rem" : "1rem",
              right: isMobile ? "0.75rem" : "1rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: isMobile ? "3.5rem" : "3rem",
              height: isMobile ? "3.5rem" : "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              fontSize: "1.5rem",
              backdropFilter: "blur(10px)",
              zIndex: 10001,
              opacity: showControls ? 1 : 0,
              transition: "opacity 0.3s ease",
              pointerEvents: showControls ? "auto" : "none",
            }}
          >
            <X size={isMobile ? 28 : 24} />
          </button>

          {memory.photos.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevPhoto();
                }}
                style={{
                  position: "absolute",
                  left: isMobile ? "0.75rem" : "2rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: isMobile ? "4rem" : "3rem",
                  height: isMobile ? "4rem" : "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  zIndex: 10001,
                  opacity: showControls ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: showControls ? "auto" : "none",
                }}
              >
                <ChevronLeft size={isMobile ? 32 : 24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                style={{
                  position: "absolute",
                  right: isMobile ? "0.75rem" : "2rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: isMobile ? "4rem" : "3rem",
                  height: isMobile ? "4rem" : "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  backdropFilter: "blur(10px)",
                  zIndex: 10001,
                  opacity: showControls ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: showControls ? "auto" : "none",
                }}
              >
                <ChevronRight size={isMobile ? 32 : 24} />
              </button>
            </>
          )}

          <img
            src={memory.photos[selectedPhotoIndex]}
            alt={`Foto ${selectedPhotoIndex + 1}`}
            style={{
              maxWidth: isMobile ? "98%" : "90%",
              maxHeight: isMobile ? "90%" : "90%",
              objectFit: "contain",
              borderRadius: "0.5rem",
            }}
            onClick={toggleControls}
          />

          {memory.photos.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: isMobile ? "1.5rem" : "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.2)",
                padding: isMobile ? "0.75rem 1.25rem" : "0.5rem 1rem",
                borderRadius: "1rem",
                color: "white",
                fontSize: isMobile ? "1rem" : "0.875rem",
                backdropFilter: "blur(10px)",
                zIndex: 10001,
                opacity: showControls ? 1 : 0,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
            >
              {selectedPhotoIndex + 1} / {memory.photos.length}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
