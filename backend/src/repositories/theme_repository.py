# ============================================
# THEME REPOSITORY - Repository Pattern
# Repositório específico para temas
# ============================================

from typing import Optional
from .base_repository import BaseRepository
from src.models.theme import Theme

class ThemeRepository(BaseRepository):
    """Repositório para operações com temas"""
    
    def __init__(self):
        super().__init__(Theme)
    
    def get_by_user(self, user_id: int) -> Optional[Theme]:
        """
        Busca o tema de um usuário
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            Tema do usuário ou None
        """
        return self.find_one_by(user_id=user_id)
    
    def create_or_update_theme(self, user_id: int, gradient_name: str, gradient_css: str, is_active: bool = True) -> Theme:
        """
        Cria ou atualiza o tema de um usuário
        
        Args:
            user_id (int): ID do usuário
            gradient_name (str): Nome do gradiente
            gradient_css (str): CSS do gradiente
            
        Returns:
            Tema criado ou atualizado
        """
        existing_theme = self.get_by_user(user_id)
        
        if existing_theme:
            # Atualizar tema existente
            return self.update(
                existing_theme,
                gradient_name=gradient_name,
                gradient_css=gradient_css,
                is_active=is_active
            )
        else:
            # Criar novo tema
            return self.create(
                user_id=user_id,
                gradient_name=gradient_name,
                gradient_css=gradient_css,
                is_active=is_active
            )
    
    def get_or_create_default_theme(self, user_id: int) -> Theme:
        """
        Busca o tema do usuário ou cria um padrão se não existir
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            Tema do usuário (existente ou padrão criado)
        """
        theme = self.get_by_user(user_id)
        
        if not theme:
            # Criar tema padrão para o usuário
            theme = self.create(user_id=user_id)
        
        return theme
    
    def reset_to_default(self, user_id: int) -> Theme:
        """
        Reseta o tema do usuário para o padrão
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            Tema resetado para o padrão
        """
        return self.create_or_update_theme(
            user_id=user_id,
            gradient_name='default',
            gradient_css=Theme._get_default_gradient()
        )
    
    def deactivate_theme(self, user_id: int) -> bool:
        """
        Desativa o tema de um usuário
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            True se desativado com sucesso
        """
        theme = self.get_by_user(user_id)
        if theme:
            self.update(theme, is_active=False)
            return True
        return False
    
    def activate_theme(self, user_id: int) -> bool:
        """
        Ativa o tema de um usuário
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            True se ativado com sucesso
        """
        theme = self.get_by_user(user_id)
        if theme:
            self.update(theme, is_active=True)
            return True
        return False