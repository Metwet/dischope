import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

/**
 * AuthService - содержит всю бизнес-логику для авторизации
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Валидация пользователя по email и паролю
   *
   * @param email - email пользователя
   * @param password - пароль пользователя (не хэшированный)
   * @returns пользователь без пароля или null если валидация не прошла
   */
  async validateUser(email: string, password: string) {
    // 1. Ищем пользователя по email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Если пользователь не найден - возвращаем null
    if (!user) {
      return null;
    }

    // 2. Сравниваем введенный пароль с хэшированным паролем в базе
    // bcrypt.compare() - безопасно сравнивает пароли
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Если пароль неверный - возвращаем null
    if (!isPasswordValid) {
      return null;
    }

    // 3. Если всё ок - возвращаем пользователя без пароля
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  /**
   * Логин пользователя
   *
   * @param loginDto - данные для логина (email, password)
   * @returns объект с access_token и информацией о пользователе
   */
  async login(loginDto: LoginDto) {
    // 1. Валидируем пользователя
    const user = await this.validateUser(loginDto.email, loginDto.password);

    // Если валидация не прошла - бросаем ошибку
    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    // 2. Создаем payload для JWT токена
    const payload = {
      sub: user.id, // sub (subject) - стандартное поле JWT для ID
      email: user.email,
      name: user.name,
    };

    // 3. Генерируем JWT токен
    const accessToken = this.jwtService.sign(payload);

    // 4. Возвращаем токен и информацию о пользователе
    return {
      access_token: accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  /**
   * Получение пользователя по ID (для валидации токена)
   *
   * @param userId - ID пользователя
   * @returns пользователь без пароля
   */
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
