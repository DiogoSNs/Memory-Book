// ============================================
// CONTEXT - GradientContext
// Gerenciamento global de gradientes da aplicação
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';

// Importação dos backgrounds como URLs estáticas
import backgroundNebula from '../assets/backgroundNebula.jpg';
import backgroundMint from '../assets/backgroundMint.jpg';
import backgroundAurora from '../assets/backgroundAurora.jpg';
import backgroundSunset from '../assets/backgroundSunset.jpg';

const GradientContext = createContext();

// Definição dos gradientes disponíveis
export const GRADIENTS = {
  purplePink: {
    name: 'Nebula',
    description: 'Gradiente roxo escuro transitando para rosa vibrante',
    gradient: 'linear-gradient(135deg, #4c1d95 0%, #ec4899 100%)',
    shadow: 'rgba(76, 29, 149, 0.3)',
    shadowHover: 'rgba(76, 29, 149, 0.4)',
    backgroundImage: backgroundNebula,
  },
  blueGreen: {
    name: 'Mint',
    description: 'Gradiente azul oceano transitando para verde esmeralda',
    gradient: 'linear-gradient(135deg, #0ea5e9 0%, #10b981 100%)',
    shadow: 'rgba(14, 165, 233, 0.3)',
    shadowHover: 'rgba(14, 165, 233, 0.4)',
    backgroundImage: backgroundMint,
  },
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
};

export const GradientProvider = ({ children }) => {
  const [currentGradient, setCurrentGradient] = useState('purplePink');

  // Carregar gradiente salvo do localStorage
  useEffect(() => {
    const savedGradient = localStorage.getItem('selectedGradient');
    if (savedGradient && GRADIENTS[savedGradient]) {
      setCurrentGradient(savedGradient);
    }
  }, []);

  // Salvar gradiente no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('selectedGradient', currentGradient);
  }, [currentGradient]);

  const changeGradient = (gradientKey) => {
    if (GRADIENTS[gradientKey]) {
      setCurrentGradient(gradientKey);
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