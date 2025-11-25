# ============================================
# CONTROLLER - Spotify (Mock)
# Endpoint mock para busca de músicas por nome
# ============================================

from flask import Blueprint, request, jsonify, current_app
import unicodedata
import time
import base64
import json
from urllib import request as urlrequest
from urllib import parse as urlparse

spotify_bp = Blueprint('spotify', __name__)

def _normalize(text: str) -> str:
    return ''.join(
        c for c in unicodedata.normalize('NFD', (text or '').lower().strip())
        if unicodedata.category(c) != 'Mn'
    )

@spotify_bp.route('/search', methods=['GET'])
def search_tracks():
    try:
        query_raw = request.args.get('q') or ''
        query = _normalize(query_raw)
        if not query or len(query) < 2:
            return jsonify({'results': []}), 200

        client_id = current_app.config.get('SPOTIFY_CLIENT_ID')
        client_secret = current_app.config.get('SPOTIFY_CLIENT_SECRET')

        limit_arg = request.args.get('limit')
        try:
            limit = max(1, min(50, int(limit_arg))) if limit_arg else 10
        except Exception:
            limit = 10

        if client_id and client_secret:
            results = _search_spotify_api(query_raw, limit)
            return jsonify({'results': results}), 200
        else:
            catalog = [
                {'title': 'Imagine', 'artist': 'John Lennon', 'spotify_id': '3HfB5dLgKcQoXH7O2s7ZKf'},
                {'title': 'Bohemian Rhapsody', 'artist': 'Queen', 'spotify_id': '1AhDOtG9vPSomsx4M8R6rw'},
                {'title': 'Shape of You', 'artist': 'Ed Sheeran', 'spotify_id': '7qiZfU4dY1lWllzX7mPBI3'},
                {'title': 'Evidências', 'artist': 'Chitãozinho & Xororó', 'spotify_id': '0evsf1evidencias'},
                {'title': 'Garota de Ipanema', 'artist': 'Tom Jobim', 'spotify_id': '0garotaipanema'},
                {'title': 'Tempo Perdido', 'artist': 'Legião Urbana', 'spotify_id': '0tempoperdido'},
                {'title': 'Ai Se Eu Te Pego', 'artist': 'Michel Teló', 'spotify_id': '0aiseeu'},
                {'title': 'Despacito', 'artist': 'Luis Fonsi', 'spotify_id': '0despacito'},
                {'title': 'Havana', 'artist': 'Camila Cabello', 'spotify_id': '0havana'},
                {'title': 'Blinding Lights', 'artist': 'The Weeknd', 'spotify_id': '0blinding'},
                {'title': 'Perfect', 'artist': 'Ed Sheeran', 'spotify_id': '0perfect'},
                {'title': 'Someone Like You', 'artist': 'Adele', 'spotify_id': '0someone'},
                {'title': 'Thinking Out Loud', 'artist': 'Ed Sheeran', 'spotify_id': '0thinking'},
                {'title': 'Billie Jean', 'artist': 'Michael Jackson', 'spotify_id': '0billiejean'},
                {'title': 'Hotel California', 'artist': 'Eagles', 'spotify_id': '0hotelcalifornia'},
            ]
            qn = query
            filtered = [
                item for item in catalog
                if qn in _normalize(item['title']) or qn in _normalize(item['artist'])
            ]
            if not filtered:
                filtered = catalog[: min(10, limit)]
            results = [
                {
                    'id': item['spotify_id'],
                    'name': item['title'],
                    'artists': item['artist'],
                    'album_image': None,
                    'external_url': f"https://open.spotify.com/track/{item['spotify_id']}"
                }
                for item in filtered
            ]
            return jsonify({'results': results}), 200
    except Exception:
        return jsonify({'results': []}), 200

# Token cache simples em memória
_SPOTIFY_TOKEN = None
_SPOTIFY_TOKEN_EXPIRES_AT = 0

def _get_spotify_token() -> str | None:
    global _SPOTIFY_TOKEN, _SPOTIFY_TOKEN_EXPIRES_AT
    now = time.time()
    if _SPOTIFY_TOKEN and now < _SPOTIFY_TOKEN_EXPIRES_AT - 60:
        return _SPOTIFY_TOKEN

    client_id = current_app.config.get('SPOTIFY_CLIENT_ID')
    client_secret = current_app.config.get('SPOTIFY_CLIENT_SECRET')
    if not client_id or not client_secret:
        return None

    token_url = 'https://accounts.spotify.com/api/token'
    data = urlparse.urlencode({'grant_type': 'client_credentials'}).encode('utf-8')
    basic = base64.b64encode(f'{client_id}:{client_secret}'.encode('utf-8')).decode('utf-8')
    req = urlrequest.Request(token_url, data=data, method='POST')
    req.add_header('Authorization', f'Basic {basic}')
    req.add_header('Content-Type', 'application/x-www-form-urlencoded')

    try:
        with urlrequest.urlopen(req, timeout=10) as resp:
            payload = json.loads(resp.read().decode('utf-8'))
            access_token = payload.get('access_token')
            expires_in = payload.get('expires_in', 3600)
            if access_token:
                _SPOTIFY_TOKEN = access_token
                _SPOTIFY_TOKEN_EXPIRES_AT = now + int(expires_in)
                return access_token
    except Exception:
        return None

    return None

def _search_spotify_api(query: str, limit: int = 10) -> list[dict]:
    token = _get_spotify_token()
    if not token:
        return []

    params = urlparse.urlencode({
        'q': query,
        'type': 'track',
        'limit': int(limit),
        'market': 'BR'
    })
    url = f'https://api.spotify.com/v1/search?{params}'
    req = urlrequest.Request(url, method='GET')
    req.add_header('Authorization', f'Bearer {token}')

    try:
        with urlrequest.urlopen(req, timeout=10) as resp:
            payload = json.loads(resp.read().decode('utf-8'))
            items = (payload.get('tracks') or {}).get('items') or []
            results = []
            for t in items:
                artists = ', '.join([a.get('name') for a in t.get('artists', []) if a.get('name')])
                images = (t.get('album') or {}).get('images') or []
                album_image = images[0]['url'] if images else None
                external_url = ((t.get('external_urls') or {}).get('spotify')) or None
                results.append({
                    'id': t.get('id'),
                    'name': t.get('name'),
                    'artists': artists,
                    'album_image': album_image,
                    'external_url': external_url,
                })
            return results
    except Exception:
        return []

    return []
