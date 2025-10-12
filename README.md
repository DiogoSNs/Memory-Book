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
## 🧩 Análise dos Requisitos do Projeto

### Requisitos Funcionais Principais (RF)
- **RF01–RF03**: Criar, visualizar, editar e excluir memórias geolocalizadas.  
- **RF04**: Filtrar memórias por data, tag ou tipo de mídia.  
- **RF05**: Compartilhar memórias via link ou QR Code.  
- **RF06 (futuro)**: Anexar mídias (fotos, vídeos e áudios).  

### Requisitos Não Funcionais (RNF)
- **RNF01**: Interface responsiva e mobile-friendly.  
- **RNF02**: Persistência em banco relacional (PostgreSQL).  
- **RNF03**: Tempo de resposta ≤ 3 s.  
- **RNF04**: Interface simples e intuitiva.  
- **RNF05 (futuro)**: Autenticação segura e controle de acesso.  

### Implicações Arquiteturais
- Separação clara entre cliente e servidor.  
- Baixo acoplamento entre camadas, permitindo expansão futura (ex.: upload de mídia, login).  
- Uso de dados geográficos (mapa) sugere o uso de **PostGIS** (extensão do PostgreSQL).  
- Performance e organização são essenciais — recomenda-se arquitetura **MVC em camadas**.  

---

## 2. Escolha e Justificativa do Padrão de Arquitetura Base

**Padrão escolhido:** Arquitetura em Camadas com padrão **MVC (Model–View–Controller)**  

**Justificativa:**

| Critério / Benefício | Descrição |
|---------------------|-----------|
| Organização modular | Estrutura em camadas separa responsabilidades entre interface (frontend), lógica (controllers) e dados (models/db). |
| Aderência aos RF/RNF | Permite desenvolvimento paralelo entre equipes (frontend e backend) e cumpre RNFs de responsividade e manutenibilidade. |
| Escalabilidade futura | A adição de autenticação e upload de mídias pode ser feita sem alterar a arquitetura existente. |
| Reuso e testabilidade | Controllers e Models podem ser testados isoladamente. |
| Desempenho e segurança | Backend Express funciona como camada intermediária de controle e segurança. |
| Integração eficiente | API RESTful conecta frontend React e backend Node.js, com trocas leves em JSON. |

O padrão **MVC em camadas** é ideal para o *Memory Book*, pois combina clareza estrutural, facilidade de manutenção e flexibilidade para expansão.

---

## 3. Conexão da Proposta com o Projeto Memory Book

Abaixo, a arquitetura inicial real do projeto, já estruturada conforme boas práticas de **camadas** e **MVC**:  

`mapa-memorias-afetivas/`

│
├── backend/                  # API e regras de negócio (Controller + Model)
│   ├── server.js             # Ponto de entrada do servidor Express
│   ├── db.js                 # Conexão com o banco de dados PostgreSQL
│   ├── routes/               # Rotas da API (Camada de Controle)
│   │   └── memories.js       # Endpoints CRUD de memórias
│   ├── models/               # Modelos de dados (Camada de Modelo)
│   │   └── memory.js         # Estrutura da entidade "Memória"
│   └── package.json          # Dependências do backend
│
├── frontend/                 # Interface do usuário (Camada de Visão)
│   ├── src/
│   │   ├── App.jsx           # Componente raiz da aplicação React
│   │   ├── api.js            # Configuração Axios (comunicação com backend)
│   │   ├── components/
│   │   │   ├── MapView.jsx   # Mapa interativo (Leaflet)
│   │   │   └── MemoryForm.jsx# Formulário (futuro: fotos/áudios)
│   │   └── assets/           # Ícones, imagens, etc.
│   ├── index.html            # Página principal
│   └── package.json          # Dependências do frontend
│
├── README.md                 # Documentação do projeto
└── docker-compose.yml        # (Opcional) Executa backend + banco PostgreSQL + pgAdmin
Fluxo e Conexão entre as Camadas
Visão geral da arquitetura (camadas e fluxo de dados):
┌────────────────────────────────────────────────┐
│              Frontend (React)                   │
│  - App.jsx / MapView.jsx / MemoryForm.jsx       │
│  - Consome API REST via Axios (api.js)          │
│  - Exibe mapa interativo e formulários          │
└───────────────▲─────────────────────────────────┘
                │  JSON (Axios)
┌───────────────▼─────────────────────────────────┐
│                Backend (Node.js + Express)      │
│  - Rotas (routes/memories.js)                   │
│  - Controladores processam requests e responses │
│  - Models (models/memory.js) definem entidades  │
│  - db.js conecta ao PostgreSQL via Sequelize    │
└───────────────▲─────────────────────────────────┘
                │  SQL Queries
┌───────────────▼─────────────────────────────────┐
│          Banco de Dados (PostgreSQL + PostGIS)  │
│  - Tabela: memórias (id, título, descrição, lat, long, data) │
│  - Suporte geoespacial para consultas por local  │
└─────────────────────────────────────────────────┘
4. Especificação e Documentação da Proposta
CamadaFunçãoTecnologiasApresentação (View)Interface com o usuário: mapa, formulários, visualização de memórias.React.js + Leaflet.js + AxiosControle (Controller)Interpreta requisições e chama o Model.Node.js + Express.js (rotas em routes/memories.js)Modelo (Model)Define estrutura dos dados e persistência.Sequelize ORM + PostgreSQLBanco de DadosArmazena memórias e coordenadas.PostgreSQL + extensão PostGISInfraestrutura (opcional)Gerencia containers e dependências.Docker + docker-composeCamada de Segurança (futuro)Controle de acesso e autenticação.JWT / OAuth2Integrações (futuro)Upload e armazenamento de mídias.AWS S3 / Firebase Storage
Decisões Arquiteturais Fundamentais
DecisãoJustificativaMVC em CamadasSepara responsabilidades, facilita manutenção e testes.API RESTfulComunicação leve entre frontend e backend.Banco PostgreSQL + PostGISSuporte geoespacial nativo, ideal para dados de mapa.Frontend desacoplado (SPA)Interface dinâmica, responsiva e independente.Uso de Docker (opcional)Facilita ambiente unificado de desenvolvimento.Extensível para autenticação e mídiasGarante evolução modular do projeto.
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
- **Frontend:** React + Vite + Leaflet.js  
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

