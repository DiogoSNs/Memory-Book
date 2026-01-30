# ============================================
# MODEL - theme.py
# Modelo de dados para temas e gradientes personalizados dos usuários
# ============================================

"""
Modelo Theme para gerenciar temas visuais personalizados dos usuários.

Responsabilidades:
- Definir estrutura de dados para temas/gradientes dos usuários
- Armazenar configurações de gradientes CSS personalizados
- Gerenciar estado ativo/inativo dos temas
- Implementar Factory Method para criação de temas
- Fornecer gradiente padrão para novos usuários
- Manter relacionamento um-para-um com usuários

Dependências:
- src.app_factory.db: Instância do SQLAlchemy
- .base_model.BaseModel: Classe base com funcionalidades comuns

Padrões de Projeto:
- Factory Method Pattern: Método create() especializado
- Active Record Pattern: Modelo com lógica de negócio
- Template Method Pattern: Herda comportamentos do BaseModel
- Default Object Pattern: Gradiente padrão para novos usuários
"""

from src.app_factory import db
from .base_model import BaseModel

class Theme(BaseModel):
    """Modelo de tema/gradiente do usuário"""
    
    __tablename__ = 'themes'
    
    # Campos do tema
    gradient_name = db.Column(db.String(50), nullable=False, default='default')
    gradient_css = db.Column(db.Text, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    # Relacionamento com usuário (um-para-um)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, unique=True)
    
    @classmethod
    def create(cls, user_id, gradient_name='default', gradient_css=None, **kwargs):
        """
        Factory Method para criar tema do usuário
        
        Args:
            user_id (int): ID do usuário
            gradient_name (str): Nome do gradiente
            gradient_css (str): CSS do gradiente
            **kwargs: Outros argumentos
            
        Returns:
            Theme: Instância do tema criada
        """
        # Gradiente padrão se não fornecido
        if not gradient_css:
            gradient_css = cls._get_default_gradient()
        
        return super().create(
            user_id=user_id,
            gradient_name=gradient_name,
            gradient_css=gradient_css,
            **kwargs
        )
    
    @staticmethod
    def _get_default_gradient():
        """
        Retorna o gradiente padrão da aplicação
        
        Returns:
            str: CSS do gradiente padrão
        """
        return "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)"
    
    def update_gradient(self, gradient_name, gradient_css):
        """
        Atualiza o gradiente do usuário
        
        Args:
            gradient_name (str): Nome do novo gradiente
            gradient_css (str): CSS do novo gradiente
        """
        self.gradient_name = gradient_name
        self.gradient_css = gradient_css
        return self
    
    def to_dict(self):
        """
        Converte tema para dicionário compatível com o frontend
        
        Returns:
            dict: Dados do tema no formato esperado pelo frontend
        """
        data = super().to_dict()
        
        # Remover user_id do retorno
        data.pop('user_id', None)
        
        # Adicionar campos no formato esperado pelo frontend
        data['gradientName'] = data.pop('gradient_name')
        data['gradientCss'] = data.pop('gradient_css')
        data['isActive'] = data.pop('is_active')
        
        return data
    
    def __repr__(self):
        return f'<Theme {self.gradient_name} for User {self.user_id}>'