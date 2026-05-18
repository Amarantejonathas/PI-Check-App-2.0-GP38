"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('App de Organização de Eventos')
        .setDescription('API do MVP — Projeto Integrador SENAC ADS')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Auth', 'Autenticação e cadastro')
        .addTag('Users', 'Perfil do usuário')
        .addTag('Events', 'CRUD de eventos')
        .addTag('Guests', 'Convidados do evento')
        .addTag('Tasks', 'Checklist de tarefas')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
    console.log('🚀 Servidor rodando em http://localhost:3000');
    console.log('📄 Swagger disponível em http://localhost:3000/api');
}
bootstrap();
//# sourceMappingURL=main.js.map