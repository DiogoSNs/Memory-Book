"""
Testes de integração do Spotify:
- Função de acesso está funcionando (mock) e retorna estrutura mínima
- Busca por música via endpoint /api/spotify/search
- Tratamento da resposta da API (estrutura esperada)
- Armazenamento do link da música ao criar memória
- Atualização da música na memória via nova seleção (mock)
- Validação de entradas inválidas (nome vazio)
"""

import pytest


def test_spotify_api_functioning(monkeypatch, client):
    # Cenário: validar estrutura mínima retornada pela função de acesso ao Spotify (mockada)
    print("Testando: Spotify (função de acesso está funcionando - mock)")

    # Mockamos a função interna que buscaria na API real, garantindo que não há chamadas externas
    from src.controllers import spotify_controller as sc

    def fake_search_api(query, limit=10):
        return [
            {
                "id": "api_ok_1",
                "name": "Song OK",
                "artists": "Artist A, Artist B",
                "album_image": None,
                "external_url": "https://open.spotify.com/track/api_ok_1",
            }
        ]

    monkeypatch.setattr(sc, "_search_spotify_api", fake_search_api)

    # Chamamos o endpoint do backend; internamente ele usará o mock acima
    res = client.get("/api/spotify/search", query_string={"q": "ok", "limit": 1})
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data.get("results"), list)
    assert len(data["results"]) == 1
    item = data["results"][0]
    # Campos essenciais da resposta
    assert item["name"]
    assert item["artists"]
    assert item["external_url"].startswith("https://open.spotify.com/track/")


def test_spotify_search_success(client):
    # Cenário: usuário pesquisa uma música válida
    print("Testando: Spotify (busca por música - sucesso)")
    # A chamada usa o endpoint do backend que abstrai a API do Spotify
    res = client.get("/api/spotify/search", query_string={"q": "Imagine", "limit": 5})
    assert res.status_code == 200
    data = res.get_json()
    # O backend sempre retorna um array 'results' (mesmo em modo mock)
    assert isinstance(data.get("results"), list)
    # Esperamos pelo menos um resultado para consultas válidas
    assert len(data["results"]) >= 1
    item = data["results"][0]
    # Estrutura mínima esperada por item: id, name, artists e o link externo do Spotify
    assert "id" in item
    assert "name" in item
    assert "artists" in item
    assert "external_url" in item


def test_spotify_search_empty_query(client):
    # Cenário: usuário tenta buscar com string vazia
    print("Testando: Spotify (busca com nome vazio)")
    # O backend normaliza e rejeita consultas menores que 2 caracteres, retornando lista vazia
    res = client.get("/api/spotify/search", query_string={"q": ""})
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data.get("results"), list)
    assert len(data["results"]) == 0


def test_spotify_search_mocked(monkeypatch, client):
    # Cenário: simulamos resposta da API externa para garantir previsibilidade
    print("Testando: Spotify (busca com mock da API externa)")

    # Importamos o módulo do controller e substituímos a função que chamaria a API real
    from src.controllers import spotify_controller as sc

    def fake_search_api(query, limit=10):
        # Retorno estático que imita o formato esperado pelo frontend
        return [
            {
                "id": "mock123",
                "name": "Mocked Song",
                "artists": "Mock Artist",
                "album_image": None,
                "external_url": "https://open.spotify.com/track/mock123",
            }
        ]

    # Substitui a função interna por nossa versão fake durante este teste
    monkeypatch.setattr(sc, "_search_spotify_api", fake_search_api)

    # Agora chamamos o endpoint, que internamente usará o fake_search_api
    res = client.get("/api/spotify/search", query_string={"q": "qualquer", "limit": 1})
    assert res.status_code == 200
    data = res.get_json()
    # Deve retornar exatamente um resultado (limit=1), vindo do mock
    assert isinstance(data.get("results"), list)
    assert len(data["results"]) == 1
    assert data["results"][0]["id"] == "mock123"


def test_store_music_link_in_memory(client, create_test_user):
    # Cenário: após selecionar a música, salvamos o link dentro da memória
    print("Testando: Armazenar link da música na memória")
    _, _, token = create_test_user(client)

    music = {
        "id": "mock123",
        "name": "Mocked Song",
        "artists": "Mock Artist",
        "album_image": None,
        "external_url": "https://open.spotify.com/track/mock123",
    }

    # Criamos a memória enviando o objeto 'music' com os campos mínimos esperados
    # Observação: backend trata este objeto como somente leitura (sem transformações)
    create_res = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Mem com música",
            "date": "2024-01-10",
            "lat": 1,
            "lng": 1,
            "music": music,
        },
    )
    assert create_res.status_code == 201
    mem_id = create_res.get_json()["memory"]["id"]

    # Recuperamos a memória criada para assegurar que o link foi persistido corretamente
    get_res = client.get(
        f"/api/memories/{mem_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert get_res.status_code == 200
    mem = get_res.get_json()["memory"]
    # O campo 'music' deve existir e conter o link 'external_url' enviado
    assert isinstance(mem.get("music"), dict)
    assert mem["music"]["external_url"] == music["external_url"]


def test_update_memory_music_with_spotify_mock(monkeypatch, client, create_test_user):
    # Cenário: editar música de uma memória existente usando nova seleção do Spotify (mock)
    print("Testando: Atualizar música da memória com mock do Spotify")
    _, _, token = create_test_user(client)

    # Música inicial salva na memória
    initial_music = {
        "id": "old123",
        "name": "Old Song",
        "artists": "Old Artist",
        "album_image": None,
        "external_url": "https://open.spotify.com/track/old123",
    }

    create_res = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "title": "Mem com música antiga",
            "date": "2024-01-10",
            "lat": 1,
            "lng": 1,
            "music": initial_music,
        },
    )
    assert create_res.status_code == 201
    mem_id = create_res.get_json()["memory"]["id"]

    # Mock da busca do Spotify para retornar uma nova música
    from src.controllers import spotify_controller as sc

    def fake_search_api(query, limit=10):
        return [
            {
                "id": "new456",
                "name": "New Song",
                "artists": "New Artist",
                "album_image": None,
                "external_url": "https://open.spotify.com/track/new456",
            }
        ]

    monkeypatch.setattr(sc, "_search_spotify_api", fake_search_api)

    # Obter nova música via endpoint (usará o mock), então atualizar a memória com a nova seleção
    search_res = client.get("/api/spotify/search", query_string={"q": "nova", "limit": 1})
    assert search_res.status_code == 200
    new_music = search_res.get_json()["results"][0]

    update_res = client.put(
        f"/api/memories/{mem_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"music": new_music},
    )
    assert update_res.status_code == 200

    # Validar que a música antiga foi substituída
    get_res = client.get(
        f"/api/memories/{mem_id}",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert get_res.status_code == 200
    mem = get_res.get_json()["memory"]
    assert mem["music"]["id"] == "new456"
    assert mem["music"]["external_url"].endswith("/new456")

