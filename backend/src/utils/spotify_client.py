import time
import requests
from typing import List, Dict, Optional

class SpotifyClient:
    def __init__(self, client_id: Optional[str], client_secret: Optional[str]):
        self.client_id = client_id
        self.client_secret = client_secret
        self._token: Optional[str] = None
        self._expires_at: float = 0.0
        self._session = requests.Session()

    def _get_token(self) -> Optional[str]:
        now = time.time()
        if self._token and now < self._expires_at - 60:
            return self._token
        if not self.client_id or not self.client_secret:
            return None
        try:
            resp = self._session.post(
                "https://accounts.spotify.com/api/token",
                data={"grant_type": "client_credentials"},
                auth=(self.client_id, self.client_secret),
                timeout=10,
            )
            resp.raise_for_status()
            payload = resp.json()
            access_token = payload.get("access_token")
            expires_in = int(payload.get("expires_in", 3600))
            if access_token:
                self._token = access_token
                self._expires_at = now + expires_in
                return access_token
            return None
        except requests.RequestException:
            return None

    def search_tracks(self, query: str, limit: int = 10, market: str = "BR") -> List[Dict]:
        token = self._get_token()
        if not token:
            return []
        try:
            resp = self._session.get(
                "https://api.spotify.com/v1/search",
                params={
                    "q": query,
                    "type": "track",
                    "limit": int(limit),
                    "market": market,
                },
                headers={"Authorization": f"Bearer {token}"},
                timeout=10,
            )
            resp.raise_for_status()
            payload = resp.json()
            items = (payload.get("tracks") or {}).get("items") or []
            results: List[Dict] = []
            for t in items:
                artists = ", ".join([a.get("name") for a in t.get("artists", []) if a.get("name")])
                images = (t.get("album") or {}).get("images") or []
                album_image = images[0]["url"] if images else None
                external_url = (t.get("external_urls") or {}).get("spotify")
                results.append(
                    {
                        "id": t.get("id"),
                        "name": t.get("name"),
                        "artists": artists,
                        "album_image": album_image,
                        "external_url": external_url,
                    }
                )
            return results
        except requests.RequestException:
            return []

