"""
Testes de memórias (CRUD):
- Criar (sucesso/erro simples)
- Listar (com token/sem token)
- Atualizar (sucesso/ID inexistente)
- Deletar (sucesso/outro usuário)

Padrão seguido:
- Mesmo estilo dos demais testes (client, prints, asserts diretos)
- Comentários curtos explicando cada cenário
"""
import pytest


def test_create_memory_success(client, create_test_user):
    # Cenário: criação de memória com dados válidos
    print("Testando: Criar memória (sucesso)")
    _, _, token = create_test_user(client)
    res = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Memória", "date": "2024-01-10", "lat": 1, "lng": 1},
    )
    assert res.status_code == 201


def test_create_memory_missing_title(client, create_test_user):
    # Cenário: rejeita criação sem título
    print("Testando: Criar memória (erro sem título)")
    _, _, token = create_test_user(client)
    res = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token}"},
        json={"date": "2024-01-10", "lat": 1, "lng": 1},
    )
    assert res.status_code == 400


def test_list_memories_with_token(client, create_test_user):
    # Cenário: lista memórias do usuário autenticado
    print("Testando: Listar memórias (com token)")
    _, _, token = create_test_user(client)
    res = client.get("/api/memories", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200


def test_list_memories_without_token(client):
    # Cenário: bloqueia listagem sem autenticação
    print("Testando: Listar memórias (sem token)")
    res = client.get("/api/memories")
    assert res.status_code == 401


def test_update_memory_success(client, create_test_user):
    # Cenário: atualização de campos da memória existente
    print("Testando: Atualizar memória (sucesso)")
    _, _, token = create_test_user(client)
    create = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "X", "date": "2024-01-10", "lat": 1, "lng": 1},
    )
    mem_id = create.get_json()["memory"]["id"]
    res = client.put(
        f"/api/memories/{mem_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Atualizada"},
    )
    assert res.status_code == 200


def test_update_memory_nonexistent(client, create_test_user):
    # Cenário: tentativa de atualizar um recurso inexistente
    print("Testando: Atualizar memória (ID inexistente)")
    _, _, token = create_test_user(client)
    res = client.put(
        "/api/memories/999999",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "X"},
    )
    assert res.status_code == 404


def test_delete_memory_success(client, create_test_user):
    # Cenário: exclusão de memória do próprio usuário
    print("Testando: Deletar memória (sucesso)")
    _, _, token = create_test_user(client)
    create = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "X", "date": "2024-01-10", "lat": 1, "lng": 1},
    )
    mem_id = create.get_json()["memory"]["id"]
    res = client.delete(f"/api/memories/{mem_id}", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200


def test_delete_memory_other_user(client, create_test_user):
    # Cenário: impede exclusão de memória pertencente a outro usuário
    print("Testando: Deletar memória (outro usuário)")
    _, _, token1 = create_test_user(client, email="u1@example.com")
    create = client.post(
        "/api/memories",
        headers={"Authorization": f"Bearer {token1}"},
        json={"title": "X", "date": "2024-01-10", "lat": 1, "lng": 1},
    )
    mem_id = create.get_json()["memory"]["id"]
    _, _, token2 = create_test_user(client, email="u2@example.com")
    res = client.delete(f"/api/memories/{mem_id}", headers={"Authorization": f"Bearer {token2}"})
    assert res.status_code in (403, 404)
