// ============================================
// VIEW - ControlBar
// Barra de controles para adicionar memórias
// ============================================

/**
 * Barra de controles para gerenciar o modo de adição de memórias no mapa.
 * 
 * Responsabilidades:
 * - Fornecer botão para iniciar modo de adição de memórias
 * - Exibir instruções quando em modo de adição
 * - Permitir cancelamento do modo de adição
 * - Aplicar temas visuais dinâmicos
 * - Renderizar interface responsiva e intuitiva
 * - Integrar com sistema de gradientes
 * 
 * Dependências:
 * - React para criação do componente funcional
 * - Lucide React para ícones de ação
 * - GradientContext para temas visuais
 * - Props para estado e callbacks de adição
 * 
 * Padrões de Projeto:
 * - View: Componente de apresentação da arquitetura MVC
 * - Observer: Reage a mudanças de tema via contexto
 * - Strategy: Diferentes estratégias de exibição baseadas no estado
 * - Command: Encapsula ações de iniciar/cancelar adição
 * - State: Reflete estado atual do modo de adição
 */

import React from "react";
import { Plus, MapPin, X } from "lucide-react";
import { useGradient } from '../contexts/GradientContext.jsx';

export function ControlBar({ isAddingMemory, onStartAdding, onCancelAdding }) {
  const { getCurrentGradientData } = useGradient();
  const gradientData = getCurrentGradientData();
  
  return (
    <div
      style={{
        padding: "1rem",
        background: "white",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {!isAddingMemory ? (
          <button
            onClick={onStartAdding}
            style={{
              background: gradientData.gradient,
              color: "white",
              padding: "12px 32px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontWeight: "600",
              fontSize: "1rem",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Plus style={{ width: "1.25rem", height: "1.25rem" }} />
            Adicionar Nova Memória
          </button>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                background: "#f3e8ff",
                color: "#7c3aed",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <MapPin style={{ width: "1.25rem", height: "1.25rem" }} />
              Clique no mapa para escolher o local da memória
            </div>
            <button
              onClick={onCancelAdding}
              style={{
                color: "#4b5563",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <X style={{ width: "1.25rem", height: "1.25rem" }} />
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}