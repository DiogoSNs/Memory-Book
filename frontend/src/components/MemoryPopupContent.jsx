// ============================================
// COMPONENT - MemoryPopupContent
// Conteúdo do popup das memórias
// ============================================

import React, { useState } from "react";
import { Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";
import { extractSpotifyId } from '../utils/helpers.js';

export function MemoryPopupContent({ memory, onDelete }) {
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const spotifyId = extractSpotifyId(memory.spotifyUrl);

  const openPhoto = (index) => {
    setSelectedPhotoIndex(index);
    setShowFullImage(true);
  };

  const nextPhoto = () => {
    setSelectedPhotoIndex((prev) => 
      prev === memory.photos.length - 1 ? 0 : prev + 1
    );
  };

  const prevPhoto = () => {
    setSelectedPhotoIndex((prev) => 
      prev === 0 ? memory.photos.length - 1 : prev - 1
    );
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
        onClick={onDelete}
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

      {showFullImage && memory.photos && (
        <div
          onClick={() => setShowFullImage(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            cursor: "pointer",
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowFullImage(false);
            }}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: "3rem",
              height: "3rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "white",
              fontSize: "1.5rem",
              backdropFilter: "blur(10px)",
            }}
          >
            <X size={24} />
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
                  left: "1rem",
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  backdropFilter: "blur(10px)",
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextPhoto();
                }}
                style={{
                  position: "absolute",
                  right: "1rem",
                  background: "rgba(255,255,255,0.2)",
                  border: "none",
                  borderRadius: "50%",
                  width: "3rem",
                  height: "3rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "white",
                  backdropFilter: "blur(10px)",
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <img
            src={memory.photos[selectedPhotoIndex]}
            alt={`Foto ${selectedPhotoIndex + 1}`}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
              borderRadius: "0.5rem",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {memory.photos.length > 1 && (
            <div
              style={{
                position: "absolute",
                bottom: "2rem",
                left: "50%",
                transform: "translateX(-50%)",
                background: "rgba(255,255,255,0.2)",
                padding: "0.5rem 1rem",
                borderRadius: "1rem",
                color: "white",
                fontSize: "0.875rem",
                backdropFilter: "blur(10px)",
              }}
            >
              {selectedPhotoIndex + 1} / {memory.photos.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
}