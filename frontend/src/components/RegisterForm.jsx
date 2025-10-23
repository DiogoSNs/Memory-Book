import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext.jsx';
import { useGradient } from '../contexts/GradientContext.jsx';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const { register } = useAuth();
  const { showToast } = useToast();
  const { getCurrentGradientData } = useGradient();
  const gradientData = getCurrentGradientData() || {};

  // Hook para detectar tamanho da tela
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Debug: monitorar mudanças no estado errors
  useEffect(() => {
    console.log('🔍 [RegisterForm] Estado errors atualizado:', errors);
  }, [errors]);

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
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
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
    try {
      console.log('🔍 [RegisterForm] Iniciando registro com:', { 
        name: formData.name, 
        email: formData.email 
      });
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      console.log('🔍 [RegisterForm] Resultado do registro:', result);
      
      if (!result.success) {
        const errorMessage = result?.error || 'Erro ao criar conta';
        const errorSuggestion = result?.suggestion || null;
        const errorType = result?.errorType || null;
        
        console.log('🔍 [RegisterForm] Definindo erros:', { 
          general: errorMessage,
          suggestion: errorSuggestion,
          errorType: errorType
        });
        
        setErrors({ 
          general: errorMessage,
          suggestion: errorSuggestion,
          errorType: errorType
        });
      }
    } catch (error) {
      setErrors({ general: error.message || 'Erro ao criar conta' });
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
            Criar Conta
          </h1>
          <p style={{ 
            color: "#a7f3d0", 
            fontSize: isMobile ? "14px" : "16px",
            margin: 0
          }}>
            Comece a mapear suas memórias
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
              marginBottom: "24px"
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
              {errors.errorType === 'email_already_exists' && (
                <button
                  onClick={onSwitchToLogin}
                  style={{
                    background: "none",
                    border: "1px solid #dc2626",
                    color: "#dc2626",
                    padding: "8px 16px",
                    borderRadius: "6px",
                    fontSize: isMobile ? "12px" : "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = "#dc2626";
                    e.target.style.color = "white";
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = "transparent";
                    e.target.style.color = "#dc2626";
                  }}
                >
                  Fazer Login
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{
                display: "block",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                Nome
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute",
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#9ca3af"
                }}>
                  <User style={{ 
                    height: isMobile ? "18px" : "20px", 
                    width: isMobile ? "18px" : "20px" 
                  }} />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 10px 10px 40px" : "12px 12px 12px 44px",
                    border: errors.name ? "2px solid #dc2626" : "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: isMobile ? "14px" : "16px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    if (!errors.name) {
                      e.target.style.borderColor = "#2563eb";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.name) {
                      e.target.style.borderColor = "#e5e7eb";
                    }
                  }}
                  placeholder="Seu nome"
                />
              </div>
              {errors.name && (
                <p style={{ 
                  color: "#dc2626", 
                  fontSize: isMobile ? "10px" : "12px", 
                  marginTop: "4px",
                  margin: "4px 0 0 0"
                }}>
                  {errors.name}
                </p>
              )}
            </div>

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
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 10px 10px 40px" : "12px 12px 12px 44px",
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
            <div style={{ marginBottom: "20px" }}>
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
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Field */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block",
                fontSize: isMobile ? "12px" : "14px",
                fontWeight: "600",
                color: "#374151",
                marginBottom: "8px"
              }}>
                Confirmar Senha
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
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: isMobile ? "10px 40px 10px 40px" : "12px 44px 12px 44px",
                    border: errors.confirmPassword ? "2px solid #dc2626" : "2px solid #e5e7eb",
                    borderRadius: "8px",
                    fontSize: isMobile ? "14px" : "16px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box"
                  }}
                  onFocus={(e) => {
                    if (!errors.confirmPassword) {
                      e.target.style.borderColor = "#2563eb";
                    }
                  }}
                  onBlur={(e) => {
                    if (!errors.confirmPassword) {
                      e.target.style.borderColor = "#e5e7eb";
                    }
                  }}
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  {showConfirmPassword ? 
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
              {errors.confirmPassword && (
                <p style={{ 
                  color: "#dc2626", 
                  fontSize: isMobile ? "10px" : "12px", 
                  marginTop: "4px",
                  margin: "4px 0 0 0"
                }}>
                  {errors.confirmPassword}
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
              {isLoading ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Switch to Login */}
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
              Já tem uma conta?{' '}
              <button
                onClick={onSwitchToLogin}
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
                Entrar
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;