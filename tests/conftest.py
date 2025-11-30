"""
Fixtures e utilitários de testes
- Ajusta o path para importar o backend (src.*)
- Fornece app e client do Flask
- Helpers para criar usuário, logar e criar memória
"""
import os
import sys
import uuid
import pytest

# Inclui o diretório do backend no sys.path para permitir imports (src.*)
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, 'backend')
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from src.app_factory import create_app, db
from src.config import DevelopmentConfig


class TestConfig(DevelopmentConfig):
    # Configuração de teste (modo TESTING e banco SQLite isolado)
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///test_memory_book.sqlite'


def unique_email(prefix="user"):
    # Gera email único por teste para evitar colisões
    return f"{prefix}_{uuid.uuid4().hex[:8]}@example.com"


@pytest.fixture(scope="session")
def app():
    # Cria a aplicação Flask usando a TestConfig (uma vez por sessão)
    app = create_app(TestConfig)
    return app


@pytest.fixture(scope="function")
def client(app):
    # Recria o banco a cada teste para isolamento
    with app.app_context():
        db.drop_all()
        db.create_all()
    # Client do Flask para enviar requisições reais
    return app.test_client()


def _auth_headers(token):
    # Helper para montar o header Authorization com JWT
    return {"Authorization": f"Bearer {token}"}


def _create_test_user(client, name="Test User", email=None, password="password123"):
    # Cria usuário via endpoint de registro e retorna resposta, dados e token
    if email is None:
        email = unique_email("tester")
    res = client.post(
        "/api/auth/register",
        json={"name": name, "email": email, "password": password},
    )
    data = res.get_json()
    token = data.get("access_token") if res.status_code in (200, 201) else None
    return res, data, token


def _login_user(client, email, password):
    # Realiza login e retorna resposta, dados e token (se sucesso)
    res = client.post(
        "/api/auth/login",
        json={"email": email, "password": password},
    )
    data = res.get_json()
    token = data.get("access_token") if res.status_code == 200 else None
    return res, data, token


def _create_test_memory(client, token, payload=None):
    # Cria memória de teste para o usuário autenticado
    if payload is None:
        payload = {
            "title": "Memória",
            "date": "2024-01-10",
            "lat": -23.5505,
            "lng": -46.6333,
            "description": "SP",
            "photos": [],
            "spotifyUrl": "https://open.spotify.com/track/3AJwUDP5ycja3OwbmV9B0g",
            "color": "#FF6B6B",
        }
    res = client.post(
        "/api/memories",
        headers=_auth_headers(token),
        json=payload,
    )
    return res, res.get_json()


# Fixtures que expõem os helpers como callables para uso nos testes
@pytest.fixture
def create_test_user():
    # Retorna função para criar usuário de teste
    return _create_test_user


@pytest.fixture
def login_user():
    # Retorna função para realizar login
    return _login_user


@pytest.fixture
def create_test_memory():
    # Retorna função para criar memória de teste
    return _create_test_memory

