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
      console.error('Erro no login:', error);
      
      let errorMessage = 'Erro ao fazer login';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
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
      console.error('Erro no registro:', error);
      
      let errorMessage = 'Erro ao criar conta';
      if (error instanceof ApiError) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
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
    // Removido localStorage para permitir que a mensagem apareça sempre após criar conta
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