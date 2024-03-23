import { Logger, NestApplicationOptions, ValidationPipe } from '@nestjs/common';
import {
  CorsOptions,
  CorsOptionsDelegate,
} from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function start() {
  // ----------------------------------------------------------------------------------------
  // Configs
  // ----------------------------------------------------------------------------------------
  const appOptions: NestApplicationOptions = {
    cors: true,
  };

  const corsOptions: CorsOptions | CorsOptionsDelegate<any> = {
    origin: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Origin',
      'Accept',
    ],
  };

  const swaggerConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const swaggerPath = 'swagger';

  // ----------------------------------------------------------------------------------------

  // ----------------------------------------------------------------------------------------
  // Variables
  // ----------------------------------------------------------------------------------------
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    appOptions,
  );
  const configService = app.get(ConfigService);

  // ----------------------------------------------------------------------------------------

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(swaggerPath, app, document);

  app.enableCors(corsOptions);

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))

  // ----------------------------------------------------------------------------------------
  await app.listen(configService.port, () =>
    Logger.log('Application started on port ' + configService.port),
  );
}

start();
