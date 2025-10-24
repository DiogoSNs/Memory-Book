// ============================================
// MAIN COMPONENT - App.jsx
// Componente raiz da aplicação Memory Book
// ============================================

/**
 * Componente principal da aplicação Memory Book.
 * 
 * Responsabilidades:
 * - Configurar providers de contexto para toda a aplicação
 * - Gerenciar estado global de autenticação, temas e notificações
 * - Implementar roteamento e proteção de rotas privadas
 * - Controlar exibição da tela de boas-vindas
 * - Detectar responsividade (mobile/desktop)
 * - Coordenar componentes principais (Header, Map, Welcome)
 * 
 * Dependências:
 * - React: Biblioteca principal para componentes
 * - ./contexts/*: Contextos para gerenciamento de estado global
 * - ./controllers/MemoryController: Controller para memórias
 * - ./views/*: Componentes de visualização principais
 * - ./components/*: Componentes reutilizáveis
 * 
 * Padrões de Projeto:
 * - Provider Pattern: Múltiplos providers para contextos
 * - Observer Pattern: Contextos observam mudanças de estado
 * - Component/Composite Pattern: Composição hierárquica de componentes
 * - MVC Pattern: Separação entre views, controllers e models
 */

import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { MemoryProvider } from './controllers/MemoryController.jsx';
import { ToastProvider, useToast } from './contexts/ToastContext.jsx';
import { GradientProvider, useGradient } from './contexts/GradientContext.jsx';
import { MapThemeProvider } from './contexts/MapThemeContext.jsx';
import { AppHeader } from './views/AppHeader.jsx';
import { MapView } from './views/MapView.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';

// Componente interno que usa o contexto de autenticação
function AppContent() {
  const { showWelcome, closeWelcome } = useAuth();
  const { getCurrentGradientData } = useGradient();
  const gradientData = getCurrentGradientData();
  const [mapKey, setMapKey] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const { ToastContainer } = useToast();

  // Hook para detectar tamanho da tela
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleCloseWelcome = () => {
    closeWelcome();
    // Força o mapa a se redimensionar após um pequeno delay
    setTimeout(() => {
      setMapKey(prev => prev + 1);
      // Também dispara o evento de resize para garantir que o Leaflet recalcule
      window.dispatchEvent(new Event('resize'));
    }, 100);
  };

  return (
    <>
      <PrivateRoute>
        <MemoryProvider>
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{
              height: '100%',
              width: '100%',
              position: 'relative'
            }}>
              <MapView key={mapKey} />
            </div>
            <AppHeader />
          </div>
        </MemoryProvider>
      </PrivateRoute>
      
      {/* Mensagem de boas-vindas fora do PrivateRoute para aparecer sempre */}
      {showWelcome && <WelcomeScreen onClose={handleCloseWelcome} />}
      
      {/* Sistema de notificações Toast */}
      <ToastContainer />
    </>
  );
}

// Componente principal da aplicação
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <GradientProvider>
          <MapThemeProvider>
            <AppContent />
          </MapThemeProvider>
        </GradientProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;