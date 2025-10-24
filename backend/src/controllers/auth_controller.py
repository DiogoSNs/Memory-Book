# ============================================
# CONTROLLER - auth_controller.py
# Controller para autenticação e autorização de usuários
# ============================================

"""
Controller de autenticação para gerenciar registro, login e autorização.

Responsabilidades:
- Gerenciar endpoints de registro e login de usuários
- Validar dados de entrada (nome, email, senha)
- Criar e gerenciar tokens JWT para autenticação
- Integrar com repositórios para persistência de dados
- Criar tema padrão para novos usuários
- Tratar erros de autenticação e validação
- Fornecer respostas padronizadas da API

Dependências:
- flask: Framework web e utilitários (Blueprint, request, jsonify)
- flask_jwt_extended: Gerenciamento de tokens JWT
- src.repositories.user_repository: Operações de dados de usuários
- src.repositories.theme_repository: Operações de dados de temas

Padrões de Projeto:
- MVC Pattern: Controller na arquitetura Model-View-Controller
- Repository Pattern: Usa repositórios para acesso a dados
- Blueprint Pattern: Organização modular de rotas Flask
- Facade Pattern: Interface simplificada para operações complexas
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from src.repositories.user_repository import UserRepository
from src.repositories.theme_repository import ThemeRepository

# Blueprint para rotas de autenticação (Blueprint Pattern)
auth_bp = Blueprint('auth', __name__)

# Instâncias dos repositórios (Repository Pattern)
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
            return jsonify({
                'message': 'Nome deve ter pelo menos 2 caracteres',
                'error_type': 'invalid_name',
                'suggestion': 'Digite um nome com pelo menos 2 caracteres'
            }), 400
        
        if len(password) < 6:
            return jsonify({
                'message': 'Senha deve ter pelo menos 6 caracteres',
                'error_type': 'invalid_password',
                'suggestion': 'Digite uma senha com pelo menos 6 caracteres'
            }), 400
        
        # Verificar se o email já existe
        if user_repo.get_by_email(email):
            return jsonify({
                'message': 'Email já está em uso',
                'error_type': 'email_already_exists',
                'suggestion': 'Tente fazer login ou use outro email'
            }), 400
        
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

@auth_bp.route('/preferences', methods=['GET'])
@jwt_required()
def get_user_preferences():
    """
    Endpoint para obter preferências do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Returns:
        JSON: Preferências de tema/gradiente do usuário
    """
    try:
        user_id = int(get_jwt_identity())
        user = user_repo.get_by_id(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        return jsonify({
            'preferences': {
                'selected_gradient': user.selected_gradient,
                'theme_preference': user.theme_preference,
                'map_theme': user.map_theme
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500

@auth_bp.route('/preferences', methods=['PUT'])
@jwt_required()
def update_user_preferences():
    """
    Endpoint para atualizar preferências do usuário
    
    Headers:
        Authorization: Bearer <token>
        
    Body:
        selected_gradient (str, optional): Gradiente selecionado (aurora, sunset, ocean, forest, cosmic)
        theme_preference (str, optional): Preferência de tema (light, dark, auto)
        map_theme (str, optional): Tema do mapa (light, dark, satellite)
        
    Returns:
        JSON: Preferências atualizadas
    """
    try:
        user_id = int(get_jwt_identity())
        user = user_repo.get_by_id(user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': 'Usuário não encontrado'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'Dados não fornecidos'}), 400
        
        # Validar gradiente se fornecido
        valid_gradients = ['aurora', 'sunset', 'ocean', 'forest', 'cosmic']
        if 'selected_gradient' in data:
            if data['selected_gradient'] not in valid_gradients:
                return jsonify({'error': f'Gradiente inválido. Opções: {", ".join(valid_gradients)}'}), 400
            user.selected_gradient = data['selected_gradient']
        
        # Validar tema se fornecido
        valid_themes = ['light', 'dark', 'auto']
        if 'theme_preference' in data:
            if data['theme_preference'] not in valid_themes:
                return jsonify({'error': f'Tema inválido. Opções: {", ".join(valid_themes)}'}), 400
            user.theme_preference = data['theme_preference']
        
        # Validar map_theme se fornecido
        valid_map_themes = ['light', 'dark', 'satellite']
        if 'map_theme' in data:
            if data['map_theme'] not in valid_map_themes:
                return jsonify({'error': f'Tema do mapa inválido. Opções: {", ".join(valid_map_themes)}'}), 400
            user.map_theme = data['map_theme']
        
        # Salvar alterações
        user_repo.update(user, 
            selected_gradient=user.selected_gradient,
            theme_preference=user.theme_preference,
            map_theme=user.map_theme
        )
        
        return jsonify({
            'message': 'Preferências atualizadas com sucesso',
            'preferences': {
                'selected_gradient': user.selected_gradient,
                'theme_preference': user.theme_preference,
                'map_theme': user.map_theme
            }
        }), 200
        
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
        
        # Autenticar usuário com detalhes
        user, auth_result = user_repo.authenticate_with_details(email, password)
        
        if not user:
            if auth_result == "user_not_found":
                return jsonify({
                    'message': 'Opa! não encontramos uma conta com esse e-mail.',
                    'suggestion': 'Verifique se o email está correto ou crie uma nova conta.',
                    'error_type': 'user_not_found'
                }), 401
            elif auth_result == "invalid_password":
                return jsonify({
                    'message': 'Ops! Parece que sua senha está errada.',
                    'suggestion': 'Verifique sua senha ou crie uma nova conta se ainda não possui uma.',
                    'error_type': 'invalid_password'
                }), 401
            elif auth_result == "user_inactive":
                return jsonify({
                    'message': 'Conta inativa',
                    'suggestion': 'Entre em contato com o suporte para reativar sua conta.',
                    'error_type': 'user_inactive'
                }), 401
            else:
                return jsonify({
                    'message': 'Email ou senha incorretos',
                    'suggestion': 'Verifique suas credenciais ou crie uma conta se ainda não possui uma.',
                    'error_type': 'unknown'
                }), 401
        
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

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """
    Endpoint para logout do usuário
    """
    try:
        # Como estamos usando JWT stateless, o logout é apenas uma confirmação
        # O token será removido no frontend
        return jsonify({'message': 'Logout realizado com sucesso'}), 200
        
    except Exception as e:
        return jsonify({'error': 'Erro interno do servidor'}), 500