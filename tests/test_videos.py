"""
Testes de upload de vídeos na memória:
- Upload de vídeo válido (<= 30s)
- Bloqueio de vídeo maior que 30s
- Exclusão de vídeo anexado à memória (via edição)
"""
import io
import pytest


def test_video_upload_valid(monkeypatch, client):
    # Cenário: upload de um vídeo válido com duração <= 30s
    print("Testando: Upload de vídeo válido (<= 30s)")

    # Mock da validação de duração para retornar 10s
    from src.controllers import media_controller as mc
    monkeypatch.setattr(mc, "validate_video_duration", lambda path, max_seconds=30: 10.0)

    # Mocks de filesystem para não tocar no disco
    import os
    monkeypatch.setattr(os, "makedirs", lambda *args, **kwargs: None)
    monkeypatch.setattr(os, "replace", lambda *args, **kwargs: None)

    # FileStorage.save será chamado; usamos um BytesIO e mock de save como no-op
    from werkzeug.datastructures import FileStorage
    original_save = FileStorage.save
    monkeypatch.setattr(FileStorage, "save", lambda self, dst: None)

    # Faz o upload via endpoint com arquivo .mp4
    data = {
        "file": (io.BytesIO(b"fake-video-bytes"), "video.mp4")
    }
    res = client.post("/api/media/upload", data=data)
    print("Resposta upload válido:", res.status_code, res.get_json())
    assert res.status_code == 200
    body = res.get_json()
    assert body["media_type"] == "video"
    assert body["path"].endswith("/static/uploads/videos/video.mp4")


def test_video_upload_block_over_30s(monkeypatch, client):
    # Cenário: upload bloqueado para vídeo > 30s
    print("Testando: Bloqueio de vídeo maior que 30s")

    # Mock da validação para levantar ValueError (duração inválida)
    from src.controllers import media_controller as mc
    def fake_validator(path, max_seconds=30):
        raise ValueError("Vídeo deve ter no máximo 30 segundos")
    monkeypatch.setattr(mc, "validate_video_duration", fake_validator)

    # Mock de remoção do arquivo temporário
    import os
    monkeypatch.setattr(os, "remove", lambda *args, **kwargs: None)

    data = {
        "file": (io.BytesIO(b"fake-large-video-bytes"), "video_grande.mp4")
    }
    res = client.post("/api/media/upload", data=data)
    print("Resposta upload bloqueado:", res.status_code, res.get_json())
    assert res.status_code == 400
    body = res.get_json()
    assert body.get("error") == "Vídeo deve ter no máximo 30 segundos"


def test_delete_video_from_memory(monkeypatch, client, create_test_user):
    # Cenário: excluir vídeo anexado à memória (via atualização da memória)
    print("Testando: Exclusão de vídeo anexado à memória")
    _, _, token = create_test_user(client)

    # Criamos memória com um vídeo anexado (via campo 'videos');
    # O backend mescla 'videos' dentro de 'photos' para compatibilidade
    create_res = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Mem com vídeo",
            "date": "2024-01-10",
            "lat": 1,
            "lng": 1,
            "videos": ["/static/uploads/videos/video.mp4"],
        },
    )
    assert create_res.status_code == 201
    mem_id = create_res.get_json()["memory"]["id"]

    # Atualizamos removendo mídias (photos vazio); backend tratará como remoção
    update_res = client.put(
        f"/api/memories/{mem_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"photos": []},
    )
    assert update_res.status_code == 200

    # Verificamos que não há mais mídias associadas
    get_res = client.get(
        f"/api/memories/{mem_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert get_res.status_code == 200
    mem = get_res.get_json()["memory"]
    # Após remoção, esperamos photos ausente ou vazio; videos não é preenchido por URL simples
    assert mem.get("photos") in (None, [])
