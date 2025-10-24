// ============================================
// CONTEXT - ToastContext.jsx
// Contexto para sistema de notificações toast
// ============================================

/**
 * Contexto para gerenciamento de notificações toast da aplicação.
 * 
 * Responsabilidades:
 * - Gerenciar estado global de notificações toast
 * - Fornecer métodos para exibir e remover toasts
 * - Controlar posicionamento e z-index dos toasts
 * - Renderizar container de toasts na aplicação
 * - Gerar IDs únicos para cada toast
 * 
 * Dependências:
 * - React: Biblioteca principal (createContext, useContext, useState)
 * - ../components/Toast: Componente individual de toast
 * 
 * Padrões de Projeto:
 * - Context Pattern: Compartilhamento de estado global
 * - Observer Pattern: Componentes observam mudanças no estado de toasts
 * - Provider Pattern: Fornece funcionalidades de toast para toda a aplicação
 * - Factory Pattern: Criação de toasts com IDs únicos
 */

import React, { createContext, useContext, useState } from 'react';
import { Toast } from '../components/Toast.jsx';

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "info", duration = 3000) => {
    const id = Date.now() + Math.random(); // ID único
    const newToast = { id, message, type, duration };
    
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const ToastContainer = () => (
    <>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ zIndex: 1200 + index }}>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </>
  );

  return (
    <ToastContext.Provider value={{ showToast, ToastContainer }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider');
  }
  return context;
}