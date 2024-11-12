import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'DEV'
        ? 'http://localhost:3000'
        : 'https://fair-gift-web.vercel.app',
    credentials: true, // Autorise les cookies
  });

  await app.listen(process.env.PORT || 8000);
}
bootstrap();
