import React from 'react';
import ReactDOM from 'react-dom';
import { MapPin, Camera, Heart, Share2, X } from 'lucide-react';
import { useGradient } from '../contexts/GradientContext.jsx';

const WelcomeScreen = ({ onClose }) => {
  const { getCurrentGradientData } = useGradient();
  const gradientData = getCurrentGradientData();
  // Criar o modal usando portal para renderizar diretamente no body
  const modalContent = (
    // Overlay de fundo escuro que cobre toda a tela
    <div 
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        zIndex: 10000,
      }}
    >
      {/* Container da mensagem de boas-vindas */}
      <div style={{
        backgroundColor: "white",
        borderRadius: "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        maxWidth: "672px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto"
      }}>
        {/* Header */}
        <div style={{
          position: "relative",
          background: gradientData.gradient,
          color: "white",
          padding: "24px",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px"
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              padding: "8px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              color: "white"
            }}
          >
            <X style={{ height: "20px", width: "20px" }} />
          </button>
          <div style={{ textAlign: "center" }}>
            <div style={{
              margin: "0 auto",
              height: "64px",
              width: "64px",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            }}>
              <MapPin style={{ height: "32px", width: "32px" }} />
            </div>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", marginBottom: "8px" }}>Bem-vindo ao Memory Book!</h1>
            <p style={{ color: "#a7f3d0" }}>Sua jornada de memórias começa agora</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <p style={{ color: "#4b5563", fontSize: "18px" }}>
              Transforme seus momentos especiais em memórias eternas. 
              Aqui você pode marcar locais importantes no mapa e guardar suas lembranças para sempre.
            </p>
          </div>

          {/* Features */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gap: "24px", 
            marginBottom: "32px" 
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                flexShrink: 0,
                height: "48px",
                width: "48px",
                backgroundColor: "#d1fae5",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <MapPin style={{ height: "24px", width: "24px", color: "#059669" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "8px" }}>Marque no Mapa</h3>
                <p style={{ color: "#4b5563", fontSize: "14px" }}>
                  Clique em qualquer lugar do mapa para adicionar uma nova memória. 
                  Escolha o local exato onde seu momento especial aconteceu.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                flexShrink: 0,
                height: "48px",
                width: "48px",
                backgroundColor: "#dbeafe",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Camera style={{ height: "24px", width: "24px", color: "#2563eb" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "8px" }}>Adicione Fotos</h3>
                <p style={{ color: "#4b5563", fontSize: "14px" }}>
                  Carregue suas fotos favoritas para cada memória. 
                  Reviva seus momentos através das imagens que mais importam.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                flexShrink: 0,
                height: "48px",
                width: "48px",
                backgroundColor: "#f3e8ff",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Heart style={{ height: "24px", width: "24px", color: "#9333ea" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "8px" }}>Escreva Histórias</h3>
                <p style={{ color: "#4b5563", fontSize: "14px" }}>
                  Conte a história por trás de cada memória. 
                  Descreva os sentimentos, as pessoas e os detalhes que tornam cada momento único.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
              <div style={{
                flexShrink: 0,
                height: "48px",
                width: "48px",
                backgroundColor: "#fed7aa",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Share2 style={{ height: "24px", width: "24px", color: "#ea580c" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: "600", color: "#111827", marginBottom: "8px" }}>Compartilhe</h3>
                <p style={{ color: "#4b5563", fontSize: "14px" }}>
                  Exporte suas memórias em PDF para compartilhar com amigos e família. 
                  Suas histórias merecem ser contadas.
                </p>
              </div>
            </div>
          </div>

          {/* Getting Started */}
          <div style={{
            background: "linear-gradient(to right, #ecfdf5, #eff6ff)",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "24px"
          }}>
            <h3 style={{
              fontWeight: "600",
              color: "#111827",
              marginBottom: "12px",
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{
                height: "24px",
                width: "24px",
                backgroundColor: "#10b981",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "bold",
                marginRight: "12px"
              }}>1</span>
              Como começar
            </h3>
            <p style={{ color: "#374151", marginBottom: "16px" }}>
              Para criar sua primeira memória, primeiro clique no botão com símbolo de <strong>"+"</strong> e depois clique em qualquer lugar do mapa. 
              Uma janela se abrirá onde você poderá adicionar o título, descrição, fotos e todos os detalhes da sua lembrança especial.
            </p>
            <div style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "16px",
              borderLeft: "4px solid #10b981"
            }}>
              <p style={{ fontSize: "14px", color: "#4b5563" }}>
                <strong>Dica:</strong> Use o botão de perfil no canto superior direito para ver todas as suas memórias 
                e exportá-las em PDF quando quiser compartilhar ou fazer backup.
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={onClose}
              style={{
                background: gradientData.gradient,
                color: "white",
                padding: "12px 32px",
                borderRadius: "8px",
                fontWeight: "600",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              }}
            >
              Começar a criar memórias
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar o modal usando portal diretamente no body
  return ReactDOM.createPortal(modalContent, document.body);
};

export default WelcomeScreen;