import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './common/config/api/config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import helmet from 'helmet';
import { AllExceptionsFilter } from './common/filter/exception.filter';
import { LoggingInterceptor } from '@common/interceptor/log.interceptor';
import { LoggerService } from '@common/logger/logger.service';
import { config } from 'dotenv';
import { join } from 'path';
config({
  path:
    process.env.NODE_ENV === 'development'
      ? `.env.${process.env.NODE_ENV}`
      : '.env',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  // CONFIG VARIABLE
  const appConfigService: AppConfigService = app.get(AppConfigService);
  const { APP_PORT, NODE_ENV } = appConfigService;
  const logService: LoggerService = app.get(LoggerService);

  // GLOBAL INTERCEPTOR
  app.useGlobalInterceptors(new LoggingInterceptor(logService));

  // SWAGGER CONFIG
  if (NODE_ENV?.toUpperCase() !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .addSecurity('auth', {
        name: 'Authorization',
        type: 'apiKey',
        in: 'header',
      })
      .setTitle(`SHORT-URL API`)
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document);
  }

  app.use('/static', express.static(join(__dirname, '..', 'public')));

  // USE GENERAL MIDDLEWARE
  app.use(express.json({ limit: '500mb' }));
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  app.use(helmet());

  // GLOBAL CATCH
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapterHost, logService));

  // LISTEN PORT AND START SERVICE
  await app.listen(APP_PORT).then(() => {
    console.log(`APP_PORT: ${APP_PORT}`, '|', `NODE_ENV: ${NODE_ENV}`);
  });
}
bootstrap();
