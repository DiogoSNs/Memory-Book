# ============================================
# CONTROLLER - Spotify (Mock)
# Endpoint mock para busca de músicas por nome
# ============================================

from flask import Blueprint, request, jsonify, current_app
import unicodedata
import json
import logging
from urllib import parse as urlparse
from src.utils.spotify_client import SpotifyClient

spotify_bp = Blueprint('spotify', __name__)
logger = logging.getLogger(__name__)
_client: SpotifyClient | None = None

def _get_client() -> SpotifyClient | None:
    global _client
    if _client:
        return _client
    client_id = current_app.config.get('SPOTIFY_CLIENT_ID')
    client_secret = current_app.config.get('SPOTIFY_CLIENT_SECRET')
    _client = SpotifyClient(client_id, client_secret)
    return _client

def _search_spotify_api(query: str, limit: int = 10) -> list[dict]:
    client = _get_client()
    if not client:
        return []
    try:
        return client.search_tracks(query, limit)
    except Exception as e:
        logger.error('spotify_search_error', extra={'error': str(e)})
        return []

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
            try:
                results = _search_spotify_api(query_raw, limit)
            except Exception as e:
                logger.error('spotify_search_error', extra={'error': str(e)})
                results = []
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

"""
Spotify API logic moved to src.utils.spotify_client.SpotifyClient
"""
