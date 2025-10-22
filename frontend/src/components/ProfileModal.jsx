import React, { useState } from "react";
import { X, User, Moon, Sun, LogOut, Share2, Settings, Satellite, Palette } from "lucide-react";
import jsPDF from "jspdf";
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { useGradient } from '../contexts/GradientContext.jsx';
import { ConfirmationModal } from './ConfirmationModal.jsx';

// Configuração para suprimir avisos de WebGL robustness
if (typeof window !== 'undefined') {
  const originalGetContext = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function(contextType, contextAttributes) {
    if (contextType === 'webgl' || contextType === 'webgl2') {
      contextAttributes = contextAttributes || {};
      contextAttributes.failIfMajorPerformanceCaveat = false;
      contextAttributes.powerPreference = 'default';
    }
    return originalGetContext.call(this, contextType, contextAttributes);
  };
}

const ProfileModal = ({ isOpen, onClose, onThemeToggle, currentTheme, currentThemeIcon, memories = [] }) => {
  
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const { currentGradient, changeGradient, availableGradients } = useGradient();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showGradientSelector, setShowGradientSelector] = useState(false);
  
  // Dados do usuário logado
  const userData = {
    name: user?.name || "Usuário",
    email: user?.email || "email@exemplo.com",
    avatar: null,
    joinDate: "Janeiro 2024" // Por enquanto fixo, mas pode ser implementado no futuro
  };

  const handleThemeToggle = () => {
    if (onThemeToggle) {
      onThemeToggle();
    }
  };

  // Função para obter o ícone correto para cada tema
  const getThemeIcon = (currentTheme) => {
    if (currentTheme === 'Escuro') {
      return <Moon size={18} color="#000000" />;
    } else if (currentTheme === 'Claro') {
      return <Sun size={18} color="#FFD700" />;
    } else if (currentTheme === 'Satélite') {
      return <Satellite size={18} color="#6B7280" />;
    } else {
      return <Sun size={18} color="#FFD700" />;
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutConfirm(false);
    onClose();
  };

  const handleGradientChange = (gradientKey) => {
    changeGradient(gradientKey);
    setShowGradientSelector(false);
    showToast('Gradiente alterado com sucesso!', 'success');
  };

  const handleShareMemories = async () => {
    try {
      // Gerar PDF com as memórias
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });
      
      // Configurar fonte e título
      doc.setFontSize(20);
      doc.text("Minhas Memórias", 20, 30);
      
      doc.setFontSize(12);
      doc.text(`Usuário: ${userData.name}`, 20, 50);
      doc.text(`Total de memórias: ${memories.length}`, 20, 65);
      doc.text(`Data de geração: ${new Date().toLocaleDateString('pt-BR')}`, 20, 80);
      
      // Adicionar linha separadora
      doc.line(20, 90, 190, 90);
      
      let yPosition = 110;
      
      if (memories.length === 0) {
        doc.text("Nenhuma memória encontrada.", 20, yPosition);
      } else {
        memories.forEach((memory, index) => {
          // Verificar se precisa de nova página
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 30;
          }
          
          doc.setFontSize(14);
          doc.text(`${index + 1}. ${memory.title}`, 20, yPosition);
          yPosition += 15;
          
          doc.setFontSize(10);
          if (memory.description) {
            const splitDescription = doc.splitTextToSize(memory.description, 170);
            doc.text(splitDescription, 25, yPosition);
            yPosition += splitDescription.length * 5 + 5;
          }
          
          if (memory.date) {
            doc.text(`Data: ${new Date(memory.date).toLocaleDateString('pt-BR')}`, 25, yPosition);
            yPosition += 10;
          }
          
          if (memory.location) {
            doc.text(`Localização: ${memory.location.lat.toFixed(6)}, ${memory.location.lng.toFixed(6)}`, 25, yPosition);
            yPosition += 10;
          }
          
          yPosition += 10; // Espaço entre memórias
        });
      }
      
      // Gerar o PDF como blob
      const pdfBlob = doc.output('blob');
      const fileName = `memorias_${userData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      // Verificar se o navegador suporta a API de compartilhamento de arquivos
      if (navigator.share && navigator.canShare) {
        const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
        
        // Verificar se pode compartilhar arquivos
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Minhas Memórias',
            text: `Confira minhas ${memories.length} memórias!`,
            files: [file]
          });
          return;
        }
      }
      
      // Fallback: fazer download do arquivo se não conseguir compartilhar
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Mostrar mensagem informativa
      showToast('PDF baixado! Você pode compartilhá-lo manualmente através dos seus aplicativos.', 'success');
      
    } catch (error) {
      console.error('Erro ao compartilhar memórias:', error);
      showToast('Erro ao gerar ou compartilhar o PDF. Tente novamente.', 'error');
    }
  };

  if (!isOpen) return null;

  return (
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
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "white",
          borderRadius: "1rem",
          padding: "2rem",
          width: "90%",
          maxWidth: "400px",
          boxShadow: "0 20px 50px rgba(0, 0, 0, 0.3)",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: "600",
              color: "#1f2937",
            }}
          >
            Perfil
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              borderRadius: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <X style={{ width: "1.5rem", height: "1.5rem", color: "#6b7280" }} />
          </button>
        </div>

        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "2rem",
            padding: "1rem",
            backgroundColor: "#f9fafb",
            borderRadius: "0.75rem",
          }}
        >
          <div
            style={{
              width: "4rem",
              height: "4rem",
              borderRadius: "50%",
              backgroundColor: "#9333ea",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "1rem",
            }}
          >
            <User style={{ width: "2rem", height: "2rem", color: "white" }} />
          </div>
          <div>
            <h3
              style={{
                margin: 0,
                fontSize: "1.125rem",
                fontWeight: "600",
                color: "#1f2937",
              }}
            >
              {userData.name}
            </h3>
            <p
              style={{
                margin: "0.25rem 0 0 0",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              {userData.email}
            </p>
            <p
              style={{
                margin: "0.25rem 0 0 0",
                fontSize: "0.75rem",
                color: "#9ca3af",
              }}
            >
              Membro desde {userData.joinDate}
            </p>
          </div>
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {/* Theme Toggle */}
          <button
            onClick={handleThemeToggle}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
              width: "100%",
              textAlign: "left",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {getThemeIcon(currentTheme)}
            <span style={{ fontSize: "0.875rem", color: "#374151" }}>
              Tema do Mapa: {currentTheme || "Claro"}
            </span>
          </button>

          {/* Gradient Selector */}
          <button
            onClick={() => setShowGradientSelector(!showGradientSelector)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem 1rem",
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
              width: "100%",
              textAlign: "left",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Palette style={{ width: "1.25rem", height: "1.25rem", color: "#8b5cf6" }} />
            <span style={{ fontSize: "0.875rem", color: "#374151" }}>
              Gradiente: {availableGradients[currentGradient]?.name}
            </span>
          </button>

          {/* Gradient Options */}
          {showGradientSelector && (
            <div style={{
              marginLeft: "1rem",
              marginTop: "0.5rem",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              overflow: "hidden",
              backgroundColor: "#f9fafb"
            }}>
              {Object.entries(availableGradients).map(([key, gradient]) => (
                <button
                  key={key}
                  onClick={() => handleGradientChange(key)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem 1rem",
                    background: currentGradient === key ? "#e0e7ff" : "transparent",
                    border: "none",
                    borderBottom: "1px solid #e5e7eb",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    width: "100%",
                    textAlign: "left",
                  }}
                  onMouseOver={(e) => {
                    if (currentGradient !== key) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentGradient !== key) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <div
                    style={{
                      width: "1.5rem",
                      height: "1.5rem",
                      borderRadius: "50%",
                      background: gradient.gradient,
                      border: "2px solid white",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div style={{ fontSize: "0.875rem", color: "#374151", fontWeight: "500" }}>
                      {gradient.name}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      {gradient.description}
                    </div>
                  </div>
                  {currentGradient === key && (
                    <div style={{ marginLeft: "auto", color: "#8b5cf6", fontSize: "0.75rem" }}>
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Share Memories */}
          <button
            onClick={handleShareMemories}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              background: "none",
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
              width: "100%",
              textAlign: "left",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#f3f4f6";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <Share2 style={{ width: "1.25rem", height: "1.25rem", color: "#10b981", marginRight: "0.75rem" }} />
            <span style={{ fontSize: "0.875rem", color: "#374151" }}>
              Compartilhar Memórias
            </span>
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.75rem 1rem",
              background: "none",
              border: "1px solid #fecaca",
              borderRadius: "0.5rem",
              cursor: "pointer",
              transition: "all 0.2s",
              width: "100%",
              textAlign: "left",
              marginTop: "1rem",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#fef2f2";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <LogOut style={{ width: "1.25rem", height: "1.25rem", color: "#ef4444", marginRight: "0.75rem" }} />
            <span style={{ fontSize: "0.875rem", color: "#ef4444" }}>
              Sair da Conta
            </span>
          </button>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Sair da Conta"
        message="Tem certeza que deseja sair da sua conta? Você precisará fazer login novamente para acessar suas memórias."
        confirmButtonText="Sair"
      />
    </div>
  );
};

export default ProfileModal;