# ============================================
# BASE MODEL - Factory Method Pattern
# Modelo base com padrão Factory Method
# ============================================

from datetime import datetime
from src.app_factory import db

class BaseModel(db.Model):
    """
    FACTORY METHOD PATTERN - Creator (Classe Abstrata)
    
    Implementa o padrão Factory Method fornecendo:
    1. Interface comum para criação de objetos (método create)
    2. Funcionalidades básicas compartilhadas por todos os modelos
    3. Estrutura para que subclasses implementem sua própria lógica de criação
    
    Benefícios do padrão:
    - Encapsula a lógica de criação de objetos
    - Permite customização da criação em subclasses
    - Garante consistência na criação de instâncias
    - Facilita manutenção e extensibilidade
    """
    
    __abstract__ = True
    
    # Campos comuns a todos os modelos
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    @classmethod
    def create(cls, **kwargs):
        """
        FACTORY METHOD - Método de criação padrão
        
        Este é o Factory Method que pode ser sobrescrito pelas subclasses
        para implementar lógica específica de criação (validações, transformações, etc.)
        
        Args:
            **kwargs: Argumentos para criação do modelo
            
        Returns:
            BaseModel: Instância criada do modelo
            
        Exemplo de uso:
            user = User.create(name="João", email="joao@email.com", password="123")
            memory = Memory.create(title="Viagem", latitude=-23.5, longitude=-46.6)
        """
        instance = cls(**kwargs)
        db.session.add(instance)
        return instance
    
    def save(self):
        """Salva a instância no banco de dados"""
        db.session.commit()
        return self
    
    def delete(self):
        """Remove a instância do banco de dados"""
        db.session.delete(self)
        db.session.commit()
    
    def update(self, **kwargs):
        """
        Atualiza os campos da instância
        
        Args:
            **kwargs: Campos a serem atualizados
        """
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)
        self.updated_at = datetime.utcnow()
        return self
    
    def to_dict(self):
        """
        Converte a instância para dicionário
        
        Returns:
            dict: Representação em dicionário do modelo
        """
        return {
            column.name: getattr(self, column.name)
            for column in self.__table__.columns
        }