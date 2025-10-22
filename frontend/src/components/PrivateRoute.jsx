import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [showRegister, setShowRegister] = React.useState(false);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #f0fdf4, #d1fae5)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            animation: 'spin 1s linear infinite',
            borderRadius: '50%',
            height: '48px',
            width: '48px',
            borderBottom: '2px solid #059669',
            margin: '0 auto 16px auto'
          }}></div>
          <p style={{ color: '#4b5563' }}>Carregando...</p>
        </div>
      </div>
    );
  }

  // Se usuário não está autenticado, mostrar tela de login/registro
  if (!user) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // Se usuário está autenticado, mostrar o conteúdo protegido
  return children;
};

export default PrivateRoute;