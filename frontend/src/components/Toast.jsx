import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info } from "lucide-react";

export function Toast({ message, type = "info", duration = 3000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0 }} />,
          backgroundColor: "#10b981",
          borderColor: "#059669"
        };
      case "error":
        return {
          icon: <AlertCircle style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0 }} />,
          backgroundColor: "#ef4444",
          borderColor: "#dc2626"
        };
      default:
        return {
          icon: <Info style={{ width: "1.25rem", height: "1.25rem", flexShrink: 0 }} />,
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb"
        };
    }
  };

  const config = getConfig();

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: isMobile ? "5rem" : "5.5rem",
        left: "50%",
        transform: `translateX(-50%) scale(${isVisible ? 1 : 0.95})`,
        backgroundColor: config.backgroundColor,
        color: "white",
        padding: isMobile ? "0.75rem 1rem" : "1rem 1.25rem",
        borderRadius: "0.75rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        zIndex: 1200,
        minWidth: isMobile ? "280px" : "320px",
        maxWidth: isMobile ? "calc(100vw - 2rem)" : "400px",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: isVisible ? 1 : 0,
        animation: "slideDown 0.3s ease-out"
      }}
    >
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateX(-50%) translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateX(-50%) translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
      
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {config.icon}
        
        <span style={{ 
          fontSize: isMobile ? "0.9rem" : "0.95rem",
          fontWeight: "500",
          lineHeight: "1.5",
          flex: 1,
          minWidth: 0
        }}>
          {message}
        </span>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: "rgba(255, 255, 255, 0.2)",
            border: "none",
            borderRadius: "0.375rem",
            padding: "0.375rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            transition: "all 0.2s ease"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <X style={{ width: "1rem", height: "1rem", color: "white" }} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    
    // Remove toast anterior do mesmo tipo (opcional, para não acumular)
    setToasts(prev => prev.filter(t => t.type !== type));
    
    // Adiciona novo toast
    setTimeout(() => {
      setToasts(prev => [...prev, newToast]);
    }, 50);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <div style={{ 
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      pointerEvents: "none",
      zIndex: 1200
    }}>
      {toasts.map((toast, index) => (
        <div 
          key={toast.id} 
          style={{ 
            pointerEvents: "auto",
            position: "relative",
            zIndex: 1200 + index 
          }}
        >
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );

  return { showToast, ToastContainer };
}