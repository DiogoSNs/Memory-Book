# ============================================
# CONTROLLER - Theme
# Controller para operações com temas
# ============================================

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from src.repositories.theme_repository import ThemeRepository

# Blueprint para rotas de temas
theme_bp = Blueprint('themes', __name__)

# Instância do repositório
theme_repo = ThemeRepository()

@theme_bp.route('', methods=['GET'])
@jwt_required()
def get_user_theme():
    """
    Endpoint para obter o tema atual do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Dados do tema do usuário
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        theme = theme_repo.get_or_create_default_theme(user_id)
        
        return jsonify({
            'theme': theme.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@theme_bp.route('', methods=['POST'])
@jwt_required()
def create_or_update_theme():
    """
    Endpoint para criar ou atualizar o tema do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Body:
        gradientName (str): Nome do gradiente
        gradientCss (str): CSS do gradiente
        isActive (bool, optional): Se o tema está ativo (padrão: true)
        
    Returns:
        JSON: Dados do tema criado/atualizado
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data or not all(k in data for k in ('gradientName', 'gradientCss')):
            return jsonify({'error': 'Nome e CSS do gradiente são obrigatórios'}), 400
        
        # Converter camelCase para snake_case
        gradient_name = data['gradientName']
        gradient_css = data['gradientCss']
        is_active = data.get('isActive', True)
        
        # Criar ou atualizar tema
        theme = theme_repo.create_or_update_theme(
            user_id=user_id,
            gradient_name=gradient_name,
            gradient_css=gradient_css,
            is_active=is_active
        )
        
        return jsonify({
            'message': 'Tema salvo com sucesso',
            'theme': theme.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@theme_bp.route('', methods=['PUT'])
@jwt_required()
def update_theme():
    """
    Endpoint para atualizar o tema existente do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Body:
        gradientName (str, optional): Nome do gradiente
        gradientCss (str, optional): CSS do gradiente
        isActive (bool, optional): Se o tema está ativo
        
    Returns:
        JSON: Dados do tema atualizado
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Dados para atualização são obrigatórios'}), 400
        
        # Obter tema existente
        theme = theme_repo.get_by_user(user_id)
        
        if not theme:
            return jsonify({'error': 'Tema não encontrado'}), 404
        
        # Preparar dados para atualização
        update_data = {}
        if 'gradientName' in data:
            update_data['gradient_name'] = data['gradientName']
        if 'gradientCss' in data:
            update_data['gradient_css'] = data['gradientCss']
        if 'isActive' in data:
            update_data['is_active'] = data['isActive']
        
        updated_theme = theme_repo.update(theme, **update_data)
        
        return jsonify({
            'message': 'Tema atualizado com sucesso',
            'theme': updated_theme.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@theme_bp.route('/reset', methods=['POST'])
@jwt_required()
def reset_theme():
    """
    Endpoint para resetar o tema para o padrão
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Dados do tema resetado
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        theme = theme_repo.reset_to_default(user_id)
        
        return jsonify({
            'message': 'Tema resetado para o padrão',
            'theme': theme.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@theme_bp.route('/activate', methods=['POST'])
@jwt_required()
def activate_theme():
    """
    Endpoint para ativar o tema do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Confirmação de ativação
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        theme = theme_repo.activate_theme(user_id)
        
        if not theme:
            return jsonify({'error': 'Tema não encontrado'}), 404
        
        return jsonify({
            'message': 'Tema ativado com sucesso',
            'theme': theme.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@theme_bp.route('/deactivate', methods=['POST'])
@jwt_required()
def deactivate_theme():
    """
    Endpoint para desativar o tema do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Confirmação de desativação
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        theme = theme_repo.deactivate_theme(user_id)
        
        if not theme:
            return jsonify({'error': 'Tema não encontrado'}), 404
        
        return jsonify({
            'message': 'Tema desativado com sucesso',
            'theme': theme.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@theme_bp.route('/presets', methods=['GET'])
def get_theme_presets():
    """
    Endpoint para obter temas pré-definidos
    
    Returns:
        JSON: Lista de temas pré-definidos
    """
    try:
        # Temas pré-definidos disponíveis
        presets = [
            {
                'name': 'Sunset',
                'gradientName': 'Sunset',
                'gradientCss': 'linear-gradient(135deg, #ff7e5f, #feb47b)'
            },
            {
                'name': 'Ocean',
                'gradientName': 'Ocean',
                'gradientCss': 'linear-gradient(135deg, #667eea, #764ba2)'
            },
            {
                'name': 'Forest',
                'gradientName': 'Forest',
                'gradientCss': 'linear-gradient(135deg, #11998e, #38ef7d)'
            },
            {
                'name': 'Purple Dream',
                'gradientName': 'Purple Dream',
                'gradientCss': 'linear-gradient(135deg, #667eea, #764ba2)'
            },
            {
                'name': 'Pink Bliss',
                'gradientName': 'Pink Bliss',
                'gradientCss': 'linear-gradient(135deg, #ff9a9e, #fecfef)'
            },
            {
                'name': 'Golden Hour',
                'gradientName': 'Golden Hour',
                'gradientCss': 'linear-gradient(135deg, #ffecd2, #fcb69f)'
            },
            {
                'name': 'Cool Blue',
                'gradientName': 'Cool Blue',
                'gradientCss': 'linear-gradient(135deg, #a8edea, #fed6e3)'
            },
            {
                'name': 'Warm Sunset',
                'gradientName': 'Warm Sunset',
                'gradientCss': 'linear-gradient(135deg, #ff9a56, #ff6b6b)'
            }
        ]
        
        return jsonify({
            'presets': presets
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500
