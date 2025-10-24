# ============================================
# BASE REPOSITORY - Repository Pattern
# Repositório base implementando padrão Repository
# ============================================

from abc import ABC, abstractmethod
from typing import List, Optional, Any
from src.app_factory import db

class BaseRepository(ABC):
    """
    REPOSITORY PATTERN - Classe Base Abstrata
    
    Implementa o padrão Repository fornecendo:
    1. Interface comum para operações de acesso a dados (CRUD)
    2. Abstração da camada de persistência
    3. Separação entre lógica de negócio e acesso a dados
    4. Base para implementações específicas de cada modelo
    
    Benefícios do padrão Repository:
    - Testabilidade: Facilita criação de mocks para testes
    - Flexibilidade: Permite trocar implementação de persistência
    - Reutilização: Operações CRUD padronizadas
    - Manutenibilidade: Centraliza lógica de acesso a dados
    - Separação de responsabilidades: Controllers não conhecem detalhes do banco
    
    Estrutura do padrão:
    Controller -> Repository -> Model -> Database
    """
    
    def __init__(self, model_class):
        """
        Inicializa o repositório com a classe do modelo
        
        Args:
            model_class: Classe do modelo SQLAlchemy que este repositório gerencia
        """
        self.model_class = model_class
    
    def create(self, **kwargs) -> Any:
        """
        Cria uma nova instância do modelo
        
        Args:
            **kwargs: Dados para criação
            
        Returns:
            Instância criada do modelo
        """
        instance = self.model_class.create(**kwargs)
        db.session.commit()
        return instance
    
    def get_by_id(self, id: int) -> Optional[Any]:
        """
        Busca uma instância pelo ID
        
        Args:
            id (int): ID da instância
            
        Returns:
            Instância encontrada ou None
        """
        return self.model_class.query.get(id)
    
    def get_all(self) -> List[Any]:
        """
        Busca todas as instâncias do modelo
        
        Returns:
            Lista com todas as instâncias
        """
        return self.model_class.query.all()
    
    def update(self, instance: Any, **kwargs) -> Any:
        """
        Atualiza uma instância
        
        Args:
            instance: Instância a ser atualizada
            **kwargs: Dados para atualização
            
        Returns:
            Instância atualizada
        """
        instance.update(**kwargs)
        db.session.commit()
        return instance
    
    def delete(self, instance: Any) -> bool:
        """
        Remove uma instância
        
        Args:
            instance: Instância a ser removida
            
        Returns:
            True se removida com sucesso
        """
        try:
            instance.delete()
            return True
        except Exception as e:
            db.session.rollback()
            raise e
    
    def delete_by_id(self, id: int) -> bool:
        """
        Remove uma instância pelo ID
        
        Args:
            id (int): ID da instância
            
        Returns:
            True se removida com sucesso
        """
        instance = self.get_by_id(id)
        if instance:
            return self.delete(instance)
        return False
    
    def exists(self, **filters) -> bool:
        """
        Verifica se existe uma instância com os filtros especificados
        
        Args:
            **filters: Filtros de busca
            
        Returns:
            True se existe
        """
        return self.model_class.query.filter_by(**filters).first() is not None
    
    def find_by(self, **filters) -> List[Any]:
        """
        Busca instâncias pelos filtros especificados
        
        Args:
            **filters: Filtros de busca
            
        Returns:
            Lista de instâncias encontradas
        """
        return self.model_class.query.filter_by(**filters).all()
    
    def find_one_by(self, **filters) -> Optional[Any]:
        """
        Busca uma única instância pelos filtros especificados
        
        Args:
            **filters: Filtros de busca
            
        Returns:
            Primeira instância encontrada ou None
        """
        return self.model_class.query.filter_by(**filters).first()
    
    def count(self) -> int:
        """
        Conta o número total de instâncias
        
        Returns:
            Número de instâncias
        """
        return self.model_class.query.count()
    
    def paginate(self, page: int = 1, per_page: int = 10) -> Any:
        """
        Busca instâncias com paginação
        
        Args:
            page (int): Número da página
            per_page (int): Itens por página
            
        Returns:
            Objeto de paginação do SQLAlchemy
        """
        return self.model_class.query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )