# ============================================
# FACTORY PATTERN - Application Factory
# Padrão Factory para criação da aplicação Flask
# ============================================

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager

# Instâncias globais das extensões
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