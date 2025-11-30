# Testes Automatizados

=================== T2 — Funcionalidades e Testes do Trabalho 2 ===================
- Registro de usuário (sucesso): garante criação de conta com dados válidos.
- Registro com campo faltando: valida rejeição quando informações obrigatórias não são enviadas.
- Login (sucesso): autentica usuário com credenciais corretas e retorna token.
- Login com senha errada: valida resposta apropriada para credenciais inválidas.
- Logout (sucesso): invalida sessão atual do usuário autenticado.
- Logout sem token: bloqueia tentativa de logout sem autenticação.
- Health check (sucesso): confirma disponibilidade da API em rota de status.
- Health check rota inválida: assegura retorno adequado em rotas inexistentes.
- Criar memória (sucesso): cadastra memória com título, data e coordenadas válidas.
- Criar memória sem título: rejeita criação quando campo obrigatório está ausente.
- Listar memórias com token: retorna memórias do usuário autenticado.
- Listar memórias sem token: bloqueia acesso quando não há autenticação.
- Atualizar memória (sucesso): altera campos de uma memória existente do usuário.
- Atualizar memória com ID inexistente: retorna erro apropriado para recursos não encontrados.
- Deletar memória (sucesso): remove memória do usuário com confirmação.
- Deletar memória de outro usuário: impede exclusão de recursos que não pertencem ao solicitante.
- Obter preferências (sucesso): retorna configurações atuais do usuário.
- Atualizar preferências com valor inválido: valida e rejeita entradas fora do padrão.
- Criar tema (sucesso): registra tema preferencial do usuário com dados válidos.
- Criar tema com campos faltando: rejeita criação de tema sem informações obrigatórias.

=================== T3 — Funcionalidades e Testes Adicionados no Trabalho 3 ===================
- Spotify (função de acesso com mock): confirma que a função retorna estrutura mínima válida (nome, artistas, link) usando simulação.
- Spotify (busca por música): valida retorno de resultados ao consultar título/termo válido.
- Spotify (consulta vazia): assegura que nomes vazios retornam lista de resultados vazia.
- Música na memória (armazenamento): verifica que o link selecionado é persistido ao criar memória.
- Música na memória (edição): valida substituição da música previamente salva por nova seleção via mock.
- Vídeo (upload válido ≤ 30s): confirma sucesso do upload quando a duração é aceita.
- Vídeo (bloqueio > 30s): rejeita upload quando a duração excede o limite estabelecido.
- Vídeo (exclusão): assegura remoção do vídeo/mídia anexada por meio de atualização da memória.

# Correção de Bugs (Trabalho 2)

1) Comportamento antes da correção
- Ao aplicar zoom out máximo, o mapa extrapolava os limites visíveis, gerando espaços em branco nas bordas. Isso comprometia a experiência de navegação e dava a impressão de área “fora do mapa”.

2) Solução aplicada e comportamento esperado
- Foi estabelecido um limite seguro para o nível mínimo de zoom (zoom out), evitando que o mapa ultrapasse os limites de renderização do componente de mapa.
- Com o limite ativo, o viewport permanece dentro de uma área válida, impedindo o aparecimento de espaços em branco nas laterais.
- Comportamento esperado: o mapa mantém preenchimento contínuo da área visível em todos os níveis de zoom permitidos, garantindo uma navegação estável e visual consistente.

Trecho de código (MapContainer com limite de zoom e limites globais):

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
# Manutenção do Projeto:
📡 Padrão de Projeto Implementado: Observer (Explícito)
📌 Motivação da Refatoração

No Trabalho 3, realizamos uma refatoração estrutural no fluxo de atualização do frontend.
Antes, a sincronização entre componentes ocorria de forma implícita pelo React, já que o Context obrigava re-renders automáticos em toda a árvore sempre que qualquer alteração de estado era realizada.

Para tornar o fluxo mais controlado, explícito e alinhado ao padrão GoF, substituímos parte desse comportamento automático pela implementação manual do padrão Observer.

❓ Por que utilizamos?
Para sincronizar a interface quando dados importantes mudam (como login/logout), agora de forma explícita, controlando manualmente quem observa e quando é notificado.

🔧 Que problema resolve?
Problema: Quando o usuário faz login, TODOS os componentes precisam se atualizar. Antes isso acontecia "implícito" via React Context (re-render automático). Agora resolvemos com um Subject manual que dispara `notify()` e observers inscritos executam `update()` conscientemente.

💻 Como aplicamos no frontend (Observer EXPLÍCITO)
Usuário faz login → Digita email/senha e clica "Entrar"
AuthSubject processa login → Atualiza estado interno via `setPartial(...)`
AuthSubject chama `notify()` → Dispara atualização para TODOS os observers inscritos
Observadores reagem manualmente:
GradientContext → observa autenticação e sincroniza gradiente do usuário
MapThemeContext → observa autenticação e sincroniza tema do mapa
App (conteúdo) → observa `showWelcome` para exibir/fechar boas-vindas
PrivateRoute → observa `user/isLoading` para proteger rotas
ProfileModal → observa `user` e dispara `logout()` no Subject
MemoryController → observa `isAuthenticated` para carregar/limpar memórias

Diagrama do Padrão Observer (Explícito):

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

• Comentário: nesta versão, não há mais re-render "automático" via Context; todo subscribe/unsubscribe/notify é manual.

—

📘 O que é o Observer explícito
• Subject: objeto central que mantém uma lista de observers, atualiza estado e chama `notify()` para enviar um snapshot a cada inscrito.
• Observer: componente/objeto que faz `subscribe()` ao Subject no `mount`, implementa `update(snapshot)` como callback e faz `unsubscribe()` no `unmount`.
• Benefício: fluxo de notificação controlado, alinhado ao GoF, sem dependência de re-render implícito do React.

🔩 Como implementamos o Subject manual
• Classe `AuthSubject` com lista de observers (`Set`), estado interno e métodos:
  - `subscribe(observer)` → registra o callback e retorna `unsubscribe`
  - `unsubscribe(observer)` → remove o callback
  - `notify()` → chama cada observer com o snapshot atual
  - `setPartial(partial)` → atualiza estado e chama `notify()`
• Referência no código: `frontend/src/contexts/AuthContext.jsx:16–51` (estrutura do Subject), `frontend/src/contexts/AuthContext.jsx:58–80` (check inicial), `frontend/src/contexts/AuthContext.jsx:81–142` (login), `frontend/src/contexts/AuthContext.jsx:144–187` (register), `frontend/src/contexts/AuthContext.jsx:189–198` (logout), `frontend/src/contexts/AuthContext.jsx:200–215` (updateUser), `frontend/src/contexts/AuthContext.jsx:217–224` (closeWelcome).
• Onde o `notify()` acontece: é invocado sempre que `setPartial(...)` é chamado, ver `frontend/src/contexts/AuthContext.jsx:59–62`.