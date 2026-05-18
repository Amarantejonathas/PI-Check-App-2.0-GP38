import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  const env = process.env.NODE_ENV || 'development';

  // =============== VALIDAÇÃO GLOBAL ===============
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // =============== CORS ===============
  app.enableCors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // =============== SWAGGER DOCUMENTAÇÃO ===============
  const config = new DocumentBuilder()
    .setTitle('API de Organização de Eventos')
    .setDescription('API REST para gerenciamento de eventos — MVP do Projeto Integrador SENAC ADS')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .addTag('Auth', 'Autenticação e cadastro de usuários')
    .addTag('Users', 'Gerenciamento de perfil do usuário')
    .addTag('Events', 'CRUD completo de eventos')
    .addTag('Guests', 'Gerenciamento de convidados por evento')
    .addTag('Tasks', 'Checklist e tarefas por evento')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  // =============== INICIALIZAÇÃO ===============
  await app.listen(port);

  logger.log('═'.repeat(50));
  logger.log(`🚀 Servidor iniciado com sucesso`);
  logger.log(`📌 Ambiente: ${env.toUpperCase()}`);
  logger.log(`🔗 URL: http://localhost:${port}`);
  logger.log(`📄 Swagger: http://localhost:${port}/api`);
  logger.log('═'.repeat(50));
}

bootstrap().catch((err) => {
  logger.error('Erro ao iniciar servidor:', err);
  process.exit(1);
});
