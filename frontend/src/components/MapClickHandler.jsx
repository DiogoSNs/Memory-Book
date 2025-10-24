// ============================================
// COMPONENT - MapClickHandler.jsx
// Handler para eventos de clique no mapa
// ============================================

/**
 * Componente handler para capturar eventos de clique no mapa Leaflet.
 * 
 * Responsabilidades:
 * - Capturar eventos de clique no mapa
 * - Filtrar cliques baseado no modo de adição de memórias
 * - Extrair coordenadas geográficas (latitude/longitude)
 * - Repassar eventos para componente pai
 * - Integrar com sistema de eventos do React Leaflet
 * 
 * Dependências:
 * - react-leaflet: Hook useMapEvents para eventos do mapa
 * 
 * Padrões de Projeto:
 * - Event Handler Pattern: Captura e processa eventos de clique
 * - Observer Pattern: Observa eventos do mapa
 * - Null Object Pattern: Retorna null (componente invisível)
 * - Strategy Pattern: Comportamento condicional baseado em estado
 */

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