# ============================================
# CONFIGURATION - config.py
# Sistema de configurações por ambiente da aplicação Flask
# ============================================

"""
Sistema de configuração centralizado para a aplicação Memory Book.

Responsabilidades:
- Definir configurações base comuns a todos os ambientes
- Especializar configurações para desenvolvimento e produção
- Carregar variáveis de ambiente do arquivo .env
- Configurar JWT, banco de dados, CORS e uploads
- Fornecer mapeamento de configurações por ambiente

Dependências:
- os: Acesso às variáveis de ambiente do sistema
- dotenv: Carregamento de variáveis do arquivo .env

Padrões de Projeto:
- Strategy Pattern: Diferentes estratégias de configuração por ambiente
- Template Method: Classe base Config com especializações
"""

import os
from dotenv import load_dotenv

# Carregar variáveis de ambiente do arquivo .env
load_dotenv()

class Config:
    """Configuração base da aplicação"""
    
    # Configurações básicas do Flask
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Configurações JWT
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = 86400  # 24 horas
    JWT_IDENTITY_CLAIM = 'sub'  # Claim padrão para identity
    JWT_ALGORITHM = 'HS256'  # Algoritmo de assinatura
    
    # Configurações do banco de dados
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///memory_book.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configurações de CORS
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(',')
    
    # Configurações de upload
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'

class DevelopmentConfig(Config):
    """Configuração para desenvolvimento"""
    DEBUG = True
    FLASK_ENV = 'development'

class ProductionConfig(Config):
    """Configuração para produção"""
    DEBUG = False
    FLASK_ENV = 'production'

# Mapeamento de configurações
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}