# Slide 1: Visão Geral dos Testes
## Como são configurados e executados
- Os testes ficam na pasta `tests/` e usam `pytest` com fixtures em `conftest.py`.
- `conftest.py` fornece `app` (Flask) e `client` (HTTP) para simular chamadas reais (tests/conftest.py:34, 41).
- Execução: `run_tests.bat` roda `python -m pytest tests --cov=backend --cov-report=term`.
- Configuração: `pytest.ini` define `testpaths=tests`, opções (`addopts`) e filtros de warnings.
- Cobertura: exibida no console após a execução.

Exemplos do que é testado:
- `test_auth.py`: registro, login e logout.
- `test_memories.py`: CRUD de memórias.
- `test_spotify.py`: busca de músicas e armazenamento/edição de link.
- `test_videos.py`: upload ≤30s, bloqueio >30s, exclusão de mídia.

---

# Slide 2: Exemplos Diretos
## Dois trechos curtos
```python
# Login: autenticação com sucesso
from tests.conftest import _create_test_user as create_test_user, _login_user as login_user

def exemplo_login_success(client):
    create_test_user(client, email="user@example.com", password="segredo123")
    res, data, _ = login_user(client, "user@example.com", "segredo123")
    assert res.status_code == 200
    assert "access_token" in data
```

```python
# Spotify: busca com estrutura mínima

def exemplo_spotify_search_success(client):
    res = client.get("/api/spotify/search", query_string={"q": "Imagine", "limit": 3})
    assert res.status_code == 200
    item = res.get_json()["results"][0]
    assert {"id", "name", "artists", "external_url"} <= set(item.keys())
```

# Slide 1: Estrutura de Testes
## Organização e Tipos
- Pasta `tests/`
- Arquivos principais:
  - `conftest.py` (fixtures: app, client, helpers)
  - `test_health.py`, `test_auth.py`, `test_memories.py`, `test_preferences.py`, `test_themes.py`, `test_spotify.py`, `test_videos.py`
- Tipos de testes:
  - Integração: chamam endpoints do backend com `Flask test_client`
  - Unitários simples: validações/mocks isolados (ex.: Spotify mock)
  - Mocks e fixtures: `monkeypatch` para APIs externas e utilitários em `conftest.py`

---

# Slide 2: Como Executar
## Comando e Passo a Passo
- Comando principal:
  - `run_tests.bat`
- O que o script faz:
  - Limpa cache do pytest
  - Executa: `python -m pytest tests --cov=backend --cov-report=term`
  - Mostra resumo (pass/fail) e cobertura
- Dependências/técnicas:
  - `pytest`, `pytest-cov` (em `backend/requirements.txt`)
  - Configuração em `pytest.ini` (`testpaths=tests`, `addopts`, `filterwarnings`)

---

# Slide 3: Exemplos Simples


## Health Check - Backend Flask (OK)
```python
# Testa se a API está saudável
def test_health_check_success(client):
    res = client.get("/api/health")  # chama o endpoint de saúde
    assert res.status_code == 200     # valida status
    data = res.get_json()             # extrai JSON
    assert data.get("status") == "OK"  # valida conteúdo
```

## Criação de Memória (Sucesso)
```python
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
```

## Login (Sucesso)
```python
# Fluxo de login com usuário válido
def test_login_success(client, create_test_user, login_user):
    create_test_user(client, email="user@example.com", password="segredo123")
    res, data, _ = login_user(client, "user@example.com", "segredo123")
    assert res.status_code == 200
    assert "access_token" in data     # token emitido
```

## Spotify (Busca Simples)
```python
# Busca por música na API (mock/real)
def test_spotify_search_success(client):
    res = client.get("/api/spotify/search", query_string={"q": "Imagine", "limit": 3})
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data.get("results"), list)
    item = data["results"][0]
    assert {"id", "name", "artists", "external_url"} <= set(item.keys())
```

---

# Slide 4: Anatomia de um Teste
## Setup → Execução → Validação
```python
# Exemplo de estrutura básica com pytest

def test_exemplo(client, create_test_user):
    # Setup: preparar estado/usuário
    _, _, token = create_test_user(client)

    # Execução: chamar o endpoint alvo
    res = client.get("/api/memories", headers={"Authorization": f"Bearer {token}"})

    # Validação: checar status e conteúdo
    assert res.status_code == 200
    data = res.get_json()
    assert isinstance(data.get("memories", []), list)
```
