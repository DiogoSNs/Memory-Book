#!/usr/bin/env python3
import requests
import json
import uuid
from datetime import datetime

BASE_URL = "http://localhost:5000"
API_BASE = f"{BASE_URL}/api"

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def p_success(m):
    print(f"{Colors.GREEN}✓ {m}{Colors.ENDC}")

def p_error(m):
    print(f"{Colors.RED}✗ {m}{Colors.ENDC}")

def p_info(m):
    print(f"{Colors.BLUE}ℹ {m}{Colors.ENDC}")

def p_warn(m):
    print(f"{Colors.YELLOW}⚠ {m}{Colors.ENDC}")

def header(m):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*50}")
    print(m)
    print(f"{'='*50}{Colors.ENDC}")

def test_health():
    header("TESTE: Health")
    resp = requests.get(f"{API_BASE}/health")
    if resp.status_code != 200:
        p_error(f"Health status {resp.status_code}")
        return False
    data = resp.json()
    if data.get("status") != "OK":
        p_error("Health payload inválido")
        return False
    p_success(f"Health OK: {data}")
    return True

def test_register():
    header("TESTE: Registro")
    unique = uuid.uuid4().hex[:8]
    email = f"teste_{unique}@memorybook.com"
    password = "senha123"
    payload = {"name": "Usuário Teste", "email": email, "password": password}
    resp = requests.post(f"{API_BASE}/auth/register", json=payload)
    if resp.status_code != 201:
        p_error(f"Registro {resp.status_code} - {resp.text}")
        return None
    data = resp.json()
    if not data.get("access_token") or not data.get("user"):
        p_error("Registro sem access_token ou user")
        return None
    p_success(f"Registrado: {data['user']['email']}")
    return {"email": email, "password": password, "user": data["user"], "token": data["access_token"]}

def test_login(credentials):
    header("TESTE: Login")
    payload = {"email": credentials["email"], "password": credentials["password"]}
    resp = requests.post(f"{API_BASE}/auth/login", json=payload)
    if resp.status_code != 200:
        p_error(f"Login {resp.status_code} - {resp.text}")
        return None
    data = resp.json()
    if not data.get("access_token") or not data.get("user"):
        p_error("Login sem access_token ou user")
        return None
    p_success(f"Login OK: {data['user']['email']}")
    return data["access_token"]

def test_me(token):
    header("TESTE: Usuário Atual")
    resp = requests.get(f"{API_BASE}/auth/me", headers={"Authorization": f"Bearer {token}"})
    if resp.status_code != 200:
        p_error(f"/auth/me {resp.status_code} - {resp.text}")
        return False
    data = resp.json()
    if not data.get("user"):
        p_error("Resposta sem user")
        return False
    p_success(f"Atual: {data['user']['email']}")
    return True

def test_memory_crud(token):
    header("TESTE: Memória CRUD")
    headers = {"Authorization": f"Bearer {token}"}
    create_payload = {
        "title": "Memória de Teste",
        "description": "Criada no fluxo de testes",
        "date": datetime.now().strftime('%Y-%m-%d'),
        "lat": -23.55,
        "lng": -46.63,
        "photos": ["foto1.jpg"],
        "color": "#FF6B6B"
    }
    r_create = requests.post(f"{API_BASE}/memories", json=create_payload, headers=headers)
    if r_create.status_code != 201:
        p_error(f"Criar {r_create.status_code} - {r_create.text}")
        return False
    mem = r_create.json().get("memory")
    if not mem or not mem.get("id"):
        p_error("Criação sem memória válida")
        return False
    mem_id = mem["id"]
    p_success(f"Criada: {mem_id}")

    r_list = requests.get(f"{API_BASE}/memories", headers=headers)
    if r_list.status_code != 200:
        p_error(f"Listar {r_list.status_code} - {r_list.text}")
        return False
    lst = r_list.json().get("memories", [])
    if not any(m.get("id") == mem_id for m in lst):
        p_warn("Memória não encontrada na listagem")

    update_payload = {"title": "Memória Atualizada"}
    r_update = requests.put(f"{API_BASE}/memories/{mem_id}", json=update_payload, headers=headers)
    if r_update.status_code != 200:
        p_error(f"Atualizar {r_update.status_code} - {r_update.text}")
        return False
    updated = r_update.json().get("memory", {})
    if updated.get("title") != "Memória Atualizada":
        p_error("Título não atualizado")
        return False
    p_success("Atualizada")

    r_delete = requests.delete(f"{API_BASE}/memories/{mem_id}", headers=headers)
    if r_delete.status_code != 200:
        p_error(f"Deletar {r_delete.status_code} - {r_delete.text}")
        return False
    p_success("Deletada")
    return True

def run():
    header("INÍCIO")
    p_info(f"URL: {BASE_URL}")
    p_info(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    if not test_health():
        return
    creds = test_register()
    if not creds:
        return
    token = test_login(creds)
    if not token:
        return
    if not test_me(token):
        return
    if not test_memory_crud(token):
        return
    header("RESULTADO")
    p_success("Fluxo Registro→Login→Operações autenticadas concluído")

if __name__ == "__main__":
    run()
