// ============================================
// COMPONENT - MapClickHandler
// Gerencia cliques no mapa para adicionar memórias
// ============================================

import { useMapEvents } from "react-leaflet";

export function MapClickHandler({ onMapClick, isAddingMemory }) {
  useMapEvents({
    click: (e) => {
      if (isAddingMemory) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}