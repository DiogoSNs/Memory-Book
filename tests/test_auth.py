"""
Testes de autenticação:
- Registro (sucesso/erro simples)
- Login (sucesso/erro simples)
- Logout (sucesso/erro simples)

Padrão seguido:
- Mesmo estilo dos demais testes (client, prints, asserts diretos)
- Comentários curtos explicando cada cenário
"""
import pytest


def test_register_success(client, create_test_user):
    # Cenário: criação de usuário com dados válidos
    print("Testando: Registro (sucesso)")
    res, data, _ = create_test_user(client)
    assert res.status_code == 201
    assert "access_token" in data


def test_register_missing_field(client):
    # Cenário: rejeita registro quando falta campo obrigatório
    print("Testando: Registro (campo faltando)")
    res = client.post(
        "/api/auth/register",
        json={"email": "a@example.com", "password": "segredo123"},
    )
    assert res.status_code == 400


def test_login_success(client, create_test_user, login_user):
    # Cenário: autenticação com credenciais corretas
    print("Testando: Login (sucesso)")
    create_test_user(client, email="user@example.com", password="segredo123")
    res, data, _ = login_user(client, "user@example.com", "segredo123")
    assert res.status_code == 200
    assert "access_token" in data


def test_login_wrong_password(client, create_test_user, login_user):
    # Cenário: falha de autenticação com senha errada
    print("Testando: Login (senha incorreta)")
    create_test_user(client, email="user2@example.com", password="segredo123")
    res, _, _ = login_user(client, "user2@example.com", "errado")
    assert res.status_code == 401


def test_logout_success(client, create_test_user):
    # Cenário: logout com token válido
    print("Testando: Logout (sucesso)")
    _, _, token = create_test_user(client)
    res = client.post("/api/auth/logout", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200


def test_logout_without_token(client):
    # Cenário: tenta logout sem autenticação
    print("Testando: Logout (sem token)")
    res = client.post("/api/auth/logout")
    assert res.status_code == 401
