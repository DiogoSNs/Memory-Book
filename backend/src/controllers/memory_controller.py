# ============================================
# CONTROLLER - Memory
# Controller para operações com memórias
# ============================================

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.repositories.memory_repository import MemoryRepository
from src.utils.validators import validate_music

# Blueprint para rotas de memórias
memory_bp = Blueprint('memories', __name__)

# Instância do repositório
memory_repo = MemoryRepository()

@memory_bp.route('', methods=['GET'])
@jwt_required()
def get_memories():
    """
    Endpoint para listar memórias do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Query Parameters:
        start_date (str, optional): Data inicial (YYYY-MM-DD)
        end_date (str, optional): Data final (YYYY-MM-DD)
        
    Returns:
        JSON: Lista de memórias do usuário
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        
        # Verificar filtros de data
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if start_date and end_date:
            memories = memory_repo.get_memories_by_date_range(user_id, start_date, end_date)
        else:
            memories = memory_repo.get_by_user(user_id)
        
        # Converter para dicionários
        memories_data = [memory.to_dict() for memory in memories]
        
        return jsonify({
            'memories': memories_data,
            'total': len(memories_data)
        }), 200
        
    except Exception as e:
        print(f"Erro no endpoint de estatísticas: {e}")  # Debug temporário
        return jsonify({'error': 'Erro interno do servidor'}), 500

@memory_bp.route('', methods=['POST'])
@jwt_required()
def create_memory():
    """
    Endpoint para criar nova memória
    
    Headers:
        Authorization: Bearer <token>
        
    Body:
        title (str): Título da memória
        description (str, optional): Descrição da memória
        date (str): Data da memória (YYYY-MM-DD)
        lat (float): Latitude
        lng (float): Longitude
        photos (list, optional): Lista de fotos
        music (object, optional): Objeto da música selecionada
        color (str, optional): Cor da memória
        
    Returns:
        JSON: Dados da memória criada
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data or not all(k in data for k in ('title', 'date', 'lat', 'lng')):
            return jsonify({'error': 'Título, data, latitude e longitude são obrigatórios'}), 400
        
        # Unificar mídia: armazenar vídeos junto às fotos para compatibilidade sem migração
        photos = data.get('photos') or []
        videos = data.get('videos') or []
        if isinstance(videos, list) and len(videos) > 0:
            photos = list(photos) + list(videos)

        if data.get('music') is not None:
            ok, err = validate_music(data.get('music'))
            if not ok:
                return jsonify({'error': err}), 400
        # Criar memória
        memory = memory_repo.create_memory(
            user_id=user_id,
            title=data['title'],
            date=data['date'],
            lat=float(data['lat']),
            lng=float(data['lng']),
            description=data.get('description', ''),
            photos=photos or None,
            music=data.get('music'),
            color=data.get('color')
        )
        
        return jsonify({
            'message': 'Memória criada com sucesso',
            'memory': memory.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@memory_bp.route('/<int:memory_id>', methods=['GET'])
@jwt_required()
def get_memory(memory_id):
    """
    Endpoint para obter uma memória específica
    
    Headers:
        Authorization: Bearer <token>
        
    Path Parameters:
        memory_id (int): ID da memória
        
    Returns:
        JSON: Dados da memória
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        memory = memory_repo.get_user_memory(memory_id, user_id)
        
        if not memory:
            return jsonify({'error': 'Memória não encontrada'}), 404
        
        return jsonify({
            'memory': memory.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@memory_bp.route('/<int:memory_id>', methods=['PUT'])
@jwt_required()
def update_memory(memory_id):
    """
    Endpoint para atualizar uma memória
    
    Headers:
        Authorization: Bearer <token>
        
    Path Parameters:
        memory_id (int): ID da memória
        
    Body:
        Campos a serem atualizados (mesmos do POST)
        
    Returns:
        JSON: Dados da memória atualizada
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados para atualização são obrigatórios'}), 400
        
        # Compatibilidade: mesclar vídeos (se enviados) com fotos antes de atualizar
        if 'videos' in data:
            photos = data.get('photos') or []
            videos = data.get('videos') or []
            if isinstance(videos, list) and len(videos) > 0:
                data['photos'] = list(photos) + list(videos)
            data.pop('videos', None)

        if data.get('music') is not None:
            ok, err = validate_music(data.get('music'))
            if not ok:
                return jsonify({'error': err}), 400
        # Atualizar memória
        memory = memory_repo.update_memory(memory_id, user_id, **data)
        
        if not memory:
            return jsonify({'error': 'Memória não encontrada'}), 404
        
        return jsonify({
            'message': 'Memória atualizada com sucesso',
            'memory': memory.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@memory_bp.route('/<int:memory_id>', methods=['DELETE'])
@jwt_required()
def delete_memory(memory_id):
    """
    Endpoint para deletar uma memória
    
    Headers:
        Authorization: Bearer <token>
        
    Path Parameters:
        memory_id (int): ID da memória
        
    Returns:
        JSON: Confirmação de exclusão
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        
        if memory_repo.delete_memory(memory_id, user_id):
            return jsonify({
                'message': 'Memória deletada com sucesso'
            }), 200
        else:
            return jsonify({'error': 'Memória não encontrada'}), 404
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@memory_bp.route('/nearby', methods=['GET'])
@jwt_required()
def get_nearby_memories():
    """
    Endpoint para buscar memórias próximas a uma localização
    
    Headers:
        Authorization: Bearer <token>
        
    Query Parameters:
        lat (float): Latitude central
        lng (float): Longitude central
        radius (float, optional): Raio de busca (padrão: 0.01)
        
    Returns:
        JSON: Lista de memórias próximas
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', type=float, default=0.01)
        
        if lat is None or lng is None:
            return jsonify({'error': 'Latitude e longitude são obrigatórias'}), 400
        
        memories = memory_repo.get_memories_by_location(user_id, lat, lng, radius)
        memories_data = [memory.to_dict() for memory in memories]
        
        return jsonify({
            'memories': memories_data,
            'total': len(memories_data)
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@memory_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_memory_stats():
    """
    Endpoint para obter estatísticas das memórias do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Estatísticas das memórias
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        total_memories = memory_repo.count_user_memories(user_id)
        
        return jsonify({
            'total_memories': total_memories
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500
