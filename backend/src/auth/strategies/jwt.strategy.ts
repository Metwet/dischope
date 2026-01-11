import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';

interface JwtPayload {
  sub: string;
  email: string;
  name: string;
}

/**
 * JwtStrategy - стратегия для валидации JWT токенов
 * Extends PassportStrategy с типом Strategy из passport-jwt
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      // Извлекаем JWT из Authorization header (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Не игнорируем истекшие токены
      ignoreExpiration: false,
      // Секретный ключ для проверки подписи JWT
      // В продакшене это должно быть в переменных окружения!
      secretOrKey: process.env.JWT_SECRET || 'your-secret-key-change-this',
    });
  }

  /**
   * Метод validate вызывается автоматически после успешной проверки JWT
   *
   * @param payload - декодированный payload из JWT токена
   * @returns пользователь, который будет доступен в req.user
   */
  async validate(payload: JwtPayload) {
    // payload.sub содержит ID пользователя (мы его добавили при создании токена)
    const user = await this.authService.getUserById(payload.sub);

    // Если пользователь не найден - бросаем ошибку
    if (!user) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    // Возвращаем пользователя - он будет доступен в контроллерах через @Request() req
    return user;
  }
}
