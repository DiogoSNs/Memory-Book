"""
Testes essenciais de temas:
- Criação/atualização básica (sucesso)
- Erro simples de criação (faltando campos)
"""
import pytest


def test_create_theme_success(client, create_test_user):
    print("Testando: Tema (criação/atualização sucesso)")
    _, _, token = create_test_user(client)
    res = client.post(
        "/api/themes",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "gradientName": "Ocean",
            "gradientCss": "linear-gradient(135deg, #667eea, #764ba2)",
            "isActive": True,
        },
    )
    assert res.status_code == 200


def test_create_theme_missing_fields(client, create_test_user):
    print("Testando: Tema (erro por campos faltando)")
    _, _, token = create_test_user(client)
    res = client.post(
        "/api/themes",
        headers={"Authorization": f"Bearer {token}"},
        json={"gradientName": "OnlyName"},
    )
    assert res.status_code == 400
