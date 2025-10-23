# ============================================
# USER REPOSITORY - Repository Pattern
# Repositório específico para usuários
# ============================================

from typing import Optional
from .base_repository import BaseRepository
from src.models.user import User

class UserRepository(BaseRepository):
    """Repositório para operações com usuários"""
    
    def __init__(self):
        super().__init__(User)
    
    def get_by_email(self, email: str) -> Optional[User]:
        """
        Busca usuário pelo email
        
        Args:
            email (str): Email do usuário
            
        Returns:
            Usuário encontrado ou None
        """
        return self.find_one_by(email=email)
    
    def email_exists(self, email: str) -> bool:
        """
        Verifica se o email já está cadastrado
        
        Args:
            email (str): Email a ser verificado
            
        Returns:
            True se o email já existe
        """
        return self.exists(email=email)
    
    def create_user(self, name: str, email: str, password: str) -> User:
        """
        Cria um novo usuário
        
        Args:
            name (str): Nome do usuário
            email (str): Email do usuário
            password (str): Senha em texto plano
            
        Returns:
            Usuário criado
            
        Raises:
            ValueError: Se o email já estiver em uso
        """
        if self.email_exists(email):
            raise ValueError("Email já está em uso")
        
        return self.create(name=name, email=email, password=password)
    
    def authenticate(self, email: str, password: str) -> Optional[User]:
        """
        Autentica um usuário
        
        Args:
            email (str): Email do usuário
            password (str): Senha em texto plano
            
        Returns:
            Usuário autenticado ou None se credenciais inválidas
        """
        user = self.get_by_email(email)
        
        if user and user.check_password(password) and user.is_active:
            return user
        
        return None
    
    def authenticate_with_details(self, email: str, password: str) -> tuple[Optional[User], str]:
        """
        Autentica um usuário com detalhes sobre o erro
        
        Args:
            email (str): Email do usuário
            password (str): Senha em texto plano
            
        Returns:
            Tupla com (usuário autenticado ou None, mensagem de erro)
        """
        user = self.get_by_email(email)
        
        if not user:
            return None, "user_not_found"
        
        if not user.is_active:
            return None, "user_inactive"
        
        if not user.check_password(password):
            return None, "invalid_password"
        
        return user, "success"
    
    def get_active_users(self):
        """
        Busca todos os usuários ativos
        
        Returns:
            Lista de usuários ativos
        """
        return self.find_by(is_active=True)
    
    def deactivate_user(self, user_id: int) -> bool:
        """
        Desativa um usuário (soft delete)
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            True se desativado com sucesso
        """
        user = self.get_by_id(user_id)
        if user:
            self.update(user, is_active=False)
            return True
        return False
    
    def activate_user(self, user_id: int) -> bool:
        """
        Ativa um usuário
        
        Args:
            user_id (int): ID do usuário
            
        Returns:
            True se ativado com sucesso
        """
        user = self.get_by_id(user_id)
        if user:
            self.update(user, is_active=True)
            return True
        return False