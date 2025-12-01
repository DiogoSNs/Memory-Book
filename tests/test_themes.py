"""
Testes de temas:
- Criação/atualização básica (sucesso)
- Erro de criação (faltando campos obrigatórios)

Padrão seguido:
- Mesmo estilo dos demais testes (client, prints, asserts diretos)
- Comentários curtos explicando cada cenário
"""
import pytest


def test_create_theme_success(client, create_test_user):
    # Cenário: cria/atualiza tema com dados válidos
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
    # Cenário: rejeita criação de tema sem dados obrigatórios
    print("Testando: Tema (erro por campos faltando)")
    _, _, token = create_test_user(client)
    res = client.post(
        "/api/themes",
        headers={"Authorization": f"Bearer {token}"},
        json={"gradientName": "OnlyName"},
    )
    assert res.status_code == 400
