# 🧪 Guia de Testes - API Eventos

## ✅ Pré-requisitos

```bash
# Instalar dependências
npm install

# Iniciar servidor em modo desenvolvimento
npm run start:dev
```

## 🌐 Acessar Swagger

**URL:** http://localhost:3000/api

O Swagger UI permite testar todos os endpoints diretamente.

---

## 📝 Fluxo de Teste Recomendado

### 1️⃣ **Teste de Registro (Register)**

**Endpoint:** `POST /auth/register`

**Body:**
```json
{
  "name": "João Silva",
  "email": "joao@test.com",
  "password": "Senha@123"
}
```

**Resposta esperada (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

**Copie o `access_token` para os próximos testes!**

---

### 2️⃣ **Teste de Login (Login)**

**Endpoint:** `POST /auth/login`

**Body:**
```json
{
  "email": "joao@test.com",
  "password": "Senha@123"
}
```

**Resposta esperada (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

---

### 3️⃣ **Autenticar no Swagger**

1. Clique no botão **"Authorize"** (ícone de cadeado) no topo do Swagger
2. Cole o token recebido no formato: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
3. Clique em "Authorize" e depois "Close"

**Agora você pode testar endpoints protegidos!**

---

### 4️⃣ **Teste de Criação de Evento (Create Event)**

**Endpoint:** `POST /events`

**Body:**
```json
{
  "title": "Festa de Aniversário",
  "description": "Celebração do aniversário de João",
  "date": "2026-06-15T18:00:00Z",
  "location": "Rua das Flores, 123"
}
```

**Resposta esperada (201):**
```json
{
  "id": "event_1718902800000",
  "userId": "user_1718902800000",
  "title": "Festa de Aniversário",
  "description": "Celebração do aniversário de João",
  "date": "2026-06-15T18:00:00Z",
  "location": "Rua das Flores, 123",
  "createdAt": "2026-05-18T10:00:00.000Z",
  "updatedAt": "2026-05-18T10:00:00.000Z"
}
```

**Copie o ID do evento!**

---

### 5️⃣ **Teste de Listar Eventos (List Events)**

**Endpoint:** `GET /events`

**Resposta esperada (200):**
```json
[
  {
    "id": "event_1718902800000",
    "userId": "user_1718902800000",
    "title": "Festa de Aniversário",
    ...
  }
]
```

---

### 6️⃣ **Teste de Obter Detalhes do Evento**

**Endpoint:** `GET /events/{id}`

Substitua `{id}` pelo ID copiado no passo 4.

**Resposta esperada (200):** Detalhes do evento

---

### 7️⃣ **Teste de Atualizar Evento**

**Endpoint:** `PATCH /events/{id}`

**Body:**
```json
{
  "title": "Festa de Aniversário - ATUALIZADO",
  "description": "Celebração melhorada!"
}
```

**Resposta esperada (200):** Evento com campos atualizados

---

### 8️⃣ **Teste de Deletar Evento**

**Endpoint:** `DELETE /events/{id}`

**Resposta esperada (204):** Sem conteúdo (sucesso)

---

## ⚠️ Testes de Erro (para validar tratamento)

### ❌ Email duplicado
```json
POST /auth/register
{
  "name": "Outro Usuário",
  "email": "joao@test.com",
  "password": "Senha@123"
}
```
**Esperado:** 409 Conflict

### ❌ Senha fraca
```json
POST /auth/register
{
  "name": "Teste",
  "email": "novo@test.com",
  "password": "123"
}
```
**Esperado:** 400 Bad Request (senha muito curta)

### ❌ Email inválido
```json
POST /auth/login
{
  "email": "nao-eh-um-email",
  "password": "Senha@123"
}
```
**Esperado:** 400 Bad Request

### ❌ Credenciais inválidas
```json
POST /auth/login
{
  "email": "nao@existe.com",
  "password": "QualquerSenha@123"
}
```
**Esperado:** 401 Unauthorized

### ❌ Sem autenticação
```
GET /events (sem token no header Authorization)
```
**Esperado:** 401 Unauthorized

---

## 📊 Checklist de Funcionalidades

- [ ] Register funciona ✅
- [ ] Login funciona ✅
- [ ] JWT gerado corretamente ✅
- [ ] POST /events criado com sucesso ✅
- [ ] GET /events retorna lista ✅
- [ ] GET /events/:id retorna evento específico ✅
- [ ] PATCH /events/:id atualiza evento ✅
- [ ] DELETE /events/:id remove evento ✅
- [ ] 401 sem autenticação ✅
- [ ] 404 evento não encontrado ✅
- [ ] 400 dados inválidos ✅

---

## 🔍 Visualizar Logs

Abra o console/terminal onde `npm run start:dev` está rodando.

Você verá logs como:
```
[AuthService] Tentativa de registro: joao@test.com
[AuthService] Usuário registrado com sucesso: joao@test.com
[EventsController] Listando eventos do usuário: user_1718902800000
```

---

## 🚀 Próximos Passos

Agora que validou a estrutura:

1. **Conectar Banco de Dados**
   - Instalar Prisma: `npm install @prisma/client`
   - Configurar Supabase

2. **Implementar Hash de Senha Real**
   - `npm install bcrypt`
   - Usar em `AuthService.hashPassword()`

3. **Adicionar Rate Limiting**
   - `npm install @nestjs/throttler`

4. **Escrever Testes**
   - Jest tests para services
   - E2E tests para controllers
