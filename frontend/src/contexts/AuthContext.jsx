// ============================================
// PADRÃO OBSERVER EXPLÍCITO - AuthContext
// Substitui completamente o Observer implícito do React Context
// por um Subject manual com subscribe/unsubscribe/notify
// ============================================

import React from 'react';
import { api, ApiError } from '../utils/api.js';

// ============================================
// Subject manual de autenticação
// - Mantém lista explícita de observers
// - Expõe subscribe(), unsubscribe() e notify()
// - Gerencia estado e notifica manualmente cada mudança
// ============================================
class AuthSubject {
  constructor() {
    this.observers = new Set();
    this.state = {
      user: null,
      isAuthenticated: false,
      isLoading: true,
      showWelcome: false,
      isNewRegistration: false,
    };
  }

  // Inscreve um observer (função callback) e retorna a função de unsubscribe
  subscribe(observer) {
    this.observers.add(observer);
    // Entrega snapshot inicial imediatamente
    observer(this.getState());
    return () => this.unsubscribe(observer);
  }

  // Remove um observer da lista
  unsubscribe(observer) {
    this.observers.delete(observer);
  }

  // Notifica todos observers com o snapshot atual
  notify() {
    const snapshot = this.getState();
    this.observers.forEach((fn) => {
      try {
        fn(snapshot);
      } catch (e) {
        console.error('Observer falhou ao processar notificação:', e);
      }
    });
  }

  // Retorna cópia imutável do estado
  getState() {
    return { ...this.state };
  }

  // Atualiza parcialmente o estado e notifica
  setPartial(partial) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  // Inicializa status de autenticação
  async checkAuthStatus() {
    try {
      this.setPartial({ isLoading: true });
      if (api.isAuthenticated()) {
        const userData = await api.getCurrentUser();
        this.setPartial({ user: userData.user, isAuthenticated: true, showWelcome: false });
      }
    } catch (error) {
      console.error('Erro ao verificar status de autenticação:', error);
      await api.logout().catch(() => {});
      this.setPartial({ user: null, isAuthenticated: false });
    } finally {
      this.setPartial({ isLoading: false });
    }
  }

  // Login explícito com notificação manual
  async login(email, password) {
    try {
      this.setPartial({ isLoading: true });
      const response = await api.login({ email, password });
      this.setPartial({ user: response.user, isAuthenticated: true, showWelcome: false });
      return { success: true, user: response.user };
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      let suggestion = null;
      let errorType = null;

      

      if (error instanceof ApiError) {
        errorMessage = error.message || 'Erro ao fazer login';
        if (error.data) {
          suggestion = error.data.suggestion || error.data.sugestao || null;
          errorType = error.data.error_type || error.data.errorType || error.data.type || null;
          if (!errorMessage && error.data.error) {
            errorMessage = error.data.error;
          }
        }

        if (error.status === 0) {
          errorMessage = 'Falha de conexão com o servidor';
          suggestion = 'Verifique sua internet ou se o backend está rodando.';
          errorType = 'network_error';
        } else if (error.status === 500) {
          errorMessage = errorMessage || 'Erro interno do servidor';
          suggestion = suggestion || 'Tente novamente mais tarde.';
          errorType = errorType || 'server_error';
        } else if (error.status === 403) {
          errorMessage = errorMessage || 'Conta inativa';
          suggestion = suggestion || 'Entre em contato com o suporte para reativar sua conta.';
          errorType = errorType || 'user_inactive';
        } else if (error.status === 404 && !errorType) {
          errorMessage = errorMessage || 'Usuário não encontrado';
          suggestion = suggestion || 'Verifique o email ou crie uma conta.';
          errorType = 'user_not_found';
        } else if (error.status === 401 && !errorType) {
          errorMessage = errorMessage || 'Credenciais inválidas';
          suggestion = suggestion || 'Verifique email e senha e tente novamente.';
          errorType = 'invalid_credentials';
        }

        if (!errorType && /senha incorreta/i.test(errorMessage)) {
          errorType = 'invalid_password';
        }
        if (!errorType && /usuário não encontrado/i.test(errorMessage)) {
          errorType = 'user_not_found';
        }
      }

      const errorResponse = { success: false, error: errorMessage, suggestion, errorType };
      return errorResponse;
    } finally {
      this.setPartial({ isLoading: false });
    }
  }

  // Registro explícito com notificação manual
  async register(userData) {
    try {
      this.setPartial({ isLoading: true });
      const response = await api.register(userData);
      this.setPartial({ user: response.user, isAuthenticated: true, isNewRegistration: true, showWelcome: true });
      return { success: true, user: response.user };
    } catch (error) {
      let errorMessage = 'Erro ao criar conta';
      let suggestion = null;
      let errorType = null;

      if (error instanceof ApiError) {
        errorMessage = error.message || 'Erro ao criar conta';
        if (error.data) {
          suggestion = error.data.suggestion || error.data.sugestao || null;
          errorType = error.data.error_type || error.data.errorType || error.data.type || null;
          if (!errorMessage && error.data.error) {
            errorMessage = error.data.error;
          }
        }
        if (error.status === 0) {
          errorMessage = 'Falha de conexão com o servidor';
          suggestion = 'Verifique sua internet ou se o backend está rodando.';
          errorType = 'network_error';
        } else if (error.status === 500) {
          errorMessage = errorMessage || 'Erro interno do servidor';
          suggestion = suggestion || 'Tente novamente mais tarde.';
          errorType = errorType || 'server_error';
        } else if (error.status === 400 && !errorType) {
          errorMessage = errorMessage || 'Dados inválidos';
          suggestion = suggestion || 'Verifique os campos e tente novamente.';
          errorType = 'invalid_data';
        }
        if (!errorType && /email já está em uso/i.test(errorMessage)) {
          errorType = 'email_already_exists';
        }
      }

      return { success: false, error: errorMessage, suggestion, errorType };
    } finally {
      this.setPartial({ isLoading: false });
    }
  }

  // Logout explícito com notificação manual
  async logout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      this.setPartial({ user: null, isAuthenticated: false });
    }
  }

  // Atualização explícita de dados do usuário
  async updateUser(userData) {
    try {
      const response = await api.updateUserProfile(this.state.user.id, userData);
      const updatedUser = { ...this.state.user, ...response.user };
      this.setPartial({ user: updatedUser });
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      let errorMessage = 'Erro ao atualizar dados';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      return { success: false, error: errorMessage };
    }
  }

  // Controle explícito da tela de boas-vindas
  closeWelcome() {
    this.setPartial({ showWelcome: false, isNewRegistration: false });
  }
}

// Instância única (Singleton) do Subject
export const authSubject = new AuthSubject();

// ============================================
// Hook OBSERVER explícito
// - Inscreve o componente no Subject manual
// - Atualiza estado local via notify()
// - Expõe ações do Subject
// ============================================
export const useAuth = () => {
  const [snapshot, setSnapshot] = React.useState(authSubject.getState());

  React.useEffect(() => {
    const unsubscribe = authSubject.subscribe(setSnapshot);
    return unsubscribe;
  }, []);

  return {
    ...snapshot,
    login: (...args) => authSubject.login(...args),
    register: (...args) => authSubject.register(...args),
    logout: () => authSubject.logout(),
    updateUser: (data) => authSubject.updateUser(data),
    closeWelcome: () => authSubject.closeWelcome(),
  };
};

// ============================================
// Provider simplificado
// - Não usa React Context
// - Apenas inicializa o Subject e renderiza children
// ============================================
export const AuthProvider = ({ children }) => {
  React.useEffect(() => {
    authSubject.checkAuthStatus();
  }, []);
  return children;
};
