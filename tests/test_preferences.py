"""
Testes essenciais de preferências do usuário:
- GET (sucesso)
- PUT (valor inválido)
"""
import pytest


def test_get_preferences_success(client, create_test_user):
    print("Testando: Preferências (GET sucesso)")
    _, _, token = create_test_user(client)
    res = client.get("/api/auth/preferences", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200


def test_update_preferences_invalid_value(client, create_test_user):
    print("Testando: Preferências (PUT valor inválido)")
    _, _, token = create_test_user(client)
    res = client.put(
        "/api/auth/preferences",
        headers={"Authorization": f"Bearer {token}"},
        json={"selected_gradient": "invalid"},
    )
    assert res.status_code == 400
