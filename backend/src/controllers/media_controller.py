import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from src.utils.validators import validate_video_duration

media_bp = Blueprint('media', __name__)

VIDEO_EXTENSIONS = {'mp4', 'mov', 'avi', 'webm', 'mkv', 'm4v'}
PHOTO_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

@media_bp.route('/upload', methods=['POST'])
def upload_media():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        file = request.files['file']
        filename = secure_filename(file.filename or '')
        if filename == '' or '.' not in filename:
            return jsonify({'error': 'Nome de arquivo inválido'}), 400
        ext = filename.rsplit('.', 1)[1].lower()

        base_upload = os.path.join(current_app.static_folder, 'uploads')
        folder = 'videos' if ext in VIDEO_EXTENSIONS else ('photos' if ext in PHOTO_EXTENSIONS else None)
        if folder is None:
            return jsonify({'error': 'Tipo de arquivo não suportado'}), 400

        # Salvar temporariamente
        tmp_dir = os.path.join(current_app.instance_path, 'tmp')
        os.makedirs(tmp_dir, exist_ok=True)
        tmp_path = os.path.join(tmp_dir, filename)
        file.save(tmp_path)

        # Validar vídeo se necessário
        if folder == 'videos':
            try:
                validate_video_duration(tmp_path, 30)
            except ValueError as ve:
                try:
                    os.remove(tmp_path)
                except Exception:
                    pass
                return jsonify({'error': 'Vídeo deve ter no máximo 30 segundos', 'detail': str(ve)}), 400

        # Mover para pasta final
        final_dir = os.path.join(base_upload, folder)
        os.makedirs(final_dir, exist_ok=True)
        final_path = os.path.join(final_dir, filename)
        try:
            os.replace(tmp_path, final_path)
        except Exception:
            # fallback: copiar e remover
            import shutil
            shutil.copy2(tmp_path, final_path)
            os.remove(tmp_path)

        rel_path = f"/static/uploads/{folder}/{filename}"
        return jsonify({'path': rel_path, 'media_type': 'video' if folder=='videos' else 'photo'}), 200
    except Exception as e:
        return jsonify({'error': 'Falha ao enviar mídia', 'detail': str(e)}), 500

