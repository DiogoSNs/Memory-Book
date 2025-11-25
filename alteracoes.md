🧩 Padrões de Projeto Implementados
📡 Padrão Observer (Comportamental) - Frontend
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

👀 Como adaptamos os Observers
• PrivateRoute: inscreve no `authSubject` e decide exibir loading, login/registro ou conteúdo privado
  - Subscribe/Unsubscribe: `frontend/src/components/PrivateRoute.jsx:39–43`
  - Update: `setAuthSnapshot(snapshot)` usado para renderização condicional
• App (conteúdo): observa `showWelcome` para abrir/fechar a tela de boas-vindas
  - Subscribe/Unsubscribe: `frontend/src/App.jsx:45–51`
  - Ação: `authSubject.closeWelcome()` fecha e notifica observadores (`frontend/src/App.jsx:63–71`)
• GradientContext: observa autenticação para sincronizar gradiente com API
  - Subscribe/Unsubscribe: `frontend/src/contexts/GradientContext.jsx:94–98`
  - Update: efeito dependente de `authSnapshot` em `frontend/src/contexts/GradientContext.jsx:123–125`
• MapThemeContext: observa autenticação para sincronizar tema do mapa
  - Subscribe/Unsubscribe: `frontend/src/contexts/MapThemeContext.jsx:35–39`
  - Update: efeito dependente de `authSnapshot` em `frontend/src/contexts/MapThemeContext.jsx:77–79`
• MemoryController: observa `isAuthenticated` para carregar/limpar memórias
  - Subscribe/Unsubscribe: `frontend/src/controllers/MemoryController.jsx:36–40`
  - Update: efeito dependente em `frontend/src/controllers/MemoryController.jsx:53–60`
• ProfileModal: observa `user` e dispara `authSubject.logout()`
  - Subscribe/Unsubscribe: `frontend/src/components/ProfileModal.jsx:60–64`
  - Ação explícita: `frontend/src/components/ProfileModal.jsx:98–101`

🔄 Diferença: Implícito vs Explícito
• Antes (implícito): React Context Provider gerava re-render automático dos consumidores, ocultando `subscribe/unsubscribe/notify`.
• Agora (explícito): cada componente Observador realiza `subscribe()` manual, recebe `update(snapshot)` e chama `unsubscribe()` ao desmontar. O `notify()` acontece por decisão do Subject, não do React.

🎓 Por que está de acordo com GoF
• GoF define Observer como dependência um-para-muitos entre objetos, onde um Subject notifica Observers registrados. Nossa implementação segue literalmente: Subject manual, lista explícita de Observers, métodos de inscrição/remoção, notificação por `notify()`.

—

📘 Como explicar para o professor
• Resumo curto:
  "Implementamos o Observer do GoF de forma explícita. O `AuthSubject` mantém observers, e quando o estado muda (login, logout, fechar boas-vindas), ele chama `notify()` entregando um snapshot. Cada componente Observador faz `subscribe()` e atualiza sua UI via callback `update(snapshot)`. Não há mais dependência de re-render implícito do React Context."

• Passo a passo de demonstração:
  1) Abrir `frontend/src/contexts/AuthContext.jsx` e mostrar o Subject explícito:
     - Classe `AuthSubject` com `observers`, `subscribe()`, `unsubscribe()`, `notify()`, `setPartial()` (ver `frontend/src/contexts/AuthContext.jsx:16–62`).
     - Mostrar que `login/register/logout/checkAuthStatus/closeWelcome/updateUser` usam `setPartial(...)` (e isso aciona `notify()`).
  2) Abrir um Observador (ex: `frontend/src/components/PrivateRoute.jsx`):
     - Efeito com `authSubject.subscribe(...)` que retorna `unsubscribe` (ver `frontend/src/components/PrivateRoute.jsx:39–43`).
     - Explicar que o callback `update(snapshot)` alimenta `authSnapshot`, e a UI decide o que renderizar.
  3) Mostrar onde `notify()` é chamado no fluxo de autenticação:
     - Em qualquer ação que chama `setPartial(...)`, o Subject invoca `notify()` (ver `frontend/src/contexts/AuthContext.jsx:59–62`).
     - Exemplo: usuário faz login → `authSubject.login(...)` → `setPartial({ user, isAuthenticated })` → `notify()` → Observadores recebem `update(snapshot)` e atualizam.
  4) Linguagem acessível:
     - "O Subject é o narrador central: ele anuncia mudanças. Os Observadores são ouvintes inscritos: quando há anúncio (`notify()`), cada um recebe o mesmo recado (`snapshot`) e atualiza sua parte da tela."

• Exemplos simples:
  - Login: "Quando o usuário faz login, o Subject chama `notify()`, e os observadores (PrivateRoute, App, GradientContext, MapThemeContext, MemoryController) recebem `update(snapshot)` e ajustam suas UIs e dados."
  - Logout: "Ao sair da conta, o Subject notifica que `user=null`, e então a rota privada volta a exibir Login/Registro, o App fecha modais, e contextos param de sincronizar preferências."

• Comentário final:
  - Este projeto agora demonstra o Observer de forma explícita, sem partes ocultas do React. Toda lógica de notificação, inscrição e atualização está manualmente implementada.
