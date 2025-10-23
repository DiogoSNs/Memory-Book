# ============================================
# CONTROLLER - Authentication
# Controller para autenticação de usuários
# ============================================

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.repositories.user_repository import UserRepository
from src.repositories.theme_repository import ThemeRepository

# Blueprint para rotas de autenticação
auth_bp = Blueprint('auth', __name__)

# Instâncias dos repositórios
user_repo = UserRepository()
theme_repo = ThemeRepository()

@auth_bp.route('/register', methods=['POST'])
def register():
    """
    Endpoint para registro de usuário
    
    Body:
        name (str): Nome do usuário
        email (str): Email do usuário
        password (str): Senha do usuário
        
    Returns:
        JSON: Dados do usuário criado e token de acesso
    """
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data or not all(k in data for k in ('name', 'email', 'password')):
            return jsonify({'error': 'Nome, email e senha são obrigatórios'}), 400
        
        name = data['name']
        email = data['email']
        password = data['password']
        
        # Validações básicas
        if len(name) < 2:
            return jsonify({'error': 'Nome deve ter pelo menos 2 caracteres'}), 400
        
        if len(password) < 6:
            return jsonify({'error': 'Senha deve ter pelo menos 6 caracteres'}), 400
        
        # Verificar se o email já existe
        if user_repo.get_by_email(email):
            return jsonify({'error': 'Email já está em uso'}), 400
        
        # Criar usuário
        user = user_repo.create(name=name, email=email, password=password)
        
        # Criar tema padrão para o usuário
        theme_repo.get_or_create_default_theme(user.id)
        
        # Gerar token de acesso
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Usuário criado com sucesso',
            'user': user.to_dict(),
            'access_token': access_token
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """
    Endpoint para login de usuário
    
    Body:
        email (str): Email do usuário
        password (str): Senha do usuário
        
    Returns:
        JSON: Dados do usuário e token de acesso
    """
    try:
        data = request.get_json()
        
        # Validar dados obrigatórios
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Email e senha são obrigatórios'}), 400
        
        email = data['email']
        password = data['password']
        
        # Autenticar usuário
        user = user_repo.authenticate(email, password)
        
        if not user:
            return jsonify({'error': 'Credenciais inválidas'}), 401
        
        # Gerar token de acesso
        access_token = create_access_token(identity=str(user.id))
        
        return jsonify({
            'message': 'Login realizado com sucesso',
            'user': user.to_dict(),
            'access_token': access_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """
    Endpoint para obter dados do usuário atual
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Dados do usuário atual
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        user = user_repo.get_by_id(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({
            'user': user.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required()
def refresh_token():
    """
    Endpoint para renovar token de acesso
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Novo token de acesso
    """
    try:
        user_id = int(get_jwt_identity())  # Converter string de volta para int
        user = user_repo.get_by_id(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        # Gerar novo token
        new_token = create_access_token(identity=str(user.id))  # Converter para string
        
        return jsonify({
            'access_token': new_token
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500