# ============================================
# MEMORY REPOSITORY - Repository Pattern
# Repositório específico para memórias
# ============================================

from typing import List, Optional
from .base_repository import BaseRepository
from src.models.memory import Memory
from src.database import db

class MemoryRepository(BaseRepository):
    """Repositório para operações com memórias"""
    
    def __init__(self):
        super().__init__(Memory)
    
    def get_by_user(self, user_id: int) -> List[Memory]:
        """
        Busca todas as memórias de um usuário
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            Lista de memórias do usuário
        """
        return self.find_by(user_id=user_id)
    
    def create_memory(self, user_id: int, title: str, date: str, lat: float, lng: float, **kwargs) -> Memory:
        """
        Cria uma nova memória para um usuário
        
        Args:
            user_id (int): ID do usuário
            title (str): Título da memória
            date (str): Data da memória
            lat (float): Latitude
            lng (float): Longitude
            **kwargs: Outros campos opcionais
            
        Returns:
            Memória criada
            
        Raises:
            ValueError: Se dados obrigatórios estiverem inválidos
        """
        memory = self.create(
            user_id=user_id,
            title=title,
            date=date,
            lat=lat,
            lng=lng,
            **kwargs
        )
        
        # Validar a memória criada
        memory.validate()
        
        return memory
    
    def get_user_memory(self, memory_id: int, user_id: int) -> Optional[Memory]:
        """
        Busca uma memória específica de um usuário
        
        Args:
            memory_id (int): ID da memória
            user_id (int): ID do usuário
            
        Returns:
            Memória encontrada ou None
        """
        return self.find_one_by(id=memory_id, user_id=user_id)
    
    def update_memory(self, memory_id: int, user_id: int, **kwargs) -> Optional[Memory]:
        """
        Atualiza uma memória de um usuário
        
        Args:
            memory_id (int): ID da memória
            user_id (int): ID do usuário
            **kwargs: Dados para atualização
            
        Returns:
            Memória atualizada ou None se não encontrada
        """
        memory = self.get_user_memory(memory_id, user_id)
        if memory:
            updated_memory = self.update(memory, **kwargs)
            updated_memory.validate()
            return updated_memory
        return None
    
    def delete_memory(self, memory_id: int, user_id: int) -> bool:
        """
        Remove uma memória de um usuário
        
        Args:
            memory_id (int): ID da memória
            user_id (int): ID do usuário
            
        Returns:
            True se removida com sucesso
        """
        memory = self.get_user_memory(memory_id, user_id)
        if memory:
            return self.delete(memory)
        return False
    
    def get_memories_by_location(self, user_id: int, lat: float, lng: float, radius: float = 0.01) -> List[Memory]:
        """
        Busca memórias próximas a uma localização
        
        Args:
            user_id (int): ID do usuário
            lat (float): Latitude central
            lng (float): Longitude central
            radius (float): Raio de busca em graus (padrão: ~1km)
            
        Returns:
            Lista de memórias próximas
        """
        return Memory.query.filter(
            Memory.user_id == user_id,
            Memory.lat.between(lat - radius, lat + radius),
            Memory.lng.between(lng - radius, lng + radius)
        ).all()
    
    def get_memories_by_date_range(self, user_id: int, start_date: str, end_date: str) -> List[Memory]:
        """
        Busca memórias em um período específico
        
        Args:
            user_id (int): ID do usuário
            start_date (str): Data inicial (YYYY-MM-DD)
            end_date (str): Data final (YYYY-MM-DD)
            
        Returns:
            Lista de memórias no período
        """
        return Memory.query.filter(
            Memory.user_id == user_id,
            Memory.date.between(start_date, end_date)
        ).order_by(Memory.date.desc()).all()
    
    def count_user_memories(self, user_id: int) -> int:
        """
        Conta o número de memórias de um usuário
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            Número de memórias
        """
        try:
            from src.app_factory import db
            return db.session.query(Memory).filter_by(user_id=user_id).count()
        except Exception as e:
            print(f"Erro ao contar memórias: {e}")
            return 0