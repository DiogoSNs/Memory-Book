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
# Locadora de Carros / Anotações do Canal 🎓┃𝗘𝘀𝗰𝗼𝗹𝗮

> Este documento reúne o conteúdo compartilhado no canal, incluindo diagramas conceituais, exemplo de GUI em Java, captura de imagens/prints e um guia rápido de fluxo de trabalho Git e arquitetura do projeto *Memory Book*.

---

## Índice

1. [Resumo](#resumo)
2. [Diagrama de Classes](#diagrama-de-classes)
3. [Diagrama de Casos de Uso](#diagrama-de-casos-de-uso)
4. [Diagrama de Sequência — Processo de Aluguel](#diagrama-de-sequencia--processo-de-aluguel)
5. [Exemplo de Interface GUI (Java Swing)](#exemplo-de-interface-gui-java-swing)
6. [Imagens / Prints](#imagens--prints)
7. [Guia Git — Fluxo rápido e comandos úteis](#guia-git---fluxo-rapido-e-comandos-uteis)
8. [Proposta de Arquitetura — *Memory Book* (resumo)](#proposta-de-arquitetura--memory-book-resumo)

---

## Resumo

Anotações extraídas do canal (mensagens de *Pietra*, *Dark* e contribuições posteriores) com foco em um sistema de locadora de carros e trechos de documentação/arquitetura do projeto *Memory Book*.

---

## Diagrama de Classes

**Classes principais**

- **Cliente**
  - Atributos: `id`, `nome`, `CPF`, `email`
  - Métodos: `realizarLocacao()`, `consultarHistorico()`

- **Carro**
  - Atributos: `id`, `modelo`, `placa`, `ano`, `valorDiaria`, `disponivel`
  - Métodos: `verificarDisponibilidade()`, `atualizarStatus()`

- **Locacao**
  - Atributos: `id`, `dataInicio`, `dataFim`, `valorTotal`
  - Métodos: `calcularValorTotal()`, `finalizarLocacao()`

- **Pagamento**
  - Atributos: `id`, `metodo`, `valor`, `status`
  - Métodos: `processarPagamento()`, `confirmarPagamento()`

- **Funcionario**
  - Atributos: `id`, `nome`, `cargo`
  - Métodos: `cadastrarCarro()`, `gerarRelatorio()`

**Relações**

- Cliente — Locacao: 1 cliente pode ter várias locações.
- Locacao agrega Carro e Pagamento (1 locação tem 1 carro e 1 pagamento associado).
- Funcionario gerencia Carro e Locacao.

---

## Diagrama de Casos de Uso

**Atores**: Cliente, Funcionário.

**Casos de Uso (resumido)**

- **Cliente**: "Alugar Carro", "Consultar Disponibilidade", "Cancelar Locação".
- **Funcionário**: "Cadastrar Carro", "Registrar Devolução", "Gerar Relatório".

**Fluxo principal — Alugar Carro**

1. Cliente seleciona carro
2. Sistema verifica disponibilidade
3. Sistema cria locação
4. Sistema processa pagamento
5. Confirmação exibida ao cliente

---

## Diagrama de Sequência — Processo de Aluguel

**Interações principais**

1. Cliente solicita aluguel
2. Sistema chama `Carro.verificarDisponibilidade()`
3. Sistema cria nova `Locacao`
4. Sistema chama `Locacao.calcularValorTotal()`
5. Sistema inicia `Pagamento.processarPagamento()`
6. Retorna confirmação ao cliente

---

## Exemplo de Interface GUI (Java Swing)

Trecho de código compartilhado (exemplo mínimo de uma GUI para listar carros e alugar):

```java
import javax.swing.*;
import java.awt.event.*;

public class LocadoraGUI {
    public static void main(String[] args) {
        JFrame frame = new JFrame("Locadora de Carros");
        frame.setSize(600, 400);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JPanel panel = new JPanel();
        frame.add(panel);
        placeComponents(panel);

        frame.setVisible(true);
    }

    private static void placeComponents(JPanel panel) {
        panel.setLayout(null);

        // Tabela de carros disponíveis
        String[] colunas = {"ID", "Modelo", "Placa", "Valor Diária"};
        Object[][] dados = {{1, "Fiat Argo", "ABC-1234", 150.0}};
        JTable tabelaCarros = new JTable(dados, colunas);
        JScrollPane scrollPane = new JScrollPane(tabelaCarros);
        scrollPane.setBounds(20, 20, 500, 150);
        panel.add(scrollPane);

        // Botão para alugar
        JButton alugarButton = new JButton("Alugar Carro");
        alugarButton.setBounds(20, 200, 120, 30);
        panel.add(alugarButton);

        // Tratamento de evento
        alugarButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                int linhaSelecionada = tabelaCarros.getSelectedRow();
                if (linhaSelecionada >= 0) {
                    JOptionPane.showMessageDialog(panel, "Carro alugado com sucesso!");
                } else {
                    JOptionPane.showMessageDialog(panel, "Selecione um carro!", "Erro", JOptionPane.ERROR_MESSAGE);
                }
            }
        });
    }
}
```

---

## Imagens / Prints

O conteúdo original inclui várias imagens compartilhadas em horários diferentes. Recomenda-se adicionar as imagens na pasta `./docs/images/` e referenciá-las aqui, por exemplo:

```markdown
![Print: Diagrama de Classes](./docs/images/diagrama-classes.png)
![Print: GUI](./docs/images/gui-example.png)
```

---

## Guia Git — Fluxo rápido e comandos úteis

**Clonar repositório**

```bash
git clone https://github.com/DiogoSNs/Memory-Book.git
cd Memory-Book
```

**Atualizar antes de trabalhar**

```bash
git pull origin main
```

**Criar branch por funcionalidade (boa prática)**

```bash
git checkout main
git pull origin main
git checkout -b feature/nome-da-branch
# depois de trabalhar
git add .
git commit -m "feat: descrição do que fez"
git push origin feature/nome-da-branch
```

**Ver branches locais e remotas**

```bash
git branch         # branches locais
git fetch origin    # busca branches remotas atualizadas
git branch -r       # lista branches remotas
```

**Criar cópia local de uma branch remota**

```bash
git checkout -b feature/nome-da-branch origin/feature/nome-da-branch
```

**Fluxo ao colaborar no grupo (resumido)**

- Antes de começar a trabalhar na branch:
  ```bash
  git checkout feature/nome-da-branch
  git pull origin feature/nome-da-branch
  ```
- Depois de finalizar alterações:
  ```bash
  git add .
  git commit -m "feat: descrição do que fez"
  git push origin feature/nome-da-branch
  ```

**Merge para a `main` (opção via terminal)**

```bash
git checkout main
git pull origin main
git merge feature/nome-da-branch
# resolva conflitos, então:
git add .
git commit -m "merge: integra feature XYZ na main"
git push origin main
# (opcional) apagar branch
git branch -d feature/nome-da-branch
git push origin --delete feature/nome-da-branch
```

---

## Proposta de Arquitetura — *Memory Book* (resumo)

**Visão geral**: sistema web para registrar memórias geolocalizadas com suporte a textos e mídias. Arquitetura sugerida: *MVC em camadas* (Frontend React, Backend Node/Express, PostgreSQL + PostGIS).

**Estrutura inicial de pasta**

```
mapa-memorias-afetivas/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   └── memories.js
│   ├── models/
│   │   └── memory.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/
│   │       ├── MapView.jsx
│   │       └── MemoryForm.jsx
│   └── package.json
├── README.md
└── docker-compose.yml
```

**Decisões e justificativas (resumido)**

- **MVC em camadas**: separação clara de responsabilidades, manutenção mais fácil e testes isolados.
- **API RESTful**: comunicação leve entre frontend e backend (JSON).
- **PostgreSQL + PostGIS**: suporte geoespacial nativo para consultas por local.
- **Docker (opcional)**: facilita padronização do ambiente de desenvolvimento.

---

## Observações finais

- Este README foi montado a partir de várias mensagens e trechos compartilhados no canal. Ajuste e refine se quiser organizar por tópicos mais específicos ou extrair diagramas em SVG/PNG.
- Sugestão: mantenha imagens e diagramas na pasta `docs/images/` e referências a elas no README para melhor apresentação no GitHub.

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

