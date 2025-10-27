# 🗺️ Memory Book - Mapa de Memórias Afetivas

Um projeto desenvolvido por **Alberto Pontiery**, **Diogo Nascimento** e **Guilherme Pança** na matéria de Engenharia de Software que transforma lembranças em pontos interativos no mapa.  
A ideia é registrar momentos especiais (texto, fotos, descrições e localizações) e guardá-los em um espaço visual e afetivo.  

---

## 🌟 Sobre o Projeto
O **Memory-Book** é uma aplicação web full-stack que permite:
- 📍 Marcar lugares importantes no mapa interativo
- 📝 Adicionar descrições detalhadas das lembranças
- 📷 Registrar fotos e cores personalizadas para cada memória
- 🎵 Integração com Spotify para adicionar trilha sonora às memórias
- 🗂️ Organizar memórias por data e visualizá-las em lista
- 👤 Sistema de autenticação e perfis de usuário
- 🎨 Temas e gradientes personalizáveis
- 📱 Interface responsiva para desktop e mobile

Mais do que um CRUD, é um espaço digital poético para revisitar histórias.  
 
---

## 📌 Funcionalidades Implementadas
- [x] **Mapa interativo** com React-Leaflet e OpenStreetMap
- [x] **Sistema de autenticação** (registro, login, logout)
- [x] **CRUD de memórias** (criar, visualizar, editar, excluir)
- [x] **Upload e visualização de fotos**
- [x] **Integração com Spotify via link** para adicionar músicas às memórias
- [x] **Sistema de cores personalizáveis** para cada memória
- [x] **Filtros e busca** por data
- [x] **Temas e gradientes dinâmicos** (Aurora, Sunset, Ocean, Forest, Cosmic)
- [x] **Interface responsiva** desktop/mobile
- [x] **Banco de dados relacional** com SQLite e SQLAlchemy
- [x] **API RESTful** Flask
- [x] **Sistema de notificações** (toasts)
- [x] **Exportação de memórias** em PDF
- [x] **Persistência de dados** no backend

---

## 🧪 Gerência de Qualidade

### 📋 Plano de Qualidade de Software

#### Objetivos de Qualidade
- **Funcionalidade**: Sistema deve atender 100% dos requisitos funcionais
- **Usabilidade**: Interface intuitiva com tempo de aprendizado < 30 minutos
- **Manutenibilidade**: Códigos com cabeçalhos explicativos e comentários descritivos.

#### Processos de Garantia de Qualidade

**1. Revisão de Código**
- **Processo**: Todo código passa por revisão de pelo menos 1 membro da equipe
- **Ferramentas**: Git/GitHub para controle de versão e revisões utilizando branches para compartimentar as interações de cada integrante.

**2. Testes e Validação**
- **Testes de Interface**: Validação manual feita por todos os integrantes para verificar as funcionalidades do programa, como (login, registro, criação de memória, exclusão, alteração de temas... etc)
- **Testes de Usabilidade**: Navegação e experiência do usuário com demonstrações para terceiros.

**3. Controle de Qualidade de Dados**
- **Validação Frontend**: Verificação de campos obrigatórios.
- **Validação Backend**: Validação de dados recebidos.
- **Tratamento de Erros**: Avisos de erros na UI.

#### 📊 Métricas e Indicadores de Qualidade

| Métrica | Status |
|---------|-------|
| **Interface responsiva** | ✅ |
| **Documentação de código** | ✅ |
| **Conformidade com padrões de arquitetura e projetos** | ✅ |
| **Manutenibilidade** | ✅ |

---

## 👥 Equipe de Desenvolvimento

| Membro | Papel Principal | Responsabilidades |
|--------|----------------|-------------------|
| **Alberto Pontiery** | Backend Developer | API Flask, banco de dados, autenticação |
| **Diogo Nascimento** | Frontend Developer | Interface React, mapas, UX/UI |
| **Guilherme Franco** | Full-Stack & QA | Integração, testes, qualidade |

---


## 🏗️ Arquitetura e Decisões Técnicas

## Análise dos Requisitos do Projeto

O **Memory Book** é um sistema web interativo que permite aos usuários registrar lembranças pessoais em pontos geográficos, com textos e mídias associadas.  
A arquitetura precisa ser modular, escalável e preparada para futuras funcionalidades, como upload de mídias e autenticação de usuários.

### Requisitos Funcionais (RF)

| Código | Descrição |
|:-------|:-----------|
| **RF01** | Criar, visualizar, editar e excluir memórias geolocalizadas. |
| **RF02** | Exibir memórias em um mapa interativo. |
| **RF03** | Filtrar memórias por data. |
| **RF04** | Compartilhar memórias. |
| **RF05** | Adicionar fotos. |

### Requisitos Não Funcionais (RNF)

| Código | Descrição |
|:-------|:-----------|
| **RNF01** | Interface responsiva e intuitiva (mobile e desktop). |
| **RNF02** | Persistência de dados em banco relacional. |
| **RNF03** | Código de fácil manutenção. |
| **RNF04** | Autenticação e controle de acesso. |

### Implicações Arquiteturais

- O sistema deve manter **fronteiras claras entre frontend e backend**.   
- Requer **API leve e responsiva** para comunicação em tempo real com o mapa.  
- A estrutura precisa facilitar **manutenibilidade** do código.

---

## Escolha do Padrão de Arquitetura Base

### Padrão Arquitetural Adotado

Arquitetura Cliente-Servidor em Camadas com o padrão MVC (Model-View-Controller)

| Critério | Decisão | Benefício |
|:----------|:--------|:----------|
| **Escalabilidade** | Separação entre frontend e backend | Permite evolução independente de cada camada. |
| **Desempenho** | API RESTful leve | Garante comunicação rápida e flexível. |
| **Manutenibilidade** | Arquitetura em camadas | Possibilita substituição ou melhoria sem impacto global. |
| **Experiência do usuário** | SPA responsiva (React + Leaflet) | Atualizações dinâmicas e fluídas sem recarregar a página. |

> Essa abordagem combina a separação de responsabilidades do **MVC** com a distribuição lógica do **cliente-servidor**, o que garante escalabilidade e organização.

### Justificativa da Escolha

A arquitetura **Cliente-Servidor em Camadas com MVC** foi escolhida porque equilibra **simplicidade e extensibilidade**.  
Ela permite o isolamento entre interface, regras de negócio e persistência de dados, o que torna o sistema mais **robusto, testável e escalável**.  

Além disso, esse padrão é amplamente recomendado para aplicações **web distribuídas**, conforme **Sommerville (2019)** e **Pressman (2016)**, pois facilita a **manutenibilidade e modularidade**, reduzindo riscos durante a evolução do software.  

> Em resumo, essa escolha garante uma base sólida para crescimento incremental, sem comprometer desempenho ou clareza estrutural.
---

### 🏛️ Diagrama de Arquitetura Detalhado

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                   │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React + Vite) - Port 5173                        │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   Views     │ │ Components  │ │  Contexts   │            │
│  │ - MapView   │ │ - LoginForm │ │ - AuthCtx   │            │
│  │ - AppHeader │ │ - MemoryForm│ │ - ToastCtx  │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                           │                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Controllers │ │   Models    │ │   Utils     │            │
│  │ - MemoryCtrl│ │ - Memory.js │ │ - api.js    │            │
│  │             │ │ - User.js   │ │ - helpers   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                    HTTP/JSON REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APLICAÇÃO                      │
├─────────────────────────────────────────────────────────────┤
│  Backend (Flask + Python) - Port 5000                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Controllers │ │   Routes    │ │ Middlewares │            │
│  │ - AuthCtrl  │ │ - /api/auth │ │ - JWT Auth  │            │
│  │ - MemoryCtrl│ │ - /api/mem  │ │ - CORS      │            │
│  │ - ThemeCtrl │ │ - /api/theme│ │ - Validation│            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                           │                                 │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Repositories│ │   Models    │ │   Utils     │            │
│  │ - UserRepo  │ │ - User      │ │ - Helpers   │            │
│  │ - MemoryRepo│ │ - Memory    │ │ - Validators│            │
│  │ - ThemeRepo │ │ - Theme     │ │ - Security  │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└─────────────────────────────────────────────────────────────┘
                              │
                        SQLAlchemy ORM
                              │
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE DADOS                          │
├─────────────────────────────────────────────────────────────┤
│  Banco de Dados (SQLite/PostgreSQL)                         │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   users     │ │  memories   │ │   themes    │            │
│  │ - id (PK)   │ │ - id (PK)   │ │ - id (PK)   │            │
│  │ - name      │ │ - title     │ │ - name      │            │
│  │ - email     │ │ - desc      │ │ - gradient  │            │
│  │ - password  │ │ - lat/lng   │ │ - user_id   │            │
│  │ - created   │ │ - user_id   │ │ - created   │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
│                    (FK: user_id)   (FK: user_id)            │
└─────────────────────────────────────────────────────────────┘
```

## 🧩 Padrões de Projeto Implementados

### 📡 Padrão Observer (Comportamental) - Frontend

### ❓ Por que utilizamos?
Para **sincronizar automaticamente** a interface quando dados importantes mudam (como login/logout do usuário).

### 🔧 Que problema resolve?
**Problema:** Quando o usuário faz login, TODOS os componentes da tela precisam saber disso para se atualizar.
**Solução:** Um "observador central" avisa todos os componentes interessados automaticamente.

### 💻 Como aplicamos no frontend?
1. **Usuário faz login** → Digita email/senha e clica "Entrar"
2. **AuthContext recebe a informação** → "Usuário logou!"
3. **AuthContext avisa TODOS automaticamente** → Como um mensageiro
4. **Componentes reagem sozinhos:**
   - `GradientContext` → Carrega gradiente escolhido e aplica na tela
   - `MapThemeContext` → Carrega preferência de mapa
   - `AppHeader` → Carrega o contador de memórias
   - `MapView` → Carrega as memórias do usuário
   

**Diagrama do Padrão Observer:**
```
                            AuthContext (Subject)
                                       |     
                                       | notifica
                                       |
         ┌───────────────────┬───────────────────┬───────────────────┐
         ↓                   ↓                   ↓                   ↓
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  GradientContext│ │ MapThemeContext │ │    AppHeader    │ │     MapView     │
│   (Observer)    │ │   (Observer)    │ │   (Observer)    │ │   (Observer)    │
│                 │ │                 │ │                 │ │                 │
│ - Carrega prefs │ │ - Carrega prefs │ │ - carrega o     │ │ - Carrega       │
│   do gradiente  │ │   do mapa       │ │   contador de   │ │   memórias      │
│ - Aplica        │ │ - Aplica tema   │ │   memórias      │ │ - Atualiza      │
│   gradiente     │ │   do mapa       │ │                 │ │   interface     │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### 🧩 Component/Composite Pattern (Estrutural) - Frontend

### ❓ Por que utilizamos?
Para **construir interfaces complexas** juntando peças pequenas e reutilizáveis.

### 🔧 Que problema resolve?
**Problema:** Interface complexa é difícil de manter e repetir código.
**Solução:** Quebrar em "peças LEGO" que se encaixam para formar qualquer tela.

### 💻 Como aplicamos no frontend?

**1. Componentes Leaf (Peças básicas):**
- **FormField**: É o arquivo `components/FormField.jsx`
- Componente simples que não contém outros componentes
- Usado para: inputs de email, senha, título, local, nome

**2. Componentes Composite (Juntam peças):**
- **LoginForm**: Junta 2 FormField + 1 Button
- **MemoryForm**: Junta 2 FormField + 1 Button  
- **RegisterForm**: Junta 3 FormField + 1 Button
- **ProfileModal**: Junta 1 FormField + 1 Button

**Diagrama do Component Pattern:**
```
                         App (Composite)
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   LoginForm              MemoryForm           RegisterForm
  (Composite)            (Composite)           (Composite)
        │                     │                     │
   ┌────┼────┐           ┌────┼────┐           ┌────┼────┬────┐
   ▼    ▼    ▼           ▼    ▼    ▼           ▼    ▼    ▼    ▼
FormField FormField   FormField FormField   FormField FormField FormField Button
 Email   Senha        Título   Local        Nome    Email   Senha
(Leaf)  (Leaf)       (Leaf)   (Leaf)       (Leaf)  (Leaf)  (Leaf)  (Leaf)

🎯 MESMA PEÇA FormField REUTILIZADA 7 VEZES EM 3 LUGARES DIFERENTES!
```

### 🏭 Factory Method Pattern (Criacional) - Backend
**Aplicação:** Criação de modelos de dados no backend  
**Justificativa:**
- **Encapsulamento**: Lógica de criação centralizada e reutilizável
- **Validação**: Garantia de que objetos são criados com dados válidos
- **Flexibilidade**: Permite diferentes formas de criação sem alterar código cliente
- **Consistência**: Padronização na criação de instâncias

**Implementações:**
- **BaseModel.create()**: Factory method base para todos os modelos
- **User.create()**: Factory method específico com hash de senha
- **Memory.create()**: Factory method para memórias com validações
- **Theme.create()**: Factory method para temas personalizados

**Diagrama do Factory Method:**
```
┌─────────────────────────────────────────────────────────┐
│                    BaseModel                            │
│                   (Creator)                             │
├─────────────────────────────────────────────────────────┤
│ + create(**kwargs): BaseModel                           │
│ + save(): self                                          │
│ + delete(): void                                        │
│ + to_dict(): dict                                       │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │ herda
            ┌───────────────┼────────────────┐
            │               │                │
┌───────────▼─────┐ ┌───────▼──────┐ ┌───────▼──────┐
│      User       │ │    Memory    │ │    Theme     │
│ (ConcreteCreator│ │(ConcreteCreat│ │(ConcreteCreat│
├─────────────────┤ ├──────────────┤ ├──────────────┤
│+ create(name,   │ │+ create(     │ │+ create(     │
│  email, pass)   │ │  title, lat, │ │  user_id,    │
│  : User         │ │  lng): Mem   │ │  colors)     │
│                 │ │              │ │  : Theme     │
│- _hash_password │ │- _validate_  │ │- _validate_  │
│  (password)     │ │  coords()    │ │  colors()    │
└─────────────────┘ └──────────────┘ └──────────────┘
```

### 🗃️ Repository Pattern (Estrutural) - Backend
**Aplicação:** Abstração da camada de acesso a dados  
**Justificativa:**
- **Separação de responsabilidades**: Lógica de negócio separada do acesso a dados
- **Testabilidade**: Facilita criação de mocks para testes unitários
- **Flexibilidade**: Permite trocar implementação de persistência sem afetar controllers
- **Reutilização**: Operações CRUD padronizadas e reutilizáveis

**Implementações:**
- **BaseRepository**: Repositório abstrato com operações CRUD básicas
- **UserRepository**: Operações específicas para usuários (busca por email, etc.)
- **MemoryRepository**: Operações para memórias (busca por usuário, localização)
- **ThemeRepository**: Operações para temas personalizados

**Diagrama do Repository Pattern:**
```
┌─────────────────┐    usa    ┌─────────────────┐    acessa   ┌─────────────────┐
│   Controllers   │ ────────> │   Repositories  │ ──────────> │   Models/DB     │
│                 │           │                 │             │                 │
│ - AuthController│           │ - UserRepository│             │ - User          │
│ - MemoryCtrl    │           │ - MemoryRepo    │             │ - Memory        │
│ - ThemeCtrl     │           │ - ThemeRepo     │             │ - Theme         │
└─────────────────┘           └─────────────────┘             └─────────────────┘

┌─────────────────────────────────────────────────────────┐
│                BaseRepository                           │
│                 (Abstract)                              │
├─────────────────────────────────────────────────────────┤
│ + create(**kwargs): Model                               │
│ + get_by_id(id): Model                                  │
│ + get_all(): List[Model]                                │
│ + update(id, **kwargs): Model                           │
│ + delete(id): bool                                      │
└─────────────────────────────────────────────────────────┘
                            ▲
                            │ implementa
            ┌───────────────┼───────────────┐
            │               │               │
┌───────────▼─────┐ ┌───────▼─────┐ ┌───────▼─────┐
│ UserRepository  │ │MemoryRepo   │ │ThemeRepo    │
├─────────────────┤ ├─────────────┤ ├─────────────┤
│+ get_by_email() │ │+ get_by_user│ │+ get_by_user│
│+ authenticate() │ │+ get_by_loc │ │+ update_    │
│+ update_prefs() │ │+ search()   │ │  colors()   │
└─────────────────┘ └─────────────┘ └─────────────┘
```

### 🏛️ Facade Pattern (Estrutural)
**Aplicação:** Simplificação da interface de comunicação com a API  
**Justificativa:**
- **Simplicidade**: Interface única e simples para operações complexas da API
- **Desacoplamento**: Frontend não precisa conhecer detalhes da implementação da API
- **Centralização**: Lógica de autenticação, tratamento de erros e configurações centralizadas
- **Manutenibilidade**: Mudanças na API requerem alterações apenas no Facade

**Implementações:**
- **ApiFacade**: Classe principal que encapsula todas as operações da API
- **TokenManager**: Gerenciamento centralizado de tokens JWT
- **ApiError**: Tratamento padronizado de erros da API
- **api (objeto)**: Interface simplificada para uso direto nos componentes

**Diagrama do Facade Pattern:** - Integração
```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Components                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ LoginForm   │  │ MemoryForm  │  │ ProfileModal│              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────┬───────────────────────────────────────┘
                          │ usa interface simples
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      ApiFacade                                  │
│                    (Facade Class)                               │
├─────────────────────────────────────────────────────────────────┤
│ + register(userData): Promise                                   │
│ + login(credentials): Promise                                   │
│ + getMemories(): Promise                                        │
│ + addMemory(memoryData): Promise                                │
│ + updateUserProfile(userId, data): Promise                      │
│ + deleteMemory(memoryId): Promise                               │
│ - #makeRequest(endpoint, options): Promise                      │
└─────────────────────────┬───────────────────────────────────────┘
                          │ coordena subsistemas
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Subsistemas Complexos                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │TokenManager │  │   ApiError  │  │ HTTP Client │              │
│  │             │  │             │  │   (fetch)   │              │
│  │- getToken() │  │- status     │  │- headers    │              │
│  │- setToken() │  │- message    │  │- auth       │              │
│  │- isValid()  │  │- data       │  │- CORS       │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```



### 🎯 Organização por Integrante da Equipe

**Diogo Nascimento - Frontend Lead:**
- **Observer Pattern**: Implementação dos Contexts (AuthContext, GradientContext, ToastContext)
- **Component Pattern**: Estrutura de componentes React reutilizáveis

**Alberto Pontiery - Backend Lead:**
- **Factory Method Pattern**: BaseModel e factory methods para criação de objetos
- **Repository Pattern**: Implementação dos repositórios para acesso a dados

**Guilherme Pança - Full-Stack:**
- **Facade Pattern**: ApiFacade para simplificar comunicação entre frontend e backend

---

## 📁 Estrutura do Projeto

```
Memory-Book/
│
├── frontend/                   # Frontend React + Vite
│   ├── src/
│   │   ├── components/         # Componentes reutilizáveis
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── MemoryForm.jsx
│   │   │   ├── MemoryListModal.jsx
│   │   │   ├── MemoryMarker.jsx
│   │   │   ├── ConfirmationModal.jsx
│   │   │   └── FormField.jsx
│   │   ├── contexts/           # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   ├── GradientContext.jsx
│   │   │   └── ToastContext.jsx
│   │   ├── controllers/        # Controladores de estado
│   │   │   └── MemoryController.jsx
│   │   ├── models/             # Modelos de dados
│   │   │   ├── Memory.js
│   │   │   └── MemoryRepository.js
│   │   ├── views/              # Páginas principais
│   │   │   ├── MapView.jsx
│   │   │   └── AppHeader.jsx
│   │   ├── utils/              # Utilitários
│   │   └── assets/             # Recursos estáticos
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Backend Flask + Python
│   ├── src/
│   │   ├── models/             # Modelos SQLAlchemy
│   │   │   ├── base_model.py
│   │   │   ├── user.py
│   │   │   ├── memory.py
│   │   │   └── theme.py
│   │   ├── repositories/       # Repository Pattern
│   │   │   ├── base_repository.py
│   │   │   ├── user_repository.py
│   │   │   ├── memory_repository.py
│   │   │   └── theme_repository.py
│   │   ├── controllers/        # Controllers MVC
│   │   │   ├── auth_controller.py
│   │   │   ├── memory_controller.py
│   │   │   └── theme_controller.py
│   │   ├── config.py
│   │   ├── app_factory.py
│   │   └── database.py
│   ├── app.py                  # Ponto de entrada
│   ├── requirements.txt        # Dependências Python
│   ├── reset_db.py            # Script de reset do banco
│   ├── test_api.py            # Testes da API
│   └── ENDPOINTS_DOCUMENTATION.md
│
└── README.md                   # Documentação principal
```

---


## 🚀 Como Rodar o Projeto

### Pré-requisitos
- **Python 3.8+** (para o backend)
- **Node.js 16+** (para o frontend)
- **npm ou yarn** (gerenciador de pacotes)


### 🔧 Configuração do Backend

```bash
# Entre na pasta do backend
cd backend

# Crie um ambiente virtual Python
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env conforme necessário

# Execute o servidor backend
python app.py
```

O backend estará rodando em `http://127.0.0.1:5000`

### 🎨 Configuração do Frontend

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

### 🗄️ Reset do Banco de Dados

```bash
# Na pasta backend, execute:
python reset_db.py
```

---

## 🎮 Como Usar a Aplicação

### 1. **Autenticação**
- Acesse `http://localhost:5173`
- **Cadastre-se** com nome, email e senha
- **Faça login** com suas credenciais

### 2. **Criando Memórias**
- **Clique em qualquer lugar do mapa** para adicionar uma nova memória
- Preencha os dados:
  - **Título** da memória
  - **Descrição** detalhada
  - **Data** do acontecimento
  - **Foto** (upload de imagem)
  - **Cor** personalizada
  - **URL do Spotify** (opcional)
- **Salve** a memória

### 3. **Visualizando Memórias**
- **Clique nos marcadores** no mapa para ver detalhes
- Use o botão **"Minhas Memórias"** para ver todas em lista
- **Filtre** por título, descrição ou data
- **Edite ou exclua** memórias existentes

### 4. **Personalização**
- Acesse o **perfil** no canto superior direito
- Escolha entre diferentes **gradientes**:
  - 🌅 Aurora (rosa/roxo)
  - 🌇 Sunset (laranja/vermelho)
  - 🌊 Ocean (azul/ciano)
  - 🌲 Forest (verde)
  - 🌌 Cosmic (roxo/azul escuro)

### 5. **Funcionalidades Extras**
- **Exportar memórias** em PDF
- **Integração com Spotify** para trilha sonora
- **Interface responsiva** para mobile
- **Sistema de notificações** para feedback

---

## 📚 Documentação Adicional

- **[Documentação da API](backend/ENDPOINTS_DOCUMENTATION.md)** - Endpoints detalhados
- **[README do Backend](backend/README.md)** - Configuração específica do backend
- **Comentários no código** - Documentação inline

---

## 📄 Licença

Este projeto foi desenvolvido para fins acadêmicos na disciplina de Engenharia de Software.

---

## 🤝 Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

**Desenvolvido por Alberto, Diogo e Guilherme**  
*Engenharia de Software - 2025*

