# eventos-api

API REST de Organização de Eventos — MVP Projeto Integrador SENAC ADS

> Arquitetura profissional com autenticação JWT, validações robustas e padrões enterprise.

## 🚀 Stack Tecnológico

- **NestJS** — Framework backend com TypeScript
- **JWT + Passport** — Autenticação segura com tokens
- **Swagger** — Documentação interativa dos endpoints
- **class-validator** — Validação de dados robusta
- **TypeScript** — Type safety e melhor DX

## 🏗️ Arquitetura

```
src/
├── auth/
│   ├── auth.controller.ts    → Endpoints de autenticação
│   ├── auth.service.ts       → Lógica de registro/login
│   ├── auth.dto.ts           → Validações de entrada
│   ├── auth.module.ts        → Módulo com JWT
│   ├── guards/
│   │   └── jwt.guard.ts      → Proteção de rotas
│   └── strategies/
│       └── jwt.strategy.ts   → Validação de JWT
├── events/
│   ├── events.controller.ts  → CRUD de eventos
│   ├── events.service.ts     → Lógica de negócio
│   ├── events.dto.ts         → Validações
│   └── events.module.ts      → Módulo
├── users/       → Perfil do usuário
├── guests/      → Convidados por evento
├── tasks/       → Checklist por evento
├── app.module.ts
└── main.ts
```

## ✨ Melhorias Implementadas

### Segurança
- ✅ JWT com expiração configurável
- ✅ Guards para proteger rotas
- ✅ Validação forte de senha (regex)
- ✅ Hash de senha (preparado para bcrypt)

### Arquitetura
- ✅ Service layer com lógica isolada
- ✅ Dependency injection completo
- ✅ Módulos bem definidos e reutilizáveis
- ✅ Separação clara de responsabilidades

### Documentação & DX
- ✅ Swagger com exemplos reais
- ✅ Logging estruturado em tudo
- ✅ DTOs com mensagens de erro customizadas
- ✅ HTTP status codes semânticos

### Validação
- ✅ DTOs com `class-validator`
- ✅ Whitelist automático de propriedades
- ✅ Mensagens de erro em português
- ✅ Validações regex para regras complexas

**Para detalhes completos:** Veja [MELHORIAS.md](./MELHORIAS.md)

## 🚀 Como Rodar

### Instalação
```bash
npm install
```

### Desenvolvimento
```bash
npm run start:dev
```

### Build & Produção
```bash
npm run build
npm start
```

## 📚 Documentação

- **API Interativa:** http://localhost:3000/api
- **Guia de Testes:** [GUIA_TESTES.md](./GUIA_TESTES.md)
- **Melhorias Técnicas:** [MELHORIAS.md](./MELHORIAS.md)

## 🧪 Teste Rápido

1. Registre um usuário em `POST /auth/register`
2. Copie o token retornado
3. Clique em "Authorize" no Swagger e cole o token
4. Teste os endpoints de eventos protegidos

```bash
# Exemplo com curl
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "Senha@123"
  }'
```

## 🔒 Variáveis de Ambiente

```env
# .env
PORT=3000
NODE_ENV=development
JWT_SECRET=seu-segredo-aqui
CORS_ORIGIN=http://localhost:3000
```

**Veja:** [.env.example](./.env.example)

## 📋 Endpoints

### 🔑 Autenticação
- `POST /auth/register` — Cadastro novo
- `POST /auth/login` — Login
- `POST /auth/logout` — Logout

### 📅 Eventos (Protegido por JWT)
- `GET /events` — Lista seus eventos
- `POST /events` — Criar evento
- `GET /events/:id` — Detalhes do evento
- `PATCH /events/:id` — Atualizar evento
- `DELETE /events/:id` — Deletar evento

### 👥 Convidados (Em desenvolvimento)
- `GET /events/:eventId/guests` — Listar convidados
- `POST /events/:eventId/guests` — Adicionar convidado
- `DELETE /events/:eventId/guests/:guestId` — Remover

### ✅ Tarefas (Em desenvolvimento)
- `GET /events/:eventId/tasks` — Listar tarefas
- `POST /events/:eventId/tasks` — Criar tarefa
- `PATCH /events/:eventId/tasks/:taskId` — Concluir tarefa

## 🛠️ Tecnologias & Dependências

| Dependência | Versão | Propósito |
|------------|--------|----------|
| `@nestjs/core` | ^10.0 | Framework principal |
| `@nestjs/jwt` | ^10.0 | Geração de JWT |
| `@nestjs/passport` | ^10.0 | Estratégia Passport |
| `@nestjs/swagger` | ^7.0 | Documentação |
| `class-validator` | ^0.14 | Validação de DTOs |
| `class-transformer` | ^0.5 | Transformação de dados |
| `passport-jwt` | ^4.0 | Strategy JWT |

## 📈 Roadmap

- [ ] Integrar Prisma + Supabase
- [ ] Implementar GuestsService
- [ ] Implementar TasksService
- [ ] Implementar UsersService (perfil)
- [ ] Rate limiting
- [ ] Tests (Jest + Supertest)
- [ ] CI/CD (GitHub Actions)
- [ ] Docker

## 🤝 Contribuindo

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Licença

MIT License — veja [LICENSE](./LICENSE) para detalhes

## 👨‍💻 Autor

Dev Team — SENAC ADS
