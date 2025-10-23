# ============================================
# HELPERS
# Funções auxiliares para o backend
# ============================================

import json
import random
from datetime import datetime
from typing import Any, Optional, List

def generate_random_color() -> str:
    """
    Gera uma cor hexadecimal aleatória
    
    Returns:
        str: Cor em formato hexadecimal (#RRGGBB)
    """
    # Cores pré-definidas para memórias
    colors = [
        '#FF6B6B',  # Vermelho suave
        '#4ECDC4',  # Turquesa
        '#45B7D1',  # Azul
        '#96CEB4',  # Verde suave
        '#FFEAA7',  # Amarelo suave
        '#DDA0DD',  # Roxo suave
        '#98D8C8',  # Verde água
        '#F7DC6F',  # Dourado suave
        '#BB8FCE',  # Lavanda
        '#85C1E9',  # Azul claro
        '#F8C471',  # Laranja suave
        '#82E0AA'   # Verde menta
    ]
    
    return random.choice(colors)

def format_date(date_obj: datetime, format_str: str = '%Y-%m-%d') -> str:
    """
    Formata objeto datetime para string
    
    Args:
        date_obj (datetime): Objeto datetime
        format_str (str): Formato desejado
        
    Returns:
        str: Data formatada
    """
    if not isinstance(date_obj, datetime):
        return str(date_obj)
    
    return date_obj.strftime(format_str)

def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """
    Carrega JSON de forma segura
    
    Args:
        json_str (str): String JSON
        default (Any): Valor padrão se falhar
        
    Returns:
        Any: Objeto Python ou valor padrão
    """
    if not json_str:
        return default
    
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default

def safe_json_dumps(obj: Any, default: str = '[]') -> str:
    """
    Converte objeto para JSON de forma segura
    
    Args:
        obj (Any): Objeto a ser convertido
        default (str): Valor padrão se falhar
        
    Returns:
        str: String JSON ou valor padrão
    """
    if obj is None:
        return default
    
    try:
        return json.dumps(obj, ensure_ascii=False)
    except (TypeError, ValueError):
        return default

def paginate_results(query, page: int = 1, per_page: int = 10):
    """
    Pagina resultados de query SQLAlchemy
    
    Args:
        query: Query SQLAlchemy
        page (int): Número da página (começa em 1)
        per_page (int): Itens por página
        
    Returns:
        dict: Dados paginados
    """
    # Garantir valores mínimos
    page = max(1, page)
    per_page = max(1, min(100, per_page))  # Máximo 100 itens por página
    
    # Executar paginação
    paginated = query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )
    
    return {
        'items': paginated.items,
        'total': paginated.total,
        'pages': paginated.pages,
        'current_page': page,
        'per_page': per_page,
        'has_next': paginated.has_next,
        'has_prev': paginated.has_prev,
        'next_page': paginated.next_num if paginated.has_next else None,
        'prev_page': paginated.prev_num if paginated.has_prev else None
    }

def calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """
    Calcula distância aproximada entre duas coordenadas (em graus)
    
    Args:
        lat1, lng1: Coordenadas do primeiro ponto
        lat2, lng2: Coordenadas do segundo ponto
        
    Returns:
        float: Distância aproximada
    """
    # Cálculo simples de distância euclidiana
    # Para uso mais preciso, usar fórmula de Haversine
    return ((lat2 - lat1) ** 2 + (lng2 - lng1) ** 2) ** 0.5

def sanitize_filename(filename: str) -> str:
    """
    Sanitiza nome de arquivo removendo caracteres perigosos
    
    Args:
        filename (str): Nome do arquivo
        
    Returns:
        str: Nome sanitizado
    """
    if not filename:
        return 'unnamed_file'
    
    # Remover caracteres perigosos
    import re
    sanitized = re.sub(r'[<>:"/\\|?*]', '_', filename)
    
    # Remover espaços extras e pontos no início/fim
    sanitized = sanitized.strip(' .')
    
    # Garantir que não está vazio
    if not sanitized:
        return 'unnamed_file'
    
    return sanitized

def get_file_extension(filename: str) -> str:
    """
    Obtém extensão do arquivo
    
    Args:
        filename (str): Nome do arquivo
        
    Returns:
        str: Extensão (sem o ponto)
    """
    if not filename or '.' not in filename:
        return ''
    
    return filename.rsplit('.', 1)[1].lower()

def is_allowed_file_type(filename: str, allowed_extensions: List[str]) -> bool:
    """
    Verifica se tipo de arquivo é permitido
    
    Args:
        filename (str): Nome do arquivo
        allowed_extensions (List[str]): Extensões permitidas
        
    Returns:
        bool: True se permitido
    """
    if not filename or not allowed_extensions:
        return False
    
    extension = get_file_extension(filename)
    return extension in [ext.lower() for ext in allowed_extensions]

def format_file_size(size_bytes: int) -> str:
    """
    Formata tamanho de arquivo em formato legível
    
    Args:
        size_bytes (int): Tamanho em bytes
        
    Returns:
        str: Tamanho formatado (ex: "1.5 MB")
    """
    if size_bytes == 0:
        return "0 B"
    
    size_names = ["B", "KB", "MB", "GB", "TB"]
    i = 0
    
    while size_bytes >= 1024 and i < len(size_names) - 1:
        size_bytes /= 1024.0
        i += 1
    
    return f"{size_bytes:.1f} {size_names[i]}"

def generate_unique_filename(original_filename: str) -> str:
    """
    Gera nome único para arquivo baseado no timestamp
    
    Args:
        original_filename (str): Nome original do arquivo
        
    Returns:
        str: Nome único do arquivo
    """
    import uuid
    from datetime import datetime
    
    # Obter extensão
    extension = get_file_extension(original_filename)
    
    # Gerar nome único
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    unique_id = str(uuid.uuid4())[:8]
    
    if extension:
        return f"{timestamp}_{unique_id}.{extension}"
    else:
        return f"{timestamp}_{unique_id}"