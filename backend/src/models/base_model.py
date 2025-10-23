# ============================================
# BASE MODEL - Factory Method Pattern
# Modelo base com padrão Factory Method
# ============================================

from datetime import datetime
from src.app_factory import db

class BaseModel(db.Model):
    """
    Modelo base que implementa Factory Method Pattern
    Fornece funcionalidades comuns para todos os modelos
    """
    
    __abstract__ = True
    
    # Campos comuns
    id = db.Column(db.Integer, primary_key=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    @classmethod
    def create(cls, **kwargs):
        """
        Factory Method para criar instâncias do modelo
        
        Args:
            **kwargs: Argumentos para criação do modelo
            
        Returns:
            BaseModel: Instância criada do modelo
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