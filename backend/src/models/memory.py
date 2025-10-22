# ============================================
# MODEL - Memory
# Modelo de memória da aplicação
# ============================================

from src.app_factory import db
from .base_model import BaseModel

class Memory(BaseModel):
    """Modelo de memória compatível com o frontend React"""
    
    __tablename__ = 'memories'
    
    # Campos da memória (compatíveis com o frontend)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    date = db.Column(db.String(10), nullable=False)  # Formato YYYY-MM-DD
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    photos = db.Column(db.JSON)  # Array de URLs/base64 das fotos
    spotify_url = db.Column(db.String(500))  # URL do Spotify
    color = db.Column(db.String(7))  # Cor em hexadecimal (#RRGGBB)
    
    # Relacionamento com usuário
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    @classmethod
    def create(cls, title, date, lat, lng, user_id, **kwargs):
        """
        Factory Method para criar memória
        
        Args:
            title (str): Título da memória
            date (str): Data da memória (YYYY-MM-DD)
            lat (float): Latitude
            lng (float): Longitude
            user_id (int): ID do usuário
            **kwargs: Outros campos opcionais
            
        Returns:
            Memory: Instância da memória criada
        """
        # Gerar cor aleatória se não fornecida
        if 'color' not in kwargs or not kwargs['color']:
            kwargs['color'] = cls._generate_random_color()
        
        return super().create(
            title=title,
            date=date,
            lat=lat,
            lng=lng,
            user_id=user_id,
            **kwargs
        )
    
    @staticmethod
    def _generate_random_color():
        """
        Gera uma cor aleatória para a memória
        
        Returns:
            str: Cor em formato hexadecimal
        """
        import random
        colors = [
            "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A",
            "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E2"
        ]
        return random.choice(colors)
    
    def validate(self):
        """
        Valida os dados da memória
        
        Raises:
            ValueError: Se algum campo obrigatório estiver inválido
        """
        if not self.title or not self.title.strip():
            raise ValueError("Título é obrigatório")
        
        if not self.lat or not self.lng:
            raise ValueError("Coordenadas são obrigatórias")
        
        if not (-90 <= self.lat <= 90):
            raise ValueError("Latitude deve estar entre -90 e 90")
        
        if not (-180 <= self.lng <= 180):
            raise ValueError("Longitude deve estar entre -180 e 180")
        
        if not self.date:
            raise ValueError("Data é obrigatória")
    
    def to_dict(self):
        """
        Converte memória para dicionário compatível com o frontend
        
        Returns:
            dict: Dados da memória no formato esperado pelo frontend
        """
        data = super().to_dict()
        
        # Renomear spotify_url para spotifyUrl (camelCase para o frontend)
        if 'spotify_url' in data:
            data['spotifyUrl'] = data.pop('spotify_url')
        
        # Remover user_id do retorno (não necessário no frontend)
        data.pop('user_id', None)
        
        return data
    
    def __repr__(self):
        return f'<Memory {self.title}>'