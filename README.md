# 🗺️ Memory-Book - Mapa de Memórias Afetivas

Um projeto desenvolvido por **Alberto Pontiery**, **Diogo Nascimento** e **Guilherme Franco** na matéria de Engenharia de Software que transforma lembranças em pontos interativos no mapa.  
A ideia é registrar momentos especiais (texto, fotos, descrições e localizações) e guardá-los em um espaço visual e afetivo. 💖  

---

## 🌟 Sobre o Projeto
O **Memory-Book** é uma aplicação web full-stack que permite:
- 📍 Marcar lugares importantes no mapa interativo
- 📝 Adicionar descrições detalhadas das lembranças
- 📷 Registrar fotos e cores personalizadas para cada memória
- 🎵 Integração com Spotify para adicionar trilha sonora às memórias
- 🗂️ Organizar memórias por data e visualizá-las em lista
- 👤 Sistema completo de autenticação e perfis de usuário
- 🎨 Temas e gradientes personalizáveis
- 📱 Interface responsiva para desktop e mobile

Mais do que um CRUD, é um espaço digital poético para revisitar histórias.  
 
---

## 📌 Funcionalidades Implementadas
- [x] **Mapa interativo** com React-Leaflet e OpenStreetMap
- [x] **Sistema de autenticação completo** (registro, login, logout)
- [x] **CRUD completo de memórias** (criar, visualizar, editar, excluir)
- [x] **Upload e visualização de fotos**
- [x] **Integração com Spotify** para adicionar músicas às memórias
- [x] **Sistema de cores personalizáveis** para cada memória
- [x] **Filtros e busca** por título, descrição e data
- [x] **Temas e gradientes dinâmicos** (Aurora, Sunset, Ocean, Forest, Cosmic)
- [x] **Interface responsiva** e moderna
- [x] **Banco de dados relacional** com SQLite/PostgreSQL
- [x] **API RESTful** completa com Flask
- [x] **Sistema de notificações** (toasts)
- [x] **Exportação de memórias** em PDF
- [x] **Persistência de dados** no backend

---

## 🏗️ Arquitetura e Tecnologias

### 🎯 Padrão Arquitetural
**Cliente-Servidor em Camadas com MVC (Model-View-Controller)**

```
┌──────────────────────────────┐
│ Frontend (React + Vite)      │
│ - Interface SPA              │
│ - React-Leaflet para mapas   │
│ - Context API para estado    │
└───────────────▲──────────────┘
                │
    Comunicação via API REST (JSON)
                │
┌───────────────▼──────────────┐
│ Backend (Flask + Python)     │
│ - Controllers MVC            │
│ - Repository Pattern         │
│ - JWT Authentication         │
└───────────────▲──────────────┘
                │
┌───────────────▼──────────────┘
│ Banco de Dados (SQLite)      │
│ - SQLAlchemy ORM             │
│ - Tabelas: Users, Memories,  │
│   Themes                     │
└──────────────────────────────┘
```

### 🛠️ Stack Tecnológica

#### Frontend
- **React 19.1.1** - Biblioteca para interfaces
- **Vite 7.1.7** - Build tool e dev server
- **React-Leaflet 5.0.0** - Mapas interativos
- **Leaflet 1.9.4** - Biblioteca de mapas
- **Lucide React 0.546.0** - Ícones modernos
- **jsPDF 3.0.3** - Geração de PDFs
- **Context API** - Gerenciamento de estado global

#### Backend
- **Flask 3.0.0** - Framework web Python
- **SQLAlchemy 3.1.1** - ORM para banco de dados
- **Flask-JWT-Extended 4.6.0** - Autenticação JWT
- **Flask-CORS 4.0.0** - Suporte a CORS
- **Flask-Migrate 4.1.0** - Migrações de banco
- **bcrypt 4.1.2** - Criptografia de senhas
- **Marshmallow 3.20.2** - Serialização de dados

#### Banco de Dados
- **SQLite** (desenvolvimento)
- **PostgreSQL** (produção - preparado)

---

## 🧩 Padrões de Projeto Implementados

### 📡 Padrão Observer
**Categoria:** Comportamental  
**Aplicação:** Gerenciamento de estado global da aplicação  

**Implementações:**
- **AuthContext**: Gerencia estado de autenticação
- **GradientContext**: Controla temas e gradientes
- **ToastContext**: Sistema de notificações globais

### 🏭 Factory Method Pattern
**Categoria:** Criacional  
**Aplicação:** Criação de modelos de dados no backend  

**Implementações:**
- **BaseModel**: Factory para criação de instâncias de modelos
- **User.create()**: Factory method para usuários
- **Memory.create()**: Factory method para memórias

### 🗃️ Repository Pattern
**Categoria:** Estrutural  
**Aplicação:** Abstração da camada de acesso a dados  

**Implementações:**
- **UserRepository**: Operações CRUD para usuários
- **MemoryRepository**: Operações CRUD para memórias
- **ThemeRepository**: Operações CRUD para temas

### 🧩 Component/Composite Pattern
**Categoria:** Estrutural  
**Aplicação:** Estrutura hierárquica de componentes React  

**Implementações:**
- Hierarquia de componentes reutilizáveis
- FormField, ConfirmationModal, Toast
- Estrutura modular e escalável

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

## 📊 Funcionalidades Técnicas

### 🔐 Autenticação e Segurança
- **JWT (JSON Web Tokens)** para autenticação
- **bcrypt** para hash de senhas
- **CORS** configurado para comunicação frontend/backend
- **Validação de dados** no frontend e backend

### 🗄️ Banco de Dados
- **Modelos relacionais** com SQLAlchemy
- **Migrações automáticas** com Flask-Migrate
- **Relacionamentos** entre usuários, memórias e temas
- **Timestamps** automáticos (created_at, updated_at)

### 🎨 Interface e UX
- **Design responsivo** com CSS3
- **Gradientes dinâmicos** personalizáveis
- **Animações suaves** e transições
- **Feedback visual** com toasts e loading states
- **Ícones modernos** com Lucide React

### 🗺️ Mapas e Geolocalização
- **React-Leaflet** para mapas interativos
- **OpenStreetMap** como provedor de tiles
- **Marcadores personalizados** com cores
- **Zoom e navegação** fluidos

---

## 🧪 Testes e Qualidade

### 📋 Plano de Qualidade
- **Revisão de código** entre membros da equipe
- **Testes manuais** de todas as funcionalidades
- **Validação de dados** no frontend e backend
- **Tratamento de erros** robusto
- **Documentação** completa da API

### 🎯 Métricas de Qualidade
| Métrica | Meta | Status |
|---------|------|--------|
| Tempo de resposta da API | ≤ 3s | ✅ |
| Cobertura de funcionalidades | 100% | ✅ |
| Interface responsiva | Mobile + Desktop | ✅ |
| Documentação | Completa | ✅ |

---

## 👥 Equipe de Desenvolvimento

| Membro | Papel Principal | Responsabilidades |
|--------|----------------|-------------------|
| **Alberto Pontiery** | Backend Developer | API Flask, banco de dados, autenticação |
| **Diogo Nascimento** | Frontend Developer | Interface React, mapas, UX/UI |
| **Guilherme Franco** | Full-Stack & QA | Integração, testes, qualidade |

---

## 📚 Documentação Adicional

- **[Documentação da API](backend/ENDPOINTS_DOCUMENTATION.md)** - Endpoints detalhados
- **[README do Backend](backend/README.md)** - Configuração específica do backend
- **Comentários no código** - Documentação inline

---

## 🔮 Próximas Funcionalidades

- [ ] **Compartilhamento de memórias** entre usuários
- [ ] **Modo colaborativo** para casais/famílias
- [ ] **Backup na nuvem** (AWS S3/Firebase)
- [ ] **Notificações push** para datas especiais
- [ ] **Integração com redes sociais**
- [ ] **Modo offline** com sincronização
- [ ] **Análise de sentimentos** nas descrições
- [ ] **Timeline** visual das memórias

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

**Desenvolvido com ❤️ por Alberto, Diogo e Guilherme**  
*Engenharia de Software - 2024*

