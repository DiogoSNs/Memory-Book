# 🗺️ Mapa de Memórias Afetivas

Um projeto desenvolvido por Alberto Pontiery, Diogo Nascimento e Guilherme Franco na matéria de Engenharia de Software que transforma lembranças em pontos interativos no mapa.  
A ideia é registrar momentos especiais (texto, fotos, áudios ou vídeos) e guardá-los em um espaço visual e afetivo. 💖  

---

## 🌟 Sobre o Projeto
O **Mapa de Memórias Afetivas** é um aplicativo web que permite:
- 📍 Marcar lugares importantes no mapa.  
- 📝 Adicionar descrições curtas das lembranças.  
- 📷 Registrar fotos, 🎤 músicas ou 🎥 vídeos.  
- 🗂️ Organizar memórias por tags, data ou humor.  
- 🤝 Compartilhar com amigos, família ou casal.  

Mais do que um CRUD, é um espaço digital poético para revisitar histórias.  
 
---

## 📌 Funcionalidades (Backlog Inicial)
- [ ] Mapa interativo base  
- [ ] Adicionar marcador manual  
- [ ] Autenticação de usuários (login/cadastro)  
- [ ] Salvar memórias no banco de dados  
- [ ] Upload de fotos e áudios  
- [ ] Visualização de memórias salvas  
- [ ] Filtros por tags/data  
- [ ] Versão colaborativa (compartilhar memórias)  

---

## 🎨 Diferenciais
- Design minimalista e acolhedor.  
- Cores diferentes para cada tipo de lembrança.  
- Animações suaves ao abrir memórias.  
- Opção de exportar sua linha do tempo.  

---
# 🧩 Proposta de Arquitetura — Sistema *Memory Book*

## Análise dos Requisitos do Projeto

### Requisitos Funcionais Principais (RF)

- **RF01–RF03:** Criar, visualizar, editar e excluir memórias geolocalizadas.
- **RF04:** Filtrar memórias por data, tag ou tipo de mídia.
- **RF05:** Compartilhar memórias via link ou QR Code.
- **RF06 (futuro):** Anexar mídias (fotos, vídeos e áudios).

### Requisitos Não Funcionais (RNF)

- **RNF01:** Interface responsiva e mobile-friendly.
- **RNF02:** Persistência em banco relacional (PostgreSQL).
- **RNF03:** Tempo de resposta ≤ 3 s.
- **RNF04:** Interface simples e intuitiva.
- **RNF05 (futuro):** Autenticação segura e controle de acesso.

### Implicações Arquiteturais

- Separação clara entre cliente e servidor.
- Baixo acoplamento entre camadas, permitindo expansão futura (upload de mídia, login, etc.).
- Uso de dados geográficos exige suporte geoespacial — **PostGIS** (extensão do PostgreSQL) recomendado.
- Performance e organização são essenciais — recomenda-se arquitetura em camadas (MVC).

---

## Escolha do Padrão de Arquitetura Base

🔹 **Padrão escolhido:** Arquitetura em Camadas com o padrão **MVC (Model–View–Controller)**

### Justificativa (resumida)

| Critério | Decisão / Benefício |
|---|---|
| Organização modular | Camadas separam responsabilidades entre interface (frontend), lógica (controllers) e dados (models/db). |
| Aderência aos RF/RNF | Permite desenvolvimento paralelo e atende requisitos de responsividade e manutenibilidade. |
| Escalabilidade futura | Autenticação e upload de mídias podem ser adicionados sem reestruturar a base. |
| Reuso e testabilidade | Controllers e Models testáveis isoladamente. |
| Desempenho e segurança | Backend (Express/Node) como camada intermediária para regras e proteção. |
| Integração eficiente | API RESTful conecta frontend React ao backend Node.js via JSON. |

> O padrão MVC em camadas equilibra clareza estrutural, facilidade de manutenção e flexibilidade para expansão.

---

## Conexão da Proposta com o Projeto — Estrutura Inicial

```
mapa-memorias-afetivas/
│
├── backend/                  # API e regras de negócio
│   ├── server.js             # Ponto de entrada do servidor Express
│   ├── db.js                 # Conexão com o banco de dados PostgreSQL
│   ├── routes/               # Rotas da API
│   │   └── memories.js       # Rotas para CRUD de memórias
│   ├── models/               # Modelos de dados (opcional, para escalar)
│   │   └── memory.js
│   └── package.json          # Dependências do backend
│
├── frontend/                 # Interface do usuário (React)
│   ├── src/
│   │   ├── App.jsx           # Componente raiz
│   │   ├── api.js            # Configuração Axios (comunicação com backend)
│   │   ├── components/
│   │   │   ├── MapView.jsx   # Mapa interativo (Leaflet)
│   │   │   └── MemoryForm.jsx# Formulário (futuro: adicionar fotos/áudios)
│   │   └── assets/           # Imagens, ícones, etc.
│   ├── index.html            # Página principal
│   └── package.json          # Dependências do frontend
│
├── README.md                 # Documentação do projeto
└── docker-compose.yml        # (opcional) para rodar backend + banco
```

### Fluxo e Conexão entre as Camadas (visão simplificada)

- **Frontend (React)**
  - Componente principal (`App.jsx`) consome a API via `api.js` (Axios) e exibe mapa/menus.
- **Backend (Node.js + Express)**
  - Rotas → Controllers → Models (Sequelize) → DB.
- **Banco (PostgreSQL + PostGIS)**
  - Tabela `memories` com colunas: `id`, `titulo`, `descricao`, `lat`, `long`, `data`, `tags`, `media_refs`.

Dados trafegam em JSON (Axios) e consultas geoespaciais são feitas via SQL/PostGIS.

---

## 4. Especificação por Camada (Rápida)

- **Apresentação (View)**
  - Função: UI (mapa, formulários, listagens).
  - Tecnologias: React.js + Leaflet.js + Axios.

- **Controle (Controller)**
  - Função: interpretar requisições, validação e orquestração.
  - Tecnologias: Node.js + Express.js.

- **Modelo (Model)**
  - Função: definir estruturas e persistência.
  - Tecnologias: Sequelize ORM + PostgreSQL.

- **Banco de Dados**
  - Função: armazenar memórias e coordenadas.
  - Tecnologias: PostgreSQL + PostGIS.

- **Infraestrutura (opcional)**
  - Docker + docker-compose para ambiente local padronizado.

- **Segurança (futuro)**
  - JWT / OAuth2 para autenticação e controle de acesso.

- **Integrações (futuro)**
  - Armazenamento de mídia: AWS S3 ou Firebase Storage.

---

## 🧱 Decisões Arquiteturais Fundamentais

- **MVC em Camadas** — separação de responsabilidades, facilita manutenção e testes.
- **API RESTful** — comunicação leve e padrão entre frontend e backend.
- **PostgreSQL + PostGIS** — suporte geoespacial nativo, ideal para buscas por proximidade/área.
- **Frontend desacoplado (SPA)** — interface dinâmica e responsiva.
- **Uso opcional de Docker** — padroniza ambiente de desenvolvimento / CI.
- **Extensibilidade** — arquitetura pensada para evoluir com autenticação e mídia.

---

## Observações e Próximos Passos Recomendados

1. **Modelagem detalhada do banco** — definir colunas, índices geoespaciais e políticas de particionamento/retenção.
2. **Contrato da API (OpenAPI/Swagger)** — documentar endpoints para front/back integrados.
3. **Plano de autenticação (MVP vs Futuro)** — decidir se o MVP terá login ou será público inicialmente.
4. **Estratégia de armazenamento de mídia** — interna (DB/FS) vs externa (S3/Firebase) e impacto de custos.
5. **Testes & CI** — pipeline básico (lint, unit tests, migration tests) e deploy automatizado.

---
---
## 🔄 Fluxo de Funcionamento

- Usuário -> Frontend (React + Leaflet) -> API Backend (Express) -> Banco (PostgreSQL)
  
---

## 📷 Protótipo (Preview)


![Protótipo 1](img/img1.jpg)
![Protótipo 2](img/img2.png)
![Protótipo 3](img/img3.jpg)


---
---

## 🧩 Plano de Gerenciamento de Qualidade

O presente plano define os processos e padrões adotados pela equipe para assegurar a **qualidade do produto e do processo** durante o desenvolvimento do projeto **Mapa de Memórias Afetivas**.

### 👥 Papéis e Responsabilidades
| Papel | Responsável | Atribuições |
|-------|--------------|-------------|
| Integração e Qualidade | Guilherme Franco | Garante a integração entre frontend e backend, valida a comunicação entre as APIs e verifica a consistência dos dados. |
| Desenvolvedor Backend | Alberto Pontiery | Implementa API, banco de dados e rotas de comunicação. |
| Desenvolvedor Frontend | Diogo Nascimento | Cria a interface interativa e integra o frontend à API. |
| QA / Revisor | Rotativo entre os membros | Realiza testes, revisa código e valida requisitos. |

---

### 🧱 Padrões de Desenvolvimento e Ferramentas
- **Frontend:** React + Vite + Axios 
- **Backend:** Node.js + Express  
- **Banco de Dados:** PostgreSQL  
- **Controle de Versão:** Git + GitHub (branches `feature/`, `dev`, `main`)  
- **Documentação:** README + relatórios em LaTeX  
- **Gestão de Tarefas:** Trello  

Todos os membros seguem um padrão de código limpo, com boas práticas de nomeação, versionamento e comentários explicativos.  
Ferramentas auxiliares como **ESLint** e **Prettier** serão utilizadas para padronização.

---

### 🔒 Padrões Não Funcionais
- **Segurança:** evitar exposição de dados sensíveis e uso de autenticação segura.  
- **Usabilidade:** interface intuitiva, responsiva e com feedback visual claro.  
- **Desempenho:** tempo de resposta da API inferior a 3 segundos.  
- **Confiabilidade:** persistência garantida em banco de dados relacional.  

---

### ⚙️ Processos de Garantia da Qualidade
- **Gestão de atividades:** via Trello, com colunas de “A Fazer”, “Em Progresso”, “Em Revisão” e “Concluído”.  
- **Revisão de código:** outro membro deve revisar antes do merge na `main`.  
- **Validação:** uso de testes unitários e funcionais no backend.  
- **Controle de mudanças:** registro de alterações via GitHub (issues e pull requests).  
- **Revisão de documentos:** feita antes de cada entrega parcial.  

---

### 📊 Atividades e Métricas de Qualidade
| Métrica | Descrição | Meta |
|----------|------------|------|
| Taxa de sucesso dos testes | Percentual de testes que passam | ≥ 90% |
| Tempo médio de resposta | Tempo de retorno da API | ≤ 3s |
| Bugs por entrega | Erros críticos detectados antes da entrega | ≤ 2 |
| Frequência de commits | Média semanal por integrante | ≥ 3 |
| Revisões de código | Pull requests revisadas antes do merge | 100% |

---

### ✅ Critérios de Conclusão
- Todas as funcionalidades mínimas do MVP implementadas e testadas.  
- Documentação e plano de qualidade atualizados no GitHub.  
- Trello atualizado com atividades e responsáveis definidos.  
- Código funcional, comentado e validado entre os membros.  

---

## 🛠️ Como Rodar o Projeto
```bash
# Clone o repositório
git clone https://github.com/DiogoSNs/Memories-Book.git

# Entre na pasta
cd mapa-memorias-afetivas

# Instale as dependências
npm install

# Rode o servidor de desenvolvimento
npm run dev

