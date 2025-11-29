import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

/**
 * UsersController - контроллер для обработки HTTP запросов, связанных с пользователями
 *
 * @Controller('users') - декоратор, который говорит NestJS:
 * - это контроллер
 * - все роуты этого контроллера начинаются с /users
 *
 * Например: POST /users, GET /users, GET /users/:id
 */
@Controller('users')
export class UsersController {
  /**
   * Конструктор - инжектим UsersService
   * Это называется Dependency Injection (внедрение зависимостей)
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Создание нового пользователя
   *
   * @Post() - декоратор, указывает что это POST запрос
   * Полный путь: POST /users
   *
   * @HttpCode(HttpStatus.CREATED) - устанавливает код ответа 201 (Created)
   *
   * @Body() - декоратор, извлекает тело запроса и валидирует его по CreateUserDto
   *
   * Пример запроса в Postman:
   * POST http://localhost:3000/users
   * Body (JSON):
   * {
   *   "email": "test@example.com",
   *   "password": "password123",
   *   "name": "Иван Иванов"
   * }
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    // Вызываем метод create из UsersService
    return await this.usersService.create(createUserDto);
  }

  /**
   * Получение всех пользователей
   *
   * @Get() - декоратор, указывает что это GET запрос
   * Полный путь: GET /users
   *
   * Пример запроса в Postman:
   * GET http://localhost:3000/users
   */
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  /**
   * Получение пользователя по ID
   *
   * @Get(':id') - декоратор с параметром :id
   * Полный путь: GET /users/:id
   *
   * @Param('id') - декоратор, извлекает параметр id из URL
   *
   * Пример запроса в Postman:
   * GET http://localhost:3000/users/123e4567-e89b-12d3-a456-426614174000
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOne(id);
  }
}
