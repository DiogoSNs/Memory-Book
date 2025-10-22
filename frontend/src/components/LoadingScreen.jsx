import React, { useState, useEffect } from 'react';

const LoadingScreen = () => {
  const [loadingText, setLoadingText] = useState('Carregando');
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animação do texto de carregamento
  useEffect(() => {
    const texts = ['Carregando', 'Carregando.', 'Carregando..', 'Carregando...'];
    let index = 0;
    
    const interval = setInterval(() => {
      setLoadingText(texts[index]);
      index = (index + 1) % texts.length;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
      zIndex: 9999,
      overflow: 'hidden'
    }}>
      {/* Padrão de fundo sutil */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%)
        `,
        animation: 'subtleShift 8s ease-in-out infinite alternate'
      }} />

      {/* Partículas flutuantes sutis */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animation: `floatParticle ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            zIndex: 1
          }}
        />
      ))}

      {/* Container principal */}
      <div style={{
        textAlign: 'center',
        position: 'relative',
        zIndex: 3,
        color: 'white',
        padding: isMobile ? '20px' : '40px'
      }}>
        {/* Ícone de marcador/pin minimalista */}
        <div style={{
          position: 'relative',
          width: isMobile ? '80px' : '100px',
          height: isMobile ? '80px' : '100px',
          margin: '0 auto 30px auto'
        }}>
          {/* Ícone de marcador estilo Maps */}
          <svg
            viewBox="0 0 100 100"
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
              animation: 'pinBounce 1.5s ease-in-out infinite'
            }}
          >
            {/* Marcador principal branco */}
            <path
              d="M 50 20 C 38 20 28 30 28 42 C 28 58 50 78 50 78 C 50 78 72 58 72 42 C 72 30 62 20 50 20 Z"
              fill="white"
            />
            {/* Círculo interno para criar o efeito de anel */}
            <circle
              cx="50"
              cy="42"
              r="8"
              fill="#1a1a1a"
            />
            {/* Sombra do marcador */}
            <ellipse
              cx="50"
              cy="82"
              rx="12"
              ry="3"
              fill="rgba(0, 0, 0, 0.3)"
              style={{
                animation: 'shadowPulse 1.5s ease-in-out infinite'
              }}
            />
          </svg>
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: isMobile ? '28px' : '36px',
          fontWeight: '600',
          margin: '0 0 8px 0',
          letterSpacing: '0.5px',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          animation: 'fadeInUp 0.6s ease-out'
        }}>
          Memory Book
        </h1>

        {/* Subtítulo */}
        <p style={{
          fontSize: isMobile ? '14px' : '16px',
          margin: '0 0 40px 0',
          opacity: 0.9,
          fontWeight: '300',
          letterSpacing: '1px',
          animation: 'fadeInUp 0.6s ease-out 0.1s backwards'
        }}>
          Suas memórias em cada lugar
        </p>

        {/* Barra de progresso elegante */}
        <div style={{
          width: isMobile ? '220px' : '280px',
          height: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '1px',
          margin: '0 auto 24px auto',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            width: '40%',
            height: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '1px',
            animation: 'progressSlide 1.8s ease-in-out infinite',
            position: 'absolute',
            boxShadow: '0 0 8px rgba(255, 255, 255, 0.5)'
          }} />
        </div>

        {/* Texto de carregamento */}
        <p style={{
          fontSize: isMobile ? '13px' : '15px',
          margin: 0,
          opacity: 0.7,
          fontWeight: '400',
          letterSpacing: '0.5px',
          animation: 'fadeInUp 0.6s ease-out 0.2s backwards'
        }}>
          {loadingText}
        </p>
      </div>

      {/* Estilos CSS para animações */}
      <style>{`
        @keyframes floatParticle {
          0%, 100% { 
            transform: translate(0, 0);
            opacity: 0.2;
          }
          50% { 
            transform: translate(10px, -15px);
            opacity: 0.5;
          }
        }
        
        @keyframes pinBounce {
          0%, 100% { 
            transform: translateY(0);
          }
          50% { 
            transform: translateY(-12px);
          }
        }
        
        @keyframes shadowPulse {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.15;
            transform: scale(0.8);
          }
        }
        
        @keyframes progressSlide {
          0% { 
            left: -40%;
          }
          100% { 
            left: 100%;
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes subtleShift {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(20px, 20px);
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;