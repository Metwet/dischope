import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

/**
 * TasksController - контроллер для обработки HTTP запросов, связанных с задачами
 *
 * @Controller('tasks') - все роуты начинаются с /tasks
 *
 * Примеры роутов:
 * - POST /tasks - создание задачи
 * - GET /tasks - получение всех задач
 * - GET /tasks/:id - получение задачи по ID
 * - GET /tasks/user/:userId - получение задач пользователя
 * - PATCH /tasks/:id - обновление задачи
 * - DELETE /tasks/:id - удаление задачи
 */
@Controller('tasks')
export class TasksController {
  /**
   * Конструктор - инжектим TasksService
   */
  constructor(private readonly tasksService: TasksService) {}

  /**
   * Создание новой задачи
   *
   * POST /tasks
   *
   * Пример запроса в Postman:
   * POST http://localhost:3000/tasks
   * Body (JSON):
   * {
   *   "title": "Выучить NestJS",
   *   "userId": "123e4567-e89b-12d3-a456-426614174000",
   *   "plannedAt": "2024-01-15T10:00:00Z"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto) {
    return await this.tasksService.create(createTaskDto);
  }

  /**
   * Получение всех задач
   *
   * GET /tasks
   * Можно передать query параметр userId для фильтрации по пользователю
   *
   * Примеры:
   * GET http://localhost:3000/tasks - все задачи
   * GET http://localhost:3000/tasks?userId=123e4567... - задачи конкретного пользователя
   */
  @Get()
  async findAll(@Query('userId') userId?: string) {
    if (userId) {
      return await this.tasksService.findByUserId(userId);
    }
    return await this.tasksService.findAll();
  }

  /**
   * Получение задач конкретного пользователя
   *
   * GET /tasks/user/:userId
   *
   * Пример:
   * GET http://localhost:3000/tasks/user/123e4567-e89b-12d3-a456-426614174000
   */
  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    return await this.tasksService.findByUserId(userId);
  }

  /**
   * Получение задачи по ID
   *
   * GET /tasks/:id
   *
   * Пример:
   * GET http://localhost:3000/tasks/456e7890-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.tasksService.findOne(id);
  }

  /**
   * Обновление задачи
   *
   * PATCH /tasks/:id
   *
   * Пример запроса в Postman:
   * PATCH http://localhost:3000/tasks/456e7890-e89b-12d3-a456-426614174000
   * Body (JSON):
   * {
   *   "title": "Изучить NestJS полностью",
   *   "completed": true
   * }
   */
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return await this.tasksService.update(id, updateTaskDto);
  }

  /**
   * Удаление задачи
   *
   * DELETE /tasks/:id
   *
   * Пример:
   * DELETE http://localhost:3000/tasks/456e7890-e89b-12d3-a456-426614174000
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string) {
    return await this.tasksService.remove(id);
  }
}
