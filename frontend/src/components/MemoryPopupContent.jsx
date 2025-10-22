// ============================================
// COMPONENT - MemoryPopupContent
// Conteúdo do popup das memórias
// ============================================

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { extractSpotifyId } from '../utils/helpers.js';

export function MemoryPopupContent({ memory, onDelete, onClose }) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [showControls, setShowControls] = useState(true);
  const [hideTimeout, setHideTimeout] = useState(null);
  const spotifyId = extractSpotifyId(memory.spotifyUrl);

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

      {spotifyId && (
        <div style={{ marginBottom: "0.75rem" }}>
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator&theme=0`}
            width="100%"
            height="152"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: "0.5rem" }}
          ></iframe>
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