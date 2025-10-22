import React, { createContext, useContext, useState, useEffect } from 'react';

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

  // Verificar se há usuário logado no localStorage ao inicializar
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('authToken');
        
        if (storedUser && token) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Nunca mostrar boas-vindas automaticamente ao carregar
          // A tela de login deve ser sempre a primeira tela
          setShowWelcome(false);
        }
      } catch (error) {
        console.error('Erro ao verificar status de autenticação:', error);
        // Limpar dados corrompidos
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Função de login (preparada para integração com backend)
  const login = async (email, password) => {
    try {
      setIsLoading(true);
      
      // TODO: Substituir por chamada real para o backend
      // Simulação temporária para desenvolvimento
      const mockUser = {
        id: Date.now(),
        name: email.split('@')[0],
        email: email,
        avatar: null
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('authToken', mockToken);
      
      setUser(mockUser);
      setIsAuthenticated(true);
      
      // Não mostrar boas-vindas no login, apenas no registro
      setShowWelcome(false);
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, error: 'Erro ao fazer login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de registro (preparada para integração com backend)
  const register = async (userData) => {
    try {
      setIsLoading(true);
      
      // TODO: Substituir por chamada real para o backend
      // Simulação temporária para desenvolvimento
      const newUser = {
        id: Date.now(),
        name: userData.name,
        email: userData.email,
        avatar: null
      };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Salvar no localStorage
      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('authToken', mockToken);
      
      setUser(newUser);
      setIsAuthenticated(true);
      
      // Marcar como novo registro e mostrar boas-vindas
      setIsNewRegistration(true);
      setShowWelcome(true);
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, error: 'Erro ao criar conta' };
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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