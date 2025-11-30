"""
Testes essenciais de autenticação:
- Registro (sucesso/erro simples)
- Login (sucesso/erro simples)
- Logout (sucesso/erro simples)
"""
import pytest


def test_register_success(client, create_test_user):
    print("Testando: Registro (sucesso)")
    res, data, _ = create_test_user(client)
    assert res.status_code == 201
    assert "access_token" in data


def test_register_missing_field(client):
    print("Testando: Registro (campo faltando)")
    res = client.post(
        "/api/auth/register",
        json={"email": "a@example.com", "password": "segredo123"},
    )
    assert res.status_code == 400


def test_login_success(client, create_test_user, login_user):
    print("Testando: Login (sucesso)")
    create_test_user(client, email="user@example.com", password="segredo123")
    res, data, _ = login_user(client, "user@example.com", "segredo123")
    assert res.status_code == 200
    assert "access_token" in data


def test_login_wrong_password(client, create_test_user, login_user):
    print("Testando: Login (senha incorreta)")
    create_test_user(client, email="user2@example.com", password="segredo123")
    res, _, _ = login_user(client, "user2@example.com", "errado")
    assert res.status_code == 401


def test_logout_success(client, create_test_user):
    print("Testando: Logout (sucesso)")
    _, _, token = create_test_user(client)
    res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200


def test_logout_without_token(client):
    print("Testando: Logout (sem token)")
    res = client.post("/api/auth/logout")
    assert res.status_code == 401
