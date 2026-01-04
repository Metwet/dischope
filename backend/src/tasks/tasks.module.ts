import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma.service';

/**
 * TasksModule - модуль, который объединяет все компоненты для работы с задачами
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
  controllers: [TasksController], // Контроллер для обработки HTTP запросов
  providers: [TasksService, PrismaService], // Сервисы, которые используются в этом модуле
  exports: [TasksService], // Экспортируем TasksService, чтобы другие модули могли его использовать
})
export class TasksModule {}
