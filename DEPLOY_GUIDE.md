# 🚀 Guia de Deploy - Memory-Book

Este guia contém instruções detalhadas para fazer deploy do projeto Memory-Book em plataformas gratuitas.

## 📋 Pré-requisitos

- Conta no GitHub (projeto já deve estar no repositório)
- Contas nas plataformas de deploy escolhidas

---

## 🎯 Opção 1: Vercel + Railway (Recomendada)

### 🔧 Backend no Railway

1. **Acesse [Railway.app](https://railway.app)**
2. **Conecte com GitHub** e selecione o repositório Memory-Book
3. **Configure as variáveis de ambiente:**
   ```
   FLASK_ENV=production
   JWT_SECRET_KEY=seu-jwt-secret-super-seguro
   SECRET_KEY=sua-secret-key-super-segura
   DATABASE_URL=postgresql://... (Railway cria automaticamente)
   CORS_ORIGINS=https://seu-frontend.vercel.app
   ```
4. **Deploy automático** - Railway detecta Python e faz deploy

### 🎨 Frontend no Vercel

1. **Acesse [Vercel.com](https://vercel.com)**
2. **Import Project** do GitHub (pasta frontend)
3. **Configure Build Settings:**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. **Configure Environment Variables:**
   ```
   VITE_API_URL=https://seu-backend.railway.app
   ```
5. **Deploy** - Vercel faz build e deploy automaticamente

---

## 🌐 Opção 2: Netlify + Render

### 🔧 Backend no Render

1. **Acesse [Render.com](https://render.com)**
2. **New Web Service** conectado ao GitHub
3. **Configure:**
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`
4. **Environment Variables:**
   ```
   FLASK_ENV=production
   JWT_SECRET_KEY=seu-jwt-secret
   SECRET_KEY=sua-secret-key
   ```
5. **PostgreSQL Database** (gratuito) - conecte ao web service

### 🎨 Frontend no Netlify

1. **Acesse [Netlify.com](https://netlify.com)**
2. **New site from Git** - selecione repositório
3. **Build Settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Environment Variables:**
   ```
   VITE_API_URL=https://seu-backend.onrender.com
   ```

---

## 🛠️ Opção 3: Heroku (Clássica)

### 🔧 Backend no Heroku

1. **Instale Heroku CLI**
2. **Comandos:**
   ```bash
   cd backend
   heroku create seu-app-backend
   heroku addons:create heroku-postgresql:hobby-dev
   heroku config:set FLASK_ENV=production
   heroku config:set JWT_SECRET_KEY=seu-jwt-secret
   git push heroku main
   ```

### 🎨 Frontend no Netlify/Vercel
- Siga os passos das opções anteriores

---

## 🔐 Variáveis de Ambiente Importantes

### Backend:
```env
FLASK_ENV=production
JWT_SECRET_KEY=chave-jwt-super-segura-256-bits
SECRET_KEY=chave-secreta-flask-super-segura
DATABASE_URL=postgresql://user:pass@host:port/db
CORS_ORIGINS=https://seu-frontend.vercel.app,https://seu-dominio.com
```

### Frontend:
```env
VITE_API_URL=https://seu-backend.railway.app
```

---

## 📊 Comparação de Plataformas

| Plataforma | Preço | Banco | SSL | Domínio | Facilidade |
|------------|-------|-------|-----|---------|------------|
| **Vercel** | Gratuito | ❌ | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **Railway** | Gratuito* | ✅ PostgreSQL | ✅ | ✅ | ⭐⭐⭐⭐⭐ |
| **Netlify** | Gratuito | ❌ | ✅ | ✅ | ⭐⭐⭐⭐ |
| **Render** | Gratuito* | ✅ PostgreSQL | ✅ | ✅ | ⭐⭐⭐⭐ |
| **Heroku** | Gratuito* | ✅ PostgreSQL | ✅ | ✅ | ⭐⭐⭐ |

*Limitações no plano gratuito

---

## 🎯 Recomendação Final

**Para iniciantes:** Vercel (Frontend) + Railway (Backend)
- ✅ Mais fácil de configurar
- ✅ Deploy automático via GitHub
- ✅ Boa documentação
- ✅ Interface amigável

**Para projetos maiores:** Netlify + Render
- ✅ Mais recursos no plano gratuito
- ✅ Melhor para aplicações complexas

---

## 🆘 Troubleshooting

### Problemas Comuns:

1. **CORS Error:**
   - Verifique se `CORS_ORIGINS` está configurado corretamente
   - Inclua a URL do frontend sem barra final

2. **Database Connection:**
   - Verifique se `DATABASE_URL` está configurada
   - Execute migrações se necessário

3. **Build Fails:**
   - Verifique se `requirements.txt` está atualizado
   - Confirme se `Procfile` está na raiz do backend

4. **Environment Variables:**
   - Nunca commite secrets no código
   - Use `.env.example` para documentar

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs da plataforma
2. Consulte a documentação oficial
3. Verifique as configurações de ambiente
4. Teste localmente primeiro

**Boa sorte com o deploy! 🚀**