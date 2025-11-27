# ============================================
# VALIDATORS
# Validadores para dados de entrada
# ============================================

import re
from datetime import datetime
from typing import Optional

def validate_email(email: str) -> bool:
    """
    Valida formato de email
    
    Args:
        email (str): Email a ser validado
        
    Returns:
        bool: True se válido, False caso contrário
    """
    if not email or not isinstance(email, str):
        return False
    
    # Regex para validação de email
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_pattern, email) is not None

def validate_password(password: str) -> tuple[bool, Optional[str]]:
    """
    Valida força da senha
    
    Args:
        password (str): Senha a ser validada
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not password or not isinstance(password, str):
        return False, "Senha é obrigatória"
    
    if len(password) < 6:
        return False, "Senha deve ter pelo menos 6 caracteres"
    
    if len(password) > 128:
        return False, "Senha deve ter no máximo 128 caracteres"
    
    # Verificar se tem pelo menos uma letra
    if not re.search(r'[a-zA-Z]', password):
        return False, "Senha deve conter pelo menos uma letra"
    
    # Verificar se tem pelo menos um número
    if not re.search(r'\d', password):
        return False, "Senha deve conter pelo menos um número"
    
    return True, None

def validate_date(date_str: str) -> tuple[bool, Optional[str]]:
    """
    Valida formato de data (YYYY-MM-DD)
    
    Args:
        date_str (str): Data em string
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not date_str or not isinstance(date_str, str):
        return False, "Data é obrigatória"
    
    try:
        # Tentar parsear a data
        parsed_date = datetime.strptime(date_str, '%Y-%m-%d')
        
        # Verificar se a data não é muito no futuro (mais de 1 ano)
        current_date = datetime.now()
        if parsed_date.year > current_date.year + 1:
            return False, "Data não pode ser mais de 1 ano no futuro"
        
        # Verificar se a data não é muito no passado (mais de 150 anos)
        if parsed_date.year < current_date.year - 150:
            return False, "Data não pode ser mais de 150 anos no passado"
        
        return True, None
        
    except ValueError:
        return False, "Formato de data inválido. Use YYYY-MM-DD"

def validate_coordinates(lat: float, lng: float) -> tuple[bool, Optional[str]]:
    """
    Valida coordenadas de latitude e longitude
    
    Args:
        lat (float): Latitude
        lng (float): Longitude
        
    Returns:
        tuple: (is_valid, error_message)
    """
    try:
        lat = float(lat)
        lng = float(lng)
    except (ValueError, TypeError):
        return False, "Coordenadas devem ser números válidos"
    
    # Validar latitude (-90 a 90)
    if lat < -90 or lat > 90:
        return False, "Latitude deve estar entre -90 e 90"
    
    # Validar longitude (-180 a 180)
    if lng < -180 or lng > 180:
        return False, "Longitude deve estar entre -180 e 180"
    
    return True, None

def validate_color(color: str) -> bool:
    """
    Valida formato de cor hexadecimal
    
    Args:
        color (str): Cor em formato hex
        
    Returns:
        bool: True se válido, False caso contrário
    """
    if not color or not isinstance(color, str):
        return False
    
    # Regex para cor hexadecimal (#RRGGBB ou #RGB)
    color_pattern = r'^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
    return re.match(color_pattern, color) is not None

def validate_spotify_url(url: str) -> bool:
    """
    Valida URL do Spotify
    
    Args:
        url (str): URL do Spotify
        
    Returns:
        bool: True se válido, False caso contrário
    """
    if not url or not isinstance(url, str):
        return False
    
    # Padrões aceitos do Spotify
    spotify_patterns = [
        r'^https://open\.spotify\.com/track/[a-zA-Z0-9]+',
        r'^https://open\.spotify\.com/album/[a-zA-Z0-9]+',
        r'^https://open\.spotify\.com/playlist/[a-zA-Z0-9]+',
        r'^spotify:track:[a-zA-Z0-9]+',
        r'^spotify:album:[a-zA-Z0-9]+',
        r'^spotify:playlist:[a-zA-Z0-9]+'
    ]
    
    return any(re.match(pattern, url) for pattern in spotify_patterns)

def validate_memory_title(title: str) -> tuple[bool, Optional[str]]:
    """
    Valida título da memória
    
    Args:
        title (str): Título da memória
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if not title or not isinstance(title, str):
        return False, "Título é obrigatório"
    
    title = title.strip()
    
    if len(title) < 1:
        return False, "Título não pode estar vazio"
    
    if len(title) > 200:
        return False, "Título deve ter no máximo 200 caracteres"
    
    return True, None

def validate_memory_description(description: str) -> tuple[bool, Optional[str]]:
    """
    Valida descrição da memória
    
    Args:
        description (str): Descrição da memória
        
    Returns:
        tuple: (is_valid, error_message)
    """
    if description is None:
        return True, None
    
    if not isinstance(description, str):
        return False, "Descrição deve ser texto"
    
    if len(description) > 2000:
        return False, "Descrição deve ter no máximo 2000 caracteres"
    
    return True, None
from moviepy.editor import VideoFileClip

def validate_video_duration(file_path: str, max_seconds: int = 30) -> float:
    """
    Valida duração de vídeo usando MoviePy.
    Retorna a duração em segundos.
    Levanta ValueError se exceder max_seconds ou se não for possível ler.
    """
    try:
        with VideoFileClip(file_path) as clip:
            duration = float(clip.duration or 0)
            if not (duration > 0):
                raise ValueError('Não foi possível obter a duração do vídeo')
            if duration > max_seconds:
                raise ValueError('Vídeo deve ter no máximo 30 segundos')
            return duration
    except Exception as e:
        raise ValueError(str(e))
