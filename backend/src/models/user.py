# ============================================
# MODEL - User
# Modelo de usuário da aplicação
# ============================================

import bcrypt
from src.app_factory import db
from .base_model import BaseModel

class User(BaseModel):
    """Modelo de usuário com autenticação"""
    
    __tablename__ = 'users'
    
    # Campos do usuário
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Preferências de tema/gradiente
    selected_gradient = db.Column(db.String(50), default='aurora', nullable=False)  # aurora, sunset, ocean, forest, cosmic
    theme_preference = db.Column(db.String(20), default='auto', nullable=False)  # light, dark, auto
    
    # Relacionamentos
    memories = db.relationship('Memory', backref='user', lazy=True, cascade='all, delete-orphan')
    theme = db.relationship('Theme', backref='user', uselist=False, cascade='all, delete-orphan')
    
    @classmethod
    def create(cls, name, email, password, **kwargs):
        """
        Factory Method para criar usuário com senha criptografada
        
        Args:
            name (str): Nome do usuário
            email (str): Email do usuário
            password (str): Senha em texto plano
            **kwargs: Outros argumentos
            
        Returns:
            User: Instância do usuário criada
        """
        password_hash = cls._hash_password(password)
        return super().create(
            name=name,
            email=email,
            password_hash=password_hash,
            **kwargs
        )
    
    @staticmethod
    def _hash_password(password):
        """
        Criptografa a senha usando bcrypt
        
        Args:
            password (str): Senha em texto plano
            
        Returns:
            str: Senha criptografada
        """
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        """
        Verifica se a senha está correta
        
        Args:
            password (str): Senha em texto plano
            
        Returns:
            bool: True se a senha estiver correta
        """
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        """
        Converte usuário para dicionário (sem senha)
        
        Returns:
            dict: Dados do usuário sem informações sensíveis
        """
        data = super().to_dict()
        data.pop('password_hash', None)  # Remove senha do retorno
        return data
    
    def __repr__(self):
        return f'<User {self.email}>'