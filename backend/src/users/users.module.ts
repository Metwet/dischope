import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma.service';

/**
 * UsersModule - модуль, который объединяет все компоненты для работы с пользователями
 *
 * В NestJS приложение состоит из модулей. Модуль - это класс с декоратором @Module()
 *
 * @Module() принимает объект с параметрами:
 * - controllers: массив контроллеров (обрабатывают HTTP запросы)
 * - providers: массив провайдеров/сервисов (содержат бизнес-логику)
 * - imports: массив других модулей, которые нужны этому модулю
 * - exports: массив сервисов, которые будут доступны другим модулям
 */
@Module({
  controllers: [UsersController], // Контроллер для обработки HTTP запросов
  providers: [UsersService, PrismaService], // Сервисы, которые используются в этом модуле
  exports: [UsersService], // Экспортируем UsersService, чтобы другие модули могли его использовать
})
export class UsersModule {}
