import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { MemoryProvider } from './controllers/MemoryController.jsx';
import { ToastProvider, useToast } from './contexts/ToastContext.jsx';
import { GradientProvider } from './contexts/GradientContext.jsx';
import { AppHeader } from './views/AppHeader.jsx';
import { MapView } from './views/MapView.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import WelcomeScreen from './components/WelcomeScreen.jsx';
import GradientTestPage from './views/GradientTestPage.jsx';

// Componente interno que usa o contexto de autenticação
function AppContent() {
  const { showWelcome, closeWelcome } = useAuth();
  const [mapKey, setMapKey] = React.useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [showGradientTest, setShowGradientTest] = React.useState(false);
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

  // Hook para ativar página de teste de gradientes com Ctrl+G
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        setShowGradientTest(true);
      }
      if (e.key === 'Escape') {
        setShowGradientTest(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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

  // Se estiver mostrando teste de gradientes, renderiza apenas isso
  if (showGradientTest) {
    return <GradientTestPage />;
  }

  return (
    <>
      <PrivateRoute>
        <MemoryProvider>
          <div style={{ 
            fontFamily: 'Arial, sans-serif',
            height: '100vh',
            width: '100vw',
            position: 'relative',
            background: '#f9fafb'
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
          <AppContent />
        </GradientProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;