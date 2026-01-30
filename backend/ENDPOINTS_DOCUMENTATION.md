# 📚 Documentação dos Endpoints - Memory Book Backend

Esta documentação detalha todos os endpoints disponíveis na API do Memory Book, como o backend funciona e como os dados são armazenados.

## 🏗️ Arquitetura do Backend

### Padrões Implementados
- **MVC (Model-View-Controller)**: Separação clara entre modelos, controladores e views
- **Repository Pattern**: Abstração da camada de acesso a dados
- **Factory Method Pattern**: Criação de objetos através de métodos factory

### Tecnologias Utilizadas
- **Flask**: Framework web Python
- **SQLAlchemy**: ORM para banco de dados
- **Flask-JWT-Extended**: Autenticação JWT
- **Flask-CORS**: Suporte a CORS
- **bcrypt**: Criptografia de senhas

### Estrutura de Diretórios
```
backend/
├── app.py                      # Ponto de entrada da aplicação
├── requirements.txt            # Dependências Python
├── .env.example               # Exemplo de variáveis de ambiente
└── src/
    ├── config.py              # Configurações da aplicação
    ├── app_factory.py         # Factory da aplicação Flask
    ├── database.py            # Configuração do banco de dados
    ├── models/                # Modelos de dados (SQLAlchemy)
    │   ├── base_model.py      # Modelo base com Factory Method
    │   ├── user.py            # Modelo de usuário
    │   ├── memory.py          # Modelo de memória
    │   └── theme.py           # Modelo de tema
    ├── repositories/          # Repositórios (Repository Pattern)
    │   ├── base_repository.py # Repositório base
    │   ├── user_repository.py # Repositório de usuários
    │   ├── memory_repository.py # Repositório de memórias
    │   └── theme_repository.py # Repositório de temas
    └── controllers/           # Controladores (MVC)
        ├── auth_controller.py # Autenticação
        ├── memory_controller.py # Memórias
        └── theme_controller.py # Temas
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela `memories`
```sql
CREATE TABLE memories (
    id INTEGER PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date VARCHAR(10) NOT NULL,  -- Formato YYYY-MM-DD
    lat FLOAT NOT NULL,
    lng FLOAT NOT NULL,
    photos JSON,  -- Array de URLs/base64 das fotos
    spotify_url VARCHAR(500),  -- URL do Spotify
    color VARCHAR(7),  -- Cor em hexadecimal (#RRGGBB)
    user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Tabela `themes`
```sql
CREATE TABLE themes (
    id INTEGER PRIMARY KEY,
    gradient_name VARCHAR(50) NOT NULL DEFAULT 'default',
    gradient_css TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    user_id INTEGER UNIQUE NOT NULL,  -- Relacionamento 1:1 com usuário
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação. Todos os endpoints protegidos requerem o header:
```
Authorization: Bearer <token>
```

## 📡 Endpoints da API

### Base URL
```
http://localhost:5000/api
```

### Health Check
```http
GET /api/health
```
**Descrição**: Verifica se a API está funcionando  
**Autenticação**: Não requerida  
**Resposta**:
```json
{
  "status": "OK",
  "message": "Memory Book API is running"
}
```

---

## 🔑 Endpoints de Autenticação (`/api/auth`)

### 1. Registro de Usuário
```http
POST /api/auth/register
```

**Body**:
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Validações**:
- Nome: mínimo 2 caracteres
- Email: formato válido e único
- Senha: mínimo 6 caracteres

**Resposta de Sucesso (201)**:
```json
{
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 2. Login
```http
POST /api/auth/login
```

**Body**:
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```

**Resposta de Sucesso (200)**:
```json
{
  "message": "Login realizado com sucesso",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  },
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### 3. Obter Usuário Atual
```http
GET /api/auth/me
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@email.com",
    "is_active": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### 4. Renovar Token
```http
POST /api/auth/refresh
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

## 📍 Endpoints de Memórias (`/api/memories`)

### 1. Listar Memórias do Usuário
```http
GET /api/memories
```

**Headers**: `Authorization: Bearer <token>`

**Query Parameters** (opcionais):
- `start_date`: Data inicial (YYYY-MM-DD)
- `end_date`: Data final (YYYY-MM-DD)

**Exemplo**: `/api/memories?start_date=2024-01-01&end_date=2024-12-31`

**Resposta de Sucesso (200)**:
```json
{
  "memories": [
    {
      "id": 1,
      "title": "Viagem à praia",
      "description": "Um dia incrível na praia com a família",
      "date": "2024-01-15",
      "lat": -23.5505,
      "lng": -46.6333,
      "photos": ["data:image/jpeg;base64,..."],
      "spotifyUrl": "https://open.spotify.com/track/...",
      "color": "#FF6B6B",
      "created_at": "2024-01-15T14:30:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    }
  ],
  "total": 1
}
```

### 2. Criar Nova Memória
```http
POST /api/memories
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "title": "Viagem à praia",
  "description": "Um dia incrível na praia com a família",
  "date": "2024-01-15",
  "lat": -23.5505,
  "lng": -46.6333,
  "photos": ["data:image/jpeg;base64,..."],
  "spotifyUrl": "https://open.spotify.com/track/...",
  "color": "#FF6B6B"
}
```

**Campos Obrigatórios**:
- `title`: Título da memória
- `date`: Data no formato YYYY-MM-DD
- `lat`: Latitude (-90 a 90)
- `lng`: Longitude (-180 a 180)

**Campos Opcionais**:
- `description`: Descrição da memória
- `photos`: Array de fotos (URLs ou base64)
- `spotifyUrl`: URL do Spotify
- `color`: Cor em hexadecimal (gerada automaticamente se não fornecida)

**Resposta de Sucesso (201)**:
```json
{
  "message": "Memória criada com sucesso",
  "memory": {
    "id": 1,
    "title": "Viagem à praia",
    "description": "Um dia incrível na praia com a família",
    "date": "2024-01-15",
    "lat": -23.5505,
    "lng": -46.6333,
    "photos": ["data:image/jpeg;base64,..."],
    "spotifyUrl": "https://open.spotify.com/track/...",
    "color": "#FF6B6B",
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:30:00Z"
  }
}
```

### 3. Obter Memória Específica
```http
GET /api/memories/{memory_id}
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "memory": {
    "id": 1,
    "title": "Viagem à praia",
    "description": "Um dia incrível na praia com a família",
    "date": "2024-01-15",
    "lat": -23.5505,
    "lng": -46.6333,
    "photos": ["data:image/jpeg;base64,..."],
    "spotifyUrl": "https://open.spotify.com/track/...",
    "color": "#FF6B6B",
    "created_at": "2024-01-15T14:30:00Z",
    "updated_at": "2024-01-15T14:30:00Z"
  }
}
```

### 4. Atualizar Memória
```http
PUT /api/memories/{memory_id}
```

**Headers**: `Authorization: Bearer <token>`

**Body**: Mesmos campos do POST (todos opcionais para atualização)

**Resposta de Sucesso (200)**:
```json
{
  "message": "Memória atualizada com sucesso",
  "memory": {
    // ... dados atualizados da memória
  }
}
```

### 5. Deletar Memória
```http
DELETE /api/memories/{memory_id}
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "message": "Memória deletada com sucesso"
}
```

### 6. Buscar Memórias Próximas
```http
GET /api/memories/nearby
```

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `lat`: Latitude central (obrigatório)
- `lng`: Longitude central (obrigatório)
- `radius`: Raio de busca (opcional, padrão: 0.01)

**Exemplo**: `/api/memories/nearby?lat=-23.5505&lng=-46.6333&radius=0.05`

**Resposta de Sucesso (200)**:
```json
{
  "memories": [
    // ... array de memórias próximas
  ],
  "total": 3
}
```

### 7. Estatísticas de Memórias
```http
GET /api/memories/stats
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "total_memories": 15
}
```

---

## 🎨 Endpoints de Temas (`/api/themes`)

### 1. Obter Tema do Usuário
```http
GET /api/themes
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "theme": {
    "id": 1,
    "gradientName": "Ocean",
    "gradientCss": "linear-gradient(135deg, #667eea, #764ba2)",
    "isActive": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### 2. Criar ou Atualizar Tema
```http
POST /api/themes
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "gradientName": "Ocean",
  "gradientCss": "linear-gradient(135deg, #667eea, #764ba2)",
  "isActive": true
}
```

**Campos Obrigatórios**:
- `gradientName`: Nome do gradiente
- `gradientCss`: CSS do gradiente

**Campos Opcionais**:
- `isActive`: Se o tema está ativo (padrão: true)

**Resposta de Sucesso (200)**:
```json
{
  "message": "Tema salvo com sucesso",
  "theme": {
    "id": 1,
    "gradientName": "Ocean",
    "gradientCss": "linear-gradient(135deg, #667eea, #764ba2)",
    "isActive": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### 3. Atualizar Tema Existente
```http
PUT /api/themes
```

**Headers**: `Authorization: Bearer <token>`

**Body**: Mesmos campos do POST (todos opcionais)

**Resposta de Sucesso (200)**:
```json
{
  "message": "Tema atualizado com sucesso",
  "theme": {
    // ... dados atualizados do tema
  }
}
```

### 4. Resetar Tema para Padrão
```http
POST /api/themes/reset
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "message": "Tema resetado para o padrão",
  "theme": {
    "id": 1,
    "gradientName": "default",
    "gradientCss": "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #ec4899 100%)",
    "isActive": true,
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
}
```

### 5. Ativar Tema
```http
POST /api/themes/activate
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "message": "Tema ativado com sucesso",
  "theme": {
    // ... dados do tema ativado
  }
}
```

### 6. Desativar Tema
```http
POST /api/themes/deactivate
```

**Headers**: `Authorization: Bearer <token>`

**Resposta de Sucesso (200)**:
```json
{
  "message": "Tema desativado com sucesso",
  "theme": {
    // ... dados do tema desativado
  }
}
```

### 7. Obter Temas Pré-definidos
```http
GET /api/themes/presets
```

**Autenticação**: Não requerida

**Resposta de Sucesso (200)**:
```json
{
  "presets": [
    {
      "name": "Sunset",
      "gradientName": "Sunset",
      "gradientCss": "linear-gradient(135deg, #ff7e5f, #feb47b)"
    },
    {
      "name": "Ocean",
      "gradientName": "Ocean",
      "gradientCss": "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      "name": "Forest",
      "gradientName": "Forest",
      "gradientCss": "linear-gradient(135deg, #11998e, #38ef7d)"
    },
    {
      "name": "Purple Dream",
      "gradientName": "Purple Dream",
      "gradientCss": "linear-gradient(135deg, #667eea, #764ba2)"
    },
    {
      "name": "Pink Bliss",
      "gradientName": "Pink Bliss",
      "gradientCss": "linear-gradient(135deg, #ff9a9e, #fecfef)"
    },
    {
      "name": "Golden Hour",
      "gradientName": "Golden Hour",
      "gradientCss": "linear-gradient(135deg, #ffecd2, #fcb69f)"
    },
    {
      "name": "Cool Blue",
      "gradientName": "Cool Blue",
      "gradientCss": "linear-gradient(135deg, #a8edea, #fed6e3)"
    },
    {
      "name": "Warm Sunset",
      "gradientName": "Warm Sunset",
      "gradientCss": "linear-gradient(135deg, #ff9a56, #ff6b6b)"
    }
  ]
}
```

---

## ⚠️ Códigos de Erro

### Códigos HTTP Utilizados
- **200**: Sucesso
- **201**: Criado com sucesso
- **400**: Erro de validação
- **401**: Não autorizado
- **404**: Não encontrado
- **500**: Erro interno do servidor

### Formato de Erro Padrão
```json
{
  "error": "Mensagem de erro descritiva"
}
```

### Exemplos de Erros Comuns

**400 - Dados inválidos**:
```json
{
  "error": "Nome, email e senha são obrigatórios"
}
```

**401 - Não autorizado**:
```json
{
  "error": "Credenciais inválidas"
}
```

**404 - Não encontrado**:
```json
{
  "error": "Memória não encontrada"
}
```

**500 - Erro interno**:
```json
{
  "error": "Erro interno do servidor"
}
```

---

## 🔧 Como o Backend Funciona

### 1. Inicialização da Aplicação
1. O arquivo `app.py` é o ponto de entrada
2. A função `create_app()` em `app_factory.py` cria a instância Flask
3. As configurações são carregadas de `config.py`
4. As extensões (SQLAlchemy, JWT, CORS) são inicializadas
5. Os blueprints (controladores) são registrados
6. As tabelas do banco são criadas automaticamente

### 2. Fluxo de Requisição
1. **Requisição HTTP** chega ao Flask
2. **CORS** verifica se a origem é permitida
3. **JWT** valida o token (se necessário)
4. **Controller** processa a requisição
5. **Repository** acessa o banco de dados
6. **Model** valida e manipula os dados
7. **Response** é retornada em JSON

### 3. Persistência de Dados
- **SQLite** é usado por padrão (desenvolvimento)
- **SQLAlchemy ORM** gerencia as operações do banco
- **Migrations** podem ser usadas para versionamento do schema
- **Relacionamentos** são definidos entre as tabelas:
  - User → Memory (1:N)
  - User → Theme (1:1)

### 4. Segurança
- **Senhas** são criptografadas com bcrypt
- **JWT tokens** têm expiração de 24 horas
- **CORS** é configurado para permitir apenas origens específicas
- **Validações** são feitas em múltiplas camadas

### 5. Validações Implementadas
- **Email**: formato válido e unicidade
- **Senha**: mínimo 6 caracteres
- **Coordenadas**: latitude (-90 a 90), longitude (-180 a 180)
- **Data**: formato YYYY-MM-DD
- **Cores**: formato hexadecimal
- **URLs**: formato válido para Spotify

---

## 🚀 Como Executar o Backend

### 1. Instalação
```bash
cd backend
pip install -r requirements.txt
```

### 2. Configuração
Crie um arquivo `.env` baseado no `.env.example`:
```env
FLASK_ENV=development
SECRET_KEY=sua-chave-secreta-super-segura
JWT_SECRET_KEY=sua-chave-jwt-super-segura
DATABASE_URL=sqlite:///memory_book.db
CORS_ORIGINS=http://localhost:5173
```

### 3. Execução
```bash
python app.py
```

A API estará disponível em `http://localhost:5000`

---

## 🧪 Testando a API

### Usando o Script de Teste
```bash
python test_api.py
```

### Usando curl
```bash
# Health check
curl http://localhost:5000/api/health

# Registro
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João","email":"joao@email.com","password":"senha123"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@email.com","password":"senha123"}'
```

---

## 📝 Notas para Desenvolvimento

### Adicionando Novos Endpoints
1. Crie o método no **Repository** correspondente
2. Adicione a validação no **Model** se necessário
3. Implemente o endpoint no **Controller**
4. Teste o endpoint
5. Atualize esta documentação

### Modificando Modelos
1. Altere o modelo em `src/models/`
2. Crie uma migration se necessário
3. Atualize o repository correspondente
4. Teste as alterações
5. Atualize a documentação

### Boas Práticas
- Sempre valide os dados de entrada
- Use os repositórios para acesso aos dados
- Mantenha os controladores simples
- Trate erros adequadamente
- Documente mudanças na API
- Escreva testes para novos recursos

---

## 🔗 Integração com o Frontend

### Como o Frontend Consome a API
1. **AuthContext** gerencia autenticação e tokens
2. **ApiContext** faz requisições HTTP para a API
3. **MemoryController** sincroniza memórias entre API e localStorage
4. **GradientContext** gerencia temas e gradientes

### Formato de Dados
- O backend retorna dados em **camelCase** para compatibilidade com JavaScript
- Campos como `spotify_url` são convertidos para `spotifyUrl`
- Datas são mantidas no formato ISO string
- Coordenadas são números float

### Sincronização
- Usuários autenticados: dados vêm da API
- Usuários não autenticados: dados vêm do localStorage
- Logout: apenas limpa dados do usuário, mantém memórias locais

---

Esta documentação deve ser atualizada sempre que novos endpoints forem adicionados ou modificados.