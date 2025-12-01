import os
import base64
import re
from typing import Tuple
from flask import current_app
from werkzeug.utils import secure_filename
from src.utils.helpers import sanitize_filename, generate_unique_filename

def build_memory_dirs(user_id: int, memory_id: int) -> Tuple[str, str, str]:
    root = current_app.instance_path
    base_dir = os.path.join(root, 'uploads', f'user_{user_id}', f'memory_{memory_id}')
    photos_dir = os.path.join(base_dir, 'photos')
    videos_dir = os.path.join(base_dir, 'videos')
    os.makedirs(photos_dir, exist_ok=True)
    os.makedirs(videos_dir, exist_ok=True)
    return base_dir, photos_dir, videos_dir

def data_url_to_file(data_url: str, dest_dir: str, prefix: str = 'media') -> str:
    m = re.match(r'^data:(.+?);base64,(.*)$', data_url)
    if not m:
        raise ValueError('Data URL inválida')
    mime = m.group(1)
    b64 = m.group(2)
    ext = 'bin'
    if '/' in mime:
        ext = mime.split('/')[-1].lower()
        if ext == 'jpeg':
            ext = 'jpg'
    raw = base64.b64decode(b64)
    name = generate_unique_filename(f'{prefix}.{ext}')
    path = os.path.join(dest_dir, secure_filename(sanitize_filename(name)))
    with open(path, 'wb') as f:
        f.write(raw)
    return os.path.basename(path)

def make_file_url(user_id: int, memory_id: int, media_type: str, filename: str) -> str:
    media_type = 'photos' if media_type == 'photo' else ('videos' if media_type == 'video' else media_type)
    return f"/api/media/user_{user_id}/memory_{memory_id}/{media_type}/{filename}"

# validação de vídeo consolidada em src.utils.validators

