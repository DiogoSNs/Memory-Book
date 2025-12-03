# Memory Book

## Sumário
- [Cenários de Testes dos Trabalho 2 e 3](#Cenários-de-Teste-T2-e-T3)
- [Relatório de Testes dos Trabalhos 2 e 3](#Relatório-de-Consolidação-de-Teste)
- [Testes Automatizados dos Trabalhos 2 e 3](#Testes-Automatizados)
- [Correção de Bugs Trabalho 2](#Correção-de-Bugs-T2)
- [Refatoração do Trabalho 2](#Refatoração-T2)
- [Teste e desenvolvimento de novas funcionalidades](#Teste-e-desenvolvimento-de-novas-funcionalidades)
- [Refatoração de Novas Funcionalidades](#Refatoração-de-Novas-Funcionalidades)
- [Integração das Funcionalidades do Trabalho 2 e Trabalho 3](#INTEGRAÇÃO)
- [Slides](./Apresentação%20-%20Eng%20de%20Software%20-%203.pdf)
- [Vídeo demonstrando o funcionamento da aplicação ](#Link-do-Video)

---

# Cenários de Teste T2 e T3

## 1 Funcionalidades (Alberto)

O sistema Memory Book permite que usuários registrem, organizem e visualizem memórias associadas a locais em um mapa interativo. As funcionalidades envolvem criação de memórias, manipulação de conteúdos multimídia, personalização visual por temas e integração com serviços externos, tudo isso garantindo usabilidade, consistência e segurança.

## Funcionalidades T2:

### 1.1 Necessidade 1 - Registrar memórias no mapa
Como um usuário autenticado  
Eu quero criar uma nova memória vinculada a uma localização no mapa  
De modo que eu possa armazenar recordações com fotos, textos e música associadas ao local onde ocorreram

### 1.1 Necessidade 2 - Visualizar memórias existentes
Como um usuário autenticado  
Eu quero visualizar todas as minhas memórias diretamente no mapa  
De modo que eu possa acessar rapidamente informações e fotos associadas a cada ponto geográfico

### 1.1 Necessidade 3 - Editar memórias
Como um usuário autenticado  
Eu quero editar o texto, imagem, localização e cor de uma memória  
De modo que eu possa atualizar ou corrigir informações conforme necessário

### 1.1 Necessidade 4 - Excluir memórias
Como um usuário autenticado  
Eu quero excluir uma memória  
De modo que eu remova conteúdos que não são mais relevantes

### 1.1 Necessidade 5 - Aplicar temas
Como um usuário autenticado  
Eu quero escolher um tema visual (Aurora, Ocean, Sunset, Forest, Cosmic)  
De modo que a interface apresente uma identidade visual personalizada

### 1.1 Necessidade 6 - Criar conta (registro)
Como um usuário não autenticado  
Eu quero criar uma nova conta informando meus dados de registro  
De modo que eu possa acessar o Memory Book com um perfil próprio e seguro

### 1.1 Necessidade 7 - Fazer login
Como um usuário não autenticado  
Eu quero acessar minha conta por meio de e-mail e senha  
De modo que eu possa utilizar todas as funcionalidades do Memory Book

### 1.1 Necessidade 8 - Fazer logout
Como um usuário autenticado  
Eu quero encerrar minha sessão no sistema  
De modo que eu garanta a segurança da minha conta e volte ao estado de usuário não autenticado

### 1.1 Necessidade 9 - Utilizar o mapa interativo
Como um usuário autenticado  
Eu quero navegar e selecionar pontos no mapa  
De modo que eu possa registrar a memória no local exato onde ocorreu

## Funcionalidades T3:

### 1.1 Necessidade 10 - Buscar músicas no Spotify
Como um usuário autenticado  
Eu quero buscar uma música digitando seu nome ou artista dentro da memória  
De modo que eu possa selecionar uma faixa diretamente da lista de resultados sem precisar copiar links externos e tê-la associada a memória

### 1.1 Necessidade 11 - Adicionar vídeos curtos à memória
Como um usuário autenticado  
Eu quero enviar um vídeo curto (até 30 segundos) ao criar ou editar uma memória  
De modo que minhas recordações incluam registros audiovisuais rápidos do momento

## 2 Cenários Funcionais (Diogo)

Nesta seção são apresentados os cenários funcionais derivados diretamente das necessidades identificadas para o sistema Memory Book. Cada cenário descreve, de forma estruturada e objetiva, como o sistema deve se comportar diante de ações típicas do usuário, cobrindo desde operações essenciais como registrar, visualizar, editar e excluir memórias até funcionalidades de suporte, como autenticação, personalização por temas e interação com o mapa.

Os cenários foram organizados por funcionalidade principal, seguindo a sequência lógica estabelecida nas necessidades: primeiro as operações relacionadas às memórias, depois os mecanismos de personalização e, por fim, o fluxo de autenticação do usuário. Cada caso está descrito no formato Dado – Quando – Então, permitindo fácil reprodutibilidade, clareza nos requisitos validados e associação direta com os testes realizados posteriormente.

## 2 Cenários Funcionais T2:

### 2.1 Registrar memórias no mapa

Cenário 1: Criar nova memória com texto e foto  
Dado que o usuário está autenticado e visualizando o mapa  
E seleciona um ponto da interface  
Quando inserir título, descrição e fizer upload de uma foto  
E confirmar o cadastro  
Então o sistema deve salvar a memória no banco  
E exibir um marcador no mapa na posição selecionada

### 2.2 Visualizar memórias existentes

Cenário 2: Exibir todas as memórias no mapa  
Dado que o usuário está logado  
Quando acessa a tela inicial do mapa  
Então o sistema deve carregar e exibir todos os marcadores referentes às memórias cadastradas

Cenário 3: Abrir uma memória ao clicar no marcador  
Dado que há uma memória cadastrada no local selecionado  
Quando o usuário clicar no marcador  
Então o sistema deve abrir o cartão da memória contendo título, descrição e imagem associada.

### 2.3 Editar memórias

Cenário 4: Editar texto e imagem de uma memória  
Dado que o usuário está autenticado  
E abriu uma memória já existente  
Quando alterar título, descrição e/ou foto  
E salvar  
Então o sistema deve atualizar os dados no banco  
E exibir as alterações no cartão da memória

### 2.4 Excluir memórias

Cenário 5: Excluir memória existente  
Dado que o usuário abriu uma memória cadastrada  
Quando clicar no botão de excluir  
E confirmar a exclusão  
Então o sistema deve remover a memória do banco  
E remover o marcador correspondente do mapa

### 2.5 Aplicar temas

Cenário 6: Alterar o tema global do Memory Book  
Dado que o usuário está autenticado  
Quando selecionar um tema como Aurora, Ocean, Sunset, Forest ou Cosmic  
Então o sistema deve atualizar imediatamente as cores, ícones e elementos da interface

### 2.6 Criar Conta (Registro)

Cenário 7: Registro bem-sucedido  
Dado que o usuário não possui conta  
Quando preencher nome, e-mail e senha válidos  
E confirmar o cadastro  
Então o sistema deve criar a conta  
E permitir o login imediato ou redirecionar para a página de acesso

Cenário 8: Registro com campo faltando  
Dado que o usuário está na tela de registro  
Quando enviar o formulário com dados incompletos  
Então o sistema deve exibir mensagem de erro  
E impedir a criação da conta

### 2.7 Login

Cenário 9: Login bem-sucedido  
Dado que o usuário possui uma conta válida  
Quando informar e-mail e senha corretos  
Então o sistema deve autenticar o usuário  
E gerar um token de sessão

Cenário 10: Login com senha incorreta  
Dado que há uma conta registrada  
Quando o usuário inserir uma senha incorreta  
Então o sistema deve recusar o login  
E exibir mensagem de credenciais inválidas

### 2.8 Logout

Cenário 11: Logout  
Dado que o usuário está autenticado  
Quando clicar no botão de logout  
Então o sistema deve encerrar a sessão  
E invalidar o token atual

### 2.9 Usar o mapa interativo

Cenário 12: Navegar pelo mapa  
Dado que o usuário está autenticado  
Quando usar zoom e arrastar o mapa  
Então o sistema deve ajustar a visualização sem perda de marcadores

## 2 Cenários Funcionais T3:

### 2.10 Buscar músicas no Spotify

Cenário 13: Pesquisar música digitando nome ou artista  
Dado que o usuário está autenticado  
Quando digitar o nome da música ou do artista no campo de busca dentro da criação ou edição da memória  
Então o sistema deve exibir uma lista de resultados correspondentes obtidos via integração com o Spotify  
E permitir que o usuário selecione uma faixa da lista para vinculá-la à memória

### 2.11 Adicionar vídeos curtos à memória

Cenário 14: Enviar vídeo curto de até 30 segundos  
Dado que o usuário está autenticado  
Quando selecionar um arquivo de vídeo ao criar ou editar uma memória  
Então o sistema deve validar que o vídeo possui até 30 segundos  
E deve fazer upload do conteúdo para armazenamento interno  
E associá-lo à memória sem comprometer o restante do processo de criação ou edição

## 3 Cenários de Desempenho (Guilherme)

Nesta seção são definidos os cenários de desempenho que avaliam a eficiência, capacidade de resposta e estabilidade do sistema Memory Book sob diferentes condições. Os cenários refletem operações críticas observadas nos testes funcionais como por exemplo criação, visualização, edição e exclusão de memórias mas agora analisadas sob a perspectiva de performance, escalabilidade e impacto no usuário.

Os testes aqui descritos permitem identificar gargalos, prever comportamentos em situações de estresse e estabelecer métricas mínimas de qualidade para as funcionalidades essenciais do sistema.

## 3 Cenários de Desempenho T2:

### 3.1 Registro, Login e Logout

Cenário 1: Registro (sucesso)  
Descrição do Cenário: Validação de criação de usuário com dados válidos e resposta rápida.  
Dado que existe um endpoint de registro disponível  
Quando o cliente envia nome, e-mail e senha válidos  
Então o sistema autentica e retorna token em tempo adequado

Cenário 2: Login (senha incorreta)  
Descrição do Cenário: Negativa ágil de login com senha incorreta.  
Dado que há um usuário existente  
Quando a senha enviada é inválida  
Então o sistema responde 401 sem processamento excessivo

Cenário 3: Logout (sem token)  
Descrição do Cenário: Bloqueio imediato de logout sem autenticação.  
Dado que não há token no header  
Quando o cliente tenta deslogar  
Então o sistema retorna 401 de forma eficiente

### 3.2 Health Check

Cenário 4: Health check (OK)  
Descrição do Cenário: Sinalização de saúde do serviço com resposta mínima.  
Dado que o endpoint de status está ativo  
Quando o cliente consulta /api/health  
Então o sistema retorna status OK rapidamente

Cenário 5: Health check (rota inválida)  
Descrição do Cenário: Resposta adequada a rota inexistente.  
Dado que a rota /api/healthz não existe  
Quando o cliente consulta a rota inválida  
Então o sistema retorna 404 sem custo adicional

### 3.3 Listagem de Memórias

Cenário 6: Listar memórias (com token)  
Descrição do Cenário: Listagem de memórias autenticada.  
Dado que o usuário possui memórias  
Quando consulta a lista com token válido  
Então o sistema retorna as memórias em tempo adequado

Cenário 7: Listar memórias (sem token)  
Descrição do Cenário: Bloqueio de listagem sem autenticação.  
Dado que não há token no header  
Quando consulta a lista  
Então o sistema retorna 401 rapidamente

## 3 Cenários de Desempenho T3:

### 3.4 Busca de Música (Spotify)

Cenário 8: Spotify (função de acesso com mock)  
Descrição do Cenário: Função de acesso ao Spotify (mock) com estrutura mínima.  
Dado que a chamada externa está mockada  
Quando consulta /api/spotify/search  
Então o retorno contém nome, artistas e link

Cenário 9: Spotify (busca por música)  
Descrição do Cenário: Busca por música com termo válido.  
Dado que há um termo de busca  
Quando consulta /api/spotify/search?q=Imagine  
Então a API retorna lista de resultados rapidamente

### 3.5 Upload de Vídeos

Cenário 10: Vídeo (upload válido ≤ 30s)  
Descrição do Cenário: Upload de vídeo válido até 30 segundos.  
Dado que a validação de duração retorna ≤30s  
Quando envia arquivo .mp4 para /api/media/upload  
Então o sistema aceita e retorna caminho do vídeo

Cenário 11: Vídeo (bloqueio > 30s)  
Descrição do Cenário: Bloqueio de upload acima de 30 segundos.  
Dado que a validação retorna erro de duração  
Quando envia arquivo longo  
Então o sistema retorna 400 com mensagem adequada

---

# Relatório de Consolidação de Teste

## Escopo dos Testes

O escopo das atividades de Verificação e Validação considerou todas as funcionalidades atualmente implementadas no Memory Book, abrangendo o fluxo de autenticação (registro, login e logout), as operações de criação, visualização, edição e exclusão de memórias, bem como a navegação no mapa interativo.

Foram realizados testes cobrindo as Tabela 1 - Tabela 5, com foco em validar o comportamento funcional, a integridade das interfaces, a consistência dos dados e a estabilidade da aplicação durante o uso contínuo. As funcionalidades principais mostraram funcionamento adequado, permitindo ao usuário autenticar-se, registrar memórias geolocalizadas, visualizar seus marcadores no mapa, editar detalhes e removê-los quando necessário.

---

# Tabela 1: Teste de Requisitos  (Alberto)

| Funcionalidade | Módulo | Demandas |
|---------------|--------|----------|
| Registro, login e logout | Autenticação | Validar que o usuário pode criar uma conta com dados válidos |
| Registro, login e logout | Autenticação | Confirmar que o login funciona com credenciais corretas |
| Registro, login e logout | Autenticação | Confirmar que o logout encerra a sessão corretamente |
| Criação de memórias | Gerenciador de Memórias | Validar criação de memórias com título, texto, data e localização |
| Criação de memórias | Gerenciador de Memórias | Validar upload de imagem junto com a memória |
| Criação de memórias | Spotify | Validar associação de uma música à memória |
| Visualização de memórias | Mapa Interativo | Verificar que todas as memórias cadastradas aparecem no mapa |
| Visualização de memórias | Gerenciador de Memórias | Garantir que os dados da memória são recuperados corretamente |
| Edição de memórias | Gerenciador de Memórias | Confirmar que o usuário pode editar título, descrição, foto e localização |
| Exclusão de memórias | Gerenciador de Memórias | Garantir que memórias sejam removidas do sistema e do mapa |
| Exportação | Exportador PDF | Validar geração de PDF contendo dados completos da memória |
| Preferências do usuário | Autenticação | Validar leitura e alteração do tema visual |
| Desempenho | Sistema | Medir tempos de carregamento de memórias (via testes automatizados) |

---

# Tabela 2: Testes Funcionais  (Alberto)

| Funcionalidade | Módulo | Demandas |
|---------------|--------|----------|
| Criar memória | CRUD de Memórias | Criar memória com texto, foto, música e localização — funcionando |
| Criar memória | CRUD de Memórias | Bloquear criação sem título — validado |
| Visualizar memórias | Mapa Interativo | Exibir todas as memórias no mapa ao carregar — funcionando |
| Abrir memória | Gerenciador de Memórias | Abrir cartão da memória ao clicar no marcador — validado |
| Editar memória | CRUD de Memórias | Permitir alteração de texto, imagem e música — validado |
| Editar localização | Mapa Interativo | Permitir mover marcador para atualizar as coordenadas — validado |
| Excluir memória | CRUD de Memórias | Remover memória e seu marcador — validado |
| Selecionar tema | Preferências | Alterar tema global — funcionando |
| Selecionar cor individual | Gerenciador de Memórias | Alterar cor do cartão da memória — funcionando |
| Validação Spotify | Spotify | Bloquear links inválidos — validado |
| Exportação PDF | Exportador PDF | Exportar memória individual — validado |
| Exportação PDF | Exportador PDF | Exportar várias memórias — validado |
| Navegação no mapa | Mapa Interativo | Zoom e arraste sem perda de marcadores — funcionando |

---

# Tabela 3: Teste de Regressão (Alberto)

| Funcionalidade | Módulo | Demandas |
|---------------|--------|----------|
| Registro/login | Autenticação | Revalidar autenticação após atualizações — ok |
| CRUD de memórias | Gerenciador de Memórias | Retestar criação/edição/exclusão após mudanças — ok |
| Temas | Preferências | Confirmar que novos temas não quebram interface — ok |
| Exportação PDF | Exportador PDF | Garantir que exportação continua funcional — ok |
| Mapa | Mapa Interativo | Validar estabilidade do mapa com novas memórias — ok |
| Fluxo prolongado | CRUD de Memórias | Testar 20 edições seguidas sem falhas — ok |
| Desempenho após alterações | Sistema | Medir impacto em tempo de resposta — ok |
| Concorrência | Sistema | Avaliar múltiplos usuários simultâneos — *inconclusivo* |

---

# Tabela 4: Teste de Performance  (Guilherme)

| Funcionalidade | Módulo | Demandas |
|---------------|--------|----------|
| Carregamento inicial | Mapa Interativo | Medir tempo de carregamento inicial do mapa |
| Listagem de memórias | Backend | Medir tempo médio de resposta ao listar memórias — ok (via testes automatizados) |
| Upload de imagens | Backend | Medir tempo de upload de imagens |
| Validação Spotify | Spotify | Medir latência na busca de músicas — ok (mock e real) |
| Navegação no mapa | Frontend | Testar fluidez com zoom/arraste intensos — estável |
| Análise de gargalos | Sistema Completo | Identificar gargalos internos — *inconclusivo* |
| Exportação PDF | Exportador PDF | Medir tempo de exportação de PDF |
| Upload de vídeos | Mídia | Validar rapidez no envio de vídeos curtos — ok |

---

# Tabela 5: Teste de Aceite  (Guilherme)

| Funcionalidade | Módulo | Demandas |
|---------------|--------|----------|
| Objetivo geral do sistema | Sistema Completo | Confirmar que o Memory Book registra memórias geolocalizadas com multimídia |
| Interface e usabilidade | Frontend | Avaliar se a interface é intuitiva e responsiva |
| Fluxo principal | Sistema Completo | Criar → visualizar → editar → exportar memória — funcionando |
| Estabilidade | Sistema Completo | Confirmar estabilidade do sistema em sessões longas |
| Teste de temas | Preferências | Avaliar temas e impacto visual na experiência |
| Satisfação do usuário | Sistema Completo | Métricas de satisfação do usuário |
| Uso sob carga | Sistema Completo | Avaliar comportamento sob alta demanda — *inconclusivo* |

# Resultados Obtidos

A presente seção descreve os resultados obtidos durante a execução dos testes planejados para o Memory Book, considerando os diferentes tipos de validação: testes de requisitos, funcionais, de regressão, de performance e de aceite.  
As tabelas a seguir registram os defeitos encontrados em cada categoria, classificados por criticidade e indicando se foram corrigidos ou permanecem pendentes.

No geral, os testes manuais e automatizados demonstraram boa estabilidade do sistema, poucos defeitos identificados e todos de baixa ou média criticidade. Os cenários de autenticação, manipulação de memórias, integração com o Spotify e upload de vídeos apresentaram comportamento consistente.  
Alguns aspectos de desempenho ainda dependem de medições adicionais, especialmente em carga e estresse, mas nenhuma falha impeditiva foi verificada nos fluxos principais.

## **Tabela 6: Defeitos Encontrados Durante a Realização do Teste de Requisitos**

| Criticidade | Corrigidos | Não Corrigidos | Total |
|-------------|------------|----------------|--------|
| Alta        | 0          | 0              | 0      |
| Média       | 0          | 0              | 0      |
| Baixa       | 1          | 0              | 1      |

*Observação: Na lista de memórias, os blocos não se ajustavam ao conteúdo e adotavam a altura da maior memória (ex.: com vídeo); corrigido ajustando o layout para altura automática por cartão e evitando herança de tamanho.*

---

## **Tabela 7: Defeitos Encontrados Durante a Realização do Teste Funcional**

| Criticidade | Corrigidos | Não Corrigidos | Total |
|-------------|------------|----------------|--------|
| Alta        | 0          | 0              | 0      |
| Média       | 1          | 0              | 1      |
| Baixa       | 0          | 0              | 0      |

*Observação: Busca do Spotify mostrava apenas resultados mockados; corrigido habilitando credenciais e cliente oficial, mantendo fallback mock apenas quando indisponível.*

---

## **Tabela 8: Defeitos Encontrados Durante a Realização do Teste de Regressão**

| Criticidade | Corrigidos | Não Corrigidos | Total |
|-------------|------------|----------------|--------|
| Alta        | 0          | 0              | 0      |
| Média       | 0          | 0              | 0      |
| Baixa       | 0          | 0              | 0      |

---

## **Tabela 9: Defeitos Encontrados Durante a Realização do Teste de Performance**

| Criticidade | Corrigidos | Não Corrigidos | Total |
|-------------|------------|----------------|--------|
| Alta        | 0          | 0              | 0      |
| Média       | 0          | 0              | 0      |
| Baixa       | 0          | 0              | 0      |

---

## **Tabela 10: Defeitos Encontrados Durante a Realização do Teste de Aceite**

| Criticidade | Corrigidos | Não Corrigidos | Total |
|-------------|------------|----------------|--------|
| Alta        | 0          | 0              | 0      |
| Média       | 0          | 0              | 0      |
| Baixa       | 2          | 0              | 2      |

*Observação: (1) Brilho atrás dos botões flutuantes afetava temas escuros; removido brilho atrás dos botões flutuantes. (2) Zoom out excessivo gerava bordas brancas no mapa; corrigido com `minZoom`, `maxBounds` e `noWrap`.*

---

# Testes Automatizados

## 📋 T2 — Funcionalidades e Testes Automatizados do Trabalho 2:

### Autenticação  (Diogo)
- **Registro de usuário (sucesso):** garante criação de conta com dados válidos
- **Registro com campo faltando:** valida rejeição quando informações obrigatórias não são enviadas
- **Login (sucesso):** autentica usuário com credenciais corretas e retorna token
- **Login com senha errada:** valida resposta apropriada para credenciais inválidas
- **Logout (sucesso):** invalida sessão atual do usuário autenticado
- **Logout sem token:** bloqueia tentativa de logout sem autenticação

### Sistema  (Alberto)
- **Health check (sucesso):** confirma disponibilidade da API em rota de status
- **Health check rota inválida:** assegura retorno adequado em rotas inexistentes

### Gerenciamento de Memórias (Diogo)
- **Criar memória (sucesso):** cadastra memória com título, data e coordenadas válidas
- **Criar memória sem título:** rejeita criação quando campo obrigatório está ausente
- **Listar memórias com token:** retorna memórias do usuário autenticado
- **Listar memórias sem token:** bloqueia acesso quando não há autenticação
- **Atualizar memória (sucesso):** altera campos de uma memória existente do usuário
- **Atualizar memória com ID inexistente:** retorna erro apropriado para recursos não encontrados
- **Deletar memória (sucesso):** remove memória do usuário com confirmação
- **Deletar memória de outro usuário:** impede exclusão de recursos que não pertencem ao solicitante

### Preferências e Temas (Diogo)
- **Obter preferências (sucesso):** retorna configurações atuais do usuário
- **Atualizar preferências com valor inválido:** valida e rejeita entradas fora do padrão
- **Selecionar tema (sucesso):** registra tema preferencial do usuário com dados válidos
- **Selecionar tema com campos faltando:** rejeita criação de tema sem informações obrigatórias

---

## 📋 T3 — Funcionalidades e Testes Automatizados do Trabalho 3:

### Integração Spotify (Diogo)
- **Spotify (função de acesso com mock):** confirma que a função retorna estrutura mínima válida (nome, artistas, link) usando simulação
- **Spotify (busca por música):** valida retorno de resultados ao consultar título/termo válido
- **Spotify (consulta vazia):** assegura que nomes vazios retornam lista de resultados vazia

### Música na Memória (Guilherme)
- **Música na memória (armazenamento):** verifica que o link selecionado é persistido ao criar memória
- **Música na memória (edição):** valida substituição da música previamente salva por nova seleção via mock

### Upload de Vídeo (Diogo)
- **Vídeo (upload válido ≤ 30s):** confirma sucesso do upload quando a duração é aceita
- **Vídeo (bloqueio > 30s):** rejeita upload quando a duração excede o limite estabelecido
- **Vídeo (exclusão):** assegura remoção do vídeo/mídia anexada por meio de atualização da memória

---

# Correção de Bugs T2:

### 1 Comportamento antes da correção

Ao aplicar zoom out máximo, o mapa extrapolava os limites visíveis, gerando espaços em branco nas bordas. Isso comprometia a experiência de navegação e dava a impressão de área "fora do mapa".

### 2️2 Solução aplicada e comportamento esperado

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

# Refatoração T2:

## Padrão de Projeto Implementado: Observer (Explícito)

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

---

# INTEGRAÇÃO 

## Integração das Funcionalidades dos Trabalhos 2 e 3

Esta seção apresenta de forma organizada a integração entre as funcionalidades desenvolvidas na Entrega 2 e as funcionalidades adicionais implementadas na Entrega 3. Assim como nas demais partes do relatório, o objetivo é demonstrar a evolução incremental do sistema Memory Book, destacando como os recursos anteriormente existentes foram mantidos, ampliados e validados por meio dos testes funcionais, de regressão e de desempenho.

A seguir, as funcionalidades estão separadas por entrega, refletindo o escopo implementado em cada fase e a consolidação final do sistema.


### **Trabalho 2 — Funcionalidades Implementadas**

As funcionalidades abaixo constituem o núcleo fundamental do Memory Book e foram totalmente desenvolvidas no Trabalho 2. Elas definem o fluxo principal de uso do sistema:

- Registro de memórias no mapa (com texto e imagem)
- Visualização de memórias existentes no mapa
- Edição de memórias (título, descrição, imagem e localização)
- Exclusão de memórias
- Aplicação de temas (Aurora, Ocean, Sunset, Forest, Cosmic)
- Criação de conta (registro)
- Login
- Logout
- Navegação no mapa interativo (zoom e arraste)

Essas funcionalidades formam a base lógica sobre a qual os recursos avançados do Trabalho 3 foram posteriormente integrados.

---

### **Trabalho 3 — Funcionalidades Adicionadas**

o Trabalho 3 introduziu novas capacidades ao sistema, com foco em integração externa e multimídia avançada. Todos os itens listados abaixo foram especificados como parte da terceira entrega:

- Busca de músicas no Spotify utilizando nome da música ou artista
- Retorno de lista de resultados (mock) para seleção de faixa
- Persistência do objeto musical na memória
- Edição e substituição da música associada à memória
- Upload de vídeos curtos (até 30 segundos)
- Validação automática da duração do vídeo
- Associação do vídeo à memória
- Remoção de vídeos previamente anexados

Essas funcionalidades ampliaram o escopo do sistema, permitindo que cada memória passe a contar não apenas com texto e imagem, mas também com música e vídeo.

---

### **Integração Entre Trabalho 2 e Trabalho 3**

As funcionalidades do Trabalho 3 foram integradas ao fluxo definido no Trabalho 2 sem comprometer os componentes já existentes. A interface de criação e edição de memórias foi estendida para incluir:

- Campo de busca por músicas  
- Lista de resultados provenientes do mock de integração Spotify  
- Campo de upload de vídeo com validação interna  
- Controle de multimídia persistente (música e vídeo)

No backend, o sistema foi atualizado para:

- Validar e armazenar novos tipos de conteúdo associados à memória  
- Atender aos novos endpoints de música e vídeo  
- Manter a compatibilidade com as operações CRUD já existentes  
- Garantir integridade dos dados durante criação, edição e exclusão  

Os testes automatizados e manuais confirmaram que:

- As funcionalidades da Entrega 2 permanecem estáveis  
- As novas funcionalidades da Entrega 3 foram integradas corretamente  
- Os fluxos combinados (autenticação → criação → multimídia → edição → exclusão) operam de modo consistente  

Assim, a versão final do Memory Book representa a consolidação das duas etapas de desenvolvimento, compondo um sistema robusto, extensível e funcional.

# Link do Video 

[Acesse a pasta no Google Drive](https://drive.google.com/drive/folders/1VXGodr3X3-qbV6X0G1itTfOX9M8Uo5-1)

---
