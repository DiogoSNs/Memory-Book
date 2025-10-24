# ============================================
# FACTORY PATTERN - app_factory.py
# Factory para criação e configuração da aplicação Flask
# ============================================

"""
Factory Pattern para criação da aplicação Flask Memory Book.

Responsabilidades:
- Implementar Factory Method para criação da aplicação Flask
- Configurar extensões (SQLAlchemy, JWT, CORS)
- Registrar blueprints dos controllers
- Inicializar banco de dados
- Centralizar configuração da aplicação

Dependências:
- flask: Framework web principal
- flask_sqlalchemy: ORM para banco de dados
- flask_cors: Configuração de CORS
- flask_jwt_extended: Autenticação JWT
- src.controllers: Blueprints dos controllers

Padrões de Projeto:
- Factory Pattern: create_app() como Factory Method
- Singleton Pattern: Instâncias globais das extensões (db, jwt)
- Blueprint Pattern: Organização modular dos controllers
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Instâncias globais das extensões (Singleton Pattern)
db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_class):
    """
    Factory Method para criar instância da aplicação Flask
    
    Args:
        config_class: Classe de configuração a ser utilizada
        
    Returns:
        Flask: Instância configurada da aplicação
    """
    
    # Criar instância do Flask
    app = Flask(__name__)
    
    # Aplicar configurações
    app.config.from_object(config_class)
    
    # Inicializar extensões
    db.init_app(app)
    jwt.init_app(app)
    
    # Configurar CORS
    CORS(app, origins=app.config['CORS_ORIGINS'])
    
    # Registrar blueprints (controllers)
    from src.controllers.auth_controller import auth_bp
    from src.controllers.memory_controller import memory_bp
    from src.controllers.theme_controller import theme_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(memory_bp, url_prefix='/api/memories')
    app.register_blueprint(theme_bp, url_prefix='/api/themes')
    
    # Criar tabelas do banco de dados
    with app.app_context():
        db.create_all()
    
    # Rota de health check
    @app.route('/api/health')
    def health_check():
        return {'status': 'OK', 'message': 'Memory Book API is running'}
    
    return app