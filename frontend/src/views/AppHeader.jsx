// ============================================
// VIEW - AppHeader
// Cabeçalho da aplicação
// ============================================

/**
 * Componente de cabeçalho principal da aplicação Memory Book.
 * 
 * Responsabilidades:
 * - Exibir título e branding da aplicação
 * - Mostrar contador de memórias do usuário
 * - Detectar e adaptar para dispositivos móveis
 * - Aplicar temas visuais dinâmicos
 * - Integrar com contextos de autenticação e memórias
 * - Fornecer feedback visual do estado da aplicação
 * - Renderizar interface responsiva e acessível
 * 
 * Dependências:
 * - React (useState, useEffect) para gerenciamento de estado
 * - Lucide React para ícones decorativos
 * - MemoryController para contagem de memórias
 * - AuthContext para estado de autenticação
 * - GradientContext para temas visuais
 * 
 * Padrões de Projeto:
 * - View: Componente de apresentação da arquitetura MVC
 * - Observer: Reage a mudanças nos contextos da aplicação
 * - Strategy: Diferentes estratégias de layout para mobile/desktop
 * - Template Method: Define estrutura fixa de cabeçalho
 * - Facade: Simplifica acesso a múltiplos contextos
 */

import React, { useState, useEffect } from "react";
import { MapPin, Heart } from "lucide-react";
import { useMemories } from '../controllers/MemoryController.jsx';
import { useGradient } from '../contexts/GradientContext.jsx';

export function AppHeader() {
  const { memories } = useMemories();
  const { getCurrentGradientData } = useGradient();
  const [isMobile, setIsMobile] = useState(false);
  
  const gradientData = getCurrentGradientData();

  // Hook para detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Header sempre visível com responsividade
  return (
    <header
      style={{
        position: "fixed",
        top: isMobile ? "0.5rem" : "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        background: gradientData.gradient,
        color: "white",
        padding: isMobile ? "0.5rem 0.75rem" : "1rem 2rem",
        borderRadius: isMobile ? "1rem" : "1.5rem",
        boxShadow: `0 10px 25px ${gradientData.shadow}`,
        zIndex: 900, // Ajustado para ficar atrás dos modais principais
        minWidth: isMobile ? "180px" : "320px",
        maxWidth: isMobile ? "calc(100vw - 12rem)" : "90vw",
        width: isMobile ? "calc(100vw - 12rem)" : "auto",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: isMobile ? "0.5rem" : "1rem",
        }}
      >
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: isMobile ? "0.5rem" : "0.75rem",
          flex: 1,
          minWidth: 0 // Para permitir text overflow
        }}>
          <MapPin style={{ 
            width: isMobile ? "1rem" : "1.75rem", 
            height: isMobile ? "1rem" : "1.75rem",
            flexShrink: 0
          }} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <h1 style={{ 
              fontSize: isMobile ? "0.875rem" : "1.25rem", 
              fontWeight: "bold", 
              margin: 0,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              Memory Book
            </h1>
            {!isMobile && (
              <p style={{ 
                fontSize: "0.75rem", 
                color: "#e0e7ff", 
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                Marque seus momentos especiais pelo mundo
              </p>
            )}
          </div>
        </div>
        
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: isMobile ? "0.5rem" : "1rem",
          flexShrink: 0
        }}>
          {/* Contador de memórias */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.4rem",
            background: "rgba(255, 255, 255, 0.15)",
            padding: isMobile ? "0.25rem 0.5rem" : "0.4rem 0.8rem",
            borderRadius: "1.25rem",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)"
          }}>
            <Heart style={{ 
              width: isMobile ? "0.75rem" : "0.875rem", 
              height: isMobile ? "0.75rem" : "0.875rem", 
              color: "white",
              flexShrink: 0
            }} />
            <span style={{ 
              fontSize: isMobile ? "0.625rem" : "0.75rem", 
              fontWeight: "500",
              margin: 0,
              whiteSpace: "nowrap"
            }}>
              {isMobile ? memories.length : `${memories.length} memória${memories.length !== 1 ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
