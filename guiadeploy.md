# Guia de Deploy Simplificado - Memory Book

Este guia foi preparado para ser o mais simples possível, utilizando serviços gratuitos e integrados ao GitHub.

## Pré-requisitos
1. Uma conta no **GitHub**.
2. Uma conta no **Render** (render.com).
3. Uma conta no **Vercel** (vercel.com).
4. Seu código deve estar no GitHub.

---

## Passo 1: Backend (Render)
O backend é onde fica a lógica (Python) e o banco de dados.

1. Acesse [dashboard.render.com](https://dashboard.render.com/).
2. Clique em **New +** -> **Web Service**.
3. Conecte sua conta do GitHub e selecione o repositório `Memory-Book`.
4. Preencha os campos:
   - **Name:** `memory-book-backend` (ou o que preferir)
   - **Region:** Escolha a mais próxima (ex: Ohio ou Frankfurt)
   - **Root Directory:** `backend` (IMPORTANTE: não deixe em branco)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `gunicorn app:app`
5. Role para baixo até **Environment Variables** e adicione:
   - `PYTHON_VERSION`: `3.11.5` (ou similar)
   - `SECRET_KEY`: Digite uma senha aleatória segura.
   - `JWT_SECRET_KEY`: Digite outra senha aleatória segura.
   - `CORS_ORIGINS`: `https://memory-book-six.vercel.app` (A URL do seu frontend sem a barra final).
6. Clique em **Create Web Service**.

### Banco de Dados (Neon.tech)
**Por que não usar SQLite?** O Render (e outros serviços de nuvem) apagam os arquivos locais toda vez que o site reinicia. Se usar SQLite, você perderia todos os usuários e memórias a cada deploy. O Neon é um banco externo que guarda seus dados para sempre gratuitamente.

1. Acesse [neon.tech](https://neon.tech) e crie uma conta.
2. Crie um novo projeto (ex: `memory-book-db`).
3. Na tela principal (Dashboard), procure a seção **Connection Details**.
4. Copie a string de conexão (ela começa com `postgresql://...`).
5. **Volte no Render:**
   - Vá no seu Web Service -> **Environment**.
   - Clique em **Add Environment Variable**.
   - **Key:** `DATABASE_URL`
   - **Value:** Cole a URL que você copiou do Neon.
   - (O código do seu projeto já está pronto para detectar essa variável e usar o Neon automaticamente).

---

## Passo 2: Frontend (Vercel)
O frontend é a parte visual (React).

1. Acesse [vercel.com](https://vercel.com).
2. Clique em **Add New...** -> **Project**.
3. Importe o mesmo repositório do GitHub.
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** Clique em Edit e selecione a pasta `frontend`.
5. Abra a aba **Environment Variables**:
   - Chave: `VITE_API_URL`
   - Valor: A URL do seu backend no Render (ex: `https://memory-book-backend.onrender.com/api`).
   - **Atenção:** Adicione `/api` no final da URL.
6. Clique em **Deploy**.

---

## Passo 3: Ajustes Finais

1. **Spotify Dashboard:**
   - Se você usa o login do Spotify, vá no [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
   - Adicione a URL do seu site (Vercel) nas configurações de Redirect URI.

2. **Testar:**
   - Acesse a URL que o Vercel gerou.
   - Tente criar uma conta e fazer login.

**Observação:** Como configuramos para usar variáveis de ambiente, seu projeto continua funcionando normalmente no seu computador (localhost) sem precisar mudar nada!
