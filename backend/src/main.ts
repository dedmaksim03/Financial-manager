import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Включение CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Разрешите только этот источник
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Разрешенные методы
    credentials: true, // Разрешить отправку куки
  });

  app.use(cookieParser())
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
