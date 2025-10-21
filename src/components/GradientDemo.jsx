import React, { useState } from 'react';

const GradientDemo = ({ onSelectGradient, onClose }) => {
  const [selectedGradient, setSelectedGradient] = useState(null);

  const gradients = [
    {
      name: "Roxo Atual",
      gradient: "linear-gradient(to right, #6366f1, #8b5cf6)",
      shadow: "rgba(99, 102, 241, 0.3)",
      description: "Roxo-violeta elegante (atual)"
    },
    {
      name: "Verde-Azul",
      gradient: "linear-gradient(to right, #10b981, #2563eb)",
      shadow: "rgba(16, 185, 129, 0.3)",
      description: "Verde esmeralda para azul"
    },
    {
      name: "Rosa Sunset",
      gradient: "linear-gradient(to right, #f472b6, #ec4899)",
      shadow: "rgba(244, 114, 182, 0.3)",
      description: "Rosa vibrante e feminino"
    },
    {
      name: "Laranja Fire",
      gradient: "linear-gradient(to right, #f97316, #ea580c)",
      shadow: "rgba(249, 115, 22, 0.3)",
      description: "Laranja energético"
    },
    {
      name: "Azul Ocean",
      gradient: "linear-gradient(to right, #0ea5e9, #0284c7)",
      shadow: "rgba(14, 165, 233, 0.3)",
      description: "Azul oceano refrescante"
    },
    {
      name: "Verde Nature",
      gradient: "linear-gradient(to right, #22c55e, #16a34a)",
      shadow: "rgba(34, 197, 94, 0.3)",
      description: "Verde natureza"
    },
    {
      name: "Vermelho Passion",
      gradient: "linear-gradient(to right, #ef4444, #dc2626)",
      shadow: "rgba(239, 68, 68, 0.3)",
      description: "Vermelho apaixonante"
    },
    {
      name: "Dourado Luxury",
      gradient: "linear-gradient(to right, #f59e0b, #d97706)",
      shadow: "rgba(245, 158, 11, 0.3)",
      description: "Dourado luxuoso"
    },
    {
      name: "Ciano Tech",
      gradient: "linear-gradient(to right, #06b6d4, #0891b2)",
      shadow: "rgba(6, 182, 212, 0.3)",
      description: "Ciano tecnológico"
    },
    {
      name: "Roxo Deep",
      gradient: "linear-gradient(to right, #7c3aed, #5b21b6)",
      shadow: "rgba(124, 58, 237, 0.3)",
      description: "Roxo profundo"
    },
    {
      name: "Gradiente Sunset",
      gradient: "linear-gradient(to right, #ff7e5f, #feb47b)",
      shadow: "rgba(255, 126, 95, 0.3)",
      description: "Pôr do sol romântico"
    },
    {
      name: "Gradiente Aurora",
      gradient: "linear-gradient(to right, #a8edea, #fed6e3)",
      shadow: "rgba(168, 237, 234, 0.3)",
      description: "Aurora boreal suave"
    }
  ];

  const handleSelectGradient = (gradient) => {
    setSelectedGradient(gradient);
  };

  const handleApplyGradient = () => {
    if (selectedGradient && onSelectGradient) {
      onSelectGradient(selectedGradient);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 10000,
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "24px",
        maxWidth: "900px",
        maxHeight: "80vh",
        overflow: "auto",
        width: "100%"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}>
          <h2 style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "600",
            color: "#1f2937"
          }}>
            🎨 Escolha seu Gradiente Favorito
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280"
            }}
          >
            ✕
          </button>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>
          {gradients.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelectGradient(item)}
              style={{
                border: selectedGradient?.name === item.name ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backgroundColor: selectedGradient?.name === item.name ? "#f0f9ff" : "white"
              }}
            >
              {/* Preview do gradiente */}
              <div style={{
                background: item.gradient,
                height: "80px",
                borderRadius: "8px",
                marginBottom: "12px",
                boxShadow: `0 8px 20px ${item.shadow}`
              }} />
              
              {/* Nome e descrição */}
              <h3 style={{
                margin: "0 0 4px 0",
                fontSize: "16px",
                fontWeight: "600",
                color: "#1f2937"
              }}>
                {item.name}
              </h3>
              <p style={{
                margin: 0,
                fontSize: "14px",
                color: "#6b7280"
              }}>
                {item.description}
              </p>

              {/* Botão de exemplo */}
              <button style={{
                marginTop: "12px",
                background: item.gradient,
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "8px 16px",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
                boxShadow: `0 4px 12px ${item.shadow}`
              }}>
                Botão Exemplo
              </button>
            </div>
          ))}
        </div>

        {/* Botões de ação */}
        <div style={{
          display: "flex",
          gap: "12px",
          justifyContent: "flex-end"
        }}>
          <button
            onClick={onClose}
            style={{
              background: "#f3f4f6",
              color: "#374151",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleApplyGradient}
            disabled={!selectedGradient}
            style={{
              background: selectedGradient ? selectedGradient.gradient : "#d1d5db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 24px",
              fontSize: "14px",
              fontWeight: "600",
              cursor: selectedGradient ? "pointer" : "not-allowed",
              boxShadow: selectedGradient ? `0 4px 12px ${selectedGradient.shadow}` : "none"
            }}
          >
            Aplicar Gradiente
          </button>
        </div>

        {selectedGradient && (
          <div style={{
            marginTop: "16px",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#374151"
            }}>
              <strong>Selecionado:</strong> {selectedGradient.name} - {selectedGradient.description}
            </p>
            <p style={{
              margin: "4px 0 0 0",
              fontSize: "12px",
              color: "#6b7280",
              fontFamily: "monospace"
            }}>
              CSS: {selectedGradient.gradient}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GradientDemo;