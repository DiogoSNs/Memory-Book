// ============================================
// COMPONENT - PrivateRoute.jsx
// Componente de proteção de rotas privadas
// ============================================

/**
 * Componente de Higher-Order Component (HOC) para proteção de rotas.
 * 
 * Responsabilidades:
 * - Verificar autenticação do usuário antes de renderizar conteúdo
 * - Redirecionar usuários não autenticados para login/registro
 * - Gerenciar transição entre telas de login e registro
 * - Exibir loading durante verificação de autenticação
 * - Renderizar conteúdo protegido apenas para usuários autenticados
 * 
 * Dependências:
 * - React: Biblioteca principal para componentes
 * - ../contexts/AuthContext: Contexto de autenticação
 * - ./LoginForm: Formulário de login
 * - ./RegisterForm: Formulário de registro
 * - ./LoadingScreen: Tela de carregamento
 * 
 * Padrões de Projeto:
 * - Higher-Order Component (HOC): Envolve componentes com lógica de autenticação
 * - Guard Pattern: Protege acesso a recursos baseado em autenticação
 * - Observer Pattern: Observa mudanças no contexto de autenticação
 * - State Pattern: Gerencia estados de loading, autenticado e não autenticado
 */

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