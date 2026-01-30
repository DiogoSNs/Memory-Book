# ============================================
# MODEL - User
# Modelo de usuário da aplicação
# ============================================

import bcrypt
from src.app_factory import db
from .base_model import BaseModel

class User(BaseModel):
    """
    FACTORY METHOD PATTERN - Concrete Creator (Implementação Específica)
    
    Esta classe herda de BaseModel e implementa sua própria versão do Factory Method,
    adicionando lógica específica para criação de usuários (criptografia de senha).
    
    Demonstra o padrão Factory Method em ação:
    - Sobrescreve o método create() da classe pai
    - Adiciona processamento específico (hash da senha)
    - Mantém a interface consistente com outros modelos
    """
    
    __tablename__ = 'users'
    
    # Campos específicos do usuário
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(128), nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Preferências de tema/gradiente
    selected_gradient = db.Column(db.String(50), default='sunset', nullable=False)  # aurora, sunset, ocean, forest, cosmic
    theme_preference = db.Column(db.String(20), default='auto', nullable=False)  # light, dark, auto
    map_theme = db.Column(db.String(20), default='light', nullable=False)  # light, dark, satellite
    
    # Relacionamentos
    memories = db.relationship('Memory', backref='user', lazy=True, cascade='all, delete-orphan')
    theme = db.relationship('Theme', backref='user', uselist=False, cascade='all, delete-orphan')
    
    @classmethod
    def create(cls, name, email, password, **kwargs):
        """
        FACTORY METHOD ESPECÍFICO - Sobrescreve o método da classe pai
        
        Implementa lógica específica para criação de usuários:
        1. Recebe senha em texto plano
        2. Aplica hash criptográfico (bcrypt)
        3. Chama o Factory Method da classe pai com dados processados
        
        Este é um exemplo perfeito do padrão Factory Method:
        - Mantém a interface consistente (método create)
        - Adiciona comportamento específico da subclasse
        - Reutiliza funcionalidade da classe pai
        
        Args:
            name (str): Nome do usuário
            email (str): Email do usuário
            password (str): Senha em texto plano (será criptografada)
            **kwargs: Outros argumentos opcionais
            
        Returns:
            User: Instância do usuário criada com senha criptografada
            
        Exemplo de uso:
            user = User.create(name="João", email="joao@email.com", password="minhasenha123")
        """
        # Processamento específico: criptografar senha
        password_hash = cls._hash_password(password)
        
        # Garantir defaults robustos mesmo se o banco tiver server_default antigo
        selected_gradient = kwargs.pop('selected_gradient', 'sunset')
        theme_preference = kwargs.pop('theme_preference', 'auto')
        map_theme = kwargs.pop('map_theme', 'light')

        # Chamar Factory Method da classe pai com dados processados e defaults explícitos
        return super().create(
            name=name,
            email=email,
            password_hash=password_hash,
            selected_gradient=selected_gradient,
            theme_preference=theme_preference,
            map_theme=map_theme,
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
