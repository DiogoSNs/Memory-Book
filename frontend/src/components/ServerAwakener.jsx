import React, { useState, useEffect } from 'react';

/**
 * ServerAwakener Component
 * 
 * Gerencia a inicialização do backend com interface que simula
 * o processo de "acordar" o servidor de forma visual e intuitiva.
 */
const ServerAwakener = ({ children }) => {
  const [isServerReady, setIsServerReady] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Chamando o servidor');
  const [attemptCount, setAttemptCount] = useState(0);

  // Simula progresso visual
  useEffect(() => {
    if (!isServerReady && progress < 85) {
      const timer = setTimeout(() => {
        setProgress(prev => Math.min(prev + Math.random() * 12, 85));
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, isServerReady]);

  // Atualiza mensagens e animações
  useEffect(() => {
    if (attemptCount > 2 && !isAwakening) {
      setIsAwakening(true);
      setStatusMessage('Servidor está acordando');
    }
    if (attemptCount > 8) {
      setStatusMessage('Espreguiçando e inicializando');
    }
    if (attemptCount > 15) {
      setStatusMessage('Preparando o café... ops, os serviços');
    }
  }, [attemptCount, isAwakening]);

  // Health check do servidor
  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const baseUrl = apiUrl.endsWith('/') ? apiUrl.slice(0, -1) : apiUrl;
        
        const response = await fetch(`${baseUrl}/health`);
        
        if (response.ok) {
          setProgress(100);
          setStatusMessage('Servidor pronto!');
          setIsAwakening(false);
          setTimeout(() => setIsServerReady(true), 800);
        } else {
          setAttemptCount(prev => prev + 1);
          setTimeout(checkServerHealth, 2000);
        }
      } catch (error) {
        setAttemptCount(prev => prev + 1);
        setTimeout(checkServerHealth, 2000);
      }
    };

    checkServerHealth();
  }, []);

  if (isServerReady) {
    return children;
  }

  return (
    <div style={styles.overlay}>
      {/* Z's flutuantes por toda a tela */}
      <div style={styles.zContainer}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.floatingZ,
              left: `${Math.random() * 100}%`,
              fontSize: `${20 + Math.random() * 30}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            {Math.random() > 0.5 ? 'Z' : 'z'}
          </div>
        ))}
      </div>

      <div style={styles.container}>
        {/* Card principal */}
        <div style={styles.card}>
          {/* Emoji simples */}
          <div style={styles.emojiContainer}>
            <div style={styles.emoji}>
              😴
            </div>
          </div>

          {/* Título e status */}
          <h1 style={styles.title}>
            {progress === 100 ? 'Servidor Acordado!' : 'Acordando o Servidor'}
          </h1>
          <p style={styles.subtitle}>{statusMessage}</p>

          {/* Barra de progresso */}
          <div style={styles.progressWrapper}>
            <div style={styles.progressTrack}>
              <div style={{...styles.progressFill, width: `${progress}%`}}>
                <div style={styles.progressShine} />
              </div>
            </div>
            <span style={styles.progressLabel}>{Math.round(progress)}%</span>
          </div>

          {/* Card de informação */}
          <div style={styles.infoCard}>
            <div style={styles.infoHeader}>
              <span style={styles.infoIcon}>💤</span>
              <span style={styles.infoTitle}>Por que demora?</span>
            </div>
            <p style={styles.infoText}>
              Servidores gratuitos "dormem" quando não estão em uso para economizar recursos.
              <br />
              <strong>Primeira conexão:</strong> pode levar até 60 segundos.
            </p>
          </div>

          {/* Indicador de tentativas */}
          <div style={styles.dotsContainer}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                style={{
                  ...styles.dot,
                  backgroundColor: i < Math.min(attemptCount, 5) ? '#8b5cf6' : '#4a5568',
                  transform: i < Math.min(attemptCount, 5) ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Mensagem de rodapé */}
        <p style={styles.footer}>
          ☁️ Hospedado em servidor gratuito • Aguarde a inicialização
        </p>
      </div>

      <style>{`
        @keyframes sleeping {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
        }

        @keyframes wakeUp {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.05) rotate(-5deg); }
          75% { transform: scale(0.95) rotate(5deg); }
        }

        @keyframes floatUpZ {
          0% { 
            transform: translateY(110vh);
            opacity: 0;
          }
          3% {
            opacity: 0.5;
          }
          97% {
            opacity: 0.5;
          }
          100% { 
            transform: translateY(-20vh);
            opacity: 0;
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#2d2d2d',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  zContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    pointerEvents: 'none'
  },
  floatingZ: {
    position: 'absolute',
    bottom: '-10vh',
    color: 'rgba(139, 92, 246, 0.4)',
    fontWeight: 'bold',
    animation: 'floatUpZ 20s infinite linear',
    pointerEvents: 'none'
  },
  container: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    padding: '20px',
    maxWidth: '540px',
    width: '100%'
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: '20px',
    padding: '50px 44px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
    width: '100%',
    textAlign: 'center',
    border: '1px solid #3a3a3a'
  },
  emojiContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '28px',
    height: '120px'
  },
  emoji: {
    fontSize: '90px',
    animation: 'sleeping 3s ease-in-out infinite',
    filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))'
  },
  title: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#ffffff',
    margin: '0 0 12px 0',
    letterSpacing: '-0.8px'
  },
  subtitle: {
    fontSize: '17px',
    color: '#a0aec0',
    margin: '0 0 32px 0',
    fontWeight: '500',
    minHeight: '24px'
  },
  progressWrapper: {
    marginBottom: '28px'
  },
  progressTrack: {
    position: 'relative',
    width: '100%',
    height: '12px',
    backgroundColor: '#2d3748',
    borderRadius: '999px',
    overflow: 'hidden',
    marginBottom: '10px'
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #667eea, #764ba2)',
    borderRadius: '999px',
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden'
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
    animation: 'shimmer 2s infinite'
  },
  progressLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#8b5cf6',
    display: 'block'
  },
  infoCard: {
    backgroundColor: '#252525',
    borderRadius: '16px',
    padding: '20px',
    border: '1px solid #3a3a3a',
    marginTop: '28px',
    textAlign: 'left'
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px'
  },
  infoIcon: {
    fontSize: '22px'
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#e2e8f0'
  },
  infoText: {
    fontSize: '14px',
    color: '#a0aec0',
    margin: 0,
    lineHeight: '1.6'
  },
  dotsContainer: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'center',
    marginTop: '24px'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    transition: 'all 0.3s ease'
  },
  footer: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    margin: 0,
    fontWeight: '500'
  }
};

export default ServerAwakener;