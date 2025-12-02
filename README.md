# Testes Automatizados

---

## 📋 T2 — Funcionalidades e Testes do Trabalho 2

### Autenticação
- **Registro de usuário (sucesso):** garante criação de conta com dados válidos
- **Registro com campo faltando:** valida rejeição quando informações obrigatórias não são enviadas
- **Login (sucesso):** autentica usuário com credenciais corretas e retorna token
- **Login com senha errada:** valida resposta apropriada para credenciais inválidas
- **Logout (sucesso):** invalida sessão atual do usuário autenticado
- **Logout sem token:** bloqueia tentativa de logout sem autenticação

### Sistema
- **Health check (sucesso):** confirma disponibilidade da API em rota de status
- **Health check rota inválida:** assegura retorno adequado em rotas inexistentes

### Gerenciamento de Memórias
- **Criar memória (sucesso):** cadastra memória com título, data e coordenadas válidas
- **Criar memória sem título:** rejeita criação quando campo obrigatório está ausente
- **Listar memórias com token:** retorna memórias do usuário autenticado
- **Listar memórias sem token:** bloqueia acesso quando não há autenticação
- **Atualizar memória (sucesso):** altera campos de uma memória existente do usuário
- **Atualizar memória com ID inexistente:** retorna erro apropriado para recursos não encontrados
- **Deletar memória (sucesso):** remove memória do usuário com confirmação
- **Deletar memória de outro usuário:** impede exclusão de recursos que não pertencem ao solicitante

### Preferências e Temas
- **Obter preferências (sucesso):** retorna configurações atuais do usuário
- **Atualizar preferências com valor inválido:** valida e rejeita entradas fora do padrão
- **Selecionar tema (sucesso):** registra tema preferencial do usuário com dados válidos
- **Selecionar tema com campos faltando:** rejeita criação de tema sem informações obrigatórias

---

## 📋 T3 — Funcionalidades e Testes Adicionados no Trabalho 3

### Integração Spotify
- **Spotify (função de acesso com mock):** confirma que a função retorna estrutura mínima válida (nome, artistas, link) usando simulação
- **Spotify (busca por música):** valida retorno de resultados ao consultar título/termo válido
- **Spotify (consulta vazia):** assegura que nomes vazios retornam lista de resultados vazia

### Música na Memória
- **Música na memória (armazenamento):** verifica que o link selecionado é persistido ao criar memória
- **Música na memória (edição):** valida substituição da música previamente salva por nova seleção via mock

### Upload de Vídeo
- **Vídeo (upload válido ≤ 30s):** confirma sucesso do upload quando a duração é aceita
- **Vídeo (bloqueio > 30s):** rejeita upload quando a duração excede o limite estabelecido
- **Vídeo (exclusão):** assegura remoção do vídeo/mídia anexada por meio de atualização da memória

---

## 🐛 Correção de Bugs (Trabalho 2)

### 1️⃣ Comportamento antes da correção

Ao aplicar zoom out máximo, o mapa extrapolava os limites visíveis, gerando espaços em branco nas bordas. Isso comprometia a experiência de navegação e dava a impressão de área "fora do mapa".

### 2️⃣ Solução aplicada e comportamento esperado

Foi estabelecido um limite seguro para o nível mínimo de zoom (zoom out), evitando que o mapa ultrapasse os limites de renderização do componente de mapa.

Com o limite ativo, o viewport permanece dentro de uma área válida, impedindo o aparecimento de espaços em branco nas laterais.

**Comportamento esperado:** o mapa mantém preenchimento contínuo da área visível em todos os níveis de zoom permitidos, garantindo uma navegação estável e visual consistente.

#### Trecho de código (MapContainer com limite de zoom e limites globais):

```jsx
<MapContainer
  center={[-23.5505, -46.6333]}
  zoom={4}
  minZoom={3}            // CORREÇÃO: limita o zoom out mínimo para evitar extrapolar o mapa
  maxBounds={[[-85, -180], [85, 180]]} // CORREÇÃO: define limites globais do mundo, impedindo arrastar além
  maxBoundsViscosity={1.0} // CORREÇÃO: viscosidade máxima para manter o mapa firmemente dentro dos limites
  worldCopyJump={false}  // CORREÇÃO: desativa cópia de world tiles, reduzindo artefatos nas bordas
  style={{ height: '100vh', width: '100%', background: '#1a1a1a' }}
  ref={mapRef}
>
  <TileLayer
    attribution={getCurrentMapThemeData().attribution}
    url={getCurrentMapThemeData().url}
    bounds={[[-90, -180], [90, 180]]} // CORREÇÃO: informa limites ao provedor de tiles
    noWrap={true} //evita repetição horizontal infinita do mundo
    maxNativeZoom={getCurrentMapThemeData().maxNativeZoom}
  />
</MapContainer>
```

---

## 🔧 Manutenção do Projeto

### 📡 Padrão de Projeto Implementado: Observer (Explícito)

#### 📌 Motivação da Refatoração

No Trabalho 3, realizamos uma refatoração estrutural no fluxo de atualização do frontend.

Antes, a sincronização entre componentes ocorria de forma implícita pelo React, já que o Context obrigava re-renders automáticos em toda a árvore sempre que qualquer alteração de estado era realizada.

Para tornar o fluxo mais controlado, explícito e alinhado ao padrão GoF, substituímos parte desse comportamento automático pela implementação manual do padrão Observer.

#### ❓ Por que utilizamos?

Para sincronizar a interface quando dados importantes mudam (como login/logout), agora de forma explícita, controlando manualmente quem observa e quando é notificado.

#### 🔧 Que problema resolve?

**Problema:** Quando o usuário faz login, TODOS os componentes precisam se atualizar. Antes isso acontecia "implícito" via React Context (re-render automático). Agora resolvemos com um Subject manual que dispara `notify()` e observers inscritos executam `update()` conscientemente.

#### 💻 Como aplicamos no frontend (Observer EXPLÍCITO)

1. **Usuário faz login** → Digita email/senha e clica "Entrar"
2. **AuthSubject processa login** → Atualiza estado interno via `setPartial(...)`
3. **AuthSubject chama `notify()`** → Dispara atualização para TODOS os observers inscritos
4. **Observadores reagem manualmente:**
   - **GradientContext** → observa autenticação e sincroniza gradiente do usuário
   - **MapThemeContext** → observa autenticação e sincroniza tema do mapa
   - **App (conteúdo)** → observa `showWelcome` para exibir/fechar boas-vindas
   - **PrivateRoute** → observa `user/isLoading` para proteger rotas
   - **ProfileModal** → observa `user` e dispara `logout()` no Subject
   - **MemoryController** → observa `isAuthenticated` para carregar/limpar memórias

#### Diagrama do Padrão Observer (Explícito):

```
                         AuthSubject (Subject manual)
                                      |     
                                      | notify(snapshot)
                                      |
         ┌───────────────────┬───────────────────┬───────────────────┬───────────────────┐
         ↓                   ↓                   ↓                   ↓                   ↓
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  GradientContext│ │ MapThemeContext │ │    PrivateRoute │ │   App (Welcome) │ │ MemoryController│
│   (Observer)    │ │   (Observer)    │ │   (Observer)    │ │   (Observer)    │ │   (Observer)    │
│ update(snapshot)│ │ update(snapshot)│ │ update(snapshot)│ │ update(snapshot)│ │ update(snapshot)│
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

> **Comentário:** nesta versão, não há mais re-render "automático" via Context; todo subscribe/unsubscribe/notify é manual.

---

#### 📘 O que é o Observer explícito

- **Subject:** objeto central que mantém uma lista de observers, atualiza estado e chama `notify()` para enviar um snapshot a cada inscrito
- **Observer:** componente/objeto que faz `subscribe()` ao Subject no `mount`, implementa `update(snapshot)` como callback e faz `unsubscribe()` no `unmount`
- **Benefício:** fluxo de notificação controlado, alinhado ao GoF, sem dependência de re-render implícito do React

#### 🔩 Como implementamos o Subject manual

- **Classe `AuthSubject`** com lista de observers (`Set`), estado interno e métodos:
  - `subscribe(observer)` → registra o callback e retorna `unsubscribe`
  - `unsubscribe(observer)` → remove o callback
  - `notify()` → chama cada observer com o snapshot atual
  - `setPartial(partial)` → atualiza estado e chama `notify()`

- **Referência no código:**
  - `frontend/src/contexts/AuthContext.jsx:16–51` (estrutura do Subject)
  - `frontend/src/contexts/AuthContext.jsx:58–80` (check inicial)
  - `frontend/src/contexts/AuthContext.jsx:81–142` (login)
  - `frontend/src/contexts/AuthContext.jsx:144–187` (register)
  - `frontend/src/contexts/AuthContext.jsx:189–198` (logout)
  - `frontend/src/contexts/AuthContext.jsx:200–215` (updateUser)
  - `frontend/src/contexts/AuthContext.jsx:217–224` (closeWelcome)

- **Onde o `notify()` acontece:** é invocado sempre que `setPartial(...)` é chamado, ver `frontend/src/contexts/AuthContext.jsx:59–62`

---

# Teste e desenvolvimento de novas funcionalidades:

# Vídeo nas Memórias

## O que mudou
Adicionamos suporte de upload de vídeo ao backend com validação de duração (máx. 30s), sanitização de nome e retorno de metadados. Compatibilizamos o armazenamento com fotos e a API de memórias continua estável para o frontend.

## Lógica Antiga vs. Nova

### Antes
Apenas fotos eram suportadas; validação de vídeo existia duplicada e não era integrada ao fluxo de upload.

### Agora
- Upload via POST `/api/media/upload` (multipart file) valida duração com MoviePy e retorna `media_type`, `path` e opcionalmente `file_url`.
- Validação centralizada em `backend/src/utils/validators.py:201–216` (remove duplicidade de `media_manager`).
- Nome de arquivo sanitizado; por padrão mantemos o nome original no retorno para compatibilidade de testes e clientes.
- Quando `user_id` e `memory_id` são passados na query, arquivos são organizados em `instance/uploads/user_{id}/memory_{id}/videos|photos`.
- O modelo Memory serializa fotos e vídeos separados com detecção robusta (por data URL, extensão ou diretório).

## Por que é melhor
- **Segurança e robustez**: sanitização de nomes e validação de duração fail-fast evitam arquivos indevidos e estados inválidos.
- **Coesão**: uma única função de validação para vídeos reduz manutenção e risco de divergência.
- **Governança**: estrutura opcional por usuário/memória facilita auditoria e limpeza sem quebrar clientes existentes.

---

# Busca de Música (Spotify)

## O que mudou
Integração com a API do Spotify centralizada em `SpotifyClient` com cache de token e `requests.Session()`; controller usa um wrapper `_search_spotify_api` para desacoplar a busca e facilitar testes.

## Lógica Antiga vs. Nova

### Antes
Token em variáveis globais, chamadas com `urllib`, erros silenciosos retornavam `[]` e lógica espalhada no controller.

### Agora
- Cliente dedicado em `backend/src/utils/spotify_client.py` gerencia o token (Client Credentials) e realiza buscas com timeouts e `raise_for_status()`.
- Controller chama `_search_spotify_api(query, limit)` que delega ao cliente, registra erros e mantém fallback de catálogo local quando não há credenciais (`SPOTIFY_CLIENT_ID/SECRET`).
- O wrapper `_search_spotify_api` é "mockável" e mantém compatibilidade com testes.

## Por que é melhor
- **Desacoplamento e coesão**: controller orquestra, cliente encapsula transporte e autenticação.
- **Observabilidade e fail-fast**: logs estruturados, timeouts e tratamento explícito de erros evitam falhas silenciosas.
- **Testabilidade**: wrapper permite monkeypatch nos testes sem abrir mão do novo design.

---

# Refatoração de Novas Funcionalidades

## Integração Spotify

### O que mudou
- Cliente Spotify centralizado em `src/utils/spotify_client.py` com `requests.Session()`, cache interno de token e timeouts.
- Controller ajustado para usar o cliente, removendo globais e `urllib`.
- Logs estruturados para erros na busca.

### Lógica Antiga vs. Nova

**Antes:**
Token em globais de módulo (`_SPOTIFY_TOKEN`) e chamadas com `urllib` e `base64`; erros silenciosos devolviam `[]` sem logging (`backend/src/controllers/spotify_controller.py:81–116`, `117–153`).

**Agora:**
Classe `SpotifyClient` gerencia token com expiração e busca via sessão HTTP (`backend/src/utils/spotify_client.py`), controller instancia um cliente e usa `client.search_tracks`, com `logger.error('spotify_search_error', extra={...})` em falhas (`backend/src/controllers/spotify_controller.py:16–22`, `33–41`).

### Por que é melhor
- **Desacoplamento**: reduz acoplamento entre controller e detalhes HTTP; aumenta coesão do módulo utilitário.
- **Fail-fast e observabilidade**: timeouts e `raise_for_status()` + logs estruturados evitam erros silenciosos.
- **Manutenibilidade e testabilidade**: cliente pode ser mockado; remove estado global compartilhado, diminuindo risco de race conditions em ambientes multi-thread/processo.

---

## Sistema de Upload

### O que mudou
- Consolidação de validação de duração de vídeo em `src/utils/validators.py`.
- Geração de nomes de arquivo únicos e sanitizados no controller.
- Suporte opcional a estrutura por usuário/memória (`user_X/memory_Y`) e logs de upload.

### Lógica Antiga vs. Nova

**Antes:**
`validate_video_duration` duplicada em dois módulos (`backend/src/utils/validators.py:201–216` e `backend/src/utils/media_manager.py:41–55`); gravação em `static/uploads/{photos|videos}` com nome original (`backend/src/controllers/media_controller.py:17–21`, `44–57`); sem logs.

**Agora:**
Validação única em `validators.py`; nomes com `generate_unique_filename` + `sanitize_filename` (`backend/src/controllers/media_controller.py:17–24`); quando `user_id` e `memory_id` são fornecidos, usa `build_memory_dirs` para segmentar armazenamento (`backend/src/controllers/media_controller.py:44–55`); logs `logger.info('media_upload', extra={...})`.

### Por que é melhor
- **Segurança e robustez**: sanitização reduz risco de path traversal e colisões; nomes únicos evitam sobrescrita acidental.
- **Coesão**: uma única fonte de verdade para validação de vídeo; elimina duplicidade e divergência.
- **Governança de dados**: estrutura por usuário/memória facilita auditoria, exclusão e migrações futuras.

---

## Módulo de Música

### O que mudou
- Validação explícita do campo `music` no POST e PUT de memórias.
- Centralização de serialização do modelo Memory com detecção robusta de mídia (foto vs. vídeo).

### Lógica Antiga vs. Nova

**Antes:**
`music` passava sem validação tipada; `to_dict` separava vídeos apenas quando eram data URLs `data:video/` (`backend/src/models/memory.py:132–138`) e convertia camelCase/snake_case localmente (`backend/src/models/memory.py:124–127`).

**Agora:**
`validate_music` verifica chaves (`id/spotify_id`, `title/name`, tipos de `artists`, `startTime`, `duration`) (`backend/src/utils/validators.py:201+`); `Memory.to_dict` delega para `serialize_memory_dict`, que separa vídeos por prefixo, extensão (`mp4`, `mov`…) e diretório (`/videos/`) e mapeia campos de forma centralizada (`backend/src/utils/helpers.py:220+`, `backend/src/models/memory.py:115–121`).

### Por que é melhor
- **Fail-fast**: validação no início previne estados inválidos e erros downstream.
- **Coesão e consistência**: serialização padronizada; reduz lógica de apresentação dentro do modelo e melhora compatibilidade com o frontend.
- **Confiabilidade**: detecção de mídia mais completa evita erros em cenários de uploads por caminho.

---

# Refatoração Geral do Projeto

## Correção do ThemeController

### O que mudou
Corrigido bug crítico no `update_theme` para passar a instância `Theme` ao repositório (`backend/src/controllers/theme_controller.py:127`).

### Lógica Antiga vs. Nova

**Antes:**
`theme_repo.update(theme.id, **update_data)`, passando `id` onde se esperava a instância.

**Agora:**
`theme_repo.update(theme, **update_data)`, alinhado com assinatura do repositório.

### Por que é melhor
- **Estabilidade**: elimina `TypeError`/comportamentos inesperados ao atualizar tema.
- **Consistência**: segue o padrão usado nos repositórios (coesão da API de atualização).
- **Manutenibilidade**: reduz dívida técnica e fragilidade em operações sobre entidades.

---

## Testes Automatizados (QA)

### O que mudou
`backend/test_api.py` refatorado para fluxo dinâmico: Registro → Login com credenciais do registro → Operações autenticadas (CRUD de memória) com asserts claros.

Remoção de login hardcoded e verificações explícitas de status code e payload em cada etapa.

### Lógica Antiga vs. Nova

**Antes:**
`register` gerava email dinâmico, mas `login` usava credenciais fixas (`teste@memorybook.com`), causando falha de autenticação; execução terminava precocemente.

**Agora:**
`test_register()` retorna `{email, password, user, token}`; `test_login(credentials)` usa o email/senha criados; `test_me(token)` e `test_memory_crud(token)` validam status code e campos (`access_token`, `user`, `memory.id`) e fazem update/delete da memória criada.

### Por que é melhor
- **Confiabilidade**: elimina falso-negativo por desconexão de dados; o teste reflete o fluxo real do sistema.
- **Fail-fast e clareza**: asserts em cada requisição com mensagens informativas; facilita diagnóstico de falhas.
- **Coesão do QA**: um único script cobre ciclo de vida completo, aumentando cobertura e detectando regressões funcionais.

---

## Padronização de Validadores

### O que mudou
- Consolidação de `validate_video_duration` em `validators.py`.
- Inclusão de `validate_music` para o payload de memórias.

### Lógica Antiga vs. Nova

**Antes:**
Duplicidade de validação de vídeo (`validators.py` e `media_manager.py`); sem verificação tipada de `music`.

**Agora:**
`media_manager` delega a `validators.py` e controllers usam validação de `music` antes de persistir/atualizar (`backend/src/controllers/memory_controller.py:96–104`, `169–176`).

### Por que é melhor
- **Baixo acoplamento**: `media_manager` e controllers dependem de um ponto único de validação; facilita testes e evolução.
- **Fail-fast**: dados inválidos são rejeitados cedo com mensagens claras, evitando inconsistências no banco.
- **Prevenção de erros**: reduz divergências e minimiza risco de erros por duplicidade.
