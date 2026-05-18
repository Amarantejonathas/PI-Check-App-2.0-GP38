# 🎯 Code Review Checklist & Boas Práticas

Use este checklist para manter a qualidade de código em futuras alterações.

## ✅ Antes de Commitar

### Estrutura
- [ ] Controllers injetam services (não contêm lógica direta)
- [ ] Services contêm toda a lógica de negócio
- [ ] DTOs validam entrada com `class-validator`
- [ ] Módulos exportam providers para reutilização
- [ ] Cada classe tem uma responsabilidade clara

### Segurança
- [ ] Rotas sensíveis têm `@UseGuards(JwtAuthGuard)`
- [ ] Usuário extraído de `req.user?.id`
- [ ] Dados isolados por usuário (multi-tenant safe)
- [ ] Senhas nunca são logadas ou expostas
- [ ] Exceções não revelam detalhes internos

### HTTP
- [ ] Métodos HTTP corretos (POST, GET, PATCH, DELETE)
- [ ] Status codes semânticos (`201`, `204`, `401`, `404`)
- [ ] `@HttpCode()` para respostas não-padrão
- [ ] Descrições nos `@ApiResponse()`

### Logging
- [ ] Logger injetado: `private readonly logger = new Logger(ClassName.name)`
- [ ] Logs de operações importantes
- [ ] Nível correto (log, warn, error)
- [ ] Nunca log de senhas ou tokens

### Documentação
- [ ] `@ApiOperation()` em cada endpoint
- [ ] `@ApiResponse()` para possíveis respostas
- [ ] `@ApiProperty()` em cada campo do DTO
- [ ] Exemplos realistas nos DTOs
- [ ] JSDoc para métodos públicos

### Validação
- [ ] Mensagens de erro customizadas
- [ ] Validações regex quando necessário
- [ ] DTOs reutilizam validadores
- [ ] Sem valores hardcoded em validações

## 🚫 Antipatterns a Evitar

### ❌ Não Faça Isso

```typescript
// ❌ Lógica no controller
@Controller('events')
export class EventsController {
  @Get()
  async findAll() {
    // ERRADO: lógica aqui!
    const events = [];
    events.filter(...);
    events.map(...);
    return events;
  }
}

// ❌ Sem logger
export class MyService {
  doSomething() {
    console.log('Algo aconteceu'); // ERRADO
  }
}

// ❌ Status code errado
@Post()
@HttpCode(200) // ERRADO: deveria ser 201
create(@Body() dto: CreateDto) { }

// ❌ Sem documentação Swagger
@Get()
findAll() { } // ERRADO

// ❌ Validação fraca
export class LoginDto {
  @IsString()
  password: string; // ERRADO: sem força mínima
}

// ❌ Sem isolamento de dados
async findOne(id: string) {
  return this.database.find(id); // ERRADO: sem verificar usuário
}
```

### ✅ Faça Assim

```typescript
// ✅ Lógica no service
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({ summary: 'Lista eventos' })
  @ApiResponse({ status: 200, description: 'Lista' })
  async findAll(@Request() req: any) {
    return await this.eventsService.findAll(req.user?.id);
  }
}

// ✅ Logger estruturado
export class MyService {
  private readonly logger = new Logger(MyService.name);

  doSomething() {
    this.logger.log('Algo aconteceu com sucesso');
  }
}

// ✅ Status code correto
@Post()
@HttpCode(HttpStatus.CREATED)
@ApiResponse({ status: 201, description: 'Criado' })
create(@Body() dto: CreateDto) { }

// ✅ Documentação completa
@Get()
@ApiOperation({ summary: 'Lista eventos do usuário' })
@ApiResponse({ status: 200, description: 'Lista de eventos' })
async findAll(@Request() req: any) { }

// ✅ Validação forte
export class LoginDto {
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  password: string;
}

// ✅ Isolamento de dados
async findOne(id: string, userId: string) {
  const event = await this.database.find(id);
  if (event.userId !== userId) {
    throw new UnauthorizedException();
  }
  return event;
}
```

## 📝 Template para Novo Controller

```typescript
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Logger,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MyService } from './my.service';
import { CreateMyDto } from './dto/create-my.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('MyResource')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('my-resource')
export class MyController {
  private readonly logger = new Logger(MyController.name);

  constructor(private readonly myService: MyService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Lista recursos' })
  @ApiResponse({ status: 200, description: 'Lista' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async findAll(@Request() req: any) {
    this.logger.log(`Listando recursos do usuário: ${req.user?.id}`);
    return await this.myService.findAll(req.user?.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria novo recurso' })
  @ApiResponse({ status: 201, description: 'Criado' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 401, description: 'Não autenticado' })
  async create(@Request() req: any, @Body() dto: CreateMyDto) {
    this.logger.log(`Criando recurso para usuário: ${req.user?.id}`);
    return await this.myService.create(req.user?.id, dto);
  }
}
```

## 📝 Template para Novo Service

```typescript
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateMyDto } from './dto/create-my.dto';

@Injectable()
export class MyService {
  private readonly logger = new Logger(MyService.name);

  async findAll(userId: string) {
    this.logger.log(`Listando recursos do usuário: ${userId}`);
    // TODO: SELECT * FROM resources WHERE user_id = userId
    return [];
  }

  async create(userId: string, dto: CreateMyDto) {
    this.logger.log(`Criando novo recurso para usuário: ${userId}`);
    // TODO: INSERT INTO resources VALUES (...)
    return { id: 'new_id', userId, ...dto };
  }

  async findOne(id: string, userId: string) {
    this.logger.log(`Buscando recurso: ${id}`);
    // TODO: SELECT * FROM resources WHERE id = id AND user_id = userId
    const resource = null;
    if (!resource) {
      throw new NotFoundException(`Recurso #${id} não encontrado`);
    }
    return resource;
  }
}
```

## 📝 Template para Novo DTO

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, Matches } from 'class-validator';

export class CreateMyDto {
  @ApiProperty({ example: 'Nome do recurso' })
  @IsString({ message: 'Deve ser string' })
  @IsNotEmpty({ message: 'É obrigatório' })
  name: string;

  @ApiProperty({ example: 'user@email.com' })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'É obrigatório' })
  email: string;

  @ApiProperty({
    example: 'Senha@123',
    minLength: 8,
    description: 'Mín 8 chars, maiúscula, minúscula, número',
  })
  @IsString()
  @MinLength(8, { message: 'Mínimo 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Deve ter maiúscula, minúscula e número',
  })
  password: string;
}
```

## 🔄 Git Workflow

```bash
# Criar branch para feature
git checkout -b feature/nova-funcionalidade

# Fazer alterações respeitando o checklist acima
# Testar tudo

# Commit com mensagem descritiva
git commit -m "feat: implementa nova funcionalidade com service, DTO e testes"

# Push e criar PR
git push origin feature/nova-funcionalidade
```

## 📊 Métricas de Qualidade

- ✅ Sem `TODO` na produção
- ✅ Sem `console.log()` (usar Logger)
- ✅ Sem validações hardcoded em controllers
- ✅ Sem senhas em logs
- ✅ Cada classe < 200 linhas
- ✅ Cada método < 30 linhas
- ✅ Cobertura de testes > 80%

## 🚀 Quando Adicionar Nova Feature

1. **Criar DTO** com validações
2. **Criar Service** com lógica
3. **Criar Controller** que injeta service
4. **Adicionar Guard** se protegido
5. **Documentar no Swagger**
6. **Adicionar Logger**
7. **Testar** via Swagger
8. **Commit** com mensagem clara

## ❓ Dúvidas Frequentes

**P: Onde colocar lógica de banco de dados?**
R: No Service. Use Prisma/TypeORM com repository pattern.

**P: Como testar isso tudo?**
R: Jest para units (services), Supertest para E2E (controllers).

**P: Preciso sempre do Guard?**
R: Não. Apenas em rotas que precisam de autenticação.

**P: Posso usar console.log?**
R: Não. Use o Logger injetado.

**P: Qual DTO usar para resposta?**
R: Crie um `ResponseDto` separado da entrada.

---

**Manter essa qualidade = Menos bugs, mais felicidade! 🎉**
