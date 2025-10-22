// ============================================
// COMPONENT - MemoryMarker
// Marcador de memória no mapa
// ============================================

import React, { useState } from "react";
import ReactDOM from "react-dom";
import { Marker } from "react-leaflet";
import L from "leaflet";
import { X } from "lucide-react";
import { useMemories } from '../controllers/MemoryController.jsx';
import { MemoryPopupContent } from './MemoryPopupContent.jsx';
import { ConfirmationModal } from './ConfirmationModal.jsx';

export function MemoryMarker({ memory }) {
  const { deleteMemory } = useMemories();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleDelete = () => {
    setShowConfirmModal(true);
  };

  const confirmDelete = () => {
    deleteMemory(memory.id);
    setShowConfirmModal(false);
  };

  const createColoredIcon = (color) => {
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 25px; height: 25px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
      className: "custom-marker",
      iconSize: [25, 25],
      iconAnchor: [12, 24],
    });
  };

  return (
    <>
      <Marker
        position={[memory.lat, memory.lng]}
        icon={createColoredIcon(memory.color)}
        eventHandlers={{
          click: () => setShowPopup(true),
        }}
      />
      
      {showPopup && ReactDOM.createPortal(
        <div
          onClick={() => setShowPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999999,
            padding: "1rem",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "0.75rem",
              boxShadow: "0 20px 25px rgba(0,0,0,0.15)",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
              maxWidth: "400px",
              width: "100%",
            }}
          >
            <button
              onClick={() => setShowPopup(false)}
              style={{
                position: "absolute",
                top: "0.75rem",
                right: "0.75rem",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "#9ca3af",
                zIndex: 1,
                padding: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={20} />
            </button>
            <MemoryPopupContent memory={memory} onDelete={handleDelete} onClose={() => setShowPopup(false)} />
          </div>
        </div>,
        document.body
      )}
      
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmDelete}
        title="Excluir Memória"
        message="Tem certeza que deseja excluir esta memória? Esta ação não pode ser desfeita."
      />
    </>
  );
}