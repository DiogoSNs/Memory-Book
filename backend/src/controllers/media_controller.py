# Controller responsável por upload e gestão básica de mídias (fotos e vídeos)
# Fluxo geral do /upload:
# 1) Recebe arquivo multipart e valida nome/extensão
# 2) Salva temporariamente em pasta interna
# 3) Para vídeos, valida duração (máx. 30s)
# 4) Move para destino final (global ou por usuário/memória)
# 5) Retorna caminho público e metadados simples
import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from src.utils.validators import validate_video_duration
from src.utils.helpers import sanitize_filename, generate_unique_filename
from src.utils.media_manager import build_memory_dirs, make_file_url
import logging

media_bp = Blueprint('media', __name__)
logger = logging.getLogger(__name__)

# Conjuntos de extensões suportadas para roteamento de mídia
VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v'}
PHOTO_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

@media_bp.route('/upload', methods=['POST'])
def upload_media():
    try:
        # Validação inicial: garantir que um campo 'file' foi enviado
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        file = request.files['file']
        # Normalizar e higienizar o nome do arquivo (evita caracteres perigosos)
        original_filename = secure_filename(file.filename or '')
        if original_filename == '' or '.' not in original_filename:
            return jsonify({'error': 'Nome de arquivo inválido'}), 400
        safe_name = secure_filename(sanitize_filename(original_filename))
        filename = safe_name
        ext = filename.rsplit('.', 1)[1].lower()

        # Selecionar diretório base e tipo de mídia (vídeo/foto) conforme extensão
        base_upload = os.path.join(current_app.static_folder, 'uploads')
        folder = 'videos' if ext in VIDEO_EXTENSIONS else ('photos' if ext in PHOTO_EXTENSIONS else None)
        if folder is None:
            return jsonify({'error': 'Tipo de arquivo não suportado'}), 400

        # Salvar arquivo temporariamente para permitir validações e movimentação segura
        tmp_dir = os.path.join(current_app.instance_path, 'tmp')
        os.makedirs(tmp_dir, exist_ok=True)
        tmp_path = os.path.join(tmp_dir, filename)
        file.save(tmp_path)

        # Caso seja vídeo, validar duração máxima (30s) usando MoviePy
        if folder == 'videos':
            try:
                validate_video_duration(tmp_path, 30)
            except ValueError as ve:
                try:
                    os.remove(tmp_path)
                except Exception:
                    pass
                return jsonify({'error': 'Vídeo deve ter no máximo 30 segundos', 'detail': str(ve)}), 400

        # Definir pasta final: global (uploads/photos|videos) ou por usuário/memória
        user_id_arg = request.args.get('user_id', type=int)
        memory_id_arg = request.args.get('memory_id', type=int)
        if user_id_arg and memory_id_arg:
            # Estrutura por memória: .../uploads/users/<user>/memories/<id>/(photos|videos)
            _, photos_dir, videos_dir = build_memory_dirs(user_id_arg, memory_id_arg)
            target_dir = videos_dir if folder == 'videos' else photos_dir
        else:
            # Estrutura global: .../static/uploads/(photos|videos)
            final_dir = os.path.join(base_upload, folder)
            os.makedirs(final_dir, exist_ok=True)
            target_dir = final_dir
        final_path = os.path.join(target_dir, filename)
        try:
            # Move atômico (substitui se existir); reduz chance de inconsistência
            os.replace(tmp_path, final_path)
        except Exception:
            # Fallback: copiar e remover arquivo temporário
            import shutil
            shutil.copy2(tmp_path, final_path)
            os.remove(tmp_path)

        # Montar caminho público (relativo a /static) e opcional URL semântica por memória
        rel_path = f"/static/uploads/{folder}/{filename}"
        api_url = None
        if user_id_arg and memory_id_arg:
            api_url = make_file_url(user_id_arg, memory_id_arg, 'video' if folder=='videos' else 'photo', filename)
        # Log leve para auditoria de upload
        logger.info('media_upload', extra={'filename': filename, 'ext': ext, 'folder': folder, 'user_id': user_id_arg, 'memory_id': memory_id_arg})
        # Resposta padronizada com tipo de mídia e caminho público
        return jsonify({'path': rel_path, 'file_url': api_url, 'media_type': 'video' if folder=='videos' else 'photo'}), 200
    except Exception as e:
        # Erro genérico: retorna detalhe para facilitar diagnóstico em ambiente de desenvolvimento
        return jsonify({'error': 'Falha ao enviar mídia', 'detail': str(e)}), 500

