import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, ApiError } from '../utils/api.js';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isNewRegistration, setIsNewRegistration] = useState(false);

  // Verificar se há usuário logado ao inicializar
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Verificar se há token válido
        if (api.isAuthenticated()) {
          // Tentar obter dados do usuário atual
          const userData = await api.getCurrentUser();
          setUser(userData.user);
          setIsAuthenticated(true);
          
          // Nunca mostrar boas-vindas automaticamente ao carregar
          setShowWelcome(false);
        }
      } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error);
        // Token inválido ou expirado, fazer logout
        await api.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Função de login
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // Fazer login via API
      const response = await api.login({ email, password });
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Não mostrar boas-vindas no login, apenas no registro
      setShowWelcome(false);
      
      return { success: true, user: response.user };
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      let suggestion = null;
      let errorType = null;
      
      console.log('🔍 [AuthContext] Erro capturado:', error);
      console.log('🔍 [AuthContext] error.data:', error.data);
      
      if (error instanceof ApiError) {
        // Mensagem principal
        errorMessage = error.message || 'Erro ao fazer login';
        
        // Dados adicionais
        if (error.data) {
          suggestion = error.data.suggestion || error.data.sugestao || null;
          errorType = error.data.error_type || error.data.errorType || error.data.type || null;
          
          // Fallback quando backend usa campo 'error'
          if (!errorMessage && error.data.error) {
            errorMessage = error.data.error;
          }
        }
        
        // Mapeamento de mensagens padrão por status
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
        
        // Inferir tipo pelo texto
        if (!errorType && /senha incorreta/i.test(errorMessage)) {
          errorType = 'invalid_password';
        }
        if (!errorType && /usuário não encontrado/i.test(errorMessage)) {
          errorType = 'user_not_found';
        }
      }
      
      const errorResponse = { 
        success: false, 
        error: errorMessage,
        suggestion: suggestion,
        errorType: errorType
      };
      
      console.log('🔍 [AuthContext] Retornando erro de login:', errorResponse);
      
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // Fazer registro via API
      const response = await api.register(userData);
      
      setUser(response.user);
      setIsAuthenticated(true);
      
      // Marcar como novo registro e mostrar boas-vindas
      setIsNewRegistration(true);
      setShowWelcome(true);
      
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
      
      const errorResponse = { 
        success: false, 
        error: errorMessage,
        suggestion: suggestion,
        errorType: errorType
      };
      
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Função para atualizar dados do usuário
  const updateUser = async (userData) => {
    try {
      const response = await api.updateUserProfile(user.id, userData);
      const updatedUser = { ...user, ...response.user };
      setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      
      let errorMessage = 'Erro ao atualizar dados';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  // Função para fechar a tela de boas-vindas
  const closeWelcome = () => {
    setShowWelcome(false);
    setIsNewRegistration(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    showWelcome,
    login,
    register,
    logout,
    updateUser,
    closeWelcome
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};