// ============================================
// COMPONENT - LoginForm.jsx
// Formulário de autenticação de usuários
// ============================================

/**
 * Componente de formulário para autenticação de usuários.
 * 
 * Responsabilidades:
 * - Renderizar interface de login responsiva
 * - Validar dados de entrada (email e senha)
 * - Gerenciar estados de loading e erros
 * - Integrar com contexto de autenticação
 * - Exibir/ocultar senha com toggle visual
 * - Aplicar tema/gradiente personalizado
 * - Fornecer navegação para tela de registro
 * - Exibir notificações de sucesso/erro
 * 
 * Dependências:
 * - React: Biblioteca principal (useState, useEffect)
 * - lucide-react: Ícones para interface
 * - ../contexts/AuthContext: Contexto de autenticação
 * - ../contexts/ToastContext: Contexto de notificações
 * - ../contexts/GradientContext: Contexto de temas
 * 
 * Padrões de Projeto:
 * - Component Pattern: Componente reutilizável e encapsulado
 * - Observer Pattern: Observa mudanças nos contextos
 * - State Pattern: Gerencia múltiplos estados do formulário
 * - Strategy Pattern: Diferentes estratégias de validação
 */

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext.jsx';
import { useGradient } from '../contexts/GradientContext.jsx';

const LoginForm = ({ onSwitchToRegister }) => {
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { login } = useAuth();
  const { showToast } = useToast();
  const { getCurrentGradientData } = useGradient();
  const gradientData = getCurrentGradientData();

  // Hook para detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.password);
      
      if (!result || !result.success) {
        const errorMessage = result?.error || 'Erro ao fazer login. Tente novamente.';
        const errorSuggestion = result?.suggestion || null;
        const errorType = result?.errorType || null;
        
        setErrors({ 
          general: errorMessage,
          suggestion: errorSuggestion,
          errorType: errorType
        });
        
        // Exibir toast de erro
        showToast(errorMessage, 'error', 4500);
      }
      // Se success === true, o AuthContext já gerencia o redirecionamento
    } catch (error) {
      console.error('Erro não tratado no login:', error);
      const fallbackMessage = 'Erro inesperado ao tentar fazer login';
      setErrors({
        general: fallbackMessage,
        suggestion: 'Por favor, tente novamente em alguns instantes'
      });
      
      // Exibir toast de erro
      showToast(fallbackMessage, 'error', 4500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundImage: gradientData.backgroundImage ? `url(${gradientData.backgroundImage})` : 'none',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "8px" : "16px"
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: isMobile ? "12px" : "16px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        maxWidth: isMobile ? "100%" : "400px",
        width: "100%",
        overflow: "hidden",
        margin: isMobile ? "0" : "auto"
      }}>
        {/* Header */}
        <div style={{
          background: gradientData.gradient,
          color: "white",
          padding: isMobile ? "24px 16px" : "32px 24px",
          textAlign: "center"
        }}>
          <div style={{
            margin: "0 auto",
            height: isMobile ? "48px" : "64px",
            width: isMobile ? "48px" : "64px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: isMobile ? "12px" : "16px"
          }}>
            <MapPin style={{ 
              height: isMobile ? "24px" : "32px", 
              width: isMobile ? "24px" : "32px" 
            }} />
          </div>
          <h1 style={{ 
            fontSize: isMobile ? "24px" : "28px", 
            fontWeight: "bold", 
            marginBottom: "8px",
            margin: 0
          }}>
            Entrar
          </h1>
          <p style={{ 
            color: "#a7f3d0", 
            fontSize: isMobile ? "14px" : "16px",
            margin: 0
          }}>
            Acesse suas memórias
          </p>
        </div>

        {/* Content */}
        <div style={{ 
          padding: isMobile ? "24px 16px" : "32px 24px" 
        }}>
          {errors.general && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "2px solid #fecaca",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "24px",
              zIndex: 9999,
              position: "relative",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
              <p style={{ 
                color: "#dc2626", 
                fontSize: isMobile ? "13px" : "14px", 
                fontWeight: "600",
                margin: "0 0 8px 0",
                lineHeight: "1.5"
              }}>
                {errors.general}
              </p>
              {errors.suggestion && (
                <p style={{ 
                  color: "#991b1b", 
                  fontSize: isMobile ? "12px" : "13px", 
                  margin: "0 0 12px 0",
                  lineHeight: "1.4"
                }}>
                  {errors.suggestion}
                </p>
              )}
              {(errors.errorType === 'user_not_found' || errors.errorType === 'invalid_password') && (
                <button
                  onClick={onSwitchToRegister}
                  style={{
                    background: "none",
                    border: "1px solid #dc2626",
                    color: "#dc2626",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#dc2626";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#dc2626";
                  }}
                >
                  Criar conta agora
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} action="#" method="post">
            {/* Email Field */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                Email
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af"
                }}>
                  <Mail style={{ 
                    height: isMobile ? "18px" : "20px", 
                    width: isMobile ? "18px" : "20px" 
                  }} />
                </div>
                <input
                  type="email"
                  name="email"
                  id="login-email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="username"
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 40px 10px 40px" : "12px 44px 12px 44px",
                    border: errors.email ? "2px solid #dc2626" : "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: isMobile ? "14px" : "16px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "#2563eb";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.email) {
                      e.target.style.borderColor = "#e5e7eb";
                    }
                  }}
                  placeholder="seu@email.com"
                />
              </div>
              {errors.email && (
                <p style={{ 
                  color: "#dc2626", 
                  fontSize: isMobile ? "10px" : "12px", 
                  marginTop: "4px",
                  margin: "4px 0 0 0"
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                Senha
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af"
                }}>
                  <Lock style={{ 
                    height: isMobile ? "18px" : "20px", 
                    width: isMobile ? "18px" : "20px" 
                  }} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="login-password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 40px 10px 40px" : "12px 44px 12px 44px",
                    border: errors.password ? "2px solid #dc2626" : "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: isMobile ? "14px" : "16px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = "#2563eb";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.password) {
                      e.target.style.borderColor = "#e5e7eb";
                    }
                  }}
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "#9ca3af",
                    cursor: "pointer",
                    padding: "4px"
                  }}
                >
                  {showPassword ? 
                    <EyeOff style={{ 
                      height: isMobile ? "18px" : "20px", 
                      width: isMobile ? "18px" : "20px" 
                    }} /> : 
                    <Eye style={{ 
                      height: isMobile ? "18px" : "20px", 
                      width: isMobile ? "18px" : "20px" 
                    }} />
                  }
                </button>
              </div>
              {errors.password && (
                <p style={{ 
                  color: "#dc2626", 
                  fontSize: isMobile ? "10px" : "12px", 
                  marginTop: "4px",
                  margin: "4px 0 0 0"
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                background: isLoading ? "#9ca3af" : gradientData.gradient,
                color: "white",
                padding: isMobile ? "12px" : "14px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: isMobile ? "14px" : "16px",
                border: "none",
                cursor: isLoading ? "not-allowed" : "pointer",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s",
                marginBottom: "24px"
              }}
              onMouseEnter={(e) => {
                if (!isLoading && !isMobile) {
                  e.target.style.transform = "translateY(-1px)";
                  e.target.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading && !isMobile) {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                }
              }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Switch to Register */}
          <div style={{
            textAlign: "center",
            padding: isMobile ? "12px" : "16px",
            backgroundColor: "#f9fafb",
            borderRadius: "8px"
          }}>
            <p style={{ 
              color: "#6b7280", 
              fontSize: isMobile ? "12px" : "14px",
              margin: 0
            }}>
              Não tem uma conta?{' '}
              <button
                onClick={onSwitchToRegister}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: isMobile ? "12px" : "14px"
                }}
              >
                Criar conta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;