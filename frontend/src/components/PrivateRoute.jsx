import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LoadingScreen from './LoadingScreen';

const PrivateRoute = ({ children }) => {
  const { user, isLoading } = useAuth();
  const [showRegister, setShowRegister] = React.useState(false);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return <LoadingScreen />;
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