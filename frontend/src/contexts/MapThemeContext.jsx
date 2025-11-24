// ============================================
// CONTEXT - MapTheme
// Context para gerenciar tema do mapa
// ============================================

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authSubject } from './AuthContext.jsx';
import { api } from '../utils/api.js';

// Temas disponíveis para o mapa
const MAP_THEMES = {
  light: {
    name: 'Claro',
    icon: 'Sun',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  },
  dark: {
    name: 'Escuro',
    icon: 'Moon',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  satellite: {
    name: 'Satélite',
    icon: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  }
};

const MapThemeContext = createContext();

export function MapThemeProvider({ children }) {
  // OBSERVER EXPLÍCITO: observa autenticação para sincronizar tema do mapa
  const [authSnapshot, setAuthSnapshot] = useState(authSubject.getState());
  useEffect(() => {
    const unsubscribe = authSubject.subscribe((snapshot) => setAuthSnapshot(snapshot));
    return unsubscribe;
  }, []);
  
  // Inicializar com tema do localStorage ou padrão
  const [currentMapTheme, setCurrentMapTheme] = useState(() => {
    const savedTheme = localStorage.getItem('selectedMapTheme');
    return (savedTheme && MAP_THEMES[savedTheme]) ? savedTheme : 'light';
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Sincronizar currentMapTheme com localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('selectedMapTheme', currentMapTheme);
  }, [currentMapTheme]);

  // Carregar preferências do usuário da API
  useEffect(() => {
    const loadUserPreferences = async () => {
      // Se não estiver autenticado, manter o tema atual do localStorage
      if (!authSnapshot.isAuthenticated || !authSnapshot.user) {
        return;
      }

      try {
        setIsLoading(true);
        const response = await api.getUserPreferences();
        if (response.preferences && response.preferences.map_theme) {
          const theme = response.preferences.map_theme;
          if (MAP_THEMES[theme]) {
            setCurrentMapTheme(theme);
            // Sincronizar com localStorage
            localStorage.setItem('selectedMapTheme', theme);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar preferências do tema do mapa:', error);
        // Manter o tema atual se a API falhar
      } finally {
        setIsLoading(false);
      }
    };

    loadUserPreferences();
  }, [authSnapshot.isAuthenticated, authSnapshot.user]);

  // Função para alterar o tema do mapa
  const changeMapTheme = async (themeKey) => {
    if (!MAP_THEMES[themeKey]) {
      console.error('Tema do mapa inválido:', themeKey);
      return;
    }

    try {
      setCurrentMapTheme(themeKey);
      
      // Se o usuário estiver autenticado, salvar na API
      if (authSnapshot.isAuthenticated && authSnapshot.user) {
        await api.updateUserPreferences({
          map_theme: themeKey
        });
      }
    } catch (error) {
      console.error('Erro ao salvar tema do mapa:', error);
      // Manter a mudança local mesmo se a API falhar
    }
  };

  // Função para alternar entre os temas
  const toggleMapTheme = () => {
    const themes = Object.keys(MAP_THEMES);
    const currentIndex = themes.indexOf(currentMapTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    const nextTheme = themes[nextIndex];
    
    changeMapTheme(nextTheme);
  };

  // Função para obter dados do tema atual
  const getCurrentMapThemeData = () => {
    return MAP_THEMES[currentMapTheme] || MAP_THEMES.light;
  };

  const value = {
    currentMapTheme,
    mapThemes: MAP_THEMES,
    changeMapTheme,
    toggleMapTheme,
    getCurrentMapThemeData,
    isLoading
  };

  return (
    <MapThemeContext.Provider value={value}>
      {children}
    </MapThemeContext.Provider>
  );
}

export function useMapTheme() {
  const context = useContext(MapThemeContext);
  if (context === undefined) {
    throw new Error('useMapTheme must be used within a MapThemeProvider');
  }
  return context;
}
