# 🗺️ Memory Book

> Um projeto desenvolvido por Alberto Pontiery, Diogo Nascimento e Guilherme Pança na matéria de Engenharia de Software que transforma lembranças em pontos interativos no mapa.
A ideia é registrar momentos especiais (texto, fotos, descrições e localizações) e guardá-los em um espaço visual e afetivo.

---

## 📖 Sobre o Projeto

**Memory Book** é uma aplicação web Full Stack desenvolvida com o objetivo de conectar memórias pessoais a locais geográficos. O sistema permite que usuários registrem momentos especiais fixando "pins" em um mapa interativo, enriquecendo cada memória com fotos, vídeos curtos e trilhas sonoras integradas ao Spotify.

Este projeto foi construído com foco em **Engenharia de Software**, aplicando padrões de projeto (Design Patterns), arquitetura modular e boas práticas de desenvolvimento como testes automatizados e integração contínua.

---

## 🚀 Funcionalidades Principais

*   **📍 Mapeamento Interativo:** Navegação fluida pelo mapa mundi para criação e visualização de memórias (via *Leaflet*).
*   **📸 Upload de Mídias:** Suporte para upload de fotos e vídeos (com validação de duração e otimização).
*   **🎵 Integração Spotify:** Busca em tempo real e anexo de músicas às memórias utilizando a API do Spotify.
*   **🎨 Temas Dinâmicos:** Sistema de personalização visual com múltiplos gradientes (Sunset, Ocean, Aurora), persistidos por usuário.
*   **🔒 Autenticação Segura:** Sistema completo de login/registro com JWT (JSON Web Tokens).
*   **📱 Design Responsivo:** Interface adaptável para dispositivos móveis e desktop.

---

## 🛠️ Tecnologias e Arquitetura

O projeto segue uma arquitetura **Client-Server** desacoplada (REST API), facilitando a escalabilidade e manutenção.

### Frontend (Client)
*   **Core:** React.js (Vite)
*   **Map Engine:** Leaflet & React-Leaflet
*   **Estilização:** CSS Modules & Lucide Icons
*   **Padrões de Projeto:**
    *   *Observer Pattern:* Implementado explicitamente para sincronização de estado de autenticação e preferências de tema (`GradientContext.jsx`).
    *   *Context Pattern:* Gerenciamento global de estados.
    *   *Facade Pattern:* Abstração das chamadas de API (`api.js`).

### Backend (Server)
*   **Core:** Flask (Python 3.12)
*   **ORM:** SQLAlchemy
*   **Database:** SQLite (Dev) / PostgreSQL (Prod/Neon)
*   **Testes:** Pytest & Pytest-Cov
*   **Padrões de Projeto:**
    *   *Factory Method:* Criação da aplicação (`app_factory.py`).
    *   *Strategy Pattern:* Gestão de configurações por ambiente (Dev/Prod).
    *   *Blueprints:* Modularização de rotas e controllers.

---

## 📂 Estrutura do Projeto

```
Memory-Book/
├── backend/                # API Server (Flask)
│   ├── src/
│   │   ├── controllers/    # Lógica de endpoints
│   │   ├── models/         # Modelos de dados (SQLAlchemy)
│   │   ├── repositories/   # Camada de acesso a dados
│   │   └── utils/          # Helpers (Spotify, Validadores)
│   ├── tests/              # Testes automatizados (Pytest)
│   └── app.py              # Entry point
│
└── frontend/               # SPA Client (React)
    ├── src/
    │   ├── components/     # Componentes UI reutilizáveis
    │   ├── contexts/       # Gestão de estado global
    │   └── utils/          # Integrações (API Facade)
    └── index.html
```

---

## ⚡ Como Executar Localmente

### Pré-requisitos
*   Python 3.10+
*   Node.js 18+

### 1. Configuração do Backend
```bash
cd backend
# Crie e ative o ambiente virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente (.env)
cp .env.example .env
# (Edite o .env com suas credenciais do Spotify se necessário)

# Inicie o servidor
flask run
```

### 2. Configuração do Frontend
```bash
cd frontend
# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
Acesse `http://localhost:5173` no seu navegador.

---

## 🧪 Testes Automatizados

O projeto possui uma suíte robusta de testes cobrindo autenticação, manipulação de mídias e lógica de negócios.

```bash
# Executar todos os testes com relatório de cobertura
cd backend
pytest --cov=src
```

---

## ☁️ Deploy

O projeto está configurado para deploy contínuo em ambiente serverless:
*   **Frontend:** Vercel
*   **Backend:** Render
*   **Database:** Neon (PostgreSQL)

---

Desenvolvido para fins acadêmicos.
