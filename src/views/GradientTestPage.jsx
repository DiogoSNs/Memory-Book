import React, { useState } from 'react';
import GradientDemo from '../components/GradientDemo';

const GradientTestPage = () => {
  const [showDemo, setShowDemo] = useState(true);
  const [selectedGradient, setSelectedGradient] = useState(null);

  const handleSelectGradient = (gradient) => {
    setSelectedGradient(gradient);
    setShowDemo(false);
    alert(`Gradiente selecionado: ${gradient.name}\n\nPara aplicar este gradiente em toda a aplicação, me informe qual você escolheu!`);
  };

  const handleCloseDemo = () => {
    setShowDemo(false);
  };

  const handleOpenDemo = () => {
    setShowDemo(true);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: selectedGradient ? selectedGradient.gradient : "linear-gradient(to right, #6366f1, #8b5cf6)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        padding: "32px",
        textAlign: "center",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
        maxWidth: "600px"
      }}>
        <h1 style={{
          margin: "0 0 16px 0",
          fontSize: "32px",
          fontWeight: "700",
          color: "#1f2937"
        }}>
          🎨 Teste de Gradientes
        </h1>
        
        <p style={{
          margin: "0 0 24px 0",
          fontSize: "16px",
          color: "#6b7280",
          lineHeight: "1.6"
        }}>
          Clique no botão abaixo para ver todos os gradientes disponíveis e escolher o que mais gosta!
        </p>

        {selectedGradient && (
          <div style={{
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px",
            border: "1px solid #e5e7eb"
          }}>
            <h3 style={{
              margin: "0 0 8px 0",
              fontSize: "18px",
              color: "#1f2937"
            }}>
              Gradiente Atual: {selectedGradient.name}
            </h3>
            <p style={{
              margin: 0,
              fontSize: "14px",
              color: "#6b7280"
            }}>
              {selectedGradient.description}
            </p>
          </div>
        )}

        <button
          onClick={handleOpenDemo}
          style={{
            background: selectedGradient ? selectedGradient.gradient : "linear-gradient(to right, #6366f1, #8b5cf6)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            padding: "16px 32px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
            boxShadow: selectedGradient ? `0 8px 20px ${selectedGradient.shadow}` : "0 8px 20px rgba(99, 102, 241, 0.3)",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = selectedGradient ? `0 12px 24px ${selectedGradient.shadow}` : "0 12px 24px rgba(99, 102, 241, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = selectedGradient ? `0 8px 20px ${selectedGradient.shadow}` : "0 8px 20px rgba(99, 102, 241, 0.3)";
          }}
        >
          🌈 Ver Todos os Gradientes
        </button>

        <div style={{
          marginTop: "24px",
          padding: "16px",
          backgroundColor: "#fef3c7",
          borderRadius: "8px",
          border: "1px solid #f59e0b"
        }}>
          <p style={{
            margin: 0,
            fontSize: "14px",
            color: "#92400e"
          }}>
            💡 <strong>Dica:</strong> Depois de escolher um gradiente, me informe qual você selecionou e eu aplicarei em toda a aplicação!
          </p>
        </div>
      </div>

      {showDemo && (
        <GradientDemo
          onSelectGradient={handleSelectGradient}
          onClose={handleCloseDemo}
        />
      )}
    </div>
  );
};

export default GradientTestPage;