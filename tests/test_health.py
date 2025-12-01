"""
Testes de saúde da API:
- Health check (OK)
- Rota inválida (404)

Padrão seguido:
- Mesmo estilo dos demais testes (client, prints, asserts diretos)
- Comentários curtos explicando cada cenário
"""
import pytest


def test_health_check_success(client):
    # Cenário: endpoint de health retorna status OK
    print("Testando: Saúde da API (OK)")
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.get_json()
    assert data.get("status") == "OK"


def test_health_check_invalid_route(client):
    # Cenário: rota inexistente deve retornar 404
    print("Testando: Saúde da API (rota inválida)")
    res = client.get("/api/healthz")
    assert res.status_code == 404
