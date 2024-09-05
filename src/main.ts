import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const FRONT_END_URL = 'http://localhost:5173';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    abortOnError: false,
  });
  app.enableCors({ origin: FRONT_END_URL });
  await app.listen(3000);
}
bootstrap();
