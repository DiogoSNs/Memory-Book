// ============================================
// CONTEXT - GradientContext
// Gerenciamento global de gradientes da aplicação
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from './AuthContext';

// Importação dos backgrounds como URLs estáticas
import backgroundNebula from '../assets/backgroundNebula.jpg';
import backgroundMint from '../assets/backgroundMint.jpg';
import backgroundAurora from '../assets/backgroundAurora.jpg';
import backgroundSunset from '../assets/backgroundSunset.jpg';

const GradientContext = createContext();

// Definição dos gradientes disponíveis
export const GRADIENTS = {
  aurora: {
    name: 'Aurora',
    description: 'Aurora boreal suave e etérea',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #c084fc 100%)',
    shadow: 'rgba(34, 211, 238, 0.3)',
    shadowHover: 'rgba(34, 211, 238, 0.4)',
    backgroundImage: backgroundAurora,
  },
  sunset: {
    name: 'Sunset',
    description: 'Gradiente inspirado no pôr do sol',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)',
    shadow: 'rgba(245, 158, 11, 0.3)',
    shadowHover: 'rgba(245, 158, 11, 0.4)',
    backgroundImage: backgroundSunset,
  },
  ocean: {
    name: 'Ocean',
    description: 'Gradiente azul oceano transitando para verde esmeralda',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
    shadow: 'rgba(14, 165, 233, 0.3)',
    shadowHover: 'rgba(14, 165, 233, 0.4)',
    backgroundImage: backgroundMint,
  },
  forest: {
    name: 'Forest',
    description: 'Gradiente verde floresta',
    gradient: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
    shadow: 'rgba(5, 150, 105, 0.3)',
    shadowHover: 'rgba(5, 150, 105, 0.4)',
    backgroundImage: backgroundMint,
  },
  cosmic: {
    name: 'Cosmic',
    description: 'Gradiente roxo escuro transitando para rosa vibrante',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #ec4899 100%)',
    shadow: 'rgba(76, 29, 149, 0.3)',
    shadowHover: 'rgba(76, 29, 149, 0.4)',
    backgroundImage: backgroundNebula,
  },
};

export const GradientProvider = ({ children }) => {
  // Inicializar com o gradiente salvo no localStorage ou 'aurora' como padrão
  const [currentGradient, setCurrentGradient] = useState(() => {
    const savedGradient = localStorage.getItem('selectedGradient');
    return (savedGradient && GRADIENTS[savedGradient]) ? savedGradient : 'aurora';
  });
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Carregar preferências do usuário da API
  useEffect(() => {
    const loadUserPreferences = async () => {
      // Se não estiver autenticado, manter o gradiente atual do localStorage
      if (!isAuthenticated || !user) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.getUserPreferences();
        if (response.preferences && response.preferences.selected_gradient) {
          const gradient = response.preferences.selected_gradient;
          if (GRADIENTS[gradient]) {
            setCurrentGradient(gradient);
            // Sincronizar com localStorage
            localStorage.setItem('selectedGradient', gradient);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
        // Manter o gradiente atual se a API falhar
        // Não alterar o estado atual para preservar a experiência do usuário
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPreferences();
  }, [isAuthenticated, user]);

  // Efeito para sempre manter o localStorage sincronizado com o gradiente atual
  useEffect(() => {
    localStorage.setItem('selectedGradient', currentGradient);
  }, [currentGradient]);

  const changeGradient = async (gradientKey) => {
    if (!GRADIENTS[gradientKey]) return;

    setCurrentGradient(gradientKey);

    // Se estiver autenticado, salvar na API
    if (isAuthenticated && user) {
      try {
        await api.updateUserPreferences({
          selected_gradient: gradientKey
        });
      } catch (error) {
        console.error('Erro ao salvar preferências:', error);
        // Não reverter a mudança local, apenas logar o erro
      }
    }
  };

  const getCurrentGradientData = () => {
    return GRADIENTS[currentGradient];
  };

  const value = {
    currentGradient,
    changeGradient,
    getCurrentGradientData,
    availableGradients: GRADIENTS,
    isLoading,
  };

  return (
    <GradientContext.Provider value={value}>
      {children}
    </GradientContext.Provider>
  );
};

export const useGradient = () => {
  const context = useContext(GradientContext);
  if (!context) {
    throw new Error('useGradient deve ser usado dentro de um GradientProvider');
  }
  return context;
};