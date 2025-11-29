import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

/**
 * bootstrap - функция, которая запускает наше приложение
 */
async function bootstrap() {
  // Создаем экземпляр приложения NestJS
  const app = await NestFactory.create(AppModule);

  /**
   * Включаем CORS (Cross-Origin Resource Sharing)
   * Это позволяет frontend (который работает на другом порту) делать запросы к backend
   */
  app.enableCors({
    origin: 'http://localhost:3001', // Разрешаем запросы с frontend
    credentials: true, // Разрешаем отправку cookies
  });

  /**
   * Подключаем глобальный ValidationPipe
   * Это автоматически валидирует все входящие данные по DTO классам
   *
   * whitelist: true - автоматически удаляет свойства, которых нет в DTO
   * forbidNonWhitelisted: true - выбрасывает ошибку, если есть лишние свойства
   * transform: true - автоматически преобразует типы (например, string в number)
   */
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Запускаем сервер на порту 3000 (или из переменной окружения PORT)
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Сервер запущен на http://localhost:${port}`);
}

bootstrap();
