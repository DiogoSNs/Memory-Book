# Memory-Book Backend

Backend Flask para o projeto Memory-Book, implementando arquitetura MVC com padrões Repository e Factory Method.

## 🏗️ Arquitetura

### Padrões de Design Implementados

- **MVC (Model-View-Controller)**: Separação clara entre modelos, controladores e views
- **Repository Pattern**: Abstração da camada de acesso a dados
- **Factory Method Pattern**: Criação de objetos através de métodos factory

### Estrutura de Diretórios

```
backend/
├── app.py                      # Ponto de entrada da aplicação
├── requirements.txt            # Dependências Python
├── .env.example               # Exemplo de variáveis de ambiente
├── README.md                  # Documentação
└── src/
    ├── __init__.py
    ├── config.py              # Configurações da aplicação
    ├── app_factory.py         # Factory da aplicação Flask
    ├── database.py            # Configuração do banco de dados
    ├── models/                # Modelos de dados (SQLAlchemy)
    │   ├── __init__.py
    │   ├── base_model.py      # Modelo base com Factory Method
    │   ├── user.py            # Modelo de usuário
    │   ├── memory.py          # Modelo de memória
    │   └── theme.py           # Modelo de tema
    ├── repositories/          # Repositórios (Repository Pattern)
    │   ├── __init__.py
    │   ├── base_repository.py # Repositório base
    │   ├── user_repository.py # Repositório de usuários
    │   ├── memory_repository.py # Repositório de memórias
    │   └── theme_repository.py # Repositório de temas
    ├── controllers/           # Controladores (MVC)
    │   ├── __init__.py
    │   ├── auth_controller.py # Autenticação
    │   ├── memory_controller.py # Memórias
    │   └── theme_controller.py # Temas
    └── utils/                 # Utilitários
        ├── __init__.py
        ├── validators.py      # Validadores
        └── helpers.py         # Funções auxiliares
```

## 🚀 Configuração e Instalação

### 1. Pré-requisitos

- Python 3.8+
- pip (gerenciador de pacotes Python)

### 2. Instalação

```bash
# Navegar para o diretório do backend
cd backend

# Criar ambiente virtual (recomendado)
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt
```

### 3. Configuração

```bash
# Copiar arquivo de exemplo das variáveis de ambiente
cp .env.example .env

# Editar o arquivo .env com suas configurações
```

### 4. Executar a Aplicação

```bash
# Executar em modo de desenvolvimento
python app.py
```

A aplicação estará disponível em `http://localhost:5000`

## 🗄️ Banco de Dados

### Modelos

#### User (Usuário)
- `id`: Identificador único
- `name`: Nome do usuário
- `email`: Email (único)
- `password_hash`: Senha criptografada
- `created_at`: Data de criação
- `updated_at`: Data de atualização

#### Memory (Memória)
- `id`: Identificador único
- `user_id`: ID do usuário proprietário
- `title`: Título da memória
- `description`: Descrição (opcional)
- `date`: Data da memória
- `lat`: Latitude
- `lng`: Longitude
- `photos`: Lista de fotos (JSON)
- `spotify_url`: URL do Spotify (opcional)
- `color`: Cor da memória
- `created_at`: Data de criação
- `updated_at`: Data de atualização

#### Theme (Tema)
- `id`: Identificador único
- `user_id`: ID do usuário proprietário
- `gradient_name`: Nome do gradiente
- `gradient_css`: CSS do gradiente
- `is_active`: Se o tema está ativo
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## 🔌 API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registrar novo usuário |
| POST | `/api/auth/login` | Login do usuário |
| GET | `/api/auth/me` | Obter usuário atual |
| POST | `/api/auth/refresh` | Renovar token |

### Memórias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/memories` | Listar memórias do usuário |
| POST | `/api/memories` | Criar nova memória |
| GET | `/api/memories/{id}` | Obter memória específica |
| PUT | `/api/memories/{id}` | Atualizar memória |
| DELETE | `/api/memories/{id}` | Deletar memória |
| GET | `/api/memories/nearby` | Buscar memórias próximas |
| GET | `/api/memories/stats` | Estatísticas das memórias |

### Temas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/themes` | Obter tema do usuário |
| POST | `/api/themes` | Criar/atualizar tema |
| PUT | `/api/themes` | Atualizar tema |
| POST | `/api/themes/reset` | Resetar para tema padrão |
| POST | `/api/themes/activate` | Ativar tema |
| POST | `/api/themes/deactivate` | Desativar tema |
| GET | `/api/themes/presets` | Obter temas pré-definidos |

## 🔐 Autenticação

A API utiliza JWT (JSON Web Tokens) para autenticação. 

### Como usar:

1. Faça login através do endpoint `/api/auth/login`
2. Inclua o token retornado no header `Authorization: Bearer <token>`
3. Para renovar o token, use `/api/auth/refresh`

## 📝 Exemplos de Uso

### Registrar Usuário

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "senha123"
  }'
```

### Criar Memória

```bash
curl -X POST http://localhost:5000/api/memories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "title": "Viagem à praia",
    "description": "Um dia incrível na praia",
    "date": "2024-01-15",
    "lat": -23.5505,
    "lng": -46.6333,
    "photos": ["foto1.jpg", "foto2.jpg"],
    "spotifyUrl": "https://open.spotify.com/track/...",
    "color": "#FF6B6B"
  }'
```

### Atualizar Tema

```bash
curl -X POST http://localhost:5000/api/themes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <seu-token>" \
  -d '{
    "gradientName": "Sunset",
    "gradientCss": "linear-gradient(135deg, #ff7e5f, #feb47b)",
    "isActive": true
  }'
```

## 🛠️ Desenvolvimento

### Estrutura dos Padrões

#### Repository Pattern
Cada modelo possui um repositório correspondente que encapsula a lógica de acesso a dados:

```python
# Exemplo de uso do repositório
from src.repositories.memory_repository import MemoryRepository

memory_repo = MemoryRepository()
memories = memory_repo.get_by_user(user_id)
```

#### Factory Method Pattern
Os modelos utilizam métodos factory para criação:

```python
# Exemplo de criação usando Factory Method
user = User.create(name="João", email="joao@email.com", password="senha123")
memory = Memory.create(user_id=1, title="Memória", date="2024-01-01", lat=-23.5, lng=-46.6)
```

### Validações

O sistema inclui validadores para:
- Email (formato válido)
- Senha (mínimo 6 caracteres, pelo menos 1 letra e 1 número)
- Data (formato YYYY-MM-DD)
- Coordenadas (latitude: -90 a 90, longitude: -180 a 180)
- Cores (formato hexadecimal)
- URLs do Spotify

### Tratamento de Erros

A API retorna erros padronizados em formato JSON:

```json
{
  "error": "Mensagem de erro descritiva"
}
```

Códigos de status HTTP utilizados:
- `200`: Sucesso
- `201`: Criado com sucesso
- `400`: Erro de validação
- `401`: Não autorizado
- `404`: Não encontrado
- `500`: Erro interno do servidor

## 🧪 Testes

Para executar testes (quando implementados):

```bash
# Executar todos os testes
python -m pytest

# Executar com cobertura
python -m pytest --cov=src
```

## 📦 Dependências Principais

- **Flask**: Framework web
- **Flask-SQLAlchemy**: ORM para banco de dados
- **Flask-JWT-Extended**: Autenticação JWT
- **Flask-CORS**: Suporte a CORS
- **Werkzeug**: Utilitários web
- **bcrypt**: Criptografia de senhas
- **python-dotenv**: Gerenciamento de variáveis de ambiente
- **marshmallow**: Serialização/deserialização de dados

## 🔧 Configurações de Ambiente

### Variáveis de Ambiente (.env)

```env
# Ambiente da aplicação
FLASK_ENV=development

# Chaves secretas
SECRET_KEY=sua-chave-secreta-super-segura
JWT_SECRET_KEY=sua-chave-jwt-super-segura

# Banco de dados
DATABASE_URL=sqlite:///memory_book.db

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

## 🚀 Deploy

### Produção

Para deploy em produção:

1. Configure `FLASK_ENV=production`
2. Use um banco de dados robusto (PostgreSQL, MySQL)
3. Configure um servidor web (Nginx + Gunicorn)
4. Use HTTPS
5. Configure logs adequados
6. Implemente backup do banco de dados

### Docker (Opcional)

```dockerfile
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "app.py"]
```

## 📄 Licença

Este projeto é parte do Memory-Book e segue a mesma licença do projeto principal.

## 🤝 Contribuição

Para contribuir com o projeto:

1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Implemente suas alterações
4. Adicione testes se necessário
5. Faça commit das alterações
6. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório do projeto.