import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    name: string;
  };
}

/**
 * AuthController - контроллер для обработки запросов авторизации
 *
 * @Controller('auth') - все роуты начинаются с /auth
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Логин пользователя
   *
   * POST /auth/login
   *
   * @param loginDto - email и password
   * @returns access_token и информацию о пользователе
   *
   * Пример запроса:
   * POST http://localhost:3000/auth/login
   * Body:
   * {
   *   "email": "test@example.com",
   *   "password": "password123"
   * }
   */
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  /**
   * Получение информации о текущем пользователе
   *
   * GET /auth/me
   *
   * @UseGuards(JwtAuthGuard) - защищает роут, требует валидный JWT токен
   * @Request() req - содержит информацию о пользователе после валидации JWT
   *
   * Пример запроса:
   * GET http://localhost:3000/auth/me
   * Headers:
   * Authorization: Bearer <your-jwt-token>
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req: RequestWithUser) {
    return req.user;
  }
}
