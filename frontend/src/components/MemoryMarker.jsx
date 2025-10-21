// ============================================
// COMPONENT - MemoryMarker
// Marcador de memória no mapa
// ============================================

import React, { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMemories } from '../controllers/MemoryController.jsx';
import { MemoryPopupContent } from './MemoryPopupContent.jsx';
import { ConfirmationModal } from './ConfirmationModal.jsx';

export function MemoryMarker({ memory }) {
  const { deleteMemory } = useMemories();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

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
      >
        <Popup maxWidth={350} minWidth={320}>
          <MemoryPopupContent memory={memory} onDelete={handleDelete} />
        </Popup>
      </Marker>
      
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