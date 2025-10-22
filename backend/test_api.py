#!/usr/bin/env python3
# ============================================
# SCRIPT DE TESTE - Memory-Book Backend API
# Script para testar todos os endpoints da API
# ============================================

import requests
import json
from datetime import datetime

# Configuração
BASE_URL = "http://localhost:5000"
API_BASE = f"{BASE_URL}/api"

# Cores para output
class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

def print_success(message):
    print(f"{Colors.GREEN}✓ {message}{Colors.ENDC}")

def print_error(message):
    print(f"{Colors.RED}✗ {message}{Colors.ENDC}")

def print_info(message):
    print(f"{Colors.BLUE}ℹ {message}{Colors.ENDC}")

def print_warning(message):
    print(f"{Colors.YELLOW}⚠ {message}{Colors.ENDC}")

def print_header(message):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*50}")
    print(f"{message}")
    print(f"{'='*50}{Colors.ENDC}")

def test_health_check():
    """Testa o endpoint de health check"""
    print_header("TESTE 1: Health Check")
    
    try:
        response = requests.get(f"{API_BASE}/health")
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Health check OK: {data}")
            return True
        else:
            print_error(f"Health check falhou: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Erro na conexão: {e}")
        return False

def test_user_registration():
    """Testa o registro de usuário"""
    print_header("TESTE 2: Registro de Usuário")
    
    # Usar timestamp para garantir email único
    timestamp = int(datetime.now().timestamp())
    user_data = {
        "name": "Usuário Teste",
        "email": f"teste{timestamp}@memorybook.com",
        "password": "senha123"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/register", json=user_data)
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Usuário registrado: {data['user']['name']}")
            return data
        else:
            print_error(f"Registro falhou: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print_error(f"Erro no registro: {e}")
        return None

def test_user_login():
    """Testa o login do usuário"""
    print_header("TESTE 3: Login de Usuário")
    
    login_data = {
        "email": "teste@memorybook.com",
        "password": "senha123"
    }
    
    try:
        response = requests.post(f"{API_BASE}/auth/login", json=login_data)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Login realizado: {data['user']['name']}")
            print_info(f"Token obtido: {data['access_token'][:20]}...")
            return data['access_token']
        else:
            print_error(f"Login falhou: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print_error(f"Erro no login: {e}")
        return None

def test_get_current_user(token):
    """Testa obter usuário atual"""
    print_header("TESTE 4: Obter Usuário Atual")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/auth/me", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Usuário atual: {data['user']['name']} ({data['user']['email']})")
            return True
        else:
            print_error(f"Falha ao obter usuário: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Erro ao obter usuário: {e}")
        return False

def test_create_memory(token):
    """Testa criação de memória"""
    print_header("TESTE 5: Criar Memória")
    
    memory_data = {
        "title": "Primeira Memória de Teste",
        "description": "Esta é uma memória criada durante os testes da API",
        "date": "2024-01-15",
        "lat": -23.5505,
        "lng": -46.6333,
        "photos": ["foto1.jpg", "foto2.jpg"],
        "spotifyUrl": "https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh",
        "color": "#FF6B6B"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{API_BASE}/memories", json=memory_data, headers=headers)
        
        if response.status_code == 201:
            data = response.json()
            print_success(f"Memória criada: {data['memory']['title']}")
            print_info(f"ID da memória: {data['memory']['id']}")
            return data['memory']['id']
        else:
            print_error(f"Falha ao criar memória: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print_error(f"Erro ao criar memória: {e}")
        return None

def test_get_memories(token):
    """Testa listagem de memórias"""
    print_header("TESTE 6: Listar Memórias")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/memories", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Memórias obtidas: {data['total']} encontradas")
            
            for memory in data['memories']:
                print_info(f"  - {memory['title']} ({memory['date']})")
            
            return True
        else:
            print_error(f"Falha ao obter memórias: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Erro ao obter memórias: {e}")
        return False

def test_update_memory(token, memory_id):
    """Testa atualização de memória"""
    print_header("TESTE 7: Atualizar Memória")
    
    update_data = {
        "title": "Memória Atualizada",
        "description": "Descrição foi atualizada durante o teste"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.put(f"{API_BASE}/memories/{memory_id}", json=update_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Memória atualizada: {data['memory']['title']}")
            return True
        else:
            print_error(f"Falha ao atualizar memória: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Erro ao atualizar memória: {e}")
        return False

def test_create_theme(token):
    """Testa criação/atualização de tema"""
    print_header("TESTE 8: Criar/Atualizar Tema")
    
    theme_data = {
        "gradientName": "Sunset Test",
        "gradientCss": "linear-gradient(135deg, #ff7e5f, #feb47b)",
        "isActive": True
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.post(f"{API_BASE}/themes", json=theme_data, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Tema criado: {data['theme']['gradientName']}")
            return True
        else:
            print_error(f"Falha ao criar tema: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Erro ao criar tema: {e}")
        return False

def test_get_theme(token):
    """Testa obtenção de tema"""
    print_header("TESTE 9: Obter Tema")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/themes", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Tema obtido: {data['theme']['gradientName']}")
            print_info(f"CSS: {data['theme']['gradientCss']}")
            return True
        else:
            print_error(f"Falha ao obter tema: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Erro ao obter tema: {e}")
        return False

def test_theme_presets():
    """Testa obtenção de presets de tema"""
    print_header("TESTE 10: Obter Presets de Tema")
    
    try:
        response = requests.get(f"{API_BASE}/themes/presets")
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Presets obtidos: {len(data['presets'])} disponíveis")
            
            for preset in data['presets'][:3]:  # Mostrar apenas os 3 primeiros
                print_info(f"  - {preset['name']}: {preset['gradientCss']}")
            
            return True
        else:
            print_error(f"Falha ao obter presets: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Erro ao obter presets: {e}")
        return False

def test_memory_stats(token):
    """Testa estatísticas de memórias"""
    print_header("TESTE 11: Estatísticas de Memórias")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{API_BASE}/memories/stats", headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Estatísticas obtidas: {data['total_memories']} memórias")
            return True
        else:
            print_error(f"Falha ao obter estatísticas: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Erro ao obter estatísticas: {e}")
        return False

def run_all_tests():
    """Executa todos os testes"""
    print_header("INICIANDO TESTES DA API MEMORY-BOOK")
    print_info(f"URL Base: {BASE_URL}")
    print_info(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Contadores
    total_tests = 0
    passed_tests = 0
    
    # Teste 1: Health Check
    total_tests += 1
    if test_health_check():
        passed_tests += 1
    
    # Teste 2: Registro
    total_tests += 1
    user_data = test_user_registration()
    if user_data:
        passed_tests += 1
    
    # Teste 3: Login
    total_tests += 1
    token = test_user_login()
    if token:
        passed_tests += 1
    
    # Se não conseguiu fazer login, parar aqui
    if not token:
        print_error("Não foi possível obter token. Parando testes.")
        return
    
    # Teste 4: Usuário atual
    total_tests += 1
    if test_get_current_user(token):
        passed_tests += 1
    
    # Teste 5: Criar memória
    total_tests += 1
    memory_id = test_create_memory(token)
    if memory_id:
        passed_tests += 1
    
    # Teste 6: Listar memórias
    total_tests += 1
    if test_get_memories(token):
        passed_tests += 1
    
    # Teste 7: Atualizar memória (se criou uma)
    if memory_id:
        total_tests += 1
        if test_update_memory(token, memory_id):
            passed_tests += 1
    
    # Teste 8: Criar tema
    total_tests += 1
    if test_create_theme(token):
        passed_tests += 1
    
    # Teste 9: Obter tema
    total_tests += 1
    if test_get_theme(token):
        passed_tests += 1
    
    # Teste 10: Presets de tema
    total_tests += 1
    if test_theme_presets():
        passed_tests += 1
    
    # Teste 11: Estatísticas
    total_tests += 1
    if test_memory_stats(token):
        passed_tests += 1
    
    # Resultado final
    print_header("RESULTADO DOS TESTES")
    
    if passed_tests == total_tests:
        print_success(f"TODOS OS TESTES PASSARAM! ({passed_tests}/{total_tests})")
        print_success("🎉 A API está funcionando perfeitamente!")
    else:
        print_warning(f"ALGUNS TESTES FALHARAM: {passed_tests}/{total_tests} passaram")
        
        if passed_tests > 0:
            print_info("✅ Funcionalidades que estão funcionando:")
            print_info("   - Servidor Flask está rodando")
            print_info("   - Endpoints básicos estão respondendo")
        
        if passed_tests < total_tests:
            print_warning("⚠️  Verifique os erros acima para mais detalhes")

if __name__ == "__main__":
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print_warning("\n\nTestes interrompidos pelo usuário")
    except Exception as e:
        print_error(f"Erro inesperado: {e}")